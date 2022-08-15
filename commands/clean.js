const fs = require('fs');

let users = []
// const execute = async (message, args, client) => {
//     users = JSON.parse(fs.readFileSync("./watch.json"))
//     let remove = args.split(" ")[0]//?
//     let user = args.split(" ")[1]
//     if (!remove || users.includes(remove)) return message.channel.createMessage("Please mention a new user to remove from the watchlist")
//     if (!user) return message.channel.createMessage("Please mention a user to remove from the watchlist")
    
const execute = (message, args, client) => {
    message.delete()
    let opt = args.split(" ")[0]
    let id = opt?.length ? opt.replace(/[<@!>]/g, "") : null
    let regex = args.split(" ")
    regex.shift()

    if (opt === "bot" || opt === "bots") {
        message.channel.purge({
            limit: 100,
            filter: (m) => m.author.bot
        })

        return
    } if (opt === "regex") {
        message.channel.purge({
            limit: 100,
            filter: (m) => m.content.test(new RegExp(regex.join(" ")), "g")
        })

        return
    } else if (id) {
        message.channel.purge({
            limit: 100,
            filter: (m) => m.author.id === id
        })

        return
    }

    message.channel.purge({
        limit: 100
    })
}

module.exports = {
    name: "clean",
    description: "Clean messages",
    execute,
    admin: true,
    aliases: ["c"]
}