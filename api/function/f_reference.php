<?php

class Class_reference {

    private $constant;
    private $fn_general;

    function __construct() {
    }

    private function get_exception($codes, $function, $line, $msg) {
        if ($msg != '') {
            $pos = strpos($msg, '-');
            if ($pos !== false) {
                $msg = substr($msg, $pos + 2);
            }
            return "(ErrCode:" . $codes . ") [" . __CLASS__ . ":" . $function . ":" . $line . "] - " . $msg;
        } else {
            return "(ErrCode:" . $codes . ") [" . __CLASS__ . ":" . $function . ":" . $line . "]";
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
            throw new Exception($this->get_exception('0001', __FUNCTION__, __LINE__, 'Get Property not exist [' . $property . ']'));
        }
    }

    /**
     * @param $property
     * @param $value
     * @throws Exception
     */
    public function __set($property, $value) {
        if (property_exists($this, $property)) {
            $this->$property = $value;
        } else {
            throw new Exception($this->get_exception('0002', __FUNCTION__, __LINE__, 'Get Property not exist [' . $property . ']'));
        }
    }

    /**
     * @param $property
     * @return bool
     * @throws Exception
     */
    public function __isset($property) {
        if (property_exists($this, $property)) {
            return isset($this->$property);
        } else {
            throw new Exception($this->get_exception('0003', __FUNCTION__, __LINE__, 'Get Property not exist [' . $property . ']'));
        }
    }

    /**
     * @param $property
     * @throws Exception
     */
    public function __unset($property) {
        if (property_exists($this, $property)) {
            unset($this->$property);
        } else {
            throw new Exception($this->get_exception('0004', __FUNCTION__, __LINE__, 'Get Property not exist [' . $property . ']'));
        }
    }

    /**
     * @return array
     * @throws Exception
     */
    public function get_state () {
        try {
            $this->fn_general->log_debug(__CLASS__, __FUNCTION__, __LINE__, 'Entering '.__FUNCTION__);

            $result = array();
            $arr_dataLocal = Class_db::getInstance()->db_select('ref_state');
            foreach ($arr_dataLocal as $dataLocal) {
                $row_result['stateId'] = $dataLocal['state_id'];
                $row_result['stateCode'] = $this->fn_general->clear_null($dataLocal['state_code']);
                $row_result['countryCode'] = $this->fn_general->clear_null($dataLocal['country_code']);
                $row_result['stateDesc'] = $dataLocal['state_desc'];
                $row_result['stateStatus'] = $dataLocal['state_status'];
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
     * @return array
     * @throws Exception
     */
    public function get_city () {
        try {
            $this->fn_general->log_debug(__CLASS__, __FUNCTION__, __LINE__, 'Entering '.__FUNCTION__);

            $result = array();
            $arr_dataLocal = Class_db::getInstance()->db_select('ref_city');
            foreach ($arr_dataLocal as $dataLocal) {
                $row_result['cityId'] = $dataLocal['city_id'];
                $row_result['cityCode'] = $this->fn_general->clear_null($dataLocal['city_code']);
                $row_result['cityDesc'] = $dataLocal['city_desc'];
                $row_result['stateId'] = $dataLocal['state_id'];
                $row_result['cityStatus'] = $dataLocal['city_status'];
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
     * @return array
     * @throws Exception
     */
    public function get_gelaran () {
        try {
            $this->fn_general->log_debug(__CLASS__, __FUNCTION__, __LINE__, 'Entering '.__FUNCTION__);

            $result = array();
            $arr_dataLocal = Class_db::getInstance()->db_select('ref_gelaran');
            foreach ($arr_dataLocal as $dataLocal) {
                $row_result['gelaranId'] = $dataLocal['gelaran_id'];
                $row_result['gelaranCode'] = $this->fn_general->clear_null($dataLocal['gelaran_code']);
                $row_result['gelaranDesc'] = $dataLocal['gelaran_desc'];
                $row_result['gelaranStatus'] = $dataLocal['gelaran_status'];
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
     * @return array
     * @throws Exception
     */
    public function get_aduanJenisWakil () {
        try {
            $this->fn_general->log_debug(__CLASS__, __FUNCTION__, __LINE__, 'Entering '.__FUNCTION__);

            $result = array();
            $arr_dataLocal = Class_db::getInstance()->db_select('ref_aduan_jenis_wakil');
            foreach ($arr_dataLocal as $dataLocal) {
                $row_result['aduanJenisWakilId'] = $dataLocal['aduanJenisWakil_id'];
                $row_result['aduanJenisWakilDesc'] = $dataLocal['aduanJenisWakil_desc'];
                $row_result['aduanJenisWakilStatus'] = $dataLocal['aduanJenisWakil_status'];
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
     * @return array
     * @throws Exception
     */
    public function get_golonganPengguna () {
        try {
            $this->fn_general->log_debug(__CLASS__, __FUNCTION__, __LINE__, 'Entering '.__FUNCTION__);

            $result = array();
            $arr_dataLocal = Class_db::getInstance()->db_select('ref_golongan_pengguna');
            foreach ($arr_dataLocal as $dataLocal) {
                $row_result['golonganPenggunaId'] = $dataLocal['golonganPengguna_id'];
                $row_result['golonganPenggunaCode'] = $this->fn_general->clear_null($dataLocal['golonganPengguna_code']);
                $row_result['golonganPenggunaDesc'] = $dataLocal['golonganPengguna_desc'];
                $row_result['golonganPenggunaStatus'] = $dataLocal['golonganPengguna_status'];
                array_push($result, $row_result);
            }

            return $result;
        }
        catch(Exception $ex) {
            $this->fn_general->log_error(__CLASS__, __FUNCTION__, __LINE__, $ex->getMessage());
            throw new Exception($this->get_exception('0005', __FUNCTION__, __LINE__, $ex->getMessage()), $ex->getCode());
        }
    }
}