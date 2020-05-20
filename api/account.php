<?php

require_once 'library/constant.php';
require_once 'function/db.php';
require_once 'function/f_general.php';
require_once 'function/f_login.php';
require_once 'function/f_all.php';
require_once 'function/f_account.php';

$api_name = 'api_account';
$is_transaction = false;
$form_data = array('success'=>false, 'result'=>'', 'error'=>'', 'errmsg'=>'');
$result = '';

$constant = new Class_constant();
$fn_general = new Class_general();
$fn_login = new Class_login();
$fn_all = new Class_all();
$fn_account = new Class_account();

try {
    $fn_general->__set('constant', $constant);
    $fn_login->__set('constant', $constant);
    $fn_login->__set('fn_general', $fn_general);
    $fn_all->__set('constant', $constant);
    $fn_all->__set('fn_general', $fn_general);
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

    $urlArr = explode('/', $_SERVER['REQUEST_URI']);
    if ('GET' === $request_method) {
        $getAction = '';
        foreach ($urlArr as $i=>$param) {
            if ($param === 'account') {
                $getAction = $urlArr[$i+1];
                break;
            }
        }

        if ($getAction === 'allList') {
            $result = $fn_all->get_all_list();
        }

        $form_data['result'] = $result;
        $form_data['success'] = true;
    }
    else if ('POST' === $request_method) {
        $postAction = '';
        foreach ($urlArr as $i=>$param) {
            if ($param === 'account') {
                $postAction = $urlArr[$i+1];
                $postType = $urlArr[$i+2];
                break;
            }
        }

        Class_db::getInstance()->db_beginTransaction();
        $is_transaction = true;
        if ($postAction === 'addNewActivity') {
            $param = array(
                'ballDate' => 'Now()',
                'ballAmount' => '-'.$_POST['amount']
            );
            if ($postAction === 'addNewActivity') {
                $param['ballDesc'] = 'Stock Purchase';
                $param['ballCategory'] = 'Stocking';
                $param['ballRemark'] = $_POST['quantity'];
                $fn_all->add_all($param);
                $fn_account->add_stock_purchase($_POST['amount'], $_POST['quantity']);
            }
            $form_data['errmsg'] = $constant::SUC_ACTIVITY_ADD;
        } else {
            throw new Exception('[' . __LINE__ . '] - Invalid action parameter ('.$postAction.')');
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
