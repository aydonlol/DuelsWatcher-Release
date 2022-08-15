const axios = require("axios")
const chokidar = require("chokidar")
const fs = require("fs")
let translate = require("../translations.json")
let users = []
let queue = []




const start = (client) => {
    run(client)

    // check all users
    setInterval(run, 1000 * 60 * 1, client)
    
    // keep user array up to date
    users = JSON.parse(fs.readFileSync("./watch.json"))
    chokidar.watch("./watch.json").on("change", () => {
        users = JSON.parse(fs.readFileSync("./watch.json"))
    })

    setInterval(async () => {
        if (queue.length === 0) return
        else queue.shift()()
    }, 75) // anti rate limit
}

const run = (client) => {
    client.watchQueue = queue
    client.logQueue.push(`\`${new Date().toLocaleString()}\` - :arrows_counterclockwise:  checking ${users.length} users`)

    users = JSON.parse(fs.readFileSync("./watch.json"))
    users.forEach(x => {
        queue.push(async () => {
            const data = await axios.get(`https://api.hypixel.net/player?uuid=${x.uuid}`, { 
                headers: {
                    "API-Key": "842aed7e-ed76-4270-9cd4-acb80e54c133"                    
                }
            })
            check(x.uuid, x.display, data.data.player.stats.Duels, client)
            // console.log(`${x.display}'s stats have been checked`)
        })
    })
    
}

const check = (uuid, display, stats, client) => {
    let old_stat = JSON.parse(fs.readFileSync("./data.json"))
    let userStats = old_stat[uuid]
    if (!userStats) userStats = stats
    let winlol = 0
    if (userStats.wins < stats.wins) {
        stats.win_increase_value = userStats.win_increase_value ? userStats.win_increase_value + (stats.wins - userStats.wins) : stats.wins - userStats.wins
        winlol +1 // winlol is used to determine if the user has won or not

    }
    if (userStats.losses < stats.losses) {
        stats.win_increase_value = 0
        winlol = 0
    }

    let streak_estimate = stats.win_increase_value
    
    client.logQueue.push(`\`${new Date().toLocaleString()}\` - :white_check_mark:  checked ${display} [${uuid}]`)


    let fields = [
        'sumo_duel_rounds_played',
        'boxing_duel_rounds_played',
        'classic_duel_rounds_played',
        'op_duel_rounds_played',
        'sumo_duel_wins',
        'boxing_duel_wins',
        'classic_duel_wins',
        'op_duel_wins',
        'wins',
        'losses',
        'best_overall_winstreak',
        'current_winstreak',
        'best_all_modes_winstreak',
        'best_uhc_winstreak',
        'current_winstreak_mode_sumo_duel',
        'best_skywars_winstreak',
        'current_winstreak_mode_skywars',
        'best_mega_walls_winstreak',
        'current_winstreak_mode_mega_walls',
        'best_blitz_winstreak',
        'current_winstreak_mode_blitz',
        'best_parkour_winstreak',
        'current_winstreak_mode_parkour',
        'best_op_winstreak',
        'current_winstreak_mode_op',
        'best_classic_winstreak',
        'current_winstreak_mode_classic',
        'best_bow_winstreak',
        'current_winstreak_mode_bow',
        'best_no_debuff_winstreak',
        'current_winstreak_mode_no_debuff',
        'best_combo_winstreak',
        'current_winstreak_mode_combo',
        'best_tnt_games_winstreak',
        'current_winstreak_mode_tnt_games',
        'best_sumo_winstreak',
        'current_winstreak_mode_sumo',
        'best_bridge_winstreak',
        'current_winstreak_mode_bridge',
        'best_boxing_winstreak',
        'current_winstreak_mode_boxing',
        'best_arena_winstreak',
        'current_winstreak_mode_arena',
        'best_winstreak_mode_sumo_duel',
        'current_sumo_winstreak',
        'duels_recently_played',
        'games_played_duels'
      ]

      let messages = []

      
    fields.forEach(x => {
        if (!stats[x]) return // no stats for specific game mode

        if (stats[x] !== userStats[x]) {
            console.log(`${display} [${uuid}] ${x}: old - ${userStats[x]} | new - ${stats[x]}`)
            messages.push(`> gained __${stats[x] - userStats[x]}__ \`${translate[x] || x}\``)
            
        }
    })
    

    
    let bust_info = users.find(x => x.uuid === uuid)
    
    if (messages.length) {
        messages.reverse()
        messages.push(`${bust_info?.head || "<:steve:975579504011530260>"} **${display}**'s [${uuid}] stats have updated!`)
        messages.reverse()
        messages.push(`**${display}** has a current win streak of **${stats.current_winstreak === 0 ? `${winlol} (Estimated)` : stats.current_winstreak || 0}**, has won **${stats.wins || 0}** games, and has lost **${stats.losses || 0}** games`)
        messages.push("```​```")
        client.messageQueue.push(messages.join("\n"))
    }

    old_stat[uuid] = stats
    fs.writeFileSync("./data.json", JSON.stringify(old_stat,null,2))

}

module.exports = start