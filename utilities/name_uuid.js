const axios = require("axios")

/**
 * 
 * @param {String} name 
 * @returns string
 */
module.exports = async (name) => {
    const data = await axios.get(`https://api.mojang.com/users/profiles/minecraft/${name}`, {
        validateStatus: false
    })

    
    // if user is not found return as null
    return data.data?.id ? data.data : null
}