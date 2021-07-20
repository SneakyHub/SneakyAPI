const Server = require("./Server")
const FormData = require('form-data')
const { JSDOM } = require("jsdom")

class ServerManager {
    constructor(client){
        this.client = client
    }

    async create(data){
        if(!this.client.sneakyhub_session) return
        if(!data.name || !data.node_id || !data.egg_id || !data.product_id) 
            throw new Error('Incomplete data provided!')
        data.name = data.name.trim()
        let form = new FormData()
        form.append('_token', this.client._token)
        form.append('name', data.name)
        form.append('description', (data.description || 'No description'))
        form.append('node_id', data.node_id)
        form.append('egg_id', data.egg_id)
        form.append('product_id', data.product_id)
        await this.client.instance.post(`https://dash.sneakyhub.com/servers/`, form, {headers:form.getHeaders()})
            .catch(error => console.log(error))
        return (await this.fetch()).find(server => server.name === data.name)
    }

    async fetch(){
        if(!this.client.sneakyhub_session) return

        const servers = []
        const response = await this.client.instance.request({
            method: 'get',
            url: '/servers',
        })
        const parsed = new JSDOM(response.data)
        parsed.window.document.querySelectorAll('.card').forEach(each => {
            let server = new Server(this.client)
            server.name = each.querySelector('.card-title').lastChild.textContent.trim()
            server.panelID = each.querySelector('a.dropdown-item.text-info').getAttribute('href').split('/').pop()
            server.dashID = each.querySelector('form').getAttribute('action').split('/').pop()
            servers.push(server)
        })
        return servers
    }
}

module.exports = ServerManager