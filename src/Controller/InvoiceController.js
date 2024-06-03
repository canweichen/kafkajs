const invoiceService = require('../services/InvoiceService');
const invoiceBalanceController = require("./CompareInvoiceBalanceController");
const ExcelJS = require('exceljs');

class InvoiceController
{

    constructor(){}

    async addFailedInvoice(request, response){
        let responseData = {
            status: true,
            message: '',
            data: []
        }
        try{
            const params = request.body
            console.log(params)
            const data = await invoiceService.addFailedInvoice(params)
            responseData.data = data
            response.status(200)
            response.json(responseData)
        }catch(e){
            responseData.message = e.message
            responseData.status = false
            response.status(500)
            response.json(responseData)
        }
    }

    async getFailedInvoice(request, response){
        let responseData = {
            status: true,
            message: '',
            total: 0,
            data: []
        }
        try{
            const params = request.query
            const {data, countData} = await invoiceService.getFailedInvoice(params)
            responseData.total = countData[0].total
            responseData.data = data
            response.status(200)
            response.json(responseData)
        }catch(e){
            responseData.message = e.message
            responseData.status = false
            response.status(500)
            response.json(responseData)
        }

    }

    async getInvoiceLogList(request, response) {
        let responseData = {
            total: 0,
            message: '',
            data: []
        }
        try {
            const reqQuery = request.query;
            const id = reqQuery.id;
            const start = reqQuery.start_date || "";
            const end = reqQuery.end_date || "";
            const page = Math.max(reqQuery.page, 1);
            const limit = Math.max(reqQuery.limit, 10);
            const offset = (page - 1) * limit;
            let whereSql = "";
            if (start !== '' && end !== '') {
                whereSql = " AND date(tms_ar_log_created_date) BETWEEN '" + start + "' AND '" + end + "' "
            } else if (start !== '' && end === '') {
                whereSql = " AND date(tms_ar_log_created_date) >= '" + start + "' "
            } else if (start === '' && end !== '') {
                whereSql = " AND date(tms_ar_log_created_date) <= '" + end + "' "
            }
            if (id > 0) {
                whereSql += " AND tms_ar.tms_ar_id = " + id
            }
            let countSql = "select count(1) as total from tms_ar_log inner join tms_ar on tms_ar.tms_ar_id = tms_ar_log.fk_tms_ar_id inner join tms_order on tms_order.tms_order_id = tms_ar.fk_tms_order_id where 1=1 " + whereSql;
            let sql = "select tms_ar.tms_ar_id as ARID,tms_ar.tms_ar_balance,tms_ar.tms_ar_desc,tms_ar.fk_file_id, concat(tms_order.tms_order_pro,'-',tms_ar.tms_ar_invoice_no) as InvoiceNumber, tms_order.tms_order_id as OrderID, tms_ar.tms_ar_invoice_date,tms_ar_log_text,tms_ar_log_created_date from tms_ar_log inner join tms_ar on tms_ar.tms_ar_id = tms_ar_log.fk_tms_ar_id inner join tms_order on tms_order.tms_order_id = tms_ar.fk_tms_order_id where 1 = 1" + whereSql + " order by tms_ar_log.tms_ar_log_id desc";
            console.log(countSql)
            console.log(sql)
            countSql = encodeURIComponent(countSql);
            sql = encodeURIComponent(sql);
            const totalResult = await invoiceService.getInvoiceLogList(countSql, 0, 100);
            const listResult = await invoiceService.getInvoiceLogList(sql, offset, limit)
            responseData.total = totalResult[0].total;
            responseData.data = listResult;
            response.status(200);
            response.json(responseData);
        }catch (e) {
            responseData.message = e.message;
            response.status(500);
            response.json(responseData);
        }
    }

    async getInvoiceList(request, response) {
        let responseData = {
            "total": 0,
            "data": [],
            'status': 'success',
            'message': ''
        }
        try {
            const reqQuery = request.query;
            const sql_query = reqQuery.sql_;
            const page = Math.max(reqQuery.page, 1);
            const limit = Math.max(reqQuery.limit, 10);
            const offset = (page - 1) * limit;
            if(sql_query === undefined || sql_query === null || sql_query === ""){
                response.status(400);
                response.json({"message": "sql_ query is required"});
                return;
            }
            const count_sql = sql_query.replace("bnp.*", " COUNT(*) as count ");
            console.log(count_sql);
            const count_data = encodeURIComponent(count_sql);
            const data = encodeURIComponent(sql_query);
            const totalResult = await invoiceService.getTransferData(count_data, 0, 100);
            const listResult = await invoiceService.getTransferData(data, offset, limit);
            responseData.total = totalResult.data[0].count ? totalResult.data[0].count : 0;
            responseData.data = listResult.data;
            response.status(200);
            response.json(responseData);
        }catch (e) {
            responseData.message = e.message;
            response.status(500);
            response.json(responseData);
        }
    }

