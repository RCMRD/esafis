<?php 
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



	$dates = get_datetime_from_file_name('MOD14.15075202818.txt'); 

	$date = $dates["date"];
	$datetime = $dates["datetime"];
	$time = $dates["time"];
	$upload_datetime = $dates["upload_datetime"];


		$updatequery3 = "UPDATE data_fire 
			SET nearby_towns=(select string_agg(concat (concat_ws(' (', ppptname, (ROUND( (ST_Distance_Sphere(ST_AsText(data_fire.geom), ST_AsText(towns.geom))/1000)::numeric,2))) , ' Kms)'), ', ') 
			FROM towns
			WHERE  ST_Distance_Sphere(ST_AsText(data_fire.geom), ST_AsText(towns.geom))/1000 <50
			AND date_time = '{$datetime}');";
		echo $updatequery3; 