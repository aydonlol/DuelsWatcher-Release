const fs = require("fs")
const Bot = require("./utilities/Bot.js")
const client = new Bot()
const admins = require("./admin.json")

const dbg = (m) => {
    let lol = false // debug moide
    if (lol === false) return
    else console.log(m)
}

// were doing this the right way
fs.readdirSync("./commands").filter(x => x.endsWith(".js")).forEach(x => {
    const data = require(`./commands/${x}`)
    dbg(`registered command ${x}`)
    client.commands.push(data)
})

client.startQueue()
client.on("ready", () => {
    console.log("logged in " + client.user.username)
    require("./utilities/watch")(client)
})

client.on("messageCreate", async (message) => {
    if (!message.content.startsWith(client.config.prefix) || message.author.bot) return
    let data = message.content.split(" ")
    let commandName = data.shift().substring(client.config.prefix.length).toLowerCase()
    let args = data.join(" ").toLowerCase()

    let command = client.commands.find(x => x.name === commandName || (x.aliases?.length && x.aliases.includes(commandName)))
    if (!command) return
    
    // check permissions
    if (command.admin) {    
        if (!admins.users.includes(message.author.id)) return

        // check if roles are included
        let ok = true
        admins.roles.forEach(role => {
            if (message.member.roles.find(x => x.id === role) !== null) ok = true
        })

       
    }

    await command.execute(message, args, client)
})

client.connect()