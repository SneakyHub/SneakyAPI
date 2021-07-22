const { default: axios } = require('axios')
const FormData = require('form-data')

class Server {
    constructor(client){
        this.client = client
    }
    
    async delete(){
        let data = new FormData()
        data.append('_token', this.client._token)
        data.append('_method', 'DELETE')
        this.client.instance.post(`https://dash.sneakyhub.com/servers/${this.dashID}`, data, {headers:data.getHeaders()})
            .catch(error => console.log(error))
    }

    async fetch(){
        const response = await axios({
            method: 'get',
            baseURL: 'https://panel.sneakyhub.com/',
            url: `/api/client/servers/${this.identifier}`,
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": `Bearer ${this.client.panelAPI}`
            }
        })
        return Object.assign(this, response.data.attributes)
    }
}

module.exports = Server