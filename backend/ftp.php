<?php

$directory="../data_files/source_files/";
include('../data/include/ftp_connection.php');
$ftp_directory_aqua = '/aqua/modis/level2/';
$ftp_directory_terra = '/terra/modis/level2/'; 
//$conn = ftp_connect('192.168.0.72');
$conn = ftp_connect('192.168.0.72') or die("Couldn't connect to the server.");
// Check the latest file on the processing machine directory
function check_latest_from_ftp ($ftp_directory_url, $ftp_connection) {
	//Global $conn;
//	Global $ftp_user_name;
//	Global $ftp_user_pass;
//	Global $ftp_server;		

	
	// get list of files on given path
	$files = ftp_nlist($ftp_connection, $ftp_directory_url);
	print_r($files); 
	$time=array(); 
	$time_file=array();
	if ($text_files= preg_grep  ('/^MOD14.*txt$/i', $files)) {
		
		foreach ($text_files as $file) {
		    // get the last modified time for the file
		    $time = ftp_mdtm($ftp_connection, $file);
		    $time_file[]= $time.$file; 
		}
		rsort($time_file); //sort descending
		print_r($time_file); 
		$latest_text= substr($time_file[0], 10); // Trim time from left side
		return $latest_text; // return the latest file. 
		echo $latest_text; 
	}
//ftp_close($conn);
}
echo $ftp_directory_aqua;
//check_latest_from_ftp ($ftp_directory_aqua);
$most_recent_ftp_file=check_latest_from_ftp ($ftp_directory_terra, $conn); 
echo $most_recent_ftp_file; 
echo $conn; 
?>
