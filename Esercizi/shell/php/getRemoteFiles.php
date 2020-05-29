<?php

$dir = "uploads";

$files = scandir($dir);

$file_list = array();
$i = 0;
foreach($files as $f) {
    error_log('uploads/'.$f);
    if($f != "." && $f != "..") {
        $file_list["file_uploaded".$i] = array("name" => explode(".",$f)[0], "ext" => pathinfo('uploads/'.$f, PATHINFO_EXTENSION), "path" => '/php/uploads/'.$f,  "size" => filesize('uploads/'.$f), 'id' => 'remote'.$i);
        if(in_array(pathinfo('uploads/'.$f, PATHINFO_EXTENSION),array('jpg', 'png', 'jpeg',))){
            $file_list["file_uploaded".$i]["width"] = getimagesize( 'uploads/'.$f)[0];
            $file_list["file_uploaded".$i]["height"] = getimagesize( 'uploads/'.$f)[1];
        }
        $i++;
    }
}
$result = json_encode($file_list);

echo $result;