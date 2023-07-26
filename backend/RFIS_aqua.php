<?php
ini_set('max_execution_time', 6000); //Set maximum excution time of the script to 6000 seconds = 1hr
/**
* This script searches for the latest txt file created. 
* Then convert the text to csv file and add header rows for the csv file. 
* And finally convert the csv to geojson. 
* Thus, at the end, two files are created .CSV and .JSON files with the same file name in the same directory. 
*/
/**
*find_latest_txt function find the latest txt file created to pick the file name. 
*@param $directory refers to the url of the file directory. 
*@var-$all_txt_files is the array of all text files. 
*/
include('../data/include/db_connection.php');
include('../data/include/ftp_connection.php');
$directory="../data_files/source_files/";
$ftp_directory_aqua = '/aqua/modis/level2/';
$aqua_url_length=strlen($ftp_directory_aqua); 
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


$most_recent_ftp_file=check_latest_from_ftp ($ftp_directory_aqua, $aqua_url_length, 'MYD14.*txt$/i'); 
 
$opencsv=fopen($directory."files_list_aqua.csv", "a+");
$file_list_rows = fgetcsv($opencsv, 1024, ' '); //get the file content without empty lines.  
/**
*Check if the latest ftp file is in files_list_aqua.csv. If it doesn't exist, copy the latest file from remote. 
*Before copying check if the same file already exists in fileslist.csv file. If it exists, delete it and stop the script. 
*@param $directory_url (string) refers to the local file url. 
*@param $file_list_rows (array) list of files in the files_list_aqua.csv
*@param $latest_ftp_file (string) the latest file found in the ftp directory/ processing machine directory. 
*/
function find_latest_txt($directory_url,  $file_list_rows, $latest_ftp_file, $ftp_directory_url) {

	Global $conn;
	Global $ftp_user_name;
	Global $ftp_user_pass;
	Global $ftp_server;		
	if ($file_list_rows===false) {
		return "failed";

	}else {
		$check_latest_ftp_result = array_search($latest_ftp_file, $file_list_rows, true); //Check if the latest ftp file is in files_list_aqua.csv
		if ( $check_latest_ftp_result===false ) { // If the latest file on the processing server are not in the file_list.csv
				ftp_get($conn, $directory_url.$latest_ftp_file, $ftp_directory_url.$latest_ftp_file, FTP_ASCII); //Copy the latest file from remote
		        $files_list = $latest_ftp_file."\n"; // Add the latest file found from the ftp /processing machine
				$files_list .= file_get_contents($directory_url."files_list_aqua.csv"); //Keep existing file list. 
				file_put_contents($directory_url."files_list_aqua.csv", $files_list); //Add the latest file name in the list. 		
				return $latest_ftp_file; 
		}
		else {
			return "failed";
		}
	}
}


$found_file_name = find_latest_txt($directory, $file_list_rows, $most_recent_ftp_file, $ftp_directory_aqua); // $found_file_name could be picked by openlayers to load json into map 
/**
*get_datetime_from_file_name Outputs the date, datetime, and time, and upload date from the found_file_name (latest file).
*/
function get_datetime_from_file_name($found_file_name) {
	if ($found_file_name!=="failed"){
		$daycount= substr($found_file_name, 8, -10);//  eg. $found_file_name == MOD14.15075202818.txt
		$year = substr($found_file_name, 6, -13);
		//create date
		$timestamp_d=mktime(0, 0, 0, 1, $daycount, "20" . $year); 
		$date=date ('Y-m-d', $timestamp_d);

		//create datetime	
		$hhmmss=substr($found_file_name, 11, -4);
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
	}

	$file_dates = [
	    "date" => $date,
	    "datetime" => $datetime,
	    "time"=>$time, 
	    "upload_datetime" =>$upload_datetime
	];
	return $file_dates; 
}


