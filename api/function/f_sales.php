<?php

class Class_sales {

    private $constant;
    private $fn_general;
    private $bslsId;

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
    public function get_sales_list () {
        try {
            $this->fn_general->log_debug(__CLASS__, __FUNCTION__, __LINE__, 'Entering '.__FUNCTION__);

            $result = array();
            $arr_dataLocal = Class_db::getInstance()->db_select('bal_sales');
            foreach ($arr_dataLocal as $dataLocal) {
                $row_result['bslsId'] = $dataLocal['bsls_id'];
                $row_result['bslsDate'] = str_replace('-', '/', $dataLocal['bsls_date']);
                $row_result['siteId'] = $dataLocal['site_id'];
                $row_result['machineId'] = $dataLocal['machine_id'];
                $row_result['bslsCanSold'] = $this->fn_general->clear_null($dataLocal['bsls_can_sold']);
                $row_result['bslsStockCost'] = $this->fn_general->clear_null($dataLocal['bsls_stock_cost']);
                $row_result['bslsProfitTarget'] = $this->fn_general->clear_null($dataLocal['bsls_profit_target']);
                $row_result['bslsCollection'] = $this->fn_general->clear_null($dataLocal['bsls_collection']);
                $row_result['bslsProfitActual'] = $this->fn_general->clear_null($dataLocal['bsls_profit_actual']);
                $row_result['bslsProfitDiff'] = $this->fn_general->clear_null($dataLocal['bsls_profit_diff']);
                array_push($result, $row_result);
            }

            return $result;
        }
        catch(Exception $ex) {
            $this->fn_general->log_error(__CLASS__, __FUNCTION__, __LINE__, $ex->getMessage());
            throw new Exception($this->get_exception('0005', __FUNCTION__, __LINE__, $ex->getMessage()), $ex->getCode());
        }
    }

    /**
     * @param $params
     * @return mixed
     * @throws Exception
     */
    public function add_sales ($params) {
        try {
            $this->fn_general->log_debug(__CLASS__, __FUNCTION__, __LINE__, 'Entering '.__FUNCTION__);
            $constant = $this->constant;

            if (empty($params)) {
                throw new Exception('[' . __LINE__ . '] - Array params empty');
            }
            if (!array_key_exists('salesName', $params) || empty($params['salesName'])) {
                throw new Exception('[' . __LINE__ . '] - Parameter salesName empty');
            }
            if (!array_key_exists('salesDesc', $params)) {
                throw new Exception('[' . __LINE__ . '] - Parameter salesDesc not exist');
            }
            if (!array_key_exists('salesStatus', $params) || empty($params['salesStatus'])) {
                throw new Exception('[' . __LINE__ . '] - Parameter salesStatus empty');
            }

            $salesName = $params['salesName'];
            $salesDesc = $params['salesDesc'];
            $salesStatus = $params['salesStatus'];

            if (Class_db::getInstance()->db_count('ast_asset_group', array('asset_group_name'=>$salesName)) > 0) {
                throw new Exception('[' . __LINE__ . '] - '.$constant::ERR_ASSET_GROUP_SIMILAR, 31);
            }

            return Class_db::getInstance()->db_insert('ast_asset_group', array('asset_group_name'=>$salesName, 'asset_group_desc'=>$salesDesc, 'asset_group_status'=>$salesStatus));
        }
        catch(Exception $ex) {
            $this->fn_general->log_error(__CLASS__, __FUNCTION__, __LINE__, $ex->getMessage());
            throw new Exception($this->get_exception('0005', __FUNCTION__, __LINE__, $ex->getMessage()), $ex->getCode());
        }
    }

    /**
     * @param $salesId
     * @param $put_vars
     * @throws Exception
     */
    public function update_sales ($salesId, $put_vars) {
        try {
            $this->fn_general->log_debug(__CLASS__, __FUNCTION__, __LINE__, 'Entering '.__FUNCTION__);
            $constant = $this->constant;

            if (empty($salesId)) {
                throw new Exception('[' . __LINE__ . '] - Parameter salesId empty');
            }
            if (empty($put_vars)) {
                throw new Exception('[' . __LINE__ . '] - Array put_vars empty');
            }

            if (!isset($put_vars['salesName']) || empty($put_vars['salesName'])) {
                throw new Exception('[' . __LINE__ . '] - Parameter salesName empty');
            }
            if (!isset($put_vars['salesDesc'])) {
                throw new Exception('[' . __LINE__ . '] - Parameter salesDesc not exist');
            }
            if (!isset($put_vars['salesStatus']) || empty($put_vars['salesStatus'])) {
                throw new Exception('[' . __LINE__ . '] - Parameter salesStatus empty');
            }

            $salesName = $put_vars['salesName'];
            $salesDesc = $put_vars['salesDesc'];
            $salesStatus = $put_vars['salesStatus'];

            if (Class_db::getInstance()->db_count('ast_asset_group', array('asset_group_name'=>$salesName, 'asset_group_id'=>'<>'.$salesId)) > 0) {
                throw new Exception('[' . __LINE__ . '] - '.$constant::ERR_ASSET_GROUP_SIMILAR, 31);
            }

            Class_db::getInstance()->db_update('ast_asset_group', array('asset_group_name'=>$salesName, 'asset_group_desc'=>$salesDesc, 'asset_group_status'=>$salesStatus), array('asset_group_id'=>$salesId));
        }
        catch(Exception $ex) {
            $this->fn_general->log_error(__CLASS__, __FUNCTION__, __LINE__, $ex->getMessage());
            throw new Exception($this->get_exception('0005', __FUNCTION__, __LINE__, $ex->getMessage()), $ex->getCode());
        }
    }

    /**
     * @param $salesId
     * @return mixed
     * @throws Exception
     */
    public function delete_sales ($salesId) {
        try {
            $this->fn_general->log_debug(__CLASS__, __FUNCTION__, __LINE__, 'Entering '.__FUNCTION__);
            $constant = $this->constant;

            if (empty($salesId)) {
                throw new Exception('[' . __LINE__ . '] - Parameter salesId empty');
            }
            if (Class_db::getInstance()->db_count('ast_asset_group', array('asset_group_id'=>$salesId)) == 0) {
                throw new Exception('[' . __LINE__ . '] - Asset Group data not exist');
            }

            Class_db::getInstance()->db_delete('ast_asset_group', array('asset_group_id'=>$salesId));
        }
        catch(Exception $ex) {
            $this->fn_general->log_error(__CLASS__, __FUNCTION__, __LINE__, $ex->getMessage());
            throw new Exception($this->get_exception('0005', __FUNCTION__, __LINE__, $ex->getMessage()), $ex->getCode());
        }
    }
}
