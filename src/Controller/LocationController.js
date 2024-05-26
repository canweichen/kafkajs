const locationService = require('../Services/LocationService')
class LocationController{
    constructor() {
    }

    async syncLocationToLocal(request, response){
        let result = {
            code: 0,
            msg: "success",
            lastId: 0
        }
        const data = await locationService.syncLocationToLocal();
        result.lastId = data;
        response.status(200);
        response.json(result);
    }

    async getLocationList(request, response){
        let result = {
            code: 0,
            msg: "success",
            total: 0,
            data: []
        }
        const [data, total] = await locationService.getLocationList(request.query);
        console.log(total);
        result.data = data;
        result.total = total;
        response.status(200);
        response.json(result);
    }

}

module.exports = new LocationController();