<?php

    $emailTo = "capinfive@gmail.com";
    $status = 0;
    
    if (isset($_POST['submit'])){

        $username = $_POST["name"];
        $useremail = $_POST["email"];
        $usersubject = $_POST["subject"];
        $usermessage = $_POST["message"];


        if (empty($username) || empty($useremail) || empty($usersubject) || empty($usermessage)) {
            
            $statusMsg = "Empty feilds";

            }else if (!filter_var($useremail, FILTER_VALIDATE_EMAIL)) {

                $statusMsg = "Invaild email";

            }else if (!preg_match("/[A-Za-z]/", $username)) {

                $statusMsg = "Invaild name";

            }else if (!preg_match("/[A-Za-z]/", $usersubject)) {

                $statusMsg = "Invaild subject";

            }else if (!preg_match("/[A-Za-z]/", $usermessage)) {

                $statusMsg = "Invaild message";
            }
            
        else {

            $htmlContent = 'contact request submitted
            Username'.$username.'
            Useremail'.$useremail.'
            Usersubject'.$usersubject.'
            Usermessage'.$usermessage.'';

            $headers = 'MIME-VersionL: 1.0' . "\r\n";
            $headers .= 'content-type:text/html;charset=UTF-8' . "\r\n";
            $headers .= 'from: '.$username.'<'.$useremail.'>'."\r\n";

            $sendEmail = mail($emailTo, $htmlContent, $headers);

            if ($sendEmail) {

                $status = 1;
                $statusMsg = 'Submited successfully';

            }else {

                $statusMsg = "That didnt work";
            }
        }

    }

        $response = array('status' => $status, 'message' => $statusMsg);
        
        //$response = $statusMsg;

        echo json_encode($response);


?>