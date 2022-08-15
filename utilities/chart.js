const axios = require("axios")

module.exports.doughnut_w_l = async (win, lose) => {
    let data = {
        "w": "300",
        "h": "300",
        "chart": {
          "type": "doughnut",
          "data": {
            "datasets": [
              {
                "data": [
                  win,
                  lose
                ],
                "backgroundColor": [
                  "rgb(106, 227, 79)",
                  "rgb(245, 66, 66)"
                ]
              }
            ],
            labels: ['Win', 'Lose'],
          },
          options: {
            title: {
              display: true,
              text: 'wins to losses',
            },
          },
        }
      }

    let response = await axios.post("https://cht.neu.lol/c", data)
    return `https://cht.neu.lol/${response.data.id}`
}