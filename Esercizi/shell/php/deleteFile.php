<?php

if(isset($_GET['path'])) {
    $path = $_GET['path'];
    unlink("uploads/".$path);
    echo "File cancellato!";
}
else
    throw new Exception($error);