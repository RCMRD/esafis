<?php 

	$db_handle = pg_connect("host=localhost port=5432 dbname=fire user=postgres password=Africa02"); 
	if (!$db_handle)
	{
		echo 'Connection attempt failed.';   
	}
?>