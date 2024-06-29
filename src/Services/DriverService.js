const axios = require('axios');
const HttpRequest = require('../Utils/HttpRequest');

class DriverService {

    async getDriverList(driverId = 10000094) {
        let data = JSON.stringify({
            "Data": {
                "Driver_ID": driverId
            },
            "UserID": 53198
        });
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://portalservice.serviceapp.com/InfoserviceWebAPI/Infoservice_CRREC/DriverReportGetAll',
            headers: {
                'Authorization': 'APIKey  C4FEC8218CCD21B85B59A071C3FF7E6F2FA019A82978BEB0D93E8E71AD1330345A68A8B3917658CE68DAB891E5F46D65',
                'Content-Type': 'application/json'
            },
            data : data
        };
        return await axios.request(config);
    }

    async getUserRequestList(reqQuery) {
        const urlKeyword = reqQuery.url_keyword;
        const bodyKeyword = reqQuery.body_keyword;
        const db_id = reqQuery.db_id;
        const dataTableName = "tms_request_log"+db_id;
        const start = reqQuery.start_date;
        const end = reqQuery.end_date;
        const page = reqQuery.page;
        const limit = reqQuery.limit;
        const offset = (page - 1) * limit;
        let whereSql = "";
        if(urlKeyword){
            whereSql += " AND tms_request_log_url LIKE '%"+urlKeyword+"%'";
        }
        if(bodyKeyword){
            whereSql += " AND tms_request_log_data LIKE '%"+bodyKeyword+"%'";
        }
        if(start && end){
            whereSql += " AND tms_request_log_created_date BETWEEN '"+start+"' AND '"+end+"'";
        }else if(start){
            whereSql += " AND tms_request_log_created_date >= '"+start+"'";
        }else if(end){
            whereSql += " AND tms_request_log_created_date <= '"+end+"'";
        }
        let countSql = "SELECT COUNT(*) AS total FROM "+dataTableName+" WHERE 1=1 "+whereSql;
        console.log(countSql);
        countSql = encodeURIComponent(countSql);
        const countData= await HttpRequest.get(countSql);
        let sql = "SELECT * FROM "+dataTableName+" WHERE 1=1 "+whereSql;
        console.log(sql);
        sql = encodeURIComponent(sql);
        const data =await HttpRequest.get(sql, offset, limit);
        return {countData, data};
    }

    async getTmsUserRpcLog(reqQuery) {
        const urlKeyword = reqQuery.url_keyword;
        const bodyKeyword = reqQuery.body_keyword;
        const id = reqQuery.id;
        const db_id = reqQuery.db_id;
        const dataTableName = "tms_user_rpc_log_"+db_id;
        const start = reqQuery.start_date;
        const end = reqQuery.end_date;
        const page = reqQuery.page;
        const limit = reqQuery.limit;
        const offset = (page - 1) * limit;
        let whereSql = "";
        if(urlKeyword){
            whereSql += " AND tms_rpc_log_target_url LIKE '%"+urlKeyword+"%'";
        }
        if(bodyKeyword){
            whereSql += " AND tms_rpc_log_request LIKE '%"+bodyKeyword+"%'";
        }
        if(id){
            whereSql += " AND tms_rpc_log_id = "+id;
        }
        if(start && end){
            whereSql += " AND tms_rpc_log_request_when BETWEEN '"+start+" 00:00:00' AND '"+end+" 23:59:59'";
        }else if(start){
            whereSql += " AND tms_rpc_log_request_when >= '"+start+" 00:00:00'";
        }else if(end){
            whereSql += " AND tms_rpc_log_request_when <= '"+end+" 23:59:59'";
        }
        let sql = "SELECT * FROM "+dataTableName+" WHERE 1=1 "+whereSql;
        let countSql = "SELECT COUNT(*) AS total FROM "+dataTableName+" WHERE 1=1 "+whereSql;
        console.log(countSql);
        countSql = encodeURIComponent(countSql);
        const countData= await HttpRequest.get(countSql);
        console.log(sql);
        sql = encodeURIComponent(sql);
        const data = await HttpRequest.get(sql, offset, limit);
        return {countData, data};
    }

    async recreateInvoice(ar_ids) {
        const email = "1111warehousing.backoffice@razor-group.com";
        const company_id = 26;
        const category = "RAZON_PAID_INV_18";//RAZON_UNPAID_INV_17
        const cust_ref = "";
        const invoice_date = "";
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            headers: {
                'Cookie': 'PHPSESSID=iqdnpofk049fip4mbt860a9uc4'
            },
            url: 'https://staging.freightapp.com/tms_invoice_5417.php?ar_ids='+ar_ids+'&category='+category+'&cust_ref='+cust_ref+'&invoice_date='+invoice_date+'&CompanyID='+company_id+'&action=recreate&key=roger1&email='+email+'&auto_send=1&use_new_company=1',
        };
        return await axios.request(config);
    }

    async getAccList() {
        let sql = "SELECT tms_acc_name_id, tms_acc_name_code, tms_acc_name_name, tms_acc_name_active, tms_acc_name_billing, tms_acc_name_hotkey, tms_acc_name_customer FROM tms_acc_name WHERE fk_company_id = 23 AND tms_acc_name_active = 1 " +
            "and tms_acc_name_billing = 1;";
        console.log(sql);
        sql = encodeURIComponent(sql);
        const accList = await HttpRequest.get(sql, 0, 1000);
        const bnpAccLists = await HttpRequest.getAccList();
        const bnpAccList = bnpAccLists.data.Result;

        let existsList = {};
        let BNPAccMap = {};
        let newAccList = [];
        bnpAccList.forEach((item) => {
            BNPAccMap[item.Code] = item;
        });
        accList.forEach((item) => {
            if(BNPAccMap && BNPAccMap.hasOwnProperty(item.tms_acc_name_code)) {
                existsList[item.tms_acc_name_code] = true;
                newAccList.push(this.accList(BNPAccMap[item.tms_acc_name_code], item));
            } else {
                newAccList.push(this.accList({}, item));
            }
        });
        bnpAccList.forEach((item) => {
            if(!(existsList && existsList.hasOwnProperty(item.Code))) {
                newAccList.push(this.accList(item, {}));
            }
        });
        return newAccList;
    }

    accList(bnpAcc, tmsAcc) {
        return {
            "Code": this.checkAccField('Code', bnpAcc),
            "Description": this.checkAccField('Description', bnpAcc),
            "IsActive": this.formatAcc(this.checkAccField('IsActive', bnpAcc)),
            "IsBillingItem": this.formatAcc(this.checkAccField('IsBillingItem', bnpAcc)),
            "IsPayItem": this.formatAcc(this.checkAccField('IsPayItem', bnpAcc)),
            "IsHotkey": this.formatAcc(this.checkAccField('IsHotkey', bnpAcc)),
            "IsCustomer": this.formatAcc(this.checkAccField('IsCustomer', bnpAcc)),
            "tms_acc_name_id": this.checkAccField('tms_acc_name_id', tmsAcc),
            "tms_acc_name_code": this.checkAccField('tms_acc_name_code', tmsAcc),
            "tms_acc_name_name": this.checkAccField('tms_acc_name_name', tmsAcc),
            "tms_acc_name_active": this.formatAcc(this.checkAccField('tms_acc_name_active', tmsAcc)),
            "tms_acc_name_billing": this.formatAcc(this.checkAccField('tms_acc_name_billing', tmsAcc)),
            "tms_acc_name_hotkey": this.formatAcc(this.checkAccField('tms_acc_name_hotkey', tmsAcc)),
            "tms_acc_name_customer": this.formatAcc(this.checkAccField('tms_acc_name_customer', tmsAcc))
        }
    }

    formatAcc(str) {
        if(str === "" || str === "false" || str === 0 || str === "0" ||str === undefined || str === null) {
            return "InActive";
        } else {
            return 'Active';
        }
    }

    checkAccField(field, object) {
        //判断是否存在该字段
        if(object && object.hasOwnProperty(field)) {
            return object[field];
        } else {
            return "";
        }
    }


}

module.exports = new DriverService();