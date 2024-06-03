const crud = require('../Dao/crud');
const HttpRequest = require('../Utils/HttpRequest');
class LocationService{
    constructor() {
    }

    async getLocationList(params){
        const totalResult = await crud.getTable("select COUNT(1) AS total from location where location_status > -1");
        console.log(totalResult[0].total);
        const total = totalResult[0].total;
        const page = params.page || 1;
        const limit = params.limit || 10;
        const offset = (page - 1) * limit;
        const result = await crud.getTable("select * from log_location where location_status > -1 order by location_id desc limit "+offset+","+limit+";");
        return [result, total];
    }

    async syncLocationToLocal(){
        const result = await crud.getTable("select max(location_id) as mid from log_location");
        let lastId = 0;
        if(result[0].mid !== null){
            lastId = result[0].mid
        }
        const sql = "select location_id, IFNULL(location_name,'') as location_name, IFNULL(location_code,'') as location_code, location_status,location_billto, IFNULL(fk_company_id,0) as company_id, location_shipper, IFNULL(location_carrier_type,0) as location_carrier_type, location_lh_carrier,location_beyond_carrier,location_advanced_carrier,location_warehouse,IFNULL(location_terminal_type,'') as location_terminal_type from location where fk_company_id != 26 and location_status > -1 and location_id > "+lastId+";";
        console.log(sql);
        const data = await HttpRequest.get(encodeURIComponent(sql), 0, 10000);
        if(data.length > 0){
            for(let i = 0; i < data.length; i++){
                crud.batchCreate(data[i], (result) => {});
            }
        }
        return lastId;
    }
}

module.exports = new LocationService()