const axios = require('axios');
const driverService = require('../Services/DriverService');
const crud = require('../Dao/crud');
const ExcelJS = require("exceljs");

class DriverController {
    constructor() {}

    async getDriverList(request, response) {
        let responseData = {
            message: '',
            data: []
        }
        try {
            const reqQuery = request.query;
            const id = reqQuery.id;
            const data = await driverService.getDriverList(id)
            responseData.data = data.data.Result;
            response.status(200);
            response.json(responseData);
        } catch (e) {
            responseData.message = e.message;
            response.status(500);
            response.json(responseData);
        }
    }

    async getAccList(request, response) {
        let responseData = {
            status: true,
            message: '',
            data: []
        }
        const reqQuery = request.query;
        const download = reqQuery.download || 0;
        try {
            responseData.data = await driverService.getAccList();
            if (download) {
                const filename = `AccList${Date.now()}.xlsx`;
                response.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
                const workbook = new ExcelJS.Workbook();
                const worksheet = workbook.addWorksheet('acc');
                worksheet.addRow([
                    "Code",
                    "Description",
                    "IsActive",
                    "IsBillingItem",
                    "IsPayItem",
                    "IsHotkey",
                    "IsCustomer",
                    "tms_acc_name_id",
                    "tms_acc_name_code",
                    "tms_acc_name_name",
                    "tms_acc_name_active",
                    "tms_acc_name_billing",
                    "tms_acc_name_hotkey",
                    "tms_acc_name_customer"
                ]);
                for (const i in responseData.data) {
                    const item = responseData.data[i];
                    worksheet.addRow([
                        item.Code,
                        item.Description,
                        item.IsActive,
                        item.IsBillingItem,
                        item.IsPayItem,
                        item.IsHotkey,
                        item.IsCustomer,
                        item.tms_acc_name_id,
                        item.tms_acc_name_code,
                        item.tms_acc_name_name,
                        item.tms_acc_name_active,
                        item.tms_acc_name_billing,
                        item.tms_acc_name_hotkey,
                        item.tms_acc_name_customer
                    ]);
                }
                console.log('Excel file has been generated.');
                const buffer = await workbook.xlsx.writeBuffer();
                // Send the buffer as the response
                response.status(200);
                response.send(buffer);
            }else{
                response.status(200);
                response.json(responseData);
            }
        } catch (e) {
            responseData.message = e.message;
            responseData.status = false;
            response.status(500);
            response.json(responseData);
        }
    }

    async getUserRequestList(request, response) {
        let responseData = {
            message: '',
            data: [],
            total: 0
        }
        try {
            const reqQuery = request.query;
            const {countData, data} = await driverService.getUserRequestList(reqQuery);
            responseData.total = countData[0].total;
            responseData.data = data;
            response.status(200);
            response.json(responseData);
        } catch (e) {
            responseData.message = e.message;
            response.status(500);
            response.json(responseData);
        }
    }

    async getTmsUserRpcLog(request, response) {
        let responseData = {
            message: '',
            total: 0,
            data: []
        }
        try {
            const reqQuery = request.query;
            const {countData, data} = await driverService.getTmsUserRpcLog(reqQuery);
            responseData.total = countData[0].total;
            responseData.data = data;
            response.status(200);
            response.json(responseData);
        } catch (e) {
            responseData.message = e.message;
            response.status(500);
            response.json(responseData);
        }
    }

    async recreateInvoice(request, response) {
        let result = {
            status: true,
            okNum: 0,
            failNum: 0,
            message: ''
        };
        try{
            const data = await crud.getTable("select * from unpaid_invoice_5147 where status = 0 limit 15");
            for (const i in data) {
                //Invoice: 2876686-1 Error: POD Missing
                //Invoice: 103000000970-1 Success!
                const arId = data[i].ar_id;
                const id = data[i].id;
                const responseData = await driverService.recreateInvoice(arId)
                const rst = responseData.data;
                const message = rst[arId];
                let url = '';
                let sql_data = '';
                let status = 0;
                if(message.includes('Success')){
                    url = rst.url[0];
                    sql_data = rst.sql[0];
                    status = 1;
                    result.okNum++;
                }else{
                    status = -1;
                    result.failNum++;
                }
                await crud.updateTableLines("update unpaid_invoice_5147 set status = ?, message = ?, url = ?, sql_data = ? where id = ?", [status, message, url, sql_data, id]);
            }
            response.status(200);
            response.json(result);
        }catch (e) {
            result.status = false;
            result.message = e.message;
            response.status(500);
            response.json(result);
        }
    }

    async getRecreateInvoiceList(request, response) {
        let responseData = {
            status: true,
            message: '',
            data: [],
            total: 0
        }
        try {
            const reqQuery = request.query;
            const page = reqQuery.page;
            const limit = reqQuery.limit;
            const offset = (page - 1) * limit;
            const countData = await crud.getTableValue("select count(1) as total from unpaid_invoice_5147;");
            const data = await crud.getTable("select * from unpaid_invoice_5147 limit "+offset+","+ limit+";");
            responseData.total = countData[0].total;
            responseData.data = data;
            response.status(200);
            response.json(responseData);
        } catch (e) {
            responseData.status = false;
            responseData.message = e.message;
            response.status(500);
            response.json(responseData);
        }
    }

    async getSummaryList(request, response) {
        let responseData = {
            message: '',
            data: {
                total: 0,
                success: 0,
                fail: 0,
                process: 0
            }
        }
        try {
            const total = await crud.getTable("select count(1) as total from unpaid_invoice_5147 ");
            responseData.data.total = total[0].total;
            const success = await crud.getTable("select count(1) as success from unpaid_invoice_5147 where status = 1");
            responseData.data.success = success[0].success;
            const fail = await crud.getTable("select count(1) as fail from unpaid_invoice_5147 where status = -1");
            responseData.data.fail = fail[0].fail;
            const process = await crud.getTable("select count(1) as process from unpaid_invoice_5147 where status = 0");
            responseData.data.process = process[0].process;
            response.status(200);
            response.json(responseData);
        } catch (e) {
            responseData.message = e.message;
            response.status(500);
            response.json(responseData);
        }
    }
}

module.exports = new DriverController();