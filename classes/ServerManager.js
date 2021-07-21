const Server = require("./Server")
const FormData = require('form-data')
const { JSDOM } = require("jsdom")
const { default: axios } = require("axios")

class ServerManager {
    constructor(client){
        this.client = client
    }

    async loadCache(){
        this.cache = await this.fetch()
    }

    async create(data){
        if(!this.client.sneakyhub_session || !this.client._token) 
            throw new Error('The client is not ready yet. Consider using await/.then() with login')

        if(!data.name || !data.node_id || !data.egg_id || !data.product_id) 
            throw new Error('Incomplete arguements. Refer to docs')
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
        return Array.from((await this.fetch()).keys()).find(server => server.name === data.name)
    }

    async fetch(identifier){
        if(identifier){
            if(!this.cache.has(identifier))
                throw new Error(`No server with identifier ${identifier} exists`)
        
            return await this.cache.get(identifier).fetch()
        }

        if(!this.client.sneakyhub_session || !this.client._token) 
            throw new Error('The client is not ready yet. Consider using await/.then() with login')

        const servers = new Map()
        const response = await this.client.instance.request({
            method: 'get',
            url: '/servers',
        })
        const parsed = new JSDOM(response.data)
        for(const each of parsed.window.document.querySelectorAll('.card')){
            let server = new Server(this.client)
            server.identifier = each.querySelector('a.dropdown-item.text-info').getAttribute('href').split('/').pop()
            server.dashID = each.querySelector('form').getAttribute('action').split('/').pop()
            await server.fetch()
            servers.set(server.identifier, server)
        }
        return servers
    }
}

module.exports = ServerManager