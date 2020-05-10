<?php

require_once 'library/constant.php';
require_once 'function/db.php';
require_once 'function/f_general.php';
/*require_once 'function/f_counter.php';

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

Class_db::getInstance()->db_connect();
$alls = Class_db::getInstance()->db_select('bal_all');
$dateCompare = '';
$ctr = 0;
foreach ($alls as $all) {
    if ($dateCompare !== $all['ball_date']) {
        $dateCompare = $all['ball_date'];
        $ctr = 0;
    } else {
        Class_db::getInstance()->db_update('bal_all', array('ball_date'=>'|ball_date + INTERVAL '.$ctr.' hour'), array('ball_id'=>$all['ball_id']));
    }
    echo 'YES - '.$ctr.' - '.$all['ball_date'].'</br>';
    $ctr++;
}
