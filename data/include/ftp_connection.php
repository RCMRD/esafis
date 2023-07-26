<?php
$ftp_user_name = 'mspp';
$ftp_user_pass = 'mspp@2020';
$ftp_server = '192.168.0.74';
$ftp_directory_terra = '/level2/mod14/'; 
$ftp_directory_aqua = '/level2/mod14/'; 
$conn = ftp_connect('192.168.0.74');
ftp_login($conn, $ftp_user_name, $ftp_user_pass);
?>