<?php

$fp = fopen("./data/lock", "r");

if (flock($fp, LOCK_EX)) {

  if(file_exists("./data/pid")) {
    $mtime = filemtime("./data/pid");
    if(time() - $mtime > 60 * 60 * 12) {
      unlink("./data/pid");
    }
    flock($fp, LOCK_UN);
    fclose($fp);
    return;
  }

  $output = array();
  exec('php ./twitterCrawler.php > /dev/null 2>&1 & echo $!', $output);
  $pid = (int)$output[0];

  file_put_contents("./data/pid", $pid);

  flock($fp, LOCK_UN);
}

fclose($fp);

