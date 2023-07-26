<?php
$directory="../data_files/source_files/";
$ftp_user_name = 'anonymous';
$ftp_user_pass = '';
$ftp_server = '192.168.0.72';
$conn = ftp_connect('192.168.0.72') or die("Couldn't connect to $ftp_server.");
$ftp_directory_aqua = '/aqua/modis/level2/';
$ftp_directory_terra = 'terra/modis/level2/'; 

// Check the latest file on the processing machine directory
function check_latest_from_ftp ($ftp_directory_url) {
	Global $conn;
	Global $ftp_user_name;
	Global $ftp_user_pass;
	Global $ftp_server;		
	ftp_login($conn, $ftp_user_name, $ftp_user_pass);
	// get list of files on given path
	$files = ftp_nlist($conn, $ftp_directory_url);
 
	foreach ($files as $arr){
		 echo $arr . "<br>"; 
	}
	$time=array(); 
	$time_file=array();
	if ($text_files= preg_grep  ('/^MOD14.*txt$/i', $files)) {
		
	foreach ($text_files as $file) {
	    // get the last modified time for the file
	    $time = ftp_mdtm($conn, $file);
	    $time_file[]= $time.$file; 
	   
	}
	rsort($time_file); 
	$latest_text= substr($time_file[0], 10); 
	return $latest_text; 
}
ftp_close($conn);
}
$most_recent_ftp_file=check_latest_from_ftp ($ftp_directory_terra); 
echo $most_recent_ftp_file; 
?>