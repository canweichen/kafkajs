const giraTicketServer = require('../Services/GiraTicketService')

class JiraTicketController
{
    constructor(){}

    async add(request, response){
        try{
            const params = request.body
            const res = await giraTicketServer.addJiraTicket(params)
            if(res.status){
                response.status(200)
            }else{
                response.status(500)
            }
            response.json(res)
        }catch(e){
            response.status(500)
            response.json({status: false, message: e.message, data:[]})
        }
        
    }

    async list(request, response){
        const responseData = {
            status: false,
            message: '',
            total: 0,
            data: []
        }
        try{
            const params = request.query
            const {countData, data} = await giraTicketServer.getJiraTicket(params)
            responseData.total = countData[0].total
            responseData.data = data
            response.status(200)
            response.json(responseData)
        }catch(e){
            responseData.message = e.message
            response.status(500)
            response.json(responseData)
        }
    }

    async edit(request, response){

    }
    async delete(request, response){

    }

    async createTech(request, response){
        try{
            const params = request.body
            const res = await giraTicketServer.createTechknowledge(params)
            if(res.status){
                response.status(200)
            }else{
                response.status(500)
            }
            response.json(res)
        }catch(e){
            response.status(500)
            response.json({status: false, message: e.message, data:[]})
        }
    }

    async techList(request, response){
        const responseData = {
            status: false,
            message: '',
            total: 0,
            data: []
        }
        try{
            const params = request.query
            const {countData, data} = await giraTicketServer.techknowledgeList(params)
            responseData.total = countData[0].total
            responseData.data = data
            response.status(200)
            response.json(responseData)
        }catch(e){
            responseData.message = e.message
            response.status(500)
            response.json(responseData)
        }
    }
}

module.exports = new JiraTicketController()