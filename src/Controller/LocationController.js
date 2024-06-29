const locationService = require('../Services/LocationService')
const ExcelJS = require('exceljs');
class LocationController{
    constructor() {
    }

    async exportToExcel(request, response){
        try{
            const data = await locationService.exportToExcel();
            // response.status(200);
            // response.json(data);
            // return;
            const filename = `SummaryTerminal${Date.now()}.xlsx`;
                response.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
                // response.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

                const workbook = new ExcelJS.Workbook();
                const worksheet = workbook.addWorksheet('Summary');

                // Define header row using an array
                worksheet.addRow([
                    'Terminal Name',
                    'Terminal Code',
                    'Terminal City',
                    'Terminal State',
                    'Terminal Zip',
                    'Trip Date',
                    'Local Trips',
                    'Inbound Trips',
                    'Outbound Trips',
                    'Pickup Shipment Count',
                    'Delivery Shipment Count'
                ]);

                // Use `Object.values` and `forEach` to iterate over the invoices
                data.forEach((line) => {
                    worksheet.addRow([
                        line.TerminalName,
                        line.TerminalCode,
                        line.TerminalCity,
                        line.TerminalState,
                        line.TerminalZip,
                        line.TripDate,
                        line.LocalTrip,
                        line.InBoundTrip,
                        line.OutBoundTrip,
                        line.PickupCount,
                        line.DeliveryCount
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
        }catch(e){
            response.status(500);
            response.json(e.message);
        }
    }

    async getTripTerminalList(request, response){
        let result = {
            status: true,
            msg: "",
            total: 0,
            data: []
        }
        try{
            const data = await locationService.getDispatchList(request.query);
            result.data = data;
            response.status(200);
            response.json(result);
        }catch(e){
            result.status = false;
            result.msg = e.message;
            response.status(500);
            response.json(result);
        }
    }

    async syncLocationToLocal(request, response){
        let result = {
            status: true,
            msg: "success",
            lastId: 0,
            okNum: 10000,
            failNum: 0,
            processNum: 0
        }
        try{
            const data = await locationService.syncLocationToLocal();
            result.lastId = data;
            response.status(200);
            response.json(result);
        }catch(e){
            result.status = false;
            result.msg = e.message;
            response.status(500);
            response.json(result);
        }
    }

    async getLocationList(request, response){
        let result = {
            status: true,
            msg: "",
            total: 0,
            data: []
        }
        try{
            const [data, total] = await locationService.getLocationList(request.query);
            result.data = data;
            result.total = total;
            response.status(200);
            response.json(result);
        }catch(e){
            result.status = false;
            result.msg = e.message;
            response.status(500);
            response.json(result);
        }
    }

}

module.exports = new LocationController();