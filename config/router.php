<?php
if(isset($_REQUEST["controller"])) {
    switch ($_REQUEST["controller"]){
        case 'tache':
            require_once(PATH_SRC."controllers".DIRECTORY_SEPARATOR."tache.controller.php");
            break;
        default:
            die("error 404");
            break;
    }
} else {
    die("else router");
}