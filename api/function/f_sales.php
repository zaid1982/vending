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

            $dataLocals = Class_db::getInstance()->db_select('bal_sales');
            return $this->fn_general->convertDbIndexs($dataLocals);
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

            $this->fn_general->checkEmptyParams(array($params['siteId'], $params['machineId']));
            $sqlArr = $this->fn_general->convertToMysqlArr($params, array('siteId', 'machineId'));
            $sqlArr['bsls_date'] = date("Y-m-d");

            if (Class_db::getInstance()->db_count('bal_sales', array('machine_id'=>$sqlArr['machine_id'], 'bsls_date'=>$sqlArr['bsls_date'])) > 0) {
                throw new Exception('[' . __LINE__ . '] - '.$constant::ERR_SALES_EXIST, 31);
            }
            return Class_db::getInstance()->db_insert('bal_sales', $sqlArr);
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