/**
* trim_value function trims the value of header and row of the csv file created from the text file.  
*/
/**
*@param $value refers to the array value to be trimmed. 
*/
function trim_value(&$value) {
	$value = trim($value); 
}

/**
*  upload_file_to_db function converts the text to csv file and add header rows for the csv file. 
* It uploads the data to postgres daatabase. 
* Thus, at the end, two files are created .CSV and .JSON files with the same file name in the same directory. 
*/
/**
*@param $data_directory refers to the url of the file directory. 
*@param $found_file_name refers to the latest txt file found using the function find_latest_txt. 
*/
function upload_file_to_db($data_directory, $found_file_name) {

	global $db_handle; 
	$dates = get_datetime_from_file_name($found_file_name); 

	$date = $dates["date"];
	$datetime = $dates["datetime"];
	$time = $dates["time"];
	$upload_datetime = $dates["upload_datetime"];

	$dir = opendir($data_directory);
	$file = readdir($dir);
	if  (false !== ($file = readdir($dir))){    // Rename to CSV
	    
		//if(pathinfo($file, PATHINFO_EXTENSION) == 'txt') {	// if the file extension is txt, rename to csv. 
 
			$csv_file_name=substr($found_file_name,0,-3)."csv"; // New name of the csv file. 
			//$newfile = $csv_file_name;
			if (!copy($data_directory.$found_file_name, $data_directory.$csv_file_name)) { // Creat a copy of the txt file as a csv if there is no error. 
				echo "failed to copy";
			}
		//}
	}

	$csv_file_name=substr($found_file_name,0,-3)."csv"; // New name of the csv file.
	
	$header_row = "latitude,longitude,kelvin,scan_size,track_size,confidence,satellite\n"; // Header row of the csv. 
	$header_row .= file_get_contents($data_directory.$csv_file_name); //Open the latest csv file. 
	file_put_contents($data_directory.$csv_file_name, $header_row); // Add the header row on the csv file. 


	if (($handle = fopen($data_directory.$csv_file_name, 'r')) === false) { //If opening fails, show opening error. 
		die('Error opening file!');
	}
	else { 
		$complete = array();
		$handle = fopen($data_directory.$csv_file_name, 'r'); 
		$headers = fgetcsv($handle, 1024, ','); // Get csv header
		$i=0; 
		while($row = fgetcsv($handle, 1024, ',')) { // Get csv rows

			$complete[] = array_combine($headers, $row); // combain each header and cell values. as Key => Value
			$latitude = pg_escape_string($complete[$i]['latitude']);
			$longitude = pg_escape_string($complete[$i]['longitude']);
			$kelvin = pg_escape_string($complete[$i]['kelvin']);
			$scan_size = pg_escape_string($complete[$i]['scan_size']);
			$track_size = pg_escape_string($complete[$i]['track_size']);
			$confidence = pg_escape_string($complete[$i]['confidence']);
			$satellite = pg_escape_string($complete[$i]['satellite']);
			$date = pg_escape_string($date);
			$datetime = pg_escape_string($datetime);	
			$time = pg_escape_string($time);			
			//Insert the latest file rows
			$query="INSERT INTO data_fire (uploaded_to_db, date, date_string, date_time, time, latitude, longitude, kelvin, scan_size, track_size, confidence, satellite,  geom, source) 
			VALUES ('{$upload_datetime}', '{$date}', '{$date}', '{$datetime}', '{$time}', '{$latitude}', '{$longitude}', '{$kelvin}', '{$scan_size}', '{$track_size}', '{$confidence}', '{$satellite}', ST_SetSRID(ST_MakePoint({$longitude}, {$latitude}), 900913), 'Aqua' );";
			//if (!pg_connection_busy($db_handle)) {
			$result = pg_query($db_handle, $query);
			//}
			if (!$result) {
			   	echo "The table connection error is: " .pg_last_notice($db_handle);
			} else {
			  //echo $query;
			}	

			$i=$i+1; // Loop untill all arrays are excuted. 

		}

		//rename($data_directory.$found_file_name, $data_directory."backup/aqua/".$found_file_name);
		//Trim the date to the target countries only. 
		//Update The country column on data_fire so that it is easy to target the target countries.  

		$query_country="UPDATE data_fire 
			SET country=countries.country
			FROM countries
			WHERE  ST_Contains(countries.geom, data_fire.geom)
			AND date_time = '{$datetime}';";
		$result_country = pg_query($db_handle, $query_country);


		//Remove fire points that are outside the targeted region
		$trim_query = "DELETE FROM data_fire 
			WHERE country IS NULL
			AND date_time = '{$datetime}';"; 
		$result_trim = pg_query($db_handle, $trim_query);

		//Update affected conservation areas
		$updatequery1 = "UPDATE data_fire 
			SET gid=conservation_areas.gid, affected_conservation_area=concat_ws(' ',  conservation_areas.name, desig)  
			FROM conservation_areas
			WHERE  ST_Contains(conservation_areas.geom, data_fire.geom)
			AND date_time = '{$datetime}';"; 
		$result_updatequery1 = pg_query($db_handle, $updatequery1);
		// Update nearby conservation areas
		$updatequery2 = "UPDATE data_fire 
			SET nearby_conservation_area=(select string_agg(concat (concat_ws(' ', name, desig, ' (', (ROUND( (ST_Distance_Sphere(ST_AsText(data_fire.geom), ST_AsText(conservation_areas.geom))/1000)::numeric,2))) , ' Kms)'), ', ') 
			FROM conservation_areas
			WHERE  ST_Distance_Sphere(ST_AsText(data_fire.geom), ST_AsText(conservation_areas.geom))/1000 > 0 AND ST_Distance_Sphere(ST_AsText(data_fire.geom), ST_AsText(conservation_areas.geom))/1000  <50 
			AND date_time = '{$datetime}');";
		$result_updatequery2 = pg_query($db_handle, $updatequery2);
		//Update for nearby towns (with distance)
		$updatequery3 = "UPDATE data_fire 
			SET nearby_towns=(select string_agg(concat (concat_ws(' (', ppptname, (ROUND( (ST_Distance_Sphere(ST_AsText(data_fire.geom), ST_AsText(towns.geom))/1000)::numeric,2))) , ' Kms)'), ', ') 
			FROM towns
			WHERE  ST_Distance_Sphere(ST_AsText(data_fire.geom), ST_AsText(towns.geom))/1000 <50
			AND date_time = '{$datetime}');";
		$result_updatequery3 = pg_query($db_handle, $updatequery3);

	}



}
/**
* send_alert() function sends email alert to receipients. 
*/
function send_message_alert(){
		//Query to select list of people to receive email and sms alert on affected_conservation_area. 
		Global $db_handle; 
		$query2 = "SELECT * FROM subscribers, data_fire 
				   WHERE subscribers.conservation_area = data_fire.affected_conservation_area AND 
				   data_fire.date_time = (SELECT max(data_fire.date_time) FROM data_fire)"; 
		$query2b= "SELECT DISTINCT full_name, email, mobile_no, conservation_area FROM subscribers, data_fire 
				   WHERE subscribers.conservation_area = data_fire.affected_conservation_area AND 
				   data_fire.date_time = (SELECT max(data_fire.date_time) FROM data_fire)"; 
		//Select full_name, email, mobile_no, affected_conservation_area to determine the number of messages sent

		$result2 = pg_query($db_handle, $query2); 
		$result2b = pg_query($db_handle, $query2b); 

		if ($result2) {
			$number_of_rows = pg_num_rows($result2);
			$row = pg_fetch_array($result2);
			if ($number_of_rows == 1) {
				// multiple recipients
				$to_email  = $row["email"].', '; // note the comma
				$to_email .= $row["email2"].
				$to_mobile = $row["mobile_no"]."@provider_domain.com"; 
				// subject
				$subject = 'Fire Alert'.$row["affected_conservation_area"];

				// message
				$email_message = '
				<html>
				<head>
				  <title>Fire Alert</title>
				   		<style>
							table, th, td {
							   border: 1px solid black;
							}
						</style>
				</head>
				<body>
				  <p>Dear '.$row["name"].',</p>
				  <p>Our system has detected a fire in '.$row["affected_conservation_area"].'!</p>
				  <p>Find the details below. </p>
				  <table width="510"  border="0"  cellspacing="0" cellpadding="0">
				    <tr>
				      <th colspan="4" scope="col">Fire Information</th>
			        </tr>
				    <tr>
				      <td width="115">Fire ID</td>
				      <td width="116">'.$row['fire_id'].'</td>
				      <td width="106">Confidence</td>
				      <td width="145">'.$row['confidence'].'</td>
			        </tr>
				    <tr>
				      <td>Longitude</td>
				      <td>'.$row['longitude'].'</td>
				      <td>Data Caputured Date</td>
				      <td>'.$row['date'].'</td>
			        </tr>
				    <tr>
				      <td>Latitude</td>
				      <td>'.$row['latitude'].'</td>
				      <td>Data Caputured Time (UTC)</td>
				      <td>'.$row['time'].'</td>
			        </tr>
				    <tr>
				      <td>Kelvin(Brightness) </td>
				      <td>'.$row['kelvin'].'</td>
				      <td>&nbsp;</td>
				      <td>&nbsp;</td>
			        </tr>
			        <a href="http://www.google.com/maps/place/'.$row['latitude'].','.$row['longitude'].'">View in Google Map"</a>
				    <tr>
				      <td colspan="4">Fire Affected Area Details</td>
			        </tr>
				    <tr>
				      <td>Affected Conservation Area</td>
				      <td colspan="3">'.$row['affected_conservation_area'].'</td>
			        </tr>
				    <tr>
				      <td>Nearby Conservation Area and Distance (Km)</td>
				      <td colspan="3">'.$row['nearby_conservation_area'].'</td>
			        </tr>
				    <tr>
				      <td>Nearby Towns and Distance (Km)</td>
				      <td colspan="3">'.$row['nearby_towns'].'</td>
			        </tr>
			    </table>
                <p></p>
                <p>Kind Regards,</p>
                <p>ESAFIS</p>
                <p>Regional Center for Mapping and Resources for Development (RCMRD)</p>     
				</body>
				</html>
				';
				$mobile_message = '
			    	Fire ID:'.$row['fire_id'].'\n
			    	Longitude:'.$row['longitude'].'\n
			    	Latitude:'.$row['latitude'].'\n		
			    	Kelvin:'.$row['kelvin'].'\n
			    	Confidence:'.$row['confidence'].'\n
			    	Affected Area:'.$row["affected_conservation_area"]
				; 
				//Mail header
		        $headers = 'From: Eastern and Southern Africa Fire Information System'.'\r\n';
		        $headers .= 'MIME-Version: 1.0'.'\r\n';
		        $headers .= 'Content-Type: text/html; charset="iso-8859-1"'.'\n';
		        $headers .= 'X-Priority: 1'.'\r\n';
		        $headers .= 'Reply-To: beshah@rcmrd.org' . '\r\n'; 
		        $headers .= 'X-MSMail-Priority: High'.'\n';
		        $headers .= 'X-Mailer: PHP'. phpversion() .'\r\n';
				// Mail it
				mail($to_email, $subject, $email_message, $headers); // Email
				mail( $to_mobile, '', $mobile_message); // SMS				
			}
			else {

				while ( ($rowbs= pg_fetch_array($result2b) ) && ($row= pg_fetch_array($result2)) 
						&&  (sizeof($row) <= sizeof($rowbs) ) ) { //Limit the top loop to the unique outputs
					// Loop through unique full_name, email, mobile_no, affected_conservation_area to avoide unecessary repeatition
					// Then email to the unique values and add different fire points in the same location in a single email.  
					$to_email  = $rowb["email"].', '; // note the comma
					$to_email .= $rowb["email2"].
					$to_mobile = $rowb["mobile_no"]."@provider_domain.com"; 
					// subject
					$subject = 'Fire Alert on '.$rowb["affected_conservation_area"];
					// message
					$email_message = '
					<html>
					<head>
					  <title>Fire Alert</title>
					   	<style>
							table, th, td {
							   border: 1px solid black;
							}
						</style>
					</head>
					<body>
					  <p>Dear '.$rowb["full_name"].',</p>
					  <p>Our system has detected a fire in '.$rowb["affected_conservation_area"].'!</p>'; 
				   //Mobile message will only show the first fire points and the rest should be seen from the visualization tool.
					//This prevents long emails. 
				   	$mobile_message = '
				    	Fire ID:'.$row['fire_id'][0].'\n
				    	Longitude:'.$row['longitude'][0].'\n
				    	Latitude:'.$row['latitude'][0].'\n		
				    	Kelvin:'.$row['kelvin'][0].'\n
				    	Confidence:'.$row['confidence'][0].'\n
				    	Affected Area:'.$row["affected_conservation_area"][0].'\n'.
				    	'There are more fire points. Please, visit the regional fire information system for more.'
					;

					while( $row = pg_fetch_array($result2)){ //Loop through all fire points to be ouptuted in an email body. 
						// multiple recipients
					  $email_message .= '
						  <p>Please find the details below. </p>'.
					
							  '<table width="510"  border="0"  cellspacing="0" cellpadding="0">
							    <tr>
							      <th colspan="4" scope="col">Fire Information</th>
						        </tr>
							    <tr>
							      <td width="115">Fire ID</td>
							      <td width="116">'.$row['fire_id'].'</td>
							      <td width="106">Confidence</td>
							      <td width="145">'.$row['confidence'].'</td>
						        </tr>
							    <tr>
							      <td>Longitude</td>
							      <td>'.$row['longitude'].'</td>
							      <td>Data Caputured Date</td>
							      <td>'.$row['date'].'</td>
						        </tr>
							    <tr>
							      <td>Latitude</td>
							      <td>'.$row['latitude'].'</td>
							      <td>Data Caputured Time (UTC)</td>
							      <td>'.$row['time'].'</td>
						        </tr>
							    <tr>
							      <td>Kelvin(Brightness) </td>
							      <td>'.$row['kelvin'].'</td>
							      <td>&nbsp;</td>
							      <td>&nbsp;</td>
						        </tr>
						        <a href="http://www.google.com/maps/place/'.$row['latitude'].','.$row['longitude'].'">View in Google Map"</a>
							    <tr>
							      <td colspan="4">Fire Affected Area Details</td>
						        </tr>
							    <tr>
							      <td>Affected Conservation Area</td>
							      <td colspan="3">'.$row['affected_conservation_area'].'</td>
						        </tr>
							    <tr>
							      <td>Nearby Conservation Area and Distance (Km)</td>
							      <td colspan="3">'.$row['nearby_conservation_area'].'</td>
						        </tr>
							    <tr>
							      <td>Nearby Towns and Distance (Km)</td>
							      <td colspan="3">'.$row['nearby_towns'].'</td>
						        </tr>
						    </table>
			                <p></p>
			                <p>Kind Regards,</p>
			                <p>ESAFIS</p>
			                <p>Regional Center for Mapping and Resources for Development (RCMRD)</p>     
							</body>
							</html>
							';

				   }
					//Mail header
			        $headers = 'From: RCMRD - Eastern and Southern Africa Fire Information System'.'\r\n';
			        $headers .= 'MIME-Version: 1.0'.'\r\n';
			        $headers .= 'Content-Type: text/html; charset="iso-8859-1"'.'\n';
			        $headers .= 'X-Priority: 1'.'\r\n';
			        $headers .= 'Reply-To: beshah@rcmrd.org' . '\r\n'; 
			        $headers .= 'X-MSMail-Priority: High'.'\n';
			        $headers .= 'X-Mailer: PHP'. phpversion() .'\r\n';
					// Mail it
					mail($to_email, $subject, $email_message, $headers); // Email
					mail( $to_mobile, '', $mobile_message); // SMS
			   }				
			}
		   
		} 
		else {
		  	echo "The table connection error is: " .pg_last_notice($db_handle);
		}
		//Query to select list of people to receive email and sms alert on country. 
		$query3 = "SELECT * FROM subscribers, data_fire 
				   WHERE subscribers.subscribed_country = data_fire.country AND 
				   data_fire.date_time = (SELECT max(data_fire.date_time) FROM data_fire)"; 
		$query3b= "SELECT DISTINCT full_name, email, mobile_no, subscribed_country  FROM subscribers, data_fire 
				   WHERE subscribers.subscribed_country = data_fire.country AND 
				   data_fire.date_time = (SELECT max(data_fire.date_time) FROM data_fire)"; 
		///Select full_name, email, mobile_no, subscribed_country to determine the number of messages sent

		$result3 = pg_query($db_handle, $query3); 
		$result3b = pg_query($db_handle, $query3b); 

		if ($result3) {
			$number_of_rows = pg_num_rows($result3);
			$row = pg_fetch_array($result3); 
			if ($number_of_rows == 1) {// If the number of fire points/rows is 1 send detail of that row. 
				// multiple recipients
				$to_email  = $row["email"].', '; // note the comma
				$to_email .= $row["email2"].
				$to_mobile = $row["mobile_no"]."@provider_domain.com"; 
				// subject
				$subject = 'Fire Alert on '.$row["subscribed_country"];

				// message
				$email_message = '
				<html>
				<head>
				  <title>Fire Alert</title>
				   	<style>
							table, th, td {
							   border: 1px solid black;
							}
						</style>
				</head>
				<body>
				  <p>Dear '.$row["name"].',</p>
				  <p>Our system has detected a fire in '.$row["subscribed_country"].'!</p>
				  <p>Find the details below. </p>
				  <table width="510"  border="0"  cellspacing="0" cellpadding="0">
				    <tr>
				      <th colspan="4" scope="col">Fire Information</th>
			        </tr>
				    <tr>
				      <td width="115">Fire ID</td>
				      <td width="116">'.$row['fire_id'].'</td>
				      <td width="106">Confidence</td>
				      <td width="145">'.$row['confidence'].'</td>
			        </tr>
				    <tr>
				      <td>Longitude</td>
				      <td>'.$row['longitude'].'</td>
				      <td>Data Caputured Date</td>
				      <td>'.$row['date'].'</td>
			        </tr>
				    <tr>
				      <td>Latitude</td>
				      <td>'.$row['latitude'].'</td>
				      <td>Data Caputured Time (UTC)</td>
				      <td>'.$row['time'].'</td>
			        </tr>
				    <tr>
				      <td>Kelvin(Brightness) </td>
				      <td>'.$row['kelvin'].'</td>
				      <td>&nbsp;</td>
				      <td>&nbsp;</td>
			        </tr>
			        <a href="http://www.google.com/maps/place/'.$row['latitude'].','.$row['longitude'].'">View in Google Map"</a>
				    <tr>
				      <td colspan="4">Fire Affected Area Details</td>
			        </tr>
				    <tr>
				      <td>Affected Conservation Area</td>
				      <td colspan="3">'.$row['affected_conservation_area'].'</td>
			        </tr>
				    <tr>
				      <td>Nearby Conservation Area and Distance (Km)</td>
				      <td colspan="3">'.$row['nearby_conservation_area'].'</td>
			        </tr>
				    <tr>
				      <td>Nearby Towns and Distance (Km)</td>
				      <td colspan="3">'.$row['nearby_towns'].'</td>
			        </tr>
			    </table>
                <p></p>
                <p>Kind Regards,</p>
                <p>ESAFIS</p>
                <p>Regional Center for Mapping and Resources for Development (RCMRD)</p>     
				</body>
				</html>
				';
				$mobile_message = '
			    	Fire ID:'.$row['fire_id'].'\n
			    	Longitude:'.$row['longitude'].'\n
			    	Latitude:'.$row['latitude'].'\n		
			    	Kelvin:'.$row['kelvin'].'\n
			    	Confidence:'.$row['confidence'].'\n
			    	Affected Area:'.$row["affected_conservation_area"]
				; 
				//Mail header
		        $headers = 'From: Eastern and Southern Africa Fire Information System'.'\r\n';
		        $headers .= 'MIME-Version: 1.0'.'\r\n';
		        $headers .= 'Content-Type: text/html; charset="iso-8859-1"'.'\n';
		        $headers .= 'X-Priority: 1'.'\r\n';
		        $headers .= 'Reply-To: beshah@rcmrd.org' . '\r\n'; 
		        $headers .= 'X-MSMail-Priority: High'.'\n';
		        $headers .= 'X-Mailer: PHP'. phpversion() .'\r\n';
				// Mail it
				mail($to_email, $subject, $email_message, $headers); // Email
				mail( $to_mobile, '', $mobile_message); // SMS				
			}
			else {

				while ( ($rowb= pg_fetch_array($result3b) ) && ($row= pg_fetch_array($result3)) 
						&&  (sizeof($row) <= sizeof($rowb) ) ) { //Limit the top loop to the unique outputs
					// Loop through unique full_name, email, mobile_no, affected_conservation_area to avoide unecessary repeatition
					// Then email to the unique values and add different fire points in the same location in a single email.  
					$to_email  = $rowb["email"].', '; // note the comma
					$to_email .= $rowb["email2"].
					$to_mobile = $rowb["mobile_no"]."@provider_domain.com"; 
					// subject
					$subject = 'Fire Alert'.$rowb["subscribed_country"];
					// message
					$email_message = '
					<html>
					<head>
					  <title>Fire Alert</title>
					   	<style>
							table, th, td {
							   border: 1px solid black;
							}
						</style>
					</head>
					<body>
					  <p>Dear '.$rowb["full_name"].',</p>
					  <p>Our system has detected a fire in '.$rowb["subscribed_country"].'!</p>'; 
				   //Mobile message will only show the first fire points and the rest should be seen from the visualization tool.
					//This prevents long emails. 
				   	$mobile_message = '
				    	Fire ID:'.$row['fire_id'][0].'\n
				    	Longitude:'.$row['longitude'][0].'\n
				    	Latitude:'.$row['latitude'][0].'\n		
				    	Kelvin:'.$row['kelvin'][0].'\n
				    	Confidence:'.$row['confidence'][0].'\n
				    	Affected Area:'.$row["affected_conservation_area"][0].'\n'.
				    	'There are more fire points. Please, visit the regional fire information system for more.'
					;

					while( $row = pg_fetch_array($result3)){ //Loop through all fire points to be ouptuted in an email body. 
						// multiple recipients
					  $email_message .= '
						  <p>Please find the details below. </p>'.
					
							  '<table width="510"  border="0"  cellspacing="0" cellpadding="0">
							    <tr>
							      <th colspan="4" scope="col">Fire Information</th>
						        </tr>
							    <tr>
							      <td width="115">Fire ID</td>
							      <td width="116">'.$row['fire_id'].'</td>
							      <td width="106">Confidence</td>
							      <td width="145">'.$row['confidence'].'</td>
						        </tr>
							    <tr>
							      <td>Longitude</td>
							      <td>'.$row['longitude'].'</td>
							      <td>Data Caputured Date</td>
							      <td>'.$row['date'].'</td>
						        </tr>
							    <tr>
							      <td>Latitude</td>
							      <td>'.$row['latitude'].'</td>
							      <td>Data Caputured Time (UTC)</td>
							      <td>'.$row['time'].'</td>
						        </tr>
							    <tr>
							      <td>Kelvin(Brightness) </td>
							      <td>'.$row['kelvin'].'</td>
							      <td>&nbsp;</td>
							      <td>&nbsp;</td>
						        </tr>
						        <a href="http://www.google.com/maps/place/'.$row['latitude'].','.$row['longitude'].'">View in Google Map"</a>
							    <tr>
							      <td colspan="4">Fire Affected Area Details</td>
						        </tr>
							    <tr>
							      <td>Affected Conservation Area</td>
							      <td colspan="3">'.$row['affected_conservation_area'].'</td>
						        </tr>
							    <tr>
							      <td>Nearby Conservation Area and Distance (Km)</td>
							      <td colspan="3">'.$row['nearby_conservation_area'].'</td>
						        </tr>
							    <tr>
							      <td>Nearby Towns and Distance (Km)</td>
							      <td colspan="3">'.$row['nearby_towns'].'</td>
						        </tr>
						    </table>
			                <p></p>
			                <p>Kind Regards,</p>
			                <p>ESAFIS</p>
			                <p>Regional Center for Mapping and Resources for Development (RCMRD)</p>     
							</body>
							</html>
							';

				   }
					//Mail header
			        $headers = 'From: RCMRD - Eastern and Southern Africa Fire Information System'.'\r\n';
			        $headers .= 'MIME-Version: 1.0'.'\r\n';
			        $headers .= 'Content-Type: text/html; charset="iso-8859-1"'.'\n';
			        $headers .= 'Reply-To: beshah@rcmrd.org' . '\r\n'; 
			        $headers .= 'X-Priority: 1'.'\r\n';
			        $headers .= 'X-MSMail-Priority: High'.'\n';
			        $headers .= 'X-Mailer: PHP'. phpversion() .'\r\n';
					// Mail it
					mail($to_email, $subject, $email_message, $headers); // Email
					mail( $to_mobile, '', $mobile_message); // SMS
			   }				
			}
		   
		} 
		else {
		  	echo "The table connection error is: " .pg_last_notice($db_handle);
		}
}

