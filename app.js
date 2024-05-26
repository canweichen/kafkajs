const express = require('express');
const cors = require('cors');
const invoiceBalanceController = require('./src/Controller/CompareInvoiceBalanceController');
const app = express();
const port = 3000;

app.use(cors());

app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.get('/quoteList', (req, res) => {
    const date = new Date()
    const currentDate = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
    const params = req.query
    const type = params.type || ""
    const id = params.id || 0
    const limit = params.limit || 20
    const offset = (params.page - 1) * limit
    let start = params.start_date || ""
    let end = params.end_date || ""
    let whereSql = ""
    if(type !== ""){
        whereSql += " AND tms_pull_bnp_data_type = '" + type + "' "
    }
    if(id > 0){
        whereSql += " AND tms_pull_bnp_data_object_id = " + id
    }
    if(start !== "" && end !== ""){
        start = start+" 00:00:00"
        end = end+" 23:59:59"
        whereSql += " AND tms_pull_bnp_data_created_date BETWEEN '" + start + "' AND '" + end + "' "
    }else if(start !== "" && end === ""){
        start = start+" 00:00:00"
        whereSql += " AND tms_pull_bnp_data_created_date >= '" + start + "' "
    }else if(start === "" && end !== ""){
        end = end+" 23:59:59"
        whereSql += " AND tms_pull_bnp_data_created_date <= '" + end + "' "
    }else{
        whereSql += " AND date(tms_pull_bnp_data_created_date) = '" + currentDate + "' "
    }
    let countSql = "SELECT COUNT(*) as count FROM tms_pull_bnp_data WHERE 1 = 1 " + whereSql
    console.log(countSql)
    countSql = encodeURIComponent(countSql)
    let sql = "SELECT * FROM tms_pull_bnp_data WHERE 1 = 1 " + whereSql + " ORDER BY tms_pull_bnp_data_id DESC "
    console.log(sql)
    sql = encodeURIComponent(sql)
    let responseData = {
        count: 0,
        list: []
    }
    const invoiceApp = new invoiceBalanceController()
    invoiceApp.getQuoteLogList(countSql, offset, limit).then(rst => {
        responseData.count = rst[0].count
        invoiceApp.getQuoteLogList(sql, offset, limit).then(rst => {
            responseData.list = rst
            res.status(200);
            res.json(responseData);
        })
    })

})
app.get('/logDetail', (req, res) => {
    const params = req.query
    const id = params.id
    const type = params.type
    let sql = ''
    if(type === 'tcl_quote_logs' || type === 'pre_tms_quote_request'){
        sql = "SELECT * FROM tms_user_rpc_log_2 WHERE tms_rpc_log_id = " + id
    }else if(type === 'tcl_quotes') {
        sql = "SELECT * FROM tms_quote_lines WHERE fk_tms_quote_id = " + id
    }
    sql = encodeURIComponent(sql)
    const invoiceApp = new invoiceBalanceController()
    invoiceApp.getQuoteLogList(sql).then(rst => {
        res.status(200);
        res.json(rst);
    })
})
app.get('/compareInvoices', (req, res) => {
    const params = req.query
    const invoiceApp = new invoiceBalanceController()
    invoiceApp.getCompareInvoiceData(params).then(rst => {
        res.status(200);
        res.json(rst);
    }, err => {})
});
app.get('/invoices', (req, res) => {
    const reqQuery = req.query;
    const sql_query = reqQuery.sql_;
    const page = Math.max(reqQuery.page, 1);
    const limit = Math.max(reqQuery.limit, 10);
    const offset = (page - 1) * limit;
    if(sql_query === undefined || sql_query === null || sql_query === ""){
        res.status(400);
        res.json({"message": "sql_ query is required"});
        return;
    }
    const count_sql = sql_query.replace("*", " COUNT(*) as count ");
    console.log(count_sql);
    const invoiceApp = new invoiceBalanceController();
    const token = "PipS5VxV42";
    const count_data = encodeURIComponent(count_sql);
    let responseData = {
        "total": 0,
        "data": [],
        'status': 'success'
    }
    invoiceApp.getTransferData(count_data, token, 0, 100).then(rst => {
        responseData.total = rst.data[0].count ? rst.data[0].count : 0;
        if(responseData.total === 0){
            res.status(200);
            res.json(responseData);
        }else{
            const data = encodeURIComponent(sql_query);
            console.log(sql_query);
            invoiceApp.getTransferData(data, token, offset, limit).then(rst => {
                //console.log(rst);
                responseData.data = rst.data;
                res.status(200);
                res.json(Object.assign({"reference_id": req.id}, responseData));
            }, err => {
                res.status(500);
                console.log("FROM ERROR: "+err);
            })
        }
    });
});

app.get('/invoiceLog', (req, res) => {
    const reqQuery = req.query;
    const id = reqQuery.id;
    const start = reqQuery.start_date || "";
    const end = reqQuery.end_date || "";
    const page = Math.max(reqQuery.page, 1);
    const limit = Math.max(reqQuery.limit, 10);
    const offset = (page - 1) * limit;
    let whereSql = "";
    if(start !== '' && end !== ''){
        whereSql = " AND date(tms_ar_log_created_date) BETWEEN '" + start + "' AND '" + end + "' "
    }else if(start !== '' && end === ''){
        whereSql = " AND date(tms_ar_log_created_date) >= '" + start + "' "
    }else if(start === '' && end !== ''){
        whereSql = " AND date(tms_ar_log_created_date) <= '" + end + "' "
    }else{
        whereSql = " AND date(tms_ar_log_created_date) = '" + new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate() + "' "
    }
    if(id > 0){
        whereSql += " AND tms_ar.tms_ar_id = " + id
    }
    let countSql = "select count(1) as total from tms_ar_log inner join tms_ar on tms_ar.tms_ar_id = tms_ar_log.fk_tms_ar_id inner join tms_order on tms_order.tms_order_id = tms_ar.fk_tms_order_id where 1=1 " + whereSql;
    let sql = "select tms_ar.tms_ar_id as ARID, concat(tms_order.tms_order_pro,'-',tms_ar.tms_ar_invoice_no) as InvoiceNumber, tms_order.tms_order_id as OrderID, tms_ar.tms_ar_invoice_date,tms_ar_log_text from tms_ar_log inner join tms_ar on tms_ar.tms_ar_id = tms_ar_log.fk_tms_ar_id inner join tms_order on tms_order.tms_order_id = tms_ar.fk_tms_order_id where 1 = 1" + whereSql + " order by tms_ar_log.tms_ar_log_id desc";
    console.log(countSql)
    console.log(sql)
    let responseData = {
        total: 0,
        data: []
    }
    countSql = encodeURIComponent(countSql);
    sql = encodeURIComponent(sql);
    const invoiceApp = new invoiceBalanceController();
    invoiceApp.getInvoiceLogList(countSql, 0, 100).then( rst => {
        responseData.total = rst[0].total
        invoiceApp.getInvoiceLogList(sql, offset, limit).then( rst => {
            responseData.data = rst
            res.status(200);
            res.json(responseData);
        })
    })
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});