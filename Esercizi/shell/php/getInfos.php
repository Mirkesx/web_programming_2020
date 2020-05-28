<?php

if ($_SERVER['REQUEST_METHOD'] == "GET") {

    // CPU LOAD----------------------------
    header("Content-Type: text/plain");
    $cpuLoad = getServerLoad();
    if (is_null($cpuLoad)) {
        $cpuLoad = "CPU load not estimateable (maybe too old Windows or missing rights at Linux or Windows)";
    } else {
        $cpuLoad = round($cpuLoad, 2) . "%";
    }

    if (php_uname(('s') == "Linux")) {
        $free_cmd = explode("    ", shell_exec('free'));
        $used_RAM = round($free_cmd[10] / 1024 / 1024, 2) . "GB";
        $free_RAM = round(explode("Swap", $free_cmd[14])[0] / 1024 / 1024, 2) . "GB";
        $total_RAM = round($free_cmd[9] / 1024 / 1024, 2) . "GB";
        $rem_Size = explode("\tuploads/", shell_exec('du -csh uploads/'))[0]."B";

        $distro_size = explode("\t../assets/", shell_exec('du -csh ../assets/'))[0]."B";

        $df_cmd = explode("\n", shell_exec('df --total'));
        $df_cmd = $df_cmd[count($df_cmd) - 2];
        $df_cmd = explode(" ", $df_cmd);
        $df_perc = 1 -substr($df_cmd[16], 0, strlen($df_cmd[16]) - 1)/100;
        $system_disk_total = round($df_cmd[11] / 1024 / 1024, 2) . "GB";
        $system_disk_used = round($df_cmd[11]*$df_perc / 1024 / 1024, 2) . "GB";
        $system_disk_free = round($df_cmd[11]*(1-$df_perc) / 1024 / 1024, 2) . "GB";
    }

    $result = array(
        "OS Name" => php_uname('s'),
        "OS Version" => php_uname('v'),
        "Architecture" => php_uname('m'),
        "CPU load" => $cpuLoad,
        "Max memory (PHP)" => round(memory_get_usage(true) / 1024 / 1024, 2) . "MB",
        "Memory used (PHP)" => round(memory_get_usage() / 1024 / 1024, 2) . "MB",
        "Memory used % (PHP)" => round((memory_get_usage() / 1024 / 1024) / (memory_get_usage(true) / 1024 / 1024), 2) . "%",
        "Max RAM" => $total_RAM,
        "Used RAM" => $used_RAM,
        "Free RAM" => $free_RAM,
        "This distro size" => $distro_size,
        "Disk Size" => $system_disk_total,
        "Used Disk Space" => $system_disk_used,
        "Free Disk Space" => $system_disk_free,
        "Size of Remote folder" => $rem_Size,
    );
    echo json_encode($result);
} else {
    throw new Exception($error);
}

function _getServerLoadLinuxData()
{
    if (is_readable("/proc/stat")) {
        $stats = @file_get_contents("/proc/stat");

        if ($stats !== false) {
            // Remove double spaces to make it easier to extract values with explode()
            $stats = preg_replace("/[[:blank:]]+/", " ", $stats);

            // Separate lines
            $stats = str_replace(array("\r\n", "\n\r", "\r"), "\n", $stats);
            $stats = explode("\n", $stats);

            // Separate values and find line for main CPU load
            foreach ($stats as $statLine) {
                $statLineData = explode(" ", trim($statLine));

                // Found!
                if (
                    (count($statLineData) >= 5) &&
                    ($statLineData[0] == "cpu")
                ) {
                    return array(
                        $statLineData[1],
                        $statLineData[2],
                        $statLineData[3],
                        $statLineData[4],
                    );
                }
            }
        }
    }

    return null;
}

// Returns server load in percent (just number, without percent sign)
function getServerLoad()
{
    $load = null;

    if (stristr(PHP_OS, "win")) {
        $cmd = "wmic cpu get loadpercentage /all";
        @exec($cmd, $output);

        if ($output) {
            foreach ($output as $line) {
                if ($line && preg_match("/^[0-9]+\$/", $line)) {
                    $load = $line;
                    break;
                }
            }
        }
    } else {
        if (is_readable("/proc/stat")) {
            // Collect 2 samples - each with 1 second period
            // See: https://de.wikipedia.org/wiki/Load#Der_Load_Average_auf_Unix-Systemen
            $statData1 = _getServerLoadLinuxData();
            sleep(1);
            $statData2 = _getServerLoadLinuxData();

            if (
                (!is_null($statData1)) &&
                (!is_null($statData2))
            ) {
                // Get difference
                $statData2[0] -= $statData1[0];
                $statData2[1] -= $statData1[1];
                $statData2[2] -= $statData1[2];
                $statData2[3] -= $statData1[3];

                // Sum up the 4 values for User, Nice, System and Idle and calculate
                // the percentage of idle time (which is part of the 4 values!)
                $cpuTime = $statData2[0] + $statData2[1] + $statData2[2] + $statData2[3];

                // Invert percentage to get CPU time, not idle time
                $load = 100 - ($statData2[3] * 100 / $cpuTime);
            }
        }
    }

    return $load;
}
