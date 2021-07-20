const FormData = require('form-data')
class Server {
    constructor(client){
        this.client = client
        this.dashID = this.panelID = this.name = ''
    }
    async delete(){
        let data = new FormData()
        data.append('_token', this.client._token)
        data.append('_method', 'DELETE')
        this.client.instance.post(`https://dash.sneakyhub.com/servers/${this.dashID}`, data, {headers:data.getHeaders()})
            .catch(error => console.log(error))
    }
}

module.exports = Server