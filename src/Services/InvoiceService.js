const axios = require("axios");
const HttpRequest = require("../Utils/HttpRequest");
const crud = require('../Dao/crud');

class InvoiceService
{
    constructor() {}
    async getInvoiceLogList(sql, offset = 0, limit = 50) {
        const body = "inputDB=TMS&inputSql="+sql+"&inputOffsetLimit="+offset+"&inputRowsLimit="+limit+"&UserID="+UserID+"&UserToken="+UserToken+"&pageName=dashboardTmsSqlTool"
        const response = await fetch("https://tms.freightapp.com/write_new/execute_sql.php", {
            "headers": {
                "accept": "application/json, text/javascript, */*; q=0.01",
                "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
                "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                "sec-ch-ua": "\"Chromium\";v=\"124\", \"Microsoft Edge\";v=\"124\", \"Not-A.Brand\";v=\"99\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "x-requested-with": "XMLHttpRequest",
                "cookie": "_ga=GA1.2.219273568.1690786012; _ga_B5TWG4D90H=GS1.2.1714294413.321.0.1714294413.0.0.0; PHPSESSID=doqq72q8kksh9i3ko5io97fn37; geoposition.lat=24.533557199999994; geoposition.long=118.10063619999998",
                "Referer": "https://tms.freightapp.com/dev.html",
                "Referrer-Policy": "strict-origin-when-cross-origin"
            },
            "body": body,
            "method": "POST"
        });
        const data = await response.json();
        return data.data;
    }

    async getTransferData(data, offset, limit) {
        console.log("Request:", UserID, UserToken);
        const response = await fetch("https://tms.freightapp.com/write_new/execute_sql.php", {
            "headers": {
                "accept": "application/json, text/javascript, */*; q=0.01",
                "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
                "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                "sec-ch-ua": "\"Microsoft Edge\";v=\"123\", \"Not:A-Brand\";v=\"8\", \"Chromium\";v=\"123\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "x-requested-with": "XMLHttpRequest",
                "cookie": "_ga=GA1.2.219273568.1690786012; PHPSESSID=vfij8ga4pspg4m6nqjpak8tge1; _ga_B5TWG4D90H=GS1.2.1713521573.311.1.1713522368.0.0.0; geoposition.lat=24.53364757142857; geoposition.long=118.10058421428567",
                "Referer": "https://tms.freightapp.com/dev.html",
                "Referrer-Policy": "strict-origin-when-cross-origin"
            },
            "body": "inputDB=TMS&inputSql="+data+"&inputOffsetLimit="+offset+"&inputRowsLimit="+limit+"&UserID="+UserID+"&UserToken="+UserToken+"&pageName=dashboardTmsSqlTool",
            "method": "POST"
        });
        return await response.json();
    }

