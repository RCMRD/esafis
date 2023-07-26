
<?php
$to      = 'wondim81@gmail.com';
$subject = 'the subject';
$message = 'hello';
$headers = 'From: beshah@rcmrd.org' . "\r\n" .
    'Reply-To: beshah@rcmrd.org' . "\r\n" .
    'X-Mailer: PHP/' . phpversion();

mail($to, $subject, $message, $headers);
?>
