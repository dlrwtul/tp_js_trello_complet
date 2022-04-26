<?php

function json_array():array
{
    $dataJson = file_get_contents(PATH_BD);
    $data = json_decode($dataJson,true);
    return $data;
}

function array_json($date,$array)
{
    $data = json_array();
    $data[$date] = $array;
    $empData = json_encode($data,JSON_PRETTY_PRINT);
    file_put_contents(PATH_BD,$empData);
}

function get_data_json()
{
    require_once(PATH_BD);
}

function save_state($string)
{
    date_default_timezone_set('UTC');
    $date = date('d-m-y h:i:s');
    $array = json_decode($string,true);
    array_json($date,$array);
    echo $string;
}