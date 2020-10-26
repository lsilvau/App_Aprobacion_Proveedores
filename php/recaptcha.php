<?php

include("keys.php");

if($_POST['token'])
{
  $googleToken = $_POST['token'];

  $response = file_get_contents("https://www.google.com/recaptcha/api/siteverify?secret=".SECRET_KEY."&response={$googleToken}"); 
  echo $response;
}

?>