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
$alls = Class_db::getInstance()->db_select('bal_account');
foreach ($alls as $all) {
    $dataPrevious = Class_db::getInstance()->db_select_single('bal_account', array('account_id'=>$all['account_id'], 'bacc_id'=>'<'.$all['bacc_id']), 'bacc_id DESC');
    if (!empty($dataPrevious)) {
        Class_db::getInstance()->db_update('bal_account', array('temp'=>(floatval($all['bacc_amount'])+floatval($dataPrevious['temp']))), array('bacc_id'=>$all['bacc_id']));
        echo 'Acc ID A - '.$all['account_id'].'</br>';
    } else {
        Class_db::getInstance()->db_update('bal_account', array('temp'=>$all['bacc_amount']), array('bacc_id'=>$all['bacc_id']));
        echo 'Acc ID B - '.$all['account_id'].'</br>';
    }
}
Class_db::getInstance()->db_close();