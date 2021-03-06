<?php

require_once 'library/constant.php';
require_once 'function/db.php';
require_once 'function/f_general.php';
require_once 'function/f_login.php';
require_once 'function/f_counter.php';
require_once 'function/f_machine.php';
require_once 'function/f_all.php';
require_once 'function/f_sales.php';
require_once 'function/f_account.php';

$api_name = 'api_counter';
$is_transaction = false;
$form_data = array('success'=>false, 'result'=>'', 'error'=>'', 'errmsg'=>'');
$result = '';

$constant = new Class_constant();
$fn_general = new Class_general();
$fn_login = new Class_login();
$fn_counter = new Class_counter();
$fn_machine = new Class_machine();
$fn_all = new Class_all();
$fn_sales = new Class_sales();
$fn_account = new Class_account();

try {
    $fn_general->__set('constant', $constant);
    $fn_login->__set('constant', $constant);
    $fn_login->__set('fn_general', $fn_general);
    $fn_counter->__set('constant', $constant);
    $fn_counter->__set('fn_general', $fn_general);
    $fn_machine->__set('constant', $constant);
    $fn_machine->__set('fn_general', $fn_general);
    $fn_all->__set('constant', $constant);
    $fn_all->__set('fn_general', $fn_general);
    $fn_sales->__set('constant', $constant);
    $fn_sales->__set('fn_general', $fn_general);
    $fn_account->__set('constant', $constant);
    $fn_account->__set('fn_general', $fn_general);

    Class_db::getInstance()->db_connect();
    $request_method = $_SERVER['REQUEST_METHOD'];
    $fn_general->log_debug('API', $api_name, __LINE__, 'Request method = '.$request_method);

    $headers = apache_request_headers();
    if (!isset($headers['Authorization'])) {
        throw new Exception('[' . __LINE__ . '] - Parameter Authorization empty');
    }
    $jwt_data = $fn_login->check_jwt($headers['Authorization']);

    if ('GET' === $request_method) {
        $urlArr = explode('/', $_SERVER['REQUEST_URI']);
        $bslsId = filter_var(end($urlArr), FILTER_VALIDATE_INT);
        $result = $fn_counter->get_counter_list($bslsId);
        $form_data['result'] = $result;
        $form_data['success'] = true;
    }
    else if ('PUT' === $request_method) {
        $urlArr = explode('/', $_SERVER['REQUEST_URI']);
        $putAction = '';
        foreach ($urlArr as $i=>$param) {
            if ($param === 'counter') {
                $putAction = $urlArr[$i+1];
                break;
            }
        }
        $putData = file_get_contents("php://input");
        parse_str($putData, $putVars);

        Class_db::getInstance()->db_beginTransaction();
        $is_transaction = true;

        if ($putAction === 'saveDataSlots') {
            $collection = $fn_counter->update_counter_sales($putVars['bslsId'], $putVars['dataCounter']);
            $fn_machine->__set('machineId', $putVars['machineId']);
            $machine = $fn_machine->get_machine();
            $fn_sales->__set('bslsId', $putVars['bslsId']);
            $sales = $fn_sales->get_sales();
            date_default_timezone_set('Asia/Kuala_Lumpur');
            $ballTime = empty($putVars['salesTime']) ? date("H:i:s") : $putVars['salesTime'].':00';
            $ballDateTime = $sales['bslsDate'].' '.$ballTime;
            $param = array(
                'ballDate'=>$ballDateTime,
                'ballDesc'=>$machine['machineName'],
                'ballCategory'=>'Sales',
                'ballRemark'=>'',
                'ballAmount'=>$collection
            );
            $fn_all->add_all($param);
            $fn_account->add_data_sales($sales, $putVars['machineId'], $machine['machineName'], $ballDateTime);
            $form_data['errmsg'] = $constant::SUC_COUNTER_UPDATE;
        } else {
            throw new Exception('[' . __LINE__ . '] - Invalid action parameter ('.$putAction.')');
        }

        Class_db::getInstance()->db_commit();
        $form_data['result'] = $result;
        $form_data['success'] = true;
    } else {
        throw new Exception('[' . __LINE__ . '] - Wrong Request Method');
    }
    Class_db::getInstance()->db_close();
} catch (Exception $ex) {
    if ($is_transaction) {
        Class_db::getInstance()->db_rollback();
    }
    Class_db::getInstance()->db_close();
    $form_data['error'] = substr($ex->getMessage(), strpos($ex->getMessage(), '] - ') + 4);
    if ($ex->getCode() === 31) {
        $form_data['errmsg'] = substr($ex->getMessage(), strpos($ex->getMessage(), '] - ') + 4);
    } else {
        $form_data['errmsg'] = $constant::ERR_DEFAULT;
    }
    $fn_general->log_error('API', $api_name, __LINE__, $ex->getMessage());
}

echo json_encode($form_data);
