<?php

$dir = "uploads";

$files = scandir($dir);

$file_list = array();
$i = 0;
foreach($files as $f) {
    error_log('uploads/'.$f);
    if($f != "." && $f != "..") {
        $file_list["file_uploaded".$i] = array("name" => explode(".",$f)[0], "type" => pathinfo('uploads/'.$f, PATHINFO_EXTENSION), "path" => '/php/uploads/'.$f,  "size" => filesize('uploads/'.$f));
        $i++;
    }
}
$result = json_encode($file_list);

echo $result;