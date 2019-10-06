const Discord = require('discord.js');
const db = require('mongoose').connection
const Config = require('../Config/Config.json');
const Users = require('../Database/Controllers/User.js')

exports.run = (client, message, args) => {
    db.collection('users').findOne({_id: message.author.id}, async (err, res) => {
        if(res) {
            let embed = new Discord.RichEmbed()
            .setColor('RED')
            .setDescription(`
            ${message.author} 님은 이미 등록되어있습니다!
            `)
            message.channel.send(embed)
        } else {
            let embed = new Discord.RichEmbed()
                .setColor('RED')
                .setDescription(`
                ${message.author} 님을 ${client.user.username} 데이터베이스에 등록합니다.
                `)
            message.channel.send(embed).then(msg => {
                msg.react('✅').then(() => msg.react('❎'))

                let filterYes = (reaction, user) => reaction.emoji.name === '✅' && user.id === message.author.id
                let collectorYes = msg.createReactionCollector(filterYes, { max: 1, time: 60000 })
    
                let filterNo = (reaction, user) => reaction.emoji.name === '❎' && user.id === message.author.id
                let collectorNo = msg.createReactionCollector(filterNo, { max: 1, time: 60000 })

                collectorYes.on('collect', () => {
                    msg.delete().then(() => {
                        let embed = new Discord.RichEmbed()
                            .setColor('GREEN')
                            .setDescription(`
                            ${message.author} 님을 성공적으로 등록하였습니다.
                            `)
                        message.channel.send(embed)

                        Users.setUser(message.member).catch(err => {
                            console.error(`\n[ MongoDB ] Register user date upload error : \n${err}\n`)
                        })
                    })
                });

                collectorNo.on('collect', () => {
                    msg.delete().then(() => {
                        let embed = new Discord.RichEmbed()
                            .setColor('RED')
                            .setDescription(`
                            ${message.author} 등록 거부!
                            `)
                        message.channel.send(embed)
                    })
                });
            })
        }
    })
}

exports.config = {
    name: '등록',
    aliases: []
}
