const axios = require('axios');

class CompareInvoiceBalanceController
{
  constructor(){

  }
  async compareInvoiceBalance(ar_id = 0, token = 'SaQ7l21ADz')
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
        "body": "inputDB=TMS&inputSql=SELECT%0Atms_ar.tms_ar_id%20AS%20ARID%2C%0Atms_order.tms_order_id%20as%20OrderID%2C%0ACONCAT(tms_order.tms_order_pro%2C'-'%2Ctms_ar.tms_ar_invoice_no)%20as%20InvoiceNum%2C%0Atms_ar.tms_ar_invoice_date%20as%20InvoiceDate%2C%0A(SELECT%20SUM(amount.tms_quote_lines_override_amount)%20FROM%20tms_quote_lines%20as%20amount%20WHERE%20amount.fk_tms_quote_id%20%3D%20tms_ar.fk_tms_quote_id%20and%20amount.tms_quote_lines_include%20%3D%201)%20AS%20TotalAmount%2C%0AIFNULL(tms_ar.tms_ar_balance%2C(SELECT%20sum(bal.tms_quote_lines_override_amount)%20FROM%20tms_quote_lines%20as%20bal%20WHERE%20bal.fk_tms_quote_id%20%3D%20tms_ar.fk_tms_quote_id%20AND%20bal.tms_quote_lines_include%20%3D%201%20)%20-%20IFNULL((%20SELECT%20sum(tms_payment_lines.tms_payment_lines_amount%20)%20FROM%20tms_payment_lines%20WHERE%20tms_payment_lines.fk_tms_ar_id%20%3D%20tms_ar.tms_ar_id%20AND%20tms_payment_lines.tms_payment_lines_status%20%3E%3D%200%20AND%20tms_payment_lines.tms_payment_lines_voided_id%20%3D%200%20)%2C0))%20AS%20InvoiceBalance%0AFROM%0Atms_ar%0AINNER%20JOIN%20tms_order%20ON%20tms_ar.fk_tms_order_id%20%3D%20tms_order.tms_order_id%0AWHERE%0Atms_ar.tms_ar_voided_id%20%3D%200%0AAND%20tms_ar.tms_ar_credit_memo%20%3D%200%0AAND%20tms_ar.tms_ar_invoice_date%20%3E%20'2020-01-01'%0AAND%20tms_ar.fk_company_id%20%3D%2023%0AAND%20tms_ar.tms_ar_locked_id%20%3E%200%0AAND%20tms_ar.tms_ar_id%20%3E%20"+ar_id+"%0AGROUP%20BY%20tms_ar.tms_ar_id%0AHAVING%20InvoiceBalance%20!%3D%200%3B&inputOffsetLimit=0&inputRowsLimit=5000&UserID=21486&UserToken="+token+"&pageName=dashboardTmsSqlTool",
        "method": "POST"
      });
      const data = await response.json();
      return data.data;
    }catch(e) {
      return [];
    }
  }

  async getInvoiceLogList(sql, offset = 0, limit = 50, token = "PipS5VxV42") {
    // const body = "inputDB=TMS&inputSql="+sql+"&inputOffsetLimit="+offset+"&inputRowsLimit="+limit+"&UserID=21486&UserToken="+token+"&pageName=dashboardTmsSqlTool"
    //   const response = await fetch("https://tms.freightapp.com/write_new/execute_sql.php", {
    //     "headers": {
    //       "accept": "application/json, text/javascript, */*; q=0.01",
    //       "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
    //       "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
    //       "sec-ch-ua": "\"Chromium\";v=\"124\", \"Microsoft Edge\";v=\"124\", \"Not-A.Brand\";v=\"99\"",
    //       "sec-ch-ua-mobile": "?0",
    //       "sec-ch-ua-platform": "\"Windows\"",
    //       "sec-fetch-dest": "empty",
    //       "sec-fetch-mode": "cors",
    //       "sec-fetch-site": "same-origin",
    //       "x-requested-with": "XMLHttpRequest",
    //       "cookie": "_ga=GA1.2.219273568.1690786012; _ga_B5TWG4D90H=GS1.2.1714294413.321.0.1714294413.0.0.0; PHPSESSID=doqq72q8kksh9i3ko5io97fn37; geoposition.lat=24.533557199999994; geoposition.long=118.10063619999998",
    //       "Referer": "https://tms.freightapp.com/dev.html",
    //       "Referrer-Policy": "strict-origin-when-cross-origin"
    //     },
    //     "body": body,
    //     "method": "POST"
    //   });
    //   const data = await response.json();
    //   return data.data;
  }

  // async getTransferData(data, token, offset, limit) {
  //   const response = await fetch("https://tms.freightapp.com/write_new/execute_sql.php", {
  //     "headers": {
  //       "accept": "application/json, text/javascript, */*; q=0.01",
  //       "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
  //       "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
  //       "sec-ch-ua": "\"Microsoft Edge\";v=\"123\", \"Not:A-Brand\";v=\"8\", \"Chromium\";v=\"123\"",
  //       "sec-ch-ua-mobile": "?0",
  //       "sec-ch-ua-platform": "\"Windows\"",
  //       "sec-fetch-dest": "empty",
  //       "sec-fetch-mode": "cors",
  //       "sec-fetch-site": "same-origin",
  //       "x-requested-with": "XMLHttpRequest",
  //       "cookie": "_ga=GA1.2.219273568.1690786012; PHPSESSID=vfij8ga4pspg4m6nqjpak8tge1; _ga_B5TWG4D90H=GS1.2.1713521573.311.1.1713522368.0.0.0; geoposition.lat=24.53364757142857; geoposition.long=118.10058421428567",
  //       "Referer": "https://tms.freightapp.com/dev.html",
  //       "Referrer-Policy": "strict-origin-when-cross-origin"
  //     },
  //     "body": "inputDB=TMS&inputSql="+data+"&inputOffsetLimit="+offset+"&inputRowsLimit="+limit+"&UserID=21486&UserToken="+token+"&pageName=dashboardTmsSqlTool",
  //     "method": "POST"
  //   });
  //   return await response.json();
  // }

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

  async getCompareInvoiceList(whereSql, token) {
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
      "body": "inputDB=TMS&inputSql=SELECT%0Atms_ar.tms_ar_id%20AS%20ARID%2C%0Atms_order.tms_order_id%20as%20OrderID%2C%0ACONCAT(tms_order.tms_order_pro%2C'-'%2Ctms_ar.tms_ar_invoice_no)%20as%20InvoiceNum%2C%0Atms_ar.tms_ar_invoice_date%20as%20InvoiceDate%2C%0A(SELECT%20SUM(amount.tms_quote_lines_override_amount)%20FROM%20tms_quote_lines%20as%20amount%20WHERE%20amount.fk_tms_quote_id%20%3D%20tms_ar.fk_tms_quote_id%20and%20amount.tms_quote_lines_include%20%3D%201)%20AS%20TotalAmount%2C%0AIFNULL(tms_ar.tms_ar_balance%2C(SELECT%20sum(bal.tms_quote_lines_override_amount)%20FROM%20tms_quote_lines%20as%20bal%20WHERE%20bal.fk_tms_quote_id%20%3D%20tms_ar.fk_tms_quote_id%20AND%20bal.tms_quote_lines_include%20%3D%201%20)%20-%20IFNULL((%20SELECT%20sum(tms_payment_lines.tms_payment_lines_amount%20)%20FROM%20tms_payment_lines%20WHERE%20tms_payment_lines.fk_tms_ar_id%20%3D%20tms_ar.tms_ar_id%20AND%20tms_payment_lines.tms_payment_lines_status%20%3E%3D%200%20AND%20tms_payment_lines.tms_payment_lines_voided_id%20%3D%200%20)%2C0))%20AS%20InvoiceBalance%0AFROM%0Atms_ar%0AINNER%20JOIN%20tms_order%20ON%20tms_ar.fk_tms_order_id%20%3D%20tms_order.tms_order_id%0AWHERE"+whereSql+"&inputOffsetLimit=0&inputRowsLimit=5000&UserID=21486&UserToken="+token+"&pageName=dashboardTmsSqlTool",
      "method": "POST"
    });
    return await response.json();
  }

  async getCompareInvoiceCount(selected, whereSql, token) {
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
      "body": "inputDB=TMS&inputSql=SELECT"+selected+"WHERE"+whereSql+"&inputOffsetLimit=0&inputRowsLimit=20&UserID=21486&UserToken="+token+"&pageName=dashboardTmsSqlTool",
      "method": "POST"
    });
    return response.json();
  }

  async getCompareInvoiceData(params, token = 'sS4cvtJ84N') {
    const page = Math.max(params.page, 1);
    const limit = Math.max(params.limit, 20);
    const offset = (page - 1) * limit;
    let sql = this.getInvoiceSql(params)
    const selected = encodeURIComponent(" count(1) as total ")
    const countWhereSql = encodeURIComponent(sql)
    const orderBy = params.getOrderSql(offset, limit);
    const queryListSql = encodeURIComponent(sql+orderBy);
    const total = await this.getCompareInvoiceCount(selected, countWhereSql, token);
    const invoices = await this.getCompareInvoiceList(queryListSql, token);
    return [total, invoices];
  }

  getInvoiceSql(requestData) {
    let sql = ''
    const selectedColumns = ""
    let base_sql = ' tms_ar.fk_company_id = 23 and tms_ar.tms_ar_locked_id > 0 and tms_ar.tms_ar_voided_id = 0 and tms_ar.tms_ar_credit_memo = 0 '

    if (requestData['ar_id'] !== '') {
      sql += ` and tms_ar.tms_ar_id = '${requestData["ar_id"]}'`
    }
    if (requestData['order_id'] !== '') {
      sql += ` and tms_ar.fk_tms_order_id = '${requestData["order_id"]}'`
    }
    if (requestData["start_date"] !== '' && requestData["end_date"] !== '') {
      const start_datetime = requestData["start_date"]
      const end_datetime = requestData["end_date"]
      sql += ` and tms_ar.tms_ar_invoice_date BETWEEN '${start_datetime}' AND '${end_datetime}'`
    } else if (requestData["start_date"] !== '' && requestData["end_date"] === '') {
      const start_datetime = requestData["start_date"]
      sql += ` and tms_ar.tms_ar_invoice_date >= '${start_datetime}'`
    } else if (requestData["start_date"] === '' && requestData["end_date"] !== '') {
      const end_datetime = requestData["end_date"]
      sql += ` and tms_ar.tms_ar_invoice_date <= '${end_datetime}'`
    }
    if (sql === '') {
      const date = new Date()
      const year = date.getFullYear()
      const month = date.getMonth() + 1
      const day = date.getDate()
      const currentDate = `${year}-${month}-${day}`
      sql = ` and tms_ar.tms_ar_invoice_date = '${currentDate}'`
    }
    base_sql += sql
    return base_sql;
  }

  getOrderSql(offset, limit) {
    return ` order by tms_ar.tms_ar_id desc limit ${offset}, ${limit};`;
  }

  async getQuoteLogList(sql, offset = 0, limit = 50, token = "8BY4DmCyeY") {
    const body = "inputDB=TMS&inputSql="+sql+"&inputOffsetLimit="+offset+"&inputRowsLimit="+limit+"&UserID=21486&UserToken="+token+"&pageName=dashboardTmsSqlTool"
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

}

module.exports = CompareInvoiceBalanceController;