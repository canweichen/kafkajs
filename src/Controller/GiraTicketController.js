const giraTicketServer = require('../Services/GiraTicketService')

class JiraTicketController
{
    constructor(){}

    async add(request, response){
        try{
            const params = request.body
            const res = await giraTicketServer.addJiraTicket(params)
            if(res.status){
                response.status(500)
            }else{
                response.status(200)
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
}

module.exports = new JiraTicketController()