    async getTransferDetail(request, response) {
        let responseData = {
            "data": [],
            'status': 'success',
            'message': ''
        }
        try {
            const reqQuery = request.query;
            const id = reqQuery.id;
            if(id === undefined || id === null || id === ""){
                response.status(400);
                response.json({"message": "id is required"});
                return;
            }
            const sql = "SELECT * FROM sync_to_bnp_rpc_log WHERE tms_rpc_log_id =" + id;
            const data = await invoiceService.getTransferData(sql, 0, 1);
            responseData.data = data.data;
            response.status(200);
            response.json(responseData);
        }catch (e) {
            responseData.message = e.message;
            response.status(500);
            response.json(responseData);
        }
    }

    async getLogDetail(request, response){
        try{
            const params = request.query
            const id = params.id
            const type = params.type
            let sql = ''
            if(type === 'tcl_quote_logs' || type === 'pre_tms_quote_request'){
                sql = "SELECT * FROM tms_user_rpc_log_1 WHERE tms_rpc_log_id = " + id
            }else if(type === 'tcl_quotes') {
                sql = "SELECT * FROM tms_quote_lines WHERE fk_tms_quote_id = " + id
            }
            console.log(sql)
            sql = encodeURIComponent(sql)
            const data = await invoiceService.getQuoteLogList(sql);
            response.status(200);
            response.json(data)
        }catch (e) {
            response.status(500);
            response.json({})
        }
    }

