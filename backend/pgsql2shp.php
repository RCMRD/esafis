<?php
$ret = shell_exec ("pgsql2shp -f fire_data -u postgres -g geom -h
localhost fire data_fire 2>&1");
echo $ret;
?>
