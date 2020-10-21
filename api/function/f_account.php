<?php

class Class_account {

    private $constant;
    private $fn_general;
    private $accountId;

    function __construct() {
    }

    private function get_exception($codes, $function, $line, $msg) {
        if ($msg != '') {
            $pos = strpos($msg,'-');
            if ($pos !== false) {
                $msg = substr($msg, $pos+2);
            }
            return "(ErrCode:".$codes.") [".__CLASS__.":".$function.":".$line."] - ".$msg;
        } else {
            return "(ErrCode:".$codes.") [".__CLASS__.":".$function.":".$line."]";
        }
    }

    /**
     * @param $property
     * @return mixed
     * @throws Exception
     */
    public function __get($property) {
        if (property_exists($this, $property)) {
            return $this->$property;
        } else {
            throw new Exception($this->get_exception('0001', __FUNCTION__, __LINE__, 'Get Property not exist ['.$property.']'));
        }
    }

    /**
     * @param $property
     * @param $value
     * @throws Exception
     */
    public function __set($property, $value ) {
        if (property_exists($this, $property)) {
            $this->$property = $value;
        } else {
            throw new Exception($this->get_exception('0002', __FUNCTION__, __LINE__, 'Get Property not exist ['.$property.']'));
        }
    }

    /**
     * @param $property
     * @return bool
     * @throws Exception
     */
    public function __isset($property ) {
        if (property_exists($this, $property)) {
            return isset($this->$property);
        } else {
            throw new Exception($this->get_exception('0003', __FUNCTION__, __LINE__, 'Get Property not exist ['.$property.']'));
        }
    }

    /**
     * @param $property
     * @throws Exception
     */
    public function __unset($property ) {
        if (property_exists($this, $property)) {
            unset($this->$property);
        } else {
            throw new Exception($this->get_exception('0004', __FUNCTION__, __LINE__, 'Get Property not exist ['.$property.']'));
        }
    }

    /**
     * @return array
     * @throws Exception
     */
    public function getAccountNames () {
        try {
            $refArray = array('');
            $arr_dataLocal = Class_db::getInstance()->db_select('vm_account', array(), null, null, 1);
            foreach ($arr_dataLocal as $dataLocal) {
                $refArray[intval($dataLocal['account_id'])] = $dataLocal['account_name'];
            }
            return $refArray;
        } catch(Exception $ex) {
            $this->log_error(__CLASS__, __FUNCTION__, __LINE__, $ex->getMessage());
            throw new Exception($this->get_exception('0051', __FUNCTION__, __LINE__, $ex->getMessage()), $ex->getCode());
        }
    }

    /**
     * @param $params
     * @return mixed
     * @throws Exception
     */
    public function add_account ($params) {
        try {
            $this->fn_general->log_debug(__CLASS__, __FUNCTION__, __LINE__, 'Entering '.__FUNCTION__);

            $this->fn_general->checkEmptyParams(array($params['accountId'], $params['baccDate'], $params['baccDesc'], $params['baccCategory'], $params['baccAmount']));
            $balanceOld = Class_db::getInstance()->db_sum('bal_account', array('account_id'=>$params['accountId']), 'bacc_amount');
            $balanceNew = floatval($balanceOld) + floatval($params['baccAmount']);
            $params['baccBalance'] = strval($balanceNew);
            $sqlArr = $this->fn_general->convertToMysqlArr($params, array('accountId', 'baccAccount', 'baccDate', 'baccDesc', 'baccCategory', 'baccRemark', 'baccAmount', 'baccBalance'));
            return Class_db::getInstance()->db_insert('bal_account', $sqlArr);
        }
        catch(Exception $ex) {
            $this->fn_general->log_error(__CLASS__, __FUNCTION__, __LINE__, $ex->getMessage());
            throw new Exception($this->get_exception('0005', __FUNCTION__, __LINE__, $ex->getMessage()), $ex->getCode());
        }
    }

    /**
     * @param $sales
     * @param $machineId
     * @param $machineName
     * @param $datetime
     * @return mixed
     * @throws Exception
     */
    public function add_data_sales ($sales, $machineId, $machineName, $datetime) {
        try {
            $this->fn_general->log_debug(__CLASS__, __FUNCTION__, __LINE__, 'Entering '.__FUNCTION__);

            $this->fn_general->checkEmptyParams(array($sales, $machineId, $sales['bslsStockCost']));
            $accountNames = $this->getAccountNames();
            $this->add_account(array('accountId'=>'1', 'baccAccount'=>$accountNames[1], 'baccDate'=>'|\''.$datetime.'\' - INTERVAL 10 MINUTE', 'baccDesc'=>$machineName.' Stock Paid', 'baccCategory'=>'Stock Paid', 'baccRemark'=>$sales['bslsStockCost'], 'baccAmount'=>$sales['bslsStockCost']));
            $shares = Class_db::getInstance()->db_select('vm_share', array('share_category'=>'profit', 'machine_id'=>$machineId), null, null, 1);
            foreach ($shares as $share) {
                $shareBeauty = $this->fn_general->convertDbIndex($share);
                $this->fn_general->checkEmptyParams(array($shareBeauty['accountId'], $shareBeauty['machineId'], $shareBeauty['sharePerc']));
                $accountName = $accountNames[intval($shareBeauty['accountId'])];
                $amount = floatval($sales['bslsProfitActual']) * intval($shareBeauty['sharePerc']) / 100;
                $remark = $shareBeauty['sharePerc']. '% from '.$sales['bslsProfitActual'];
                $this->add_account(array('accountId'=>$shareBeauty['accountId'], 'baccAccount'=>$accountName, 'baccDate'=>$datetime, 'baccDesc'=>$machineName.' Profit', 'baccCategory'=>'Profit', 'baccRemark'=>$remark, 'baccAmount'=>$amount));
            }
        }
        catch(Exception $ex) {
            $this->fn_general->log_error(__CLASS__, __FUNCTION__, __LINE__, $ex->getMessage());
            throw new Exception($this->get_exception('0005', __FUNCTION__, __LINE__, $ex->getMessage()), $ex->getCode());
        }
    }

    /**
     * @param $amount
     * @param $quantity
     * @param $datetime
     * @return mixed
     * @throws Exception
     */
    public function add_stock_purchase ($amount, $quantity, $datetime) {
        try {
            $this->fn_general->log_debug(__CLASS__, __FUNCTION__, __LINE__, 'Entering '.__FUNCTION__);

            $this->fn_general->checkEmptyParams(array($amount, $quantity, $datetime));
            $accountNames = $this->getAccountNames();
            $this->add_account(array('accountId'=>'1', 'baccAccount'=>$accountNames[1], 'baccDate'=>$datetime, 'baccDesc'=>'Stock Purchase', 'baccCategory'=>'Stocking', 'baccRemark'=>$quantity, 'baccAmount'=>'-'.$amount));
        }
        catch(Exception $ex) {
            $this->fn_general->log_error(__CLASS__, __FUNCTION__, __LINE__, $ex->getMessage());
            throw new Exception($this->get_exception('0005', __FUNCTION__, __LINE__, $ex->getMessage()), $ex->getCode());
        }
    }
}
