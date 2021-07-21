const { default: axios } = require('axios')
const { JSDOM } = require('jsdom')
const ClientUser = require('./classes/ClientUser')
const ServerManager = require('./classes/ServerManager')

class SneakyAPI {
    constructor(){
        this.servers = new ServerManager(this)
    }

    async login(sneakyhub_session, panelAPI) {
        this.sneakyhub_session = sneakyhub_session
        this.panelAPI = panelAPI

        this.instance = axios.create({
            baseURL: 'https://dash.sneakyhub.com/',
            headers: {
                'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:92.0) Gecko/20100101 Firefox/92.0',
                'Alt-Used': 'dash.sneakyhub.com',
                'Upgrade-Insecure-Requests': '1',
                'Sec-Fetch-Dest': 'document',
                'Sec-Fetch-Mode': 'navigate',
                'Sec-Fetch-Site': 'same-origin',
                'Sec-Fetch-User': '?1',
                'Cache-Control': 'max-age=0',
                'Cookie': `XSRF-TOKEN=${this.sneakyhub_session}; sneakyhub_session=${this.sneakyhub_session}`
            },
            withCredentials: true
        })

        // Get user-info and csrf-token from dash.sneakyhub.com
        const profile = await this.instance.request({
            method: 'get',
            url: '/profile',
        }).catch(error => console.log(error))
        const profileParsed = new JSDOM(profile.data)
        this._token = profileParsed.window.document.querySelector('meta[name="csrf-token"]').getAttribute('content')
        const data = {
            username: profileParsed.window.document.querySelector('input[name="name"]').value,
            email: profileParsed.window.document.querySelector('input[name="email"]').value,
            credits: parseFloat(profileParsed.window.document.querySelector('.badge.badge-primary').lastChild.textContent.trim()),
            verifiedEmail: profileParsed.window.document.querySelector('i[data-content="Verified"]') != null,
            verifiedDiscord: profileParsed.window.document.querySelector('.verified-discord div.callout.callout-info p').textContent.trim() === 'You are verified!'
        }
        this.user = new ClientUser(data, this)  
        
        //Populate ServerManager cache
        this.servers.loadCache()
    }
}

module.exports = SneakyAPI