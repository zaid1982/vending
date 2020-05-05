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
     * @param $params
     * @return mixed
     * @throws Exception
     */
    public function add_counter ($params) {
        try {
            $this->fn_general->log_debug(__CLASS__, __FUNCTION__, __LINE__, 'Entering '.__FUNCTION__);
            $constant = $this->constant;

            if (empty($params)) {
                throw new Exception('[' . __LINE__ . '] - Array params empty');
            }
            if (!array_key_exists('counterName', $params) || empty($params['counterName'])) {
                throw new Exception('[' . __LINE__ . '] - Parameter counterName empty');
            }
            if (!array_key_exists('counterDesc', $params)) {
                throw new Exception('[' . __LINE__ . '] - Parameter counterDesc not exist');
            }
            if (!array_key_exists('counterStatus', $params) || empty($params['counterStatus'])) {
                throw new Exception('[' . __LINE__ . '] - Parameter counterStatus empty');
            }

            $counterName = $params['counterName'];
            $counterDesc = $params['counterDesc'];
            $counterStatus = $params['counterStatus'];

            if (Class_db::getInstance()->db_count('ast_asset_group', array('asset_group_name'=>$counterName)) > 0) {
                throw new Exception('[' . __LINE__ . '] - '.$constant::ERR_ASSET_GROUP_SIMILAR, 31);
            }

            return Class_db::getInstance()->db_insert('ast_asset_group', array('asset_group_name'=>$counterName, 'asset_group_desc'=>$counterDesc, 'asset_group_status'=>$counterStatus));
        }
        catch(Exception $ex) {
            $this->fn_general->log_error(__CLASS__, __FUNCTION__, __LINE__, $ex->getMessage());
            throw new Exception($this->get_exception('0005', __FUNCTION__, __LINE__, $ex->getMessage()), $ex->getCode());
        }
    }

    /**
     * @param $counterId
     * @param $put_vars
     * @throws Exception
     */
    public function update_counter ($counterId, $put_vars) {
        try {
            $this->fn_general->log_debug(__CLASS__, __FUNCTION__, __LINE__, 'Entering '.__FUNCTION__);
            $constant = $this->constant;

            if (empty($counterId)) {
                throw new Exception('[' . __LINE__ . '] - Parameter counterId empty');
            }
            if (empty($put_vars)) {
                throw new Exception('[' . __LINE__ . '] - Array put_vars empty');
            }

            if (!isset($put_vars['counterName']) || empty($put_vars['counterName'])) {
                throw new Exception('[' . __LINE__ . '] - Parameter counterName empty');
            }
            if (!isset($put_vars['counterDesc'])) {
                throw new Exception('[' . __LINE__ . '] - Parameter counterDesc not exist');
            }
            if (!isset($put_vars['counterStatus']) || empty($put_vars['counterStatus'])) {
                throw new Exception('[' . __LINE__ . '] - Parameter counterStatus empty');
            }

            $counterName = $put_vars['counterName'];
            $counterDesc = $put_vars['counterDesc'];
            $counterStatus = $put_vars['counterStatus'];

            if (Class_db::getInstance()->db_count('ast_asset_group', array('asset_group_name'=>$counterName, 'asset_group_id'=>'<>'.$counterId)) > 0) {
                throw new Exception('[' . __LINE__ . '] - '.$constant::ERR_ASSET_GROUP_SIMILAR, 31);
            }

            Class_db::getInstance()->db_update('ast_asset_group', array('asset_group_name'=>$counterName, 'asset_group_desc'=>$counterDesc, 'asset_group_status'=>$counterStatus), array('asset_group_id'=>$counterId));
        }
        catch(Exception $ex) {
            $this->fn_general->log_error(__CLASS__, __FUNCTION__, __LINE__, $ex->getMessage());
            throw new Exception($this->get_exception('0005', __FUNCTION__, __LINE__, $ex->getMessage()), $ex->getCode());
        }
    }

    /**
     * @param $counterId
     * @return mixed
     * @throws Exception
     */
    public function delete_counter ($counterId) {
        try {
            $this->fn_general->log_debug(__CLASS__, __FUNCTION__, __LINE__, 'Entering '.__FUNCTION__);
            $constant = $this->constant;

            if (empty($counterId)) {
                throw new Exception('[' . __LINE__ . '] - Parameter counterId empty');
            }
            if (Class_db::getInstance()->db_count('ast_asset_group', array('asset_group_id'=>$counterId)) == 0) {
                throw new Exception('[' . __LINE__ . '] - Asset Group data not exist');
            }

            Class_db::getInstance()->db_delete('ast_asset_group', array('asset_group_id'=>$counterId));
        }
        catch(Exception $ex) {
            $this->fn_general->log_error(__CLASS__, __FUNCTION__, __LINE__, $ex->getMessage());
            throw new Exception($this->get_exception('0005', __FUNCTION__, __LINE__, $ex->getMessage()), $ex->getCode());
        }
    }
}
