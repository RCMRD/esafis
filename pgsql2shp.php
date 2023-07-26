<?php
$SQL = "SELECT * FROM data_fire WHERE
        date_time >= (select now() - interval '3 months') AND
        country='Kenya'";
$file_name = "kenya_fires_last_3_months.shp";
$directory = "C:/xampp/htdocs/esafis/data_files/";

$result = exec('pgsql2shp -f '.$directory.$file_name.
    ' -h localhost -u postgres -P Africa02  fire "'.
    $SQL.'" 2>&1', $output, $return);

if ($return !== 0) {
    echo "Shapefile generation Failed.";
}
else{
    echo "A Shapefile is saved at ". $directory.
        " with the file name ".$file_name;
}
?>