<?php
$result = "";
if ($_SERVER["REQUEST_METHOD"] == "GET") {
    if(empty($_GET['w1']) || empty($_GET['w2'])) {
        $result .= "Mancano 1 o entrambi i parametri!";
    } 
    else {
        
        $w1 = $_GET['w1'];
        $w2 = $_GET['w2'];
        if(strlen($w1) < strlen($w2)) {
            $result .= $w2." è più grande di ".$w1;
        }
        else if(($pos = strpos($w1, $w2)) !== false){
            $result .= $w2." è contenuta in ".$w1.". Prima occorrenza trovata alla posizione ".$pos.".";
        }
        else {
            $result .= $w2." non è contenuta in ".$w1."."; 
        }
    }

  } else {
    $result .= "Method sbagliato! Supporto solo GET";
  }
  echo json_encode(array("text" => $result, "id" => $_GET['id']));