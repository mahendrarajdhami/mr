<?php
// INSTAGRAM ID: yamaharacingidn
define("INSTAGRAM_ACCESS_TOKEN", "1790228377.6171603.826566ed0b5f4d018c2508c9a043775c");
$api_url = 'https://api.instagram.com/v1/users/self/media/recent/?access_token='. INSTAGRAM_ACCESS_TOKEN . '&count=11';

$next_id = $_GET['next_max_id'];
if( $next_id){
  // 2ページ目以降の処理
  $api_url = $api_url . '&max_id=' . $next_id;
}

$api_val = @file_get_contents( $api_url );


$json_d = json_decode($api_val,true); // convert it to an array.
unset($json_d["pagination"]["next_url"]);
$api_val = json_encode($json_d);

echo $api_val;
exit;