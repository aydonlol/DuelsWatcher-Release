// Command to lookup a user's profile
const fs = require("fs")
const name_to_uuid = require("../utilities/name_uuid")
const axios = require("axios")

const execute = async (message, args, client) => {
    const f = args.split(" ")[0]
    if (!f) return message.channel.createMessage("Please enter a username")

    const player_data = await name_to_uuid(f)
    console.log(player_data)
    if (!player_data?.id) return message.channel.createMessage("User not found")

    let data = require("../data.json")[player_data?.id] || null
    
    if (!data) {
        client.watchQueue.push(async () => {
            let nd = await axios.get(`https://api.hypixel.net/player?uuid=${player_data?.id}`, {
                headers: {
                    "API-Key": "842aed7e-ed76-4270-9cd4-acb80e54c133"
                },
                validateStatus: false
            })
            data = nd.data?.player?.stats?.Duels
        })
    }


    let re = setInterval(async () => {
        if (!data) return
        clearInterval(re)

        let embed = {
            title: "Duels Stats",
            // description: `[Full Data]()`, // maybe?
            author: {
                name: `${player_data.name} [${player_data?.id}]`,
                icon_url: `https://crafatar.com/avatars/${player_data?.id}?size=64`
            },
            fields: []
        }

        console.log(data)
        embed.fields.push({
            name: "Wins",
            value: `${data.wins || 0}`, // nullable
            inline: true
        })

        embed.fields.push({
            name: "Losses",
            value: `${data.losses || 0}`, // nullabla
            inline: true
        })

        embed.fields.push({
            name: "WLR",
            value: `${(((data.wins || 0)) / (data.losses || 1)).toFixed(2)}`,
            inline: true
        })

        embed.fields.push({
            name: "Win Streak",
            value: `${data.current_winstreak || "**Unknown**"}`,
            inline: true
        })

        embed.fields.push({
            name: "Overall Win Streak",
            value: `${data.current_winstreak === 0 ? `${data.win_increase_value} (is estimat!1!)` : data.current_winstreak || "**Unknown**"}`,
            inline: true
        })

        const chart = await require("../utilities/chart").doughnut_w_l(data.wins || 0, data.losses || 0)

        embed.image = {
            url: chart
        }
    
        message.channel.createMessage({
            embeds: [embed]
        })

    },10)


}

module.exports = {
    name: "profile",
    description: "Lookup a user's profile",
    execute,
    admin: false,
    aliases: ["p"]
}




