<?php

function get_data_json()
{
    require_once(PATH_BD);
}

function save_state($string)
{
    echo $string;
    date_default_timezone_set('UTC');
    $date = date('d-m-y h:i:s');
    $array = json_decode($string,true);
    array_json($date,$array);
}