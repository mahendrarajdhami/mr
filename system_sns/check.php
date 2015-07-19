<?php
require "twitteroauth/autoload.php";
use Abraham\TwitterOAuth\TwitterOAuth;

$consumerKey = 'oQX8omQXD16ZXEtz4Ky3OA';
$consumerSecret = 'A2GRgdH1gvxeo1WuQzBDLlU16m1g53i4ZM98dr6LQ';
$accessToken = '506942650-Kq4s7P2aaBq60gqDibIyh7IVUej92xmAyUAjGchk';
$accessTokenSecret = 'tJBdLb6KXud5dDThkTlOR3YdvWLry0DR517UOh2B9x659';
$connection = new TwitterOAuth($consumerKey, $consumerSecret, $accessToken, $accessTokenSecret);


$content = $connection->get("account/verify_credentials");
print_r( $content);
exit;
$statuses = $connection->get("application/rate_limit_status", array("resources" => "help,users,search,statuses")); // https://dev.twitter.com/rest/reference/get/application/rate_limit_status

echo json_encode($statuses);

exit;