    async compareInvoiceBalance(ar_id = 0)
    {
        try{
            let response = await fetch("https://tms.freightapp.com/write_new/execute_sql.php", {
                "headers": {
                    "accept": "application/json, text/javascript, */*; q=0.01",
                    "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
                    "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                    "sec-ch-ua": "\"Microsoft Edge\";v=\"123\", \"Not:A-Brand\";v=\"8\", \"Chromium\";v=\"123\"",
                    "sec-ch-ua-mobile": "?0",
                    "sec-ch-ua-platform": "\"Windows\"",
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-origin",
                    "x-requested-with": "XMLHttpRequest",
                    "cookie": "_ga=GA1.2.219273568.1690786012; _gid=GA1.2.292519765.1713171144; PHPSESSID=vfij8ga4pspg4m6nqjpak8tge1; geoposition.lat=24.48746217330105; geoposition.long=118.17837948955834; _ga_B5TWG4D90H=GS1.2.1713521573.311.1.1713522368.0.0.0",
                    "Referer": "https://tms.freightapp.com/dev.html",
                    "Referrer-Policy": "strict-origin-when-cross-origin"
                },
                "body": "inputDB=TMS&inputSql=SELECT%0Atms_ar.tms_ar_id%20AS%20ARID%2C%0Atms_order.tms_order_id%20as%20OrderID%2C%0ACONCAT(tms_order.tms_order_pro%2C'-'%2Ctms_ar.tms_ar_invoice_no)%20as%20InvoiceNum%2C%0Atms_ar.tms_ar_invoice_date%20as%20InvoiceDate%2C%0A(SELECT%20SUM(amount.tms_quote_lines_override_amount)%20FROM%20tms_quote_lines%20as%20amount%20WHERE%20amount.fk_tms_quote_id%20%3D%20tms_ar.fk_tms_quote_id%20and%20amount.tms_quote_lines_include%20%3D%201)%20AS%20TotalAmount%2C%0AIFNULL(tms_ar.tms_ar_balance%2C(SELECT%20sum(bal.tms_quote_lines_override_amount)%20FROM%20tms_quote_lines%20as%20bal%20WHERE%20bal.fk_tms_quote_id%20%3D%20tms_ar.fk_tms_quote_id%20AND%20bal.tms_quote_lines_include%20%3D%201%20)%20-%20IFNULL((%20SELECT%20sum(tms_payment_lines.tms_payment_lines_amount%20)%20FROM%20tms_payment_lines%20WHERE%20tms_payment_lines.fk_tms_ar_id%20%3D%20tms_ar.tms_ar_id%20AND%20tms_payment_lines.tms_payment_lines_status%20%3E%3D%200%20AND%20tms_payment_lines.tms_payment_lines_voided_id%20%3D%200%20)%2C0))%20AS%20InvoiceBalance%0AFROM%0Atms_ar%0AINNER%20JOIN%20tms_order%20ON%20tms_ar.fk_tms_order_id%20%3D%20tms_order.tms_order_id%0AWHERE%0Atms_ar.tms_ar_voided_id%20%3D%200%0AAND%20tms_ar.tms_ar_credit_memo%20%3D%200%0AAND%20tms_ar.tms_ar_invoice_date%20%3E%20'2020-01-01'%0AAND%20tms_ar.fk_company_id%20%3D%2023%0AAND%20tms_ar.tms_ar_locked_id%20%3E%200%0AAND%20tms_ar.tms_ar_id%20%3E%20"+ar_id+"%0AGROUP%20BY%20tms_ar.tms_ar_id%0AHAVING%20InvoiceBalance%20!%3D%200%3B&inputOffsetLimit=0&inputRowsLimit=2500&UserID="+UserID+"&UserToken="+UserToken+"&pageName=dashboardTmsSqlTool",
                "method": "POST"
            });
            const data = await response.json();
            return data.data;
        }catch(e) {
            return [];
        }
    }

