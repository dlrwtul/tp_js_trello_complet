<?php

if ($_SERVER['REQUEST_METHOD'] == "POST") {
    if (isset($_POST['action'])) {
        switch ($_POST['action']) {
            case 'show':
                get_data_json();
                break;
            case 'set':
                save_state($_POST['data']);
                break;
            default:
                die("Error 404");
                break;
        }
    }else {
        die("else post");
    }
}

if ($_SERVER['REQUEST_METHOD'] == "GET") {
    if (isset($_GET['action'])) {
        switch ($_GET['action']) {
            case 'tache':
                require_once(PATH_BD);
                break;
            default:
                die("Error 404");
                break;
        }
        
    } else {
        die("else get");
    }
}
