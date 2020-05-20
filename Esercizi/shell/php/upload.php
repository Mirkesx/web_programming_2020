<?php 
    $upload = 'err'; 
    if(!empty($_FILES['file'])){ 
        
        // File upload configuration 
        $targetDir = "uploads/"; 
        $allowTypes = array('pdf', 'doc', 'docx', 'jpg', 'png', 'jpeg', 'gif'); 
        
        $fileName = "file_".date("Y_m_d_h_i_s").".".explode(".",basename($_FILES['file']['name']))[1];
        $targetFilePath = $targetDir.$fileName; 
        
        // Check whether file type is valid 
        $fileType = pathinfo($targetFilePath, PATHINFO_EXTENSION); 
        if(in_array($fileType, $allowTypes)){ 
            // Upload file to the server 
            if(move_uploaded_file($_FILES['file']['tmp_name'], $targetFilePath)){ 
                $upload = "ok"; 
            } 
        } 
    } 
    if($upload === 'err') {
        $error = 'Always throw this error';
        throw new Exception($error);
    }
    echo $targetFilePath."!".$fileType; 
?>