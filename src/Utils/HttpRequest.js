
class HttpRequest
{
    constructor() {}

    async get(sql, offset = 0, limit = 50) {
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

    async login(username, password) {
        let passwordRes = btoa(password);
        const response = await fetch("https://tms.freightapp.com/write/check_login.php", {
            "headers": {
                "accept": "application/json, text/javascript, */*; q=0.01",
                "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
                "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                "sec-ch-ua": "\"Microsoft Edge\";v=\"125\", \"Chromium\";v=\"125\", \"Not.A/Brand\";v=\"24\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "x-requested-with": "XMLHttpRequest",
                "cookie": "_ga=GA1.2.219273568.1690786012; tms_dispatch.show_dispatched=0; tms_dispatch.show_map=0; _gid=GA1.2.2116278761.1716288929; PHPSESSID=ajkfm4lcv4n4q4eic5et9bqqj4; _ga_B5TWG4D90H=GS1.2.1716544417.353.0.1716544417.0.0.0; geoposition.lat=24.5118; geoposition.long=118.098",
                "Referer": "https://tms.freightapp.com/index.html",
                "Referrer-Policy": "strict-origin-when-cross-origin"
            },
            "body": "username="+username+"&password="+passwordRes+"&UserID=null&UserToken=null&pageName=/index.html",
            "method": "POST"
        });
        return await response.json();
    }
}

module.exports = new HttpRequest();