const execute = async (message, args, client) => {
    client.createMessage(message.channel.id, "Pong!")
}

module.exports = {
    name: "ping",
    description: "Ping",
    execute,
    admin: false,
    aliases: ["ptest"]
}