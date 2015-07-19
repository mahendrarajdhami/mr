<?php
require "twitteroauth/autoload.php";
use Abraham\TwitterOAuth\TwitterOAuth;

$consumerKey = 'oQX8omQXD16ZXEtz4Ky3OA';
$consumerSecret = 'A2GRgdH1gvxeo1WuQzBDLlU16m1g53i4ZM98dr6LQ';
$accessToken = '506942650-Kq4s7P2aaBq60gqDibIyh7IVUej92xmAyUAjGchk';
$accessTokenSecret = 'tJBdLb6KXud5dDThkTlOR3YdvWLry0DR517UOh2B9x659';
$connection = new TwitterOAuth($consumerKey, $consumerSecret, $accessToken, $accessTokenSecret);
//$content = $connection->get("account/verify_credentials");
//$statuses = $connection->get("search/tweets", array("q" => "yamaha"));

$screen_name = "yamaharacing_id";
$count = 10;

$param = array(
             "screen_name" => $screen_name,
             "count" => $count
         );

if($_GET['screen_name']){
  $param["screen_name"] = $_GET['screen_name'];
}

if($_GET['count']){
  $param["count"] = $_GET['count'];
}

if($_GET['max_id']){
  $param["max_id"] = $_GET['max_id'];
}

$statuses = $connection->get("statuses/user_timeline", $param);

echo json_encode($statuses);

exit;