    async getBeiJingInvoiceBalance(invoiceNums) {

        let data = JSON.stringify({
            "UserID": "1073",
            "Data": {
                "InvoiceNumbers": invoiceNums
            }
        });

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://bnp.unisco.com/apiv2/api/Invoice_Header/TMSGetInvoiceApply',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'apikey AA320B44C82D78DB4E4645E4A8E3E6DDF63B90C1C927EE94D903EDE250B6FDE5'
            },
            data : data
        };
        const response = await axios.request(config);
        return response.data;
    }

    async getQuoteLogList(sql, offset = 0, limit = 50) {
        const body = "inputDB=TMS&inputSql="+sql+"&inputOffsetLimit="+offset+"&inputRowsLimit="+limit+"&UserID="+UserID+"&UserToken="+UserToken+"&pageName=dashboardTmsSqlTool"
        const response = await fetch("https://tms.freightapp.com/write_new/execute_sql.php", {
            "headers": {
                "accept": "application/json, text/javascript, */*; q=0.01",
                "accept-language": "zh-CN,zh;q=0.9",
                "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                "sec-ch-ua": "\"Chromium\";v=\"124\", \"Google Chrome\";v=\"124\", \"Not-A.Brand\";v=\"99\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "x-requested-with": "XMLHttpRequest",
                "cookie": "_ga=GA1.2.1294339863.1690787030; tms_dispatch.show_map=0; tms_dispatch.show_dispatched=0; PHPSESSID=e1iaktvtj71sh8q91sjog9s2i1; geoposition.lat=24.49408; geoposition.long=118.1745152; _gid=GA1.2.1351513312.1714281613; _ga_B5TWG4D90H=GS1.2.1714308019.329.0.1714308019.0.0.0; io=H6Ra68qobnhNl7h0AB8R",
                "Referer": "https://tms.freightapp.com/dev.html",
                "Referrer-Policy": "strict-origin-when-cross-origin"
            },
            "body": body,
            "method": "POST"
        });
        const data = await response.json();
        return data.data;
    }

    async getStagingQuoteLogList(sql, offset = 0, limit = 50) {
        const token = "8BY4DmCyeY"
        const userId = "21486"
        const body = "inputDB=TMS&inputSql="+sql+"&inputOffsetLimit="+offset+"&inputRowsLimit="+limit+"&UserID="+userId+"&UserToken="+token+"&pageName=dashboardTmsSqlTool"
        const response = await fetch("https://staging.freightapp.com/write_new/execute_sql.php", {
            "headers": {
                "accept": "application/json, text/javascript, */*; q=0.01",
                "accept-language": "zh-CN,zh;q=0.9",
                "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                "sec-ch-ua": "\"Chromium\";v=\"124\", \"Google Chrome\";v=\"124\", \"Not-A.Brand\";v=\"99\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "x-requested-with": "XMLHttpRequest",
                "cookie": "_ga=GA1.2.1294339863.1690787030; tms_dispatch.show_map=0; tms_dispatch.show_dispatched=0; PHPSESSID=e1iaktvtj71sh8q91sjog9s2i1; geoposition.lat=24.49408; geoposition.long=118.1745152; _gid=GA1.2.1351513312.1714281613; _ga_B5TWG4D90H=GS1.2.1714308019.329.0.1714308019.0.0.0; io=H6Ra68qobnhNl7h0AB8R",
                "Referer": "https://staging.freightapp.com/dev.html",
                "Referrer-Policy": "strict-origin-when-cross-origin"
            },
            "body": body,
            "method": "POST"
        });
        const data = await response.json();
        return data.data;
    }

    async getTmsInvoice(params) {
        const id = params.ar_id || 0
        const order_id = params.order_id || 0
        const invoiceNum = params.invoice_num || ""
        const start = params.start_date || ""
        const end = params.end_date || ""
        const page = params.page || 1
        const limit = params.limit || 20
        const offset = (params.page - 1) * limit
        const sort = params.sort || "ASC"
        let whereSql = ""
        if (id > 0) {
            whereSql += " AND tms_ar.tms_ar_id > " + id
        }
        if (order_id > 0) {
            whereSql += " AND tms_order.tms_order_id = " + order_id
        }
        if (invoiceNum !== "") {
            whereSql += " AND CONCAT(tms_order.tms_order_pro,'-',tms_ar.tms_ar_invoice_no) = '" + invoiceNum + "'"
        }
        if (start !== "" && end !== "") {
            whereSql += " AND tms_ar.tms_ar_invoice_date BETWEEN '" + start + "' AND '" + end + "' "
        }else if (start !== "" && end === "") {
            whereSql += " AND tms_ar.tms_ar_invoice_date >= '" + start + "' "
        }else if (start === "" && end !== "") {
            whereSql += " AND tms_ar.tms_ar_invoice_date <= '" + end + "' "
        }
        if(whereSql === ""){
            const date = new Date()
            const currentDate = date.getFullYear() + '-' + (date.getMonth()) + '-' + date.getDate()
            whereSql += " AND tms_ar.tms_ar_invoice_date >= '" + currentDate + "' "
        }

        let sql = "SELECT " + "tms_ar.tms_ar_id AS ARID," + "tms_order.tms_order_id as OrderID," +
            "CONCAT(tms_order.tms_order_pro,'-',tms_ar.tms_ar_invoice_no) as InvoiceNum," + "tms_ar.tms_ar_invoice_date as InvoiceDate," +
            "(SELECT SUM(amount.tms_quote_lines_override_amount) FROM tms_quote_lines as amount WHERE amount.fk_tms_quote_id = tms_ar.fk_tms_quote_id and amount.tms_quote_lines_include = 1) AS TotalAmount," +
            "IFNULL(tms_ar.tms_ar_balance,(SELECT sum(bal.tms_quote_lines_override_amount) FROM tms_quote_lines as bal WHERE bal.fk_tms_quote_id = tms_ar.fk_tms_quote_id AND bal.tms_quote_lines_include = 1 ) - IFNULL(( SELECT sum(tms_payment_lines.tms_payment_lines_amount ) FROM tms_payment_lines WHERE tms_payment_lines.fk_tms_ar_id = tms_ar.tms_ar_id AND tms_payment_lines.tms_payment_lines_status >= 0 AND tms_payment_lines.tms_payment_lines_voided_id = 0 ),0)) AS InvoiceBalance" +
            " FROM " + "tms_ar" + " INNER JOIN tms_order ON tms_ar.fk_tms_order_id = tms_order.tms_order_id" +
            " WHERE" +
            " tms_ar.tms_ar_voided_id = 0" + " AND tms_ar.tms_ar_credit_memo = 0 " + whereSql + " AND tms_ar.fk_company_id = 23 " +
            " AND tms_ar.tms_ar_locked_id > 0" + " HAVING InvoiceBalance > 0 order by tms_ar.tms_ar_id "+sort+";";
        console.log(sql)
        sql = encodeURIComponent(sql)

        let data = await HttpRequest.get(sql, offset, limit);
        let invoiceNums = [];
        let invoices = [];
        let lastArId = 0;
        for (let i = 0; i < data.length; i++) {
            let key = data[i]['InvoiceNum'];
            invoices[key] = data[i];
            invoiceNums.push(key);
            if(i === data.length - 1){
                lastArId = data[i]['ARID'];
            }
        }
        return [invoiceNums, invoices, lastArId];
    }

    async getBnpInvoice(invoiceNumbers){
        const invoices = await this.getBeiJingInvoiceBalance(invoiceNumbers);
        let bnpInvoice = [];
        for(const key in invoices){
            const invoice = invoices[key];
            const number = invoice['invoiceNumber'];
            if(bnpInvoice[number]){
                bnpInvoice[number].TotalAmount = invoice['totalAmount'];
                bnpInvoice[number].BNPBalance = invoice['balance'];
                bnpInvoice[number].BNPApply += invoice['receiptAmount'];
                bnpInvoice[number].ApplyDate += invoice['applyPostDate:'];
            }else{
                bnpInvoice[number] = {
                    InvoiceNumber: number,
                    TotalAmount: invoice['totalAmount'],
                    BNPBalance: invoice['balance'],
                    BNPApply: invoice['receiptAmount'],
                    ApplyDate: invoice['applyPostDate:']
                };
            }
        }
        return bnpInvoice;
    }

    async addFailedInvoice(params){
        const reason = params.reason;
        const invoice_str = params.lists;
        if(invoice_str === "" || invoice_str === null || invoice_str === undefined){
            return false;
        }
        console.log(invoice_str);
        let invoice_list = invoice_str.split("\n");
        console.log(invoice_list)
        if(invoice_list.length <= 0){
            invoice_list = invoice_str.split(',');
        }
        if(invoice_list.length <= 0){
            return false;
        }
        let invoices = [];
        for (let i in invoice_list){
            let child = {ar_id: 0, order_id: 0, invoice_num: '', reason: reason}
            const invoice_str = invoice_list[i]
            if(invoice_str === ""){
                continue;
            }
            const sp_1 = invoice_str.split('(')
            child.invoice_num = sp_1[0].trim()
            const sp_2 = sp_1[1].split('||')
            child.ar_id = sp_2[0].trim()
            child.order_id = sp_2[1].replace(')', '').trim()
            invoices.push(child)
            crud.batchAdd('log_failed_invoice', child, () => {})
        }
        return invoices;
    }

    async getFailedInvoice(params){
        const invoice = params.number || ''
        const aid = params.aid || ''
        const oid = params.oid || ''
        const start = params.start || ''
        const end = params.end || ''
        const page = params.page || 1
        const limit = params.limit || 20
        const offset = (page - 1)*limit
        let sql = "select * from log_failed_invoice where "
        let countSql = "select count(*) as total from log_failed_invoice where "
        let where = " 1 = 1 "
        if(invoice !== ''){
            where += " AND invoice_num = " + invoice;
        }
        if(aid !== ''){
            where += " AND ar_id = " + aid
        }
        if(oid !== ''){
            where += " AND order_id = " + oid
        }
        if(start !== '' && end !== ''){
            where += " AND date(created_at) between " + start + " and " + end
        }else if(start !== '' && end === ''){
            where += " AND date(created_at) >= " + start
        }else if(start === '' && end != ''){
            where += " AND date(created_at) <= " + end
        }
        countSql += where
        sql += where + ' order by id desc limit '+ offset + ',' + limit
        console.log(countSql)
        console.log(sql)
        const countData = await crud.getTable(countSql)
        const data = await crud.getTable(sql)
        return {data, countData}
    }

}

module.exports = new InvoiceService();