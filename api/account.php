<?php

require_once 'library/constant.php';
require_once 'function/db.php';
require_once 'function/f_general.php';
require_once 'function/f_login.php';
require_once 'function/f_all.php';
require_once 'function/f_account.php';
require_once 'function/f_machine.php';
require_once 'function/f_sales.php';

$api_name = 'api_account';
$is_transaction = false;
$form_data = array('success'=>false, 'result'=>'', 'error'=>'', 'errmsg'=>'');
$result = '';

$constant = new Class_constant();
$fn_general = new Class_general();
$fn_login = new Class_login();
$fn_all = new Class_all();
$fn_account = new Class_account();
$fn_machine = new Class_machine();
$fn_sales = new Class_sales();

try {
    $fn_general->__set('constant', $constant);
    $fn_login->__set('constant', $constant);
    $fn_login->__set('fn_general', $fn_general);
    $fn_all->__set('constant', $constant);
    $fn_all->__set('fn_general', $fn_general);
    $fn_account->__set('constant', $constant);
    $fn_account->__set('fn_general', $fn_general);
    $fn_machine->__set('constant', $constant);
    $fn_machine->__set('fn_general', $fn_general);
    $fn_sales->__set('constant', $constant);
    $fn_sales->__set('fn_general', $fn_general);

    Class_db::getInstance()->db_connect();
    $request_method = $_SERVER['REQUEST_METHOD'];
    $fn_general->log_debug('API', $api_name, __LINE__, 'Request method = '.$request_method);

    $headers = apache_request_headers();
    if (!isset($headers['Authorization'])) {
        throw new Exception('[' . __LINE__ . '] - Parameter Authorization empty');
    }
    $jwt_data = $fn_login->check_jwt($headers['Authorization']);

    $urlArr = explode('/', $_SERVER['REQUEST_URI']);
    foreach ($urlArr as $i=>$param) {
        if ($param === 'account') {
            break;
        }
        array_shift($urlArr);
    }

    if ('GET' === $request_method) {
        if (!isset ($urlArr[1])) {
            throw new Exception('[' . __LINE__ . '] - Wrong Request Method');
        }
        if ($urlArr[1] === 'allList') {
            $result = $fn_all->get_all_list();
        }
        $form_data['result'] = $result;
        $form_data['success'] = true;
    }
    else if ('POST' === $request_method) {
        Class_db::getInstance()->db_beginTransaction();
        $is_transaction = true;

        if (!isset ($urlArr[1])) {
            throw new Exception('[' . __LINE__ . '] - Wrong Request Method');
        }
        $datetime = $_POST['activityDate'].' '.$_POST['activityTime'].':00';
        if ($urlArr[1] === 'stock_purchase') {
            $param = array(
                'ballDate' => $datetime,
                'ballAmount' => '-'.$_POST['amount'],
                'ballDesc' => 'Stock Purchase',
                'ballCategory' => 'Stocking',
                'ballRemark' => $_POST['remark']
            );
            $fn_all->add_all($param);
            $fn_account->add_stock_purchase($_POST['amount'], $datetime, $_POST['remark']);
            $form_data['errmsg'] = $constant::SUC_ACTIVITY_ADD;
        } else if ($urlArr[1] === 'petrol') {
            $param = array(
                'ballDate' => $datetime,
                'ballAmount' => '-'.$_POST['amount'],
                'ballDesc' => 'Petrol',
                'ballCategory' => 'Petrol',
                'ballRemark' => $_POST['remark']
            );
            $fn_all->add_all($param);
            $fn_account->add_petrol($_POST['amount'], $datetime, $_POST['remark']);
            $form_data['errmsg'] = $constant::SUC_ACTIVITY_ADD;
        } else if ($urlArr[1] === 'touch_n_go') {
            $param = array(
                'ballDate' => $datetime,
                'ballAmount' => '-'.$_POST['amount'],
                'ballDesc' => 'Touch N Go',
                'ballCategory' => 'Touch N Go',
                'ballRemark' => $_POST['remark']
            );
            $fn_all->add_all($param);
            $fn_account->add_tng($_POST['amount'], $datetime, $_POST['remark']);
            $form_data['errmsg'] = $constant::SUC_ACTIVITY_ADD;
        } else if ($urlArr[1] === 'salary') {
            $param = array(
                'ballDate' => $datetime,
                'ballAmount' => '-'.$_POST['amount'],
                'ballDesc' => $_POST['staff'],
                'ballCategory' => 'Salary',
                'ballRemark' => $_POST['remark']
            );
            $fn_all->add_all($param);
            $fn_account->add_salary($_POST['amount'], $datetime, $_POST['staff'], $_POST['remark']);
            $form_data['errmsg'] = $constant::SUC_ACTIVITY_ADD;
        } else if ($urlArr[1] === 'ro_sales') {
            $fn_machine->__set('machineId', $_POST['machineId']);
            $machine = $fn_machine->get_machine();
            $param = array(
                'ballDate' => $datetime,
                'ballAmount' => $_POST['amount'],
                'ballDesc' => $machine['machineName'],
                'ballCategory' => 'Sales',
                'ballRemark' => ''
            );
            $fn_all->add_all($param);
            $fn_account->add_ro_sales($_POST['amount'], $_POST['machineId'], $machine['machineName'], $datetime);
            $fn_sales->add_sales(array('siteId'=>$_POST['siteId'], 'machineId'=>$_POST['machineId'], 'bslsDate'=>$_POST['activityDate']));
            $fn_sales->update_sales(array('bslsCollection'=>$_POST['amount'], 'bslsProfitActual'=>$_POST['amount'], 'bslsStatus'=>'16', 'bslsStockCost'=>'0', 'bslsProfitTarget'=>'0', 'bslsProfitDiff'=>'0'));
            $form_data['errmsg'] = $constant::SUC_ACTIVITY_ADD;
        } else {
            throw new Exception('[' . __LINE__ . '] - Invalid action parameter ('.$urlArr[1].')');
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
