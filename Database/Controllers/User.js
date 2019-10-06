const User = require("../models/User")

module.exports = {
    async setUser(user) {
        await User.create({
            _id: user.user.id,
            username: user.nickname ? user.nickname : user.user.username
        })
        return console.log(`[ MongoDB ] Successfully saved the user: ${user.user.username}(${user.id})`)
    },

    async showLevel (user) {
      let userFind = await User.findById({
        _id: user.id
      })
  
      return userFind.level
    },
  
    async showXp(user) {
        let userFind = await User.findById({
            _id: user.id
        })
      
        return userFind.xp
    }
}