    async getQuoteList(request, response){
        let responseData = {
            count: 0,
            list: [],
            message: ''
        }
        try {
            const date = new Date()
            const currentDate = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
            const params = request.query
            const type = params.type || ""
            const id = params.id || 0
            const limit = params.limit || 20
            const offset = (params.page - 1) * limit
            let start = params.start_date || ""
            let end = params.end_date || ""
            let whereSql = ""
            if (type !== "") {
                whereSql += " AND tms_pull_bnp_data_type = '" + type + "' "
            }
            if (id > 0) {
                whereSql += " AND tms_pull_bnp_data_object_id = " + id
            }
            if (start !== "" && end !== "") {
                start = start + " 00:00:00"
                end = end + " 23:59:59"
                whereSql += " AND tms_pull_bnp_data_created_date BETWEEN '" + start + "' AND '" + end + "' "
            } else if (start !== "" && end === "") {
                start = start + " 00:00:00"
                whereSql += " AND tms_pull_bnp_data_created_date >= '" + start + "' "
            } else if (start === "" && end !== "") {
                end = end + " 23:59:59"
                whereSql += " AND tms_pull_bnp_data_created_date <= '" + end + "' "
            } else {
                whereSql += " AND date(tms_pull_bnp_data_created_date) = '" + currentDate + "' "
            }
            let countSql = "SELECT COUNT(*) as count FROM tms_pull_bnp_data WHERE 1 = 1 " + whereSql
            console.log(countSql)
            countSql = encodeURIComponent(countSql)
            let sql = "SELECT * FROM tms_pull_bnp_data WHERE 1 = 1 " + whereSql + " ORDER BY tms_pull_bnp_data_id DESC "
            console.log(sql)
            sql = encodeURIComponent(sql)
            const countData = await invoiceService.getQuoteLogList(countSql, offset, limit);
            responseData.count = countData[0].count;
            responseData.list = await invoiceService.getQuoteLogList(sql, offset, limit);
            response.status(200);
            response.json(responseData);
        }catch (e){
            responseData.message = e.message;
            response.status(500);
            response.json(responseData);
        }
    }
    async getCompareInvoices(request, response){
        let responseData = {
            last_ar_id: 0,
            list: [],
            message: ''
        }
        try {
            const params = request.query
            const download = params.download || 0
            const [invoiceNums, invoices, lastArId] = await invoiceService.getTmsInvoice(params)
            const bnpInvoices = await invoiceService.getBnpInvoice(invoiceNums)
            for(const key in bnpInvoices){
                bnpInvoices[key]['TMSBalance'] = invoices[key]['InvoiceBalance'];
                bnpInvoices[key]['TMSAmount'] = invoices[key]['TotalAmount'];
                bnpInvoices[key]['InvoiceDate'] = invoices[key]['InvoiceDate'];
                bnpInvoices[key]['OrderID'] = invoices[key]['OrderID'];
                bnpInvoices[key]['ARID'] = invoices[key]['ARID'];
                bnpInvoices[key]['ComposerBalance'] = parseFloat(invoices[key]['InvoiceBalance']) == parseFloat(bnpInvoices[key]['BNPBalance']);
                bnpInvoices[key]['ComposerAmount'] = parseFloat(invoices[key]['TotalAmount']) == parseFloat(bnpInvoices[key]['TotalAmount']);
            }
            if(download === '1'){
                const filename = `Summary${Date.now()}.xlsx`;
                response.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
                // response.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

                const workbook = new ExcelJS.Workbook();
                const worksheet = workbook.addWorksheet('Summary');

                // Define header row using an array
                worksheet.addRow([
                    'ARID',
                    'OrderID',
                    'InvoiceNum',
                    'InvoiceDate',
                    'TMSTotalAmount',
                    'TMSBalance',
                    'BNPTotalAmount',
                    'BNPBalance',
                    'BNPApply',
                    'ComposerBalance',
                    'ComposerAmount'
                ]);

                // Use `Object.values` and `forEach` to iterate over the invoices
                Object.values(bnpInvoices).forEach((line) => {
                    worksheet.addRow([
                        line.ARID,
                        line.OrderID,
                        line.InvoiceNumber,
                        line.InvoiceDate,
                        line.TMSAmount,
                        line.TMSBalance,
                        line.TotalAmount,
                        line.BNPBalance,
                        line.BNPApply,
                        line.ComposerBalance,
                        line.ComposerAmount
                    ]);
                });

                // Use `await` to wait for the file to be written
                //await workbook.xlsx.writeFile(filename);
                console.log('Excel file has been generated.');
                //response.status(200);
                //response.end();
                const buffer = await workbook.xlsx.writeBuffer();
                // Send the buffer as the response
                response.status(200);
                response.send(buffer);
            }else{
                responseData.list = Object.values(bnpInvoices);
                responseData.last_ar_id = lastArId;
                response.status(200);
                response.json(responseData);
            }
        }catch (e){
            responseData.message = e.message;
            response.status(500);
            response.json(responseData);
        }
    }

    async getCompareInvoicesDetail(request, response){
        let responseData = {
            list: [],
            message: ''
        }
        try {
            const params = request.query
            const invoiceNum = params.invoiceNum || ''
            if(invoiceNum === ''){
                responseData.message = 'Invoice number is required';
                response.status(400);
                response.json(responseData);
                return;
            }
            const invoiceNums = [invoiceNum];
            responseData.list = await invoiceService.getBeiJingInvoiceBalance(invoiceNums);
            response.status(200);
            response.json(responseData);
        }catch (e){
            responseData.message = e.message;
            response.status(500);
            response.json(responseData);
        }
    }

    exports(exportData, filename){
        let workbook = new ExcelJS.Workbook();
        let worksheet = workbook.addWorksheet('Summary');
        // 定义标题
        worksheet.addRow(['ARID', 'OrderID', 'InvoiceNum', 'InvoiceDate', 'TMSTotalAmount', 'TMSBalance',
            'BNPTotalAmount', 'BNPBalance', 'BNPApply', 'ComposerBalance', 'ComposerAmount']);
        for (const key in exportData) {
            let line = exportData[key];
            worksheet.addRow([
                line.ARID,
                line.OrderID,
                line.InvoiceNumber,
                line.InvoiceDate,
                line.TMSAmount,
                line.TMSBalance,
                line.TotalAmount,
                line.BNPBalance,
                line.BNPApply,
                line.ComposerBalance,
                line.ComposerAmount
            ]);
        }

        workbook.xlsx.writeFile(filename).then(() => {
            console.log('Excel file has been generated.');
        }).catch(error => {
            console.error(error);
        });

    }
}

module.exports = new InvoiceController();