if ($found_file_name=="failed"){
  	echo "There is no new text file found on the processing machine. Thus, the database is not updated."; 
  	array_map('unlink', glob( $directory."MYD14*.csv")); 
}
else {
	upload_file_to_db($directory, $found_file_name) ; /// Call the function
	send_message_alert(); 
	array_map('unlink', glob( $directory."MYD14*.csv")); 
}








/**
* create_db_table function creates a the data_fire database table.  
*/
function create_db_table (){
	//global $table_name;
	//global $found_file_name; //file_id serial  primary key,  
	$createtable="CREATE TABLE data_fire (fire_id serial primary key, date date NOT NULL, date_string text NOT NULL, date_time timestamp NOT NULL, time time NOT NULL, 
latitude NUMERIC NOT NULL, longitude NUMERIC NOT NULL, kelvin NUMERIC NOT NULL, scan_size NUMERIC NOT NULL, track_size NUMERIC NOT NULL, 
confidence NUMERIC NOT NULL,  satellite NUMERIC NOT NULL, geom GEOMETRY NOT NULL, gid NUMERIC, areaname CHARACTER (1000)  DEFAULT 'None', nearby_towns character(10000000) DEFAULT 'None', population NUMERIC(1000))";
	$createresult=pg_query($createtable);
	if (!$createresult) {
		  	echo "Couldn't create a new table ".$table_name.".\n";
		   	echo "The table create error is: " .pg_last_notice($db_handle);
	} else {
	  echo "";
	}
}
?>