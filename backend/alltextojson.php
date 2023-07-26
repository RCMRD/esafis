<?php
ini_set('max_execution_time', 600); //Set maximum excution time of the script to 300 seconds = 5 minutes
// ini_set('display_errors',1);
// ini_set('display_startup_errors',1);
// error_reporting(-1);
/**
* This script searches for the latest txt file created. 
* Then convert the text to csv file and add header rows for the csv file. 
* And finally convert the csv to geojson. 
* Thus, at the end, two files are created .CSV and .JSON files with the same file name in the same directory. 
*/
include('../data/include/db_connection.php');  //connect to the database
/**
*find_all_txt function find the all txt files in a directory and picks the file name. 
@param $directory refers to the url of the file directory. 
@var-$all_txt_files is the array of all text files. 
*/
function find_all_txt($directory) {
	$all_txt_files = array();
	foreach (new DirectoryIterator($directory) as $fileInfo) {
		if ( !$fileInfo->isDot() && $fileInfo->isFile() && $fileInfo->getExtension()=="txt") {

                $all_txt_files[] = $fileInfo->getFileName(); // get all text file names into array
            }
        }
        //rsort($all_txt_files); 

        return $all_txt_files; /// Remove the time stamp to get the file name only. 

}




/**
* trim_value function trims the value of header and row of the csv file created from the text file.  
*/
/**
@param $value refers to the array value to be trimmed. 
*/
function trim_value(&$value) {
	$value = trim($value); 
}

$data_directory="../data_files/source_files/";
$found_file_names = find_all_txt($data_directory); // $found_file_names could be picked by geoext to load json into map

$number_of_files=count($found_file_names); 
//delete_files_list =  fopen($data_directory."files_list.csv", 'w'); // delete files_list.csv if they exist. 

$fp = fopen($data_directory."files_list.csv", "w");

foreach ($found_file_names as $file) {
	$files_list = $file."\n"; // Add the latest file found 
	$files_list .= file_get_contents($data_directory."files_list.csv"); //Keep existing list existing in the file list. 
	file_put_contents($data_directory."files_list.csv", $files_list); //Add the latest file name in the list. 
}
fclose($fp);

/**
* createcsvandjson function converts the text to csv file and add header rows for the csv file. 
* And finally convert the csv to geojson. 
* Thus, at the end, two files are created .CSV and .JSON files with the same file name in the same directory. 
*/
/**
@param $data_directory refers to the url of the file directory. 
@param $found_file_names refers to the latest txt file found using the function find_latest_txt. 
*/
function createallcsvandjson($data_directory, $found_file_names) {
	global $db_handle; 
	$dir = opendir($data_directory);
	$file = readdir($dir);
	$i =0;
	while  (false !== ($file = readdir($dir))) {    // Rename to CSV
	    // if the extension is '.txt'
		if(pathinfo($file, PATHINFO_EXTENSION) == 'txt') {	// if the file extension is txt, rename to csv. 
			//$files[] = $i; // Loop through files. 
			$newName=substr($found_file_names[$i],0,-3)."csv"; // New name of the csv file. 

			$newfile = $newName;
			if (!copy($data_directory.$found_file_names[$i], $data_directory.$newfile)) { // Creat a copy of the txt file as a csv if there is no error. 
				echo "failed to copy";
			}

			$header_row = "latitude,longitude,kelvin,scan_size,track_size,confidence,satellite\n"; // Header row of the csv. 
			$header_row .= file_get_contents($data_directory.$newfile); //Open the csv file. 
			//$header_row .= rtrim($header_row); 
			file_put_contents($data_directory.$newfile, rtrim($header_row)); // Trim and add the header row on the csv file. 

	///Create a Json file using the csv
			if (($handle = fopen($data_directory.$newfile, 'r')) === false) {
				die('Error opening file!');
			} 
			else { 

				$complete = array();
				
				$handle = fopen($data_directory.$newfile, 'r'); 

				$headers = fgetcsv($handle, 1024, ',');
				$j=0; 
		echo '<br>'.$found_file_names[$i].'<br>';
				while($row = fgetcsv($handle, 1024, ',')) {


					$daycount= substr($found_file_names[$i], 8, -10);//  eg. $found_file_name == MOD14.15075202818.txt
					$year = substr($found_file_names[$i], 6, -13);
					//echo "Year:".$year;
				//create date
					$timestamp_d=mktime(0, 0, 0, 1, $daycount, "20" . $year); 
					$date=date ('Y-m-d', $timestamp_d);
					$hhmmss=substr($file, 11, -4);
				//create datetime
					$stringdate = $date.$hhmmss;
					$create_date = date_create_from_format('Y-m-dHis', $stringdate);
					$timestamp_dt= $create_date->getTimestamp();
					$datetime=date ('Y-m-d H:i:s', $timestamp_dt);
				//create hhmmss
					$stringtime = $hhmmss;
					$create_time = date_create_from_format('His', $stringtime);
					$timestamp_time= $create_time->getTimestamp();
					$time=date ('H:i:s', $timestamp_time);
				//Create upload_Datetime
					$create_upload_datetime = date_create();
					$timestamp_upload_datetime= date_timestamp_get($create_upload_datetime);
					$upload_datetime = date('Y-m-d H:i:s', $timestamp_upload_datetime);

					$complete[] = array_combine($headers, $row); // combain each header and cell values. as Key => Value
					$latitude = pg_escape_string($complete[$j]['latitude']);
					$longitude = pg_escape_string($complete[$j]['longitude']);
					$kelvin = pg_escape_string($complete[$j]['kelvin']);
					$scan_size = pg_escape_string($complete[$j]['scan_size']);
					$track_size = pg_escape_string($complete[$j]['track_size']);
					$confidence = pg_escape_string($complete[$j]['confidence']);
					$satellite = pg_escape_string($complete[$j]['satellite']);
					$date = pg_escape_string($date);
					$upload_datetime = pg_escape_string($upload_datetime);
					$datetime = pg_escape_string($datetime);	
					$time = pg_escape_string($time);		

					$query="INSERT INTO data_fire (uploaded_to_db, date, date_string, date_time, time, latitude, longitude, kelvin, scan_size, track_size, confidence, satellite, geom) VALUES ('{$upload_datetime}', '{$date}', '{$date}', '{$datetime}', '{$time}', '{$latitude}', '{$longitude}', '{$kelvin}', '{$scan_size}', '{$track_size}', '{$confidence}', '{$satellite}', ST_SetSRID(ST_MakePoint({$longitude}, {$latitude}), 900913) );";
					


				  	if (!pg_connection_busy($db_handle)) {
				      	$result = pg_send_query($db_handle, $query);
				  	}
					//$result = pg_query($db_handle,$query); 
					echo $query."<br>"; 
					if (!$result) {
					   	echo "The table insert error is: " .pg_last_notice($db_handle);
					} else {
					  	$pg_result = pg_get_result($db_handle);
  						echo "First call to pg_get_result(): $pg_result\n";
					}
	
				}
			}

		$i++;  

		}

	} 

	$query2="UPDATE data_fire 
		SET affected_conservation_area=concat_ws(' ', areaname, designate)
		FROM ethiopia_conservation_areas
		WHERE  ST_Contains(ethiopia_conservation_areas.geom, data_fire.geom);"; 
	$query2.= "UPDATE data_fire 
	    SET nearby_conservation_area=(select string_agg(concat (concat_ws(' ', areaname, designate, ' (', (ROUND( (ST_Distance_Sphere(ST_AsText(data_fire.geom), ST_AsText(ethiopia_conservation_areas.geom))/1000)::numeric,2))) , ' Kms)'), ', ') 
	    FROM ethiopia_conservation_areas
	    WHERE  ST_Distance_Sphere(ST_AsText(data_fire.geom), ST_AsText(ethiopia_conservation_areas.geom))/1000 <50);";
	//Update for nearby towns (with distance)
	$query2.= "UPDATE data_fire 
	    SET nearby_towns=(select string_agg(concat (concat_ws(' (', town_name, (ROUND( (ST_Distance_Sphere(ST_AsText(data_fire.geom), ST_AsText(ethiopia_major_settlements.geom))/1000)::numeric,2))) , ' Kms)'), ', ') 
	    FROM ethiopia_major_settlements
	    WHERE  ST_Distance_Sphere(ST_AsText(data_fire.geom), ST_AsText(ethiopia_major_settlements.geom))/1000 <50);";

	if (!pg_connection_busy($db_handle)) {
	  	$result2 = pg_send_query($db_handle, $query2);
	}
	echo $query2."<br>"; 

}

createallcsvandjson($data_directory, $found_file_names) ; /// Call the function
array_map('unlink', glob( $data_directory."MOD14*.csv")); 

?>