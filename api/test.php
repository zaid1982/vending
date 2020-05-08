<?php

/*require_once 'library/constant.php';
require_once 'function/db.php';
require_once 'function/f_general.php';
require_once 'function/f_counter.php';

$constant = new Class_constant();
$fn_general = new Class_general();
$fn_counter = new Class_counter();

$fn_general->__set('constant', $constant);

$fn_counter->__set('fn_general', $fn_general);

Class_db::getInstance()->db_connect();


//$icNo = filter_input(INPUT_GET, 'icNo');
//$fn_counter->__set('icNo', $icNo);

$getData = $fn_counter->get_counter_list('1', '2019-11-05');
//$response = json_decode($getData, true);
//$errors = $response['response']['errors'];
//$data = $response['response']['data'][0];

print_r($getData);*/

echo date("Y-m-d h:i:sa");