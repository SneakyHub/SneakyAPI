class ClientUser{
    constructor(data, client){
        this.username = data.username
        this.email = data.email
        this.credits = data.credits
        this.verifiedEmail = data.verifiedEmail
        this.verifiedDiscord = data.verifiedDiscord
        this.client = client
    }
}

module.exports = ClientUser