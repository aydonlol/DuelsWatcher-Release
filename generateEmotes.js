const { default: axios } = require("axios")
const fs = require("fs")
const data = require("./watch.json")
const config = require("./cogs.js")

let w = data
let newData = []

setInterval(async () => {
    let profile = w.shift()
    if (!profile) return process.exit()
    if (profile.head) return

    let avatar = await axios.get(`https://crafatar.com/renders/head/${profile.uuid}?size=64`, {
        responseType: 'arraybuffer'
    })

    const data = await axios.post(`https://discord.com/api/v9/guilds/869738293489696848/emojis`, {
        name: `head_${profile.display}`,
        image: `data:image/png;base64,${Buffer.from(avatar.data, 'binary').toString('base64')}`
    }, {
        headers: {
            authorization: `Bot OTc1MjU2NTAwNzUyNzYwODQy.Gs-s86.LvbSl6yczs9yEZJsSBPgxZZXundrtuV7t9EXkc`
        },
        validateStatus: false
    })
    console.log(Buffer.from(avatar.data, 'binary').toString('base64'))
    console.log(JSON.stringify(data.data))

    profile.head = `<:${data.data.name}:${data.data.id}>`

    newData.push(profile)
    fs.writeFileSync("./new_watch.json", JSON.stringify(newData, null, 2))
},1000)

