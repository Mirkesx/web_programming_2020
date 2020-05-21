<?php

if($_SERVER['REQUEST_METHOD'] == "GET") {
    $result = array(
        "os_name" => php_uname('s'),
        "os_version" => php_uname('v'),
        "os_machine" => php_uname('m'),
        "cpu_avg" => (sys_getloadavg()[1])."%",
        "memory_used" => round(memory_get_usage()/1024/1024,3)."MB",
        "memory_all" => round(memory_get_usage(true)/1024/1024,3)."MB",
        "memory_prc" => round((memory_get_usage()/1024/1024)/(memory_get_usage(true)/1024/1024),2)."%",
    );
    echo json_encode($result);
}
else {
    throw new Exception($error);
}
