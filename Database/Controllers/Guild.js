const Guild = require("../models/Guild")

module.exports = {
    async store(server) {
        await Guild.create({
            _id: server.id
        })
        return console.log(`[ MongoDB ] Successfully saved the server: ${server.name}(${server.id})`)
    },

    async retrivePrefix (server) {
      const guild = await Guild.findById({
        _id: server.id
      })
  
      return guild.prefix
    },
    async changePrefix (server, prefix) {
      await Guild.findByIdAndUpdate(
        {
          _id: server.id
        },
        {
          prefix: prefix
        }
      )
  
      return console.log(`[ MongoDB ] The prefix of the server ${server.name}(${server.id}) has changed to ${prefix}`)
    }
}