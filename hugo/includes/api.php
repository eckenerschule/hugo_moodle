<?php 

require_once(__DIR__ . '/../../../config.php');

if($_SERVER['REQUEST_METHOD'] == "POST")
{
    if(!empty($_POST['source_ids']))
    {
        $_SESSION['source_ids'] = json_decode($_POST['source_ids']);
        
    }
}
echo json_encode($_SESSION);
?>

