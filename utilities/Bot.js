const eris = require("eris")

class Bot extends eris {
    constructor(token, config) {
        super(require("../cogs.js").token, config)

        this.messageQueue = []
        this.config = require("../cogs.js")
        this.commands = []
        this.logQueue = []

        this.token = this.config.token
    }

    log = (message) => {
        this.logQueue.push(message)
    }

    startQueue = () => {
        setInterval(() => {
            let msg = this.messageQueue.shift()
            if (!msg) return
            this.createMessage(this.config.channel, msg)
        }, 500)

        setInterval(() => {
            let msg = this.logQueue.join("\n")
            this.logQueue = []
            if (!msg) return
            this.createMessage(this.config.logChannel, msg.substring(0, 2000))
        }, 500)
    }
}

module.exports = Bot