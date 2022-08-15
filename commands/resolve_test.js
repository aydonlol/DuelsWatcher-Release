const resolve = require("../utilities/resolveHead")
const majhong = require("../utilities/name_uuid")

const execute = async (message, args, client) => {
    let d = await majhong("neumaticc")
    let head = await resolve({
        display: d.name,
        uuid: d.id
    })
    client.createMessage(message.channel.id, `${head} 2`)
}

module.exports = {
    name: "rt",
    description: "",
    execute,
    admin: false,
    aliases: []
}