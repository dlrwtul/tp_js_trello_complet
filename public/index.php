<?php 
if (session_status() == 1) {
    session_start();
}

define("CONFIG",dirname(dirname(__FILE__)).DIRECTORY_SEPARATOR."config".DIRECTORY_SEPARATOR);

require_once(CONFIG."constantes.php");
require_once(CONFIG."orm.php");
require_once(CONFIG."validators.php");
require_once(CONFIG."functions.php");
require_once(CONFIG."router.php");
