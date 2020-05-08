<?php

class Class_counter {

    private $constant;
    private $fn_general;
    private $counterId;

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
     * @param $bslsId
     * @return array
     * @throws Exception
     */
    public function get_counter_list ($bslsId) {
        try {
            $this->fn_general->log_debug(__CLASS__, __FUNCTION__, __LINE__, 'Entering '.__FUNCTION__);

            $this->fn_general->checkEmptyParams(array($bslsId));
            $sales = Class_db::getInstance()->db_select_single('bal_sales', array('bsls_id'=>$bslsId), null, 1);
            $dataLocals = Class_db::getInstance()->db_select('vw_counter_slot', array('vm_counter.machine_id'=>$sales['machine_id'], 'vm_counter.counter_date'=>$sales['bsls_date']));
            return $this->fn_general->convertDbIndexs($dataLocals);
        }
        catch(Exception $ex) {
            $this->fn_general->log_error(__CLASS__, __FUNCTION__, __LINE__, $ex->getMessage());
            throw new Exception($this->get_exception('0005', __FUNCTION__, __LINE__, $ex->getMessage()), $ex->getCode());
        }
    }

    /**
     * @param $bslsId
     * @throws Exception
     */
    public function add_counter_sales ($bslsId) {
        try {
            $this->fn_general->log_debug(__CLASS__, __FUNCTION__, __LINE__, 'Entering '.__FUNCTION__);
            $constant = $this->constant;

            $this->fn_general->checkEmptyParams(array($bslsId));
            $sales = Class_db::getInstance()->db_select_single('bal_sales', array('bsls_id'=>$bslsId), null, 1);
            $previousDate = Class_db::getInstance()->db_select_col('bal_sales', array('machine_id'=>$sales['machine_id'], 'bsls_date'=>'<'.$sales['bsls_date']), 'bsls_date', 'bsls_date DESC');
            if (empty($previousDate)) {
                throw new Exception('[' . __LINE__ . '] - '.$constant::ERR_SALES_NO_PREVIOUS, 31);
            }

            $brandCosts = $this->fn_general->getBrandCost();
            $previousCounters = Class_db::getInstance()->db_select('vm_counter', array('machine_id'=>$sales['machine_id'], 'counter_date'=>$previousDate), 'counter_slot_no', null, 1);
            foreach ($previousCounters as $previousCounter) {
                $brandId = $previousCounter['brand_id'];
                Class_db::getInstance()->db_insert('vm_counter', array('counter_date'=>$sales['bsls_date'], 'site_id'=>$sales['site_id'], 'machine_id'=>$sales['machine_id'], 'counter_slot_no'=>$previousCounter['counter_slot_no'],
                    'brand_id'=>$brandId, 'counter_cost'=>$brandCosts[intval($brandId)], 'counter_price'=>$previousCounter['counter_price'], 'counter_balance_initial'=>$previousCounter['counter_balance_final'], 'counter_balance_final'=>$previousCounter['counter_balance_final']));
            }
        }
        catch(Exception $ex) {
            $this->fn_general->log_error(__CLASS__, __FUNCTION__, __LINE__, $ex->getMessage());
            throw new Exception($this->get_exception('0005', __FUNCTION__, __LINE__, $ex->getMessage()), $ex->getCode());
        }
    }

    /**
     * @param $bslsId
     * @param $dataCounters
     * @throws Exception
     */
    public function update_counter_sales ($bslsId, $dataCounters) {
        try {
            $this->fn_general->log_debug(__CLASS__, __FUNCTION__, __LINE__, 'Entering '.__FUNCTION__);

            $this->fn_general->checkEmptyParams(array($bslsId));
            $totalSold = 0.0;
            $totalCost = 0.0;
            $totalCollection = 0.0;
            foreach ($dataCounters as $dataCounter) {
                $totalSold += floatval($dataCounter['counterCanSold']);
                $totalCost += (floatval($dataCounter['counterCanSold'])*floatval($dataCounter['counterCost']));
                $totalCollection += (floatval($dataCounter['counterCanSold'])*floatval($dataCounter['counterPrice']));
                $sqlArr = $this->fn_general->convertToMysqlArr($dataCounter, array('brandId', 'counterCost', 'counterPrice', 'counterBalanceFinal', 'counterCanSold'));
                Class_db::getInstance()->db_update('vm_counter', $sqlArr, array('counter_id'=>$dataCounter['counterId']));
            }
            $totalProfit = $totalCollection - $totalCost;
            Class_db::getInstance()->db_update('bal_sales', array('bsls_can_sold'=>$totalSold, 'bsls_stock_cost'=>$totalCost, 'bsls_profit_target'=>$totalProfit, 'bsls_collection'=>$totalCollection, 'bsls_profit_actual'=>$totalProfit,
                'bsls_profit_diff'=>'0', 'bsls_status'=>'16'), array('bsls_id'=>$bslsId));
        }
        catch(Exception $ex) {
            $this->fn_general->log_error(__CLASS__, __FUNCTION__, __LINE__, $ex->getMessage());
            throw new Exception($this->get_exception('0005', __FUNCTION__, __LINE__, $ex->getMessage()), $ex->getCode());
        }
    }
}
