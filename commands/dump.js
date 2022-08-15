const { default: axios } = require("axios")
const fs = require("fs")

let limited = false
const execute = async (message, args, client) => {
      if (limited) return client.createMessage(message.channel.id, "This action is being limited")
      limited = true
      setTimeout(() => { limited = false }, 1000 * 60)

    let c = fs.readFileSync("./data.json", "utf8")
    let payload = new URLSearchParams({
        Content: c,
        Title: `d_${message.author.username}_${Date.now().toString(15)}`,
        Syntax: "json",
        ExpireLength: "1",
        ExpireUnit: "Never",
        Password: ""
      })
    const data = await axios.post("https://paste.teknik.io/Action/Paste", payload, {
        maxRedirects: 0,
        validateStatus: false
    })
    let link = data.headers?.location


    client.createMessage(message.channel.id, `Dumped all data to ${link}`)
}

module.exports = {
    name: "dump",
    description: "Dump all player data",
    execute,
    admin: false
}