const crud = require('../Dao/crud')

class JiraTicketService
{
    constructor(){}

    formatJiraTicketData(params){
        return {
            name: params.name,
            ticket: params.ticket,
            type: params.type,
            priority: params.priority,
            status: params.status | 0,
            epic: params.epic,
            dev_sp: params.dev_sp | 0,
            dev_user: params.dev_user,
            dev_hour: params.dev_hour | 0,
            ext_sp: params.ext_sp | 0,
            qa_sp: params.qa_sp | 0,
            qa_user: params.qa_user,
            qa_hour: params.qa_hour | 0,
            reporter: params.reporter,
            spring_version: params.spring_version
        }
    }

    async addJiraTicket(params){
        if(params.ticket === ''){
            return {status: false, message: "Please required ticket field.", data: []}
        }
        const data = this.formatJiraTicketData(params)
        crud.batchAdd('log_gira_ticket', data, () => {})
        return {status: true, message: "Add Successfully.", data: []}
    }

    async getJiraTicket(params){
        const page = params.page | 1
        const limit = params.limit | 20
        const offset = (page - 1)*limit
        let whereSql = " where 1 = 1"
        if(params.type !== ''){
            whereSql += ' AND type = "' + params.type + '"'
        }
        console.log(params)
        if(params.status !== ''){
            whereSql += ' AND status = ' + params.status
        }
        if(params.version !== ''){
            whereSql += ' AND spring_version = "' + params.version + '"'
        }
        if(params.start !== '' && params.end != ''){
            whereSql += " AND date(created_at) between '" + params.start + "' and '" + params.end + "'"
        }else if(params.start !== '' && params.end === ''){
            whereSql += " AND date(created_at) >= '" + params.start + "'"
        }else if(params.start === '' && params.end !== ''){
            whereSql += " AND date(created_at) 《= '" + params.end + "'"
        }
        const countSql = "select count(1) as total from log_gira_ticket " + whereSql
        const sql = "select * from log_gira_ticket " + whereSql + " limit " + offset + ',' + limit
        console.log(countSql)
        console.log(sql)
        const countData = await crud.getTable(countSql)
        const data = await crud.getTable(sql)
        return {countData, data}
    }

    async editJiraTicket(id, params){

    }

    async deleteJiraTicket(id){

    }
}

module.exports = new JiraTicketService()