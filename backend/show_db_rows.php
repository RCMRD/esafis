<?php 
include('../data/include/db_connection.php');
$sql ="select * from data_fire where fire_id=18693"; 

$result = pg_query($db_handle, $sql);
$rows= pg_fetch_array($result); 
foreach ($rows as $key => $row) {
	echo $key.' - '.$row."<br>"; 
}
$geojson = array(
	'type'      => 'FeatureCollection',
	'features'  => array()
	);


foreach ($rows as $key => $row) {                	
		$feature = array(  // create the feature part of the geojson. 
				'type' => 'Feature',
			'properties' => array(
				$key => $row
				)
			);

		array_push($geojson['features'], $feature);
	}

	echo json_encode($geojson);
