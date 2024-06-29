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

    async exportToExcel(){
        let basewData = await crud.getTable("select * from trip_base_data order by TripID asc;")
        let basewDataGroup = {};
        //根据tripID分组
        for(let i = 0; i < basewData.length; i++){
            const key = basewData[i].TripID;
            if(!basewDataGroup.hasOwnProperty(key)){
                basewDataGroup[key] = [];
            }
            //新的数据就不要处理这个了
            // if(basewData[i].Type == "Pickup"){
            //     basewData[i].Type = "Delivery";
            // }else if(basewData[i].Type == "Delivery"){
            //     basewData[i].Type = "Pickup";
            // }
            basewDataGroup[key].push(basewData[i]);
        }
        basewData = null
        let exportBaseData = [];
        for (const key in basewDataGroup) {
            let lines = basewDataGroup[key];
            const result = this.calcPerTrip(lines)
            exportBaseData.push(...result)
        }
        let exportDataValue = {}
        for(let i = 0; i < exportBaseData.length; i++){
            const line = exportBaseData[i];
            const key = line['TerminalCode']+":"+line['TripDate'];
            if(!exportDataValue.hasOwnProperty(key)){
                exportDataValue[key] = line;
            }else{
                exportDataValue[key]['LocalTrip'] += line['LocalTrip'];
                exportDataValue[key]['InBoundTrip'] += line['InBoundTrip'];
                exportDataValue[key]['OutBoundTrip'] += line['OutBoundTrip'];
                exportDataValue[key]['PickupCount'] += line['PickupCount'];
                exportDataValue[key]['DeliveryCount'] += line['DeliveryCount'];
            }
        }
        exportBaseData = null
        const result = Object.values(exportDataValue);
        // for(let i = 0; i < result.length; i++){
        //     crud.batchAdd('summary',result[i], (res) => {});
        // }
        return result
    }

    calcPerTrip(params){
        let basewDataGroup = [];
        let inbound = {}
        let outbound = {}
        let pickup = 0
        let delivery = 0
        let base = {}
        for(let i = 0; i < params.length; i++){
            let line = params[i];
            const key = line['OrderID'];
            const inKey = line['OrigTerminalCode'];
            const outKey = line['DestTerminalCode'];
            if(line['Type'] == "LH"){
                //同个trip，不同LH，origin或者dest的terminal相同算一次
                if(line['OrigTerminalType'] == 'Revenue'){
                    if(!outbound.hasOwnProperty(outKey)){
                        outbound[outKey] = 0;
                        basewDataGroup.push({
                            TerminalName: line['OrigTerminalName'],
                            TerminalCode: line['OrigTerminalCode'],
                            TerminalCity: line['OrigTerminalCity'],
                            TerminalState: line['OrigTerminalState'],
                            TerminalZip: line['OrigTerminalZip'],
                            TripDate: line['TripDate'],
                            LocalTrip: 0,
                            InBoundTrip: 0,
                            OutBoundTrip: 1,
                            PickupCount: 0,
                            DeliveryCount: 0,
                        })
                    }
                }
                if(line['DestTerminalType'] == 'Revenue'){
                    if(!inbound.hasOwnProperty(inKey)){
                        inbound[outKey] = 0;
                        basewDataGroup.push({
                            TerminalName: line['DestTerminalName'],
                            TerminalCode: line['DestTerminalCode'],
                            TerminalCity: line['DestTerminalCity'],
                            TerminalState: line['DestTerminalState'],
                            TerminalZip: line['DestTerminalZip'],
                            TripDate: line['TripDate'],
                            LocalTrip: 0,
                            InBoundTrip: 1,
                            OutBoundTrip: 0,
                            PickupCount: 0,
                            DeliveryCount: 0,
                        })
                    }
                }
                continue
            }
            const is_local = line['OrigTerminalCode'] == line['DestTerminalCode'] ? 1 : 0;
            if(line['Type'] == "Pickup"){
                if(line['OrigTerminalType'] == 'Revenue'){
                    pickup = pickup + 1
                    base = {
                        TerminalName: line['OrigTerminalName'],
                        TerminalCode: line['OrigTerminalCode'],
                        TerminalCity: line['OrigTerminalCity'],
                        TerminalState: line['OrigTerminalState'],
                        TerminalZip: line['OrigTerminalZip'],
                        TripDate: line['TripDate'],
                        LocalTrip: is_local,
                        InBoundTrip: 0,
                        OutBoundTrip: 0,
                        PickupCount: pickup,
                        DeliveryCount: delivery,
                    }
                }
            }
            if(line['Type'] == "Delivery"){
                if(line['OrigTerminalType'] == 'Revenue'){
                    delivery = delivery + 1
                    base = {
                        TerminalName: line['OrigTerminalName'],
                        TerminalCode: line['OrigTerminalCode'],
                        TerminalCity: line['OrigTerminalCity'],
                        TerminalState: line['OrigTerminalState'],
                        TerminalZip: line['OrigTerminalZip'],
                        TripDate: line['TripDate'],
                        LocalTrip: is_local,
                        InBoundTrip: 0,
                        OutBoundTrip: 0,
                        PickupCount: pickup,
                        DeliveryCount: delivery,
                    }
                }
            }
        }
        if(pickup > 0 || delivery > 0){
            basewDataGroup.push(base)
        }
        return basewDataGroup
    }

    calacSameDay(params){
        let sameDay = {};
        for(let i = 0; i < params.length; i++){
            let line = params[i];
            const orderKey = line['OrderID'];
            if($line['Type'] == "LH"){
                continue
            }
            if(!sameDay.hasOwnProperty(orderKey)){
                sameDay[orderKey] = 0;
            }
            if($line['Type'] != "LH"){
                sameDay[orderKey]++;
            }
        }
        return sameDay
    }

    async getDispatchList(params){
        const start_date = params.start_date || ""
        const end_date = params.end_date || ""
        const trip_id = params.trip_id || 0
        const batch_id = params.batch_id || 0
        const page = params.page || 1
        const limit = params.limit || 10
        const offset = (page - 1) * limit
        let filter = ""
        if(start_date != "" && end_date != ""){
            filter += " tms_dispatch.tms_dispatch_start_date between '" + start_date + " 00:00:00' and '" + end_date + " 23:59:59' "
        }else if(start_date != "" && end_date == ""){
            filter += " tms_dispatch.tms_dispatch_start_date >= '" + start_date + " 00:00:00' "
        }else if(start_date == "" && end_date != ""){
            filter += " tms_dispatch.tms_dispatch_start_date between '2024-01-01 00:00:00' and '" + end_date + " 23:59:59' "
        }else{
            filter += " tms_dispatch.tms_dispatch_start_date >= '2024-01-01 00:00:00' "
        }
        if(trip_id > 0){
            filter += " and tms_dispatch.tms_dispatch_id = " + trip_id
        }
        let sql = ' SELECT t.* FROM'
            sql += ' (SELECT'
            sql += ' task_group.task_group_id as TaskGroupID,'
            sql += ' tms_dispatch.tms_dispatch_id as TripID,'
            sql += ' task_group.fk_tms_order_id as OrderID,'
            sql += ' IF(task_group.task_group_stage = 2, "Delivery", "Pickup") AS Type,'
            sql += ' IFNULL(orig.location_name, "") as OrigTerminalName,'
            sql += ' IFNULL(orig.location_code, "") as OrigTerminalCode,'
            sql += ' IFNULL(orig.location_Street, "") as OrigTerminalStreet,'
            sql += ' IFNULL(orig.location_city, "") as OrigTerminalCity,'
            sql += ' IFNULL(orig.location_state, "") as OrigTerminalState,'
            sql += ' IFNULL(orig.location_zip, "") as OrigTerminalZip,'
            sql += ' IFNULL(orig.location_terminal_type, "") as OrigTerminalType,'
            sql += ' IFNULL(dest.location_name, "") as DestTerminalName,'
            sql += ' IFNULL(dest.location_code, "") as DestTerminalCode,'
            sql += ' IFNULL(dest.location_Street, "") as DestTerminalStreet,'
            sql += ' IFNULL(dest.location_city, "") as DestTerminalCity,'
            sql += ' IFNULL(dest.location_state, "") as DestTerminalState,'
            sql += ' IFNULL(dest.location_zip, "") as DestTerminalZip,'
            sql += ' IFNULL(dest.location_terminal_type, "") as DestTerminalType,'
            sql += ' DATE(tms_dispatch.tms_dispatch_start_date) AS TripDate'
            sql += ' FROM'
            sql += ' tms_dispatch'
            sql += ' INNER JOIN task_group ON tms_dispatch.tms_dispatch_id = task_group.fk_tms_dispatch_id'
            sql += ' LEFT JOIN location as orig ON tms_dispatch.fk_location_id_warehouse = orig.location_id'
            sql += ' LEFT JOIN location as dest ON tms_dispatch.fk_location_id_warehouse2 = dest.location_id'
            sql += ' WHERE'
            sql += filter
            sql += ' AND tms_dispatch.tms_dispatch_status > -1 '
            sql += ' AND tms_dispatch.fk_company_id = 23'
            sql += ' AND task_group.task_group_void = 0'
            sql += ' AND task_group.task_group_stage IN (0, 2)'
            sql += ' UNION ALL'
            sql += ' SELECT'
            sql += ' task_group.task_group_id as TaskGroupID,'
            sql += ' tms_dispatch.tms_dispatch_id as TripID,'
            sql += ' task_group.fk_tms_order_id as OrderID,'
            sql += ' "LH" AS Type,'
            sql += ' IFNULL(orig.location_name, "") as OrigTerminalName,'
            sql += ' IFNULL(orig.location_code, "") as OrigTerminalCode,'
            sql += ' IFNULL(orig.location_Street, "") as OrigTerminalStreet,'
            sql += ' IFNULL(orig.location_city, "") as OrigTerminalCity,'
            sql += ' IFNULL(orig.location_state, "") as OrigTerminalState,'
            sql += ' IFNULL(orig.location_zip, "") as OrigTerminalZip,'
            sql += ' IFNULL(orig.location_terminal_type, "") as OrigTerminalType,'
            sql += ' IFNULL(dest.location_name, "") as DestTerminalName,'
            sql += ' IFNULL(dest.location_code, "") as DestTerminalCode,'
            sql += ' IFNULL(dest.location_Street, "") as DestTerminalStreet,'
            sql += ' IFNULL(dest.location_city, "") as DestTerminalCity,'
            sql += ' IFNULL(dest.location_state, "") as DestTerminalState,'
            sql += ' IFNULL(dest.location_zip, "") as DestTerminalZip,'
            sql += ' IFNULL(dest.location_terminal_type, "") as DestTerminalType,'
            sql += ' DATE(tms_dispatch.tms_dispatch_start_date) AS TripDate'
            sql += ' FROM'
            sql += ' tms_dispatch'
            sql += ' INNER JOIN task_group ON tms_dispatch.tms_dispatch_id = task_group.fk_tms_dispatch_id'
            sql += ' INNER JOIN tms_lh ON tms_lh.tms_lh_id = task_group.fk_tms_lh_id'
            sql += ' LEFT JOIN location as orig ON tms_lh.fk_warehouse1_id = orig.location_id'
            sql += ' LEFT JOIN location as dest ON tms_lh.fk_warehouse2_id = dest.location_id'
            sql += ' WHERE'
            sql +=  filter
            sql += ' AND tms_dispatch.tms_dispatch_status > -1 '
            sql += ' AND tms_dispatch.fk_company_id = 23'
            sql += ' AND task_group.task_group_void = 0 '
            sql += ' AND task_group.task_group_stage = 1) AS t order by t.TripID';
        console.log(sql);
        const data = await HttpRequest.get(encodeURIComponent(sql), offset, limit);

        return data
        
    }
}

module.exports = new LocationService()