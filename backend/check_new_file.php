<?php
function dir_contains_children($dir) {
    $result = false;
    if($dh = opendir($dir)) {
        while(!$result && ($file = readdir($dh)) !== false) {
            $result = $file !== "." && $file !== "..";
        }

        closedir($dh);
    }

    echo $result;
}
$data_directory="../";
$delete_files_list =  fopen($data_directory."files_list.csv", 'a'); // delete files_list.csv if they exist. 
//unlink($data_directory."files_list.csv"); 
//$fp = fopen($data_directory."files_list.csv", "x");

?>