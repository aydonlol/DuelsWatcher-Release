const fs = require("fs")
const uuid_to_name = require("../utilities/name_uuid.js")
const resolve = require("../utilities/resolveHead")

let users = []

const execute = async (message, args, client) => {
    users = JSON.parse(fs.readFileSync("./watch.json"))
    let username = args.split(" ")[0]
    if (!username) return client.createMessage(message.channel.id, "Add a username")
    if (users.includes(username)) return client.createMessage(message.channel.id, "User is already being watched")
    
    let majong_data = await uuid_to_name(username)
    let head = await resolve({
        display: majong_data.name,
        uuid: majong_data.id
    })

    let newUser = {
        display: majong_data.name,
        uuid: majong_data.id,
        head: head || "<:steve:975579504011530260>"
    }
    users.push(newUser)
    
    fs.writeFileSync("./watch.json", JSON.stringify(users,null,2))
    

    client.log(`\`${new Date().toLocaleString()}\` ${message.author.username} added ${newUser.display} to the watch list`)
    client.createMessage(message.channel.id, {
        embeds: [{
            author: {
                name: `Now watching ${newUser.display}`,
            }
        }]
    })
   
}

module.exports = {
    name: "watch",
    description: "Add a user to the watchlist",
    execute,
    admin: true,
    aliases: ["a", "addwl"]
}