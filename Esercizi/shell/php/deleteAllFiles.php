<?php

$dir = "uploads";

$files = scandir($dir);
array_map('unlink', glob($dir."/*"));

echo "Tutti i file cancellati!";