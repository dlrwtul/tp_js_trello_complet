<?php

define("ROOT",str_replace("public".DIRECTORY_SEPARATOR."index.php","",$_SERVER["SCRIPT_FILENAME"]));
define("PATH_CONFIG",ROOT."config".DIRECTORY_SEPARATOR);
define("PATH_SRC",ROOT."src".DIRECTORY_SEPARATOR);
define("PATH_VIEWS",ROOT."templates".DIRECTORY_SEPARATOR);
define("PATH_BD",ROOT."data".DIRECTORY_SEPARATOR."db.json");
define("WEBROOT",str_replace("index.php","",$_SERVER["SCRIPT_NAME"]));