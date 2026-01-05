<?php
if($_SERVER['REQUEST_METHOD'] === 'GET') {
    echo '<h1><a href="http://car9.me/">Card9</a>';
    die;
}

$name = $_POST['name'];
$email = $_POST['email'];
$contact = $_POST['contact'];
$price = $_POST['price'];
$message = $_POST['message'];

if($name == '' || $email == '' || $contact == '' || $price == '') {
    die('data-empty');    
}

require_once ('plugins/PHPMailer-master/src/Exception.php');
require_once ('plugins/PHPMailer-master/src/PHPMailer.php');
require_once ('plugins/PHPMailer-master/src/SMTP.php');
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
//Create an instance; passing `true` enables exceptions
$mail = new PHPMailer(true);

try {
     $mail->isSMTP();                                            //Send using SMTP
    $mail->Host       = 'smtp.gmail.com';                     //Set the SMTP server to send through
    $mail->SMTPAuth   = true;                                   //Enable SMTP authentication
    $mail->Username   = 'harjotc@evolvan.com';                     //SMTP username
    $mail->Password   = 'evo5%jst';                               //SMTP password
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;            //Enable implicit TLS encryption
    $mail->Port       = 465;                                    //TCP port to connect to; use 587 if you have set `SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS`

    //Recipients
    $mail->setFrom('harjotc@evolvan.com', 'Harjot Singh');
    $mail->addAddress('hsc0296@gmail.com', 'Harjot Singh');     //Add a recipient
    // $mail->addAddress('ellen@example.com');               //Name is optional
    $mail->addReplyTo('harjotc@evolvan.com', 'Harjot Singh');
    // $mail->addCC('cc@example.com');
    // $mail->addBCC('bcc@example.com');

    //Attachments
    // $mail->addAttachment('/var/tmp/file.tar.gz');         //Add attachments
    // $mail->addAttachment('/tmp/image.jpg', 'new.jpg');    //Optional name

    //Content
    $mail->isHTML(true);                                  //Set email format to HTML
    $mail->Subject = 'Card9 pricing request';
    $mail->Body    = '<p>Name: <b>'.$name.'</b> </p>' . '<p>Email: <b>'.$email.'</b> </p>' . '<p>Contact: <b>'.$contact.'</b> </p>' . '<p>Price: <b>'.$price.'</b> </p>' . '<p>Message: <b>'.$message.'</b> </p>' ;

    $mail->send();
    echo 'Message-sent';
} catch (Exception $e) {
    // echo "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
    echo "Message-not-sent";
}


die;
?>