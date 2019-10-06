const Discord = require('discord.js');
const fs = require('fs');
const client = new Discord.Client({disableEveryone: true});
client.commands = new Discord.Collection();

client.on("message", async message => {
  if(message.author.bot) return;

  let prefix = '>>';
  let cmd = messageArray[0];
  let args = messageArray.slice(1);
    if (cmd == Config.PREFIX + `invite`){
        let invite = new Discord.RichEmbed()
        .setTitle("CelinaBOT invite link")
        .addField('Invite This Bot', '[[Invite]](https://discordapp.com/oauth2/authorize?client_id=627132306104123413&scope=bot&permissions=8)')
        
        return message.channel.send(invite);
        
    }

    if (cmd == `>>` + `patchnote`){
      let pagecount = message.content.split(' ')[1]
      if(pagecount == null){
        let patchnull = new Discord.RichEmbed()
        .setTitle("PatchNote")
        .setDescription("Now Version: Version 2.0")
        .addField('Version 2.0', '패치노트 개발 시작')

        return message.channel.send(patchnull);
      }
      
    }

})

  
  
  
  client.login('NjI3MTMyMzA2MTA0MTIzNDEz.XZdIsw.NYj8SQoWfFJRox83SEPsE_5GzOY')
