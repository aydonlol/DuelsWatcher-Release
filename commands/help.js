const execute = async (message, args, client) => {
    let h = client.commands.map(x => `**${client.config.prefix}${x.name}** (${x.aliases.join(", ")}): ${x.description}`)
    let embed = {
        "title": "Help",
        "description": h.join("\n"),
    }
    client.createMessage(message.channel.id, {
        embeds: [
            embed
        ]
    })
}

module.exports = {
    name: "help",
    description: "what it says basically",
    execute,
    admin: false
}