<?php
    ini_set("SMTP", "apps.rcmrd.org");
    ini_set("sendmail_from", "allanoware@gmail.com");

    $message = "The mail message was sent with the following mail setting:\r\nSMTP = apps.rcmrd.org\r\nsmtp_port = 25\r\nsendmail_from = allanoware@gmail.com";

    $headers = "From: allanoware@gmail.com";


    mail("lumtegis@gmail.com", "Testing", $message, $headers);
    echo "Check your email now....<BR/>";
?>