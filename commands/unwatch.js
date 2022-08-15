const fs = require('fs');

let users = []
// const execute = async (message, args, client) => {
//     users = JSON.parse(fs.readFileSync("./watch.json"))
//     let remove = args.split(" ")[0]//?
//     let user = args.split(" ")[1]
//     if (!remove || users.includes(remove)) return message.channel.createMessage("Please mention a new user to remove from the watchlist")
//     if (!user) return message.channel.createMessage("Please mention a user to remove from the watchlist")
    
const execute = (message, args, client) => {
    users = JSON.parse(fs.readFileSync("./watch.json"))
    let username = args.split(" ")[0]
    let u = users.find(x => x.display.toLowerCase() === username.toLowerCase())
    if (!u) return client.createMessage(message.channel.id, "User not found")
    users.splice(users.indexOf(u), 1)
    fs.writeFileSync("watch.json", JSON.stringify(users, null, 2))

    const dataData = JSON.parse(fs.readFileSync("data.json"))
    delete dataData[u.uuid]
    fs.writeFileSync("data.json", JSON.stringify(dataData, null, 2))

    client.log(`\`${new Date().toLocaleString()}\` ${message.author.username} removed ${u.display} from the watch list`)
    client.createMessage(message.channel.id, {
        embeds: [{
            author: {
                name: `No longer watching ${u.display}`,
            }
        }]
    })
}

module.exports = {
    name: "unwatch",
    description: "Remove a user from the watchlist",
    execute,
    admin: true,
    aliases: ["rm", "removewl"]
}