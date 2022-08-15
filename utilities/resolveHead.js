const config = require("../cogs.js")
const axios = require("axios")
const discord = axios.create({
	baseURL: "https://discord.com/api/v9",
	headers: {
		authorization: `Bot ${config.token}`
	},
	validateStatus: false
})

/**
 *
 * @param {Object} profile user's profile. has uuid and display properties
 */
module.exports = async (profile) => {
	try {
		let globalEmotes = []
                console.log("1")
		const guild_data = await discord.get(`/users/@me/guilds`)
		let guilds = guild_data.data.filter((guild) => guild.id !== "975256872116445254")

		guilds.forEach(async (guild) => {
			let emotes = await discord.get(`/guilds/${guild.id}/emojis`)
                console.log("2",guild)
                emotes.data.forEach((emote) => {
				if (emote.name.startsWith("head_"))
					globalEmotes.push({
						name: emote.name,
						id: emote.id,
						display: `<:${emote.name}:${emote.id}>`,
						player: emote.name?.replace("head_", "")
					})
			})
			// remove guilds with too many emotes
			if (emotes.data?.length === 50) guilds = guilds.filter((g) => g.id !== guild.id)
		})

                console.log("3")
		// find one that already exists
		let found = globalEmotes.find((x) => x.player === profile.display)
		if (found && found?.display) return found.display

		const headData = await axios.get(`https://crafatar.com/renders/head/${profile.uuid}?size=64`,{
				responseType: "arraybuffer"
			}
		)
		let b64 =
			"data:image/png;base64," +
			Buffer.from(headData.data, "binary").toString("base64")

            console.log(b64)
		if (!guilds.length) return null
		const data = await discord
			.post(`/guilds/${guilds[0]?.id}/emojis`, {
				name: `head_${profile.display}`,
				image: b64
			})
			.catch(() => {
                console.log("fail 3")
				return null
			})
            console.log("4")

		return `<:${data.data.name}:${data.data.id}>`
	} catch (e) {
        console.log(e)
		return null
	}
}
