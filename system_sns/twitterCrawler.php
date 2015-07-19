<?php

if (php_sapi_name() != 'cli') return;

define("TWITTER_CONSUMER_KEY", "oQX8omQXD16ZXEtz4Ky3OA");
define("TWITTER_CONSUMER_SECRET", "A2GRgdH1gvxeo1WuQzBDLlU16m1g53i4ZM98dr6LQ");

define("OAUTH_TOKEN", "506942650-Kq4s7P2aaBq60gqDibIyh7IVUej92xmAyUAjGchk");
define("OAUTH_SECRET", "tJBdLb6KXud5dDThkTlOR3YdvWLry0DR517UOh2B9x659");


require_once('./lib/Phirehose.php');
require_once('./lib/OauthPhirehose.php');

class FilterTrackConsumer extends OauthPhirehose
{
  protected $list = array();

  public function enqueueStatus($status)
  {
    $data = json_decode($status, true);
    if (is_array($data)) {

      $follow = $this->getFollow();
      if(is_array($follow)) {
        if(! in_array($data['user']['id'], $follow)) return;
      }

      $item = array(
        'id' => $data['id'],
        'text' => $data['text'],
        'screen_name' => '',
        'profile_image_url' => '',
        'photo_url' => '',
      );

      if(isset($data['user']['screen_name'])) $item['screen_name'] = $data['user']['screen_name'];
      if(isset($data['user']['profile_image_url'])) $item['profile_image_url'] = $data['user']['profile_image_url'];

      if(isset($data['extended_entities']) && isset($data['extended_entities']['media'])) {
        foreach($data['extended_entities']['media'] as $media) {
          if((! isset($media['type'])) || ($media['type'] != 'photo')) continue;

          $item['photo_url'] = $media['media_url'];
        }
      }

      $this->list[] = $item;
    }
  }

  public function finishReading()
  {
    $this->list = array_reverse($this->list);
  }

  public function getList()
  {
    return $this->list;
  }
}

function getTweetListFromStream($symbol)
{

  $tag = $symbol;
  $user = null;

  if(strpos($symbol, '@') !== false) {
    list($tag, $user) = explode('@', $symbol);
  }

  $sc = new FilterTrackConsumer(OAUTH_TOKEN, OAUTH_SECRET, Phirehose::METHOD_FILTER);
  $sc->setTrack(array('#' . $tag));
  if($user != null) $sc->setFollow(array($user));
  $sc->consume();
  $list = $sc->getList();

  return $list;
}

function execCrawl($symbol)
{
  $list = getTweetListFromStream($symbol);
  if((! is_array($list)) || (sizeof($list) == 0)) return;

  if(! file_exists("./data/tweet/{$symbol}")) {
    file_put_contents("./data/tweet/{$symbol}", json_encode(array()));
  }
  $existContents = file_get_contents("./data/tweet/{$symbol}");
  if($existContents === false) return;

  $existList = json_decode($existContents, true);
  if($existList === null) return;

  $checkList = array();
  if(sizeof($checkList) > 3) {
    $checkList = array_slice($existList, 0, 3);
  } else {
    $checkList = $existList;
  }

  $appendList = array();

  $exists = false;
  foreach($list as $item) {
    foreach($checkList as $ci) {
      if($ci['id'] == $item['id']) {
        $exists = true;
        break;
      }
    }
    if($exists) break;

    $appendList[] = $item;
  }

  $newList = array_merge($appendList, $existList);
  if(sizeof($newList) > 100) $newList = array_slice($newList, 0, 100);

  $contents = json_encode($newList);
  if($contents === false) return;

  $res = file_put_contents("./data/tweet/{$symbol}.tmp", $contents);
  if($res === false) return;

  $count = 0;
  while(! rename("./data/tweet/{$symbol}.tmp", "./data/tweet/{$symbol}")) {
    if($count > 10) {
      print("fail to mv");
      break;
    }
    $count++;
  }
}

function getSymbolList()
{
  if(! file_exists("./data/symbolList")) {
    file_put_contents("./data/symbolList", json_encode(array()));
  }

  $contents = file_get_contents("./data/symbolList");
  if($contents === false) return array();

  $list = json_decode($contents, true);
  if($list === null) return array();

  return $list;
}


$symbolList = getSymbolList();

foreach($symbolList as $symbol) {
  execCrawl($symbol);
  sleep(3);
}

$fp = fopen("./data/lock", "r");

if (flock($fp, LOCK_EX)) {
  if(file_exists("./data/pid")) {
    unlink("./data/pid");
  }
  flock($fp, LOCK_UN);
}
fclose($fp);


$aliveList = array();
foreach($symbolList as $symbol) {
  $mtime = filemtime("./data/touch/{$symbol}");
  if($mtime === false) continue;
  if(time() - $mtime < 60 * 60 * 24) {
    $aliveList[] = $symbol;
  }
}

if(sizeof($aliveList) != sizeof($symbolList)) {
  $contents = json_encode($aliveList);
  if($contents !== false) {
    $res = file_put_contents("./data/symbolList.tmp", $contents);
    if($res !== false) {
      $count = 0;
      while(! rename("./data/symbolList.tmp", "./data/symbolList")) {
        if($count > 10) {
          print("fail to mv");
          break;
        }
        $count++;
      }

      $count = 0;
      while(! chmod("./data/symbolList", 0777)) {
        if($count > 10) {
          print("fail to chmod");
          break;
        }
        $count++;
      }
    }
  }
}


