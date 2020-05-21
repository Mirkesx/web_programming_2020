<?php

$result = array(
        "os_name" => php_uname('s'),
        "os_version" => php_uname('v'),
        "os_machine" => php_uname('m'),
        "cpu_avg" => sys_getloadavg()[0],
        "memory_used" => memory_get_usage (),
    );
echo json_encode($result);
