const locationService = require('../Services/LocationService')
class LocationController{
    constructor() {
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