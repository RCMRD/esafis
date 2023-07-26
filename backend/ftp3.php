<?php 
include('../data/include/ftp_connection.php');
$directory="../data_files/source_files/";
$ftp_directory_aqua = '/aqua/modis/level2/';
$ftp_directory_terra = '/terra/modis/level2/'; 
$aqua_url_length=strlen($ftp_directory_aqua); 
$terra_url_length=strlen($ftp_directory_terra);
//echo urlencode($ftp_directory_terra);

/**
*Check the latest file on the processing machine directory.
*/

function check_latest_from_ftp ($ftp_directory_url, $ftp_url_length, $pattern) {
	Global $conn;
	// get list of files on given path
	$files = ftp_nlist($conn, $ftp_directory_url);
	$time_file=array();

	$ftp_directory_url=str_replace('/', '\/', $ftp_directory_url);

	if ($text_files = preg_grep  ('/^'.$ftp_directory_url.$pattern, $files)) {// regex pattern is $ftp_directory_url and patter. 

		foreach ($text_files as $file) {
		    //get the last modified time for the file
		    $time = ftp_mdtm($conn, $file);
		    $time_url_files[]= $time.$file; 
		}
		rsort($time_url_files); //sort descending

		$time_file=substr($time_url_files[0], $ftp_url_length+10); ///Trim time and ftp url from left side
		return $time_file; // return the latest file. 
	}
ftp_close($conn);
}
$most_recent_ftp_file=check_latest_from_ftp ($ftp_directory_terra, $terra_url_length, 'MOD14.*txt$/i'); 
echo $most_recent_ftp_file; 
?>