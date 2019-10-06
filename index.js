require('dotenv').config()

const Discord = require('discord.js');
const fs = require('fs');
const moment = require('moment');
require('moment').locale('ko-KR');
moment.locale('ko-KR');
const client = new Discord.Client({disableEveryone: true, autoReconnect: true});
const Config = require('./Config/Config.json')
client.commands = new Discord.Collection();
const dbConnect = require('mongoose').connect
const db = require('mongoose').connection

client.on('ready', async () => {
    dbConnect(process.env.MongoDB_Access, { useFindAndModify: false, useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
      console.warn(`[ MongoDB ] Connection with database stabilized successfully.\n`)
  }).catch(err => {
      console.error(`\n[ MongoDB ] Access to MongoDB failed to:\n${err}\n`)
  });
    console.log(`\n[ Login ] ${client.user.tag}\n`)

    let presence = [
      { name: `${client.user.username} | 🌐 | Ready.`, type: 'PLAYING' }
  ]

  function st() {
      let ranPre = presence[Math.floor(Math.random() * presence.length)];
      client.user.setPresence({game: ranPre})
  }

  st();
  setInterval(() => st(), 7500);
});

fs.readdir('./Commands/', (err, files) => {
    if(err) console.error(err);

    let jsfile = files.filter(f => f.split('.').pop() == 'js')
    if(jsfile.length <= 0){
        console.log("[ Commands ] Could't find commands.");
        process.exit();
    }

    jsfile.forEach((f, i) => {
        let props = require(`./Commands/${f}`);
        console.log(`[ Commands ] Successfully loaded ${f} file.`);
        client.commands.set(props.help, props);
    });
});

client.on('message', async message => {
  if (message.author.bot || message.channel.type === 'dm' || message.system) return

  if(!message.content.startsWith(Config.PREFIX)) return
  let args = message.content.slice(Config.PREFIX.length).trim().split(/ +/g)
  let cmd = args.shift().toLowerCase()

  if(message.content.startsWith(Config.PREFIX)) {

    let command = message.content.split(Config.PREFIX).pop()

    if(command.includes('uptime')) {
      function duration(ms) {
        const sec = Math.floor((ms / 1000) % 60).toString()
        const min = Math.floor((ms / (1000 * 60)) % 60).toString()
        const hrs = Math.floor((ms / (1000 * 60 * 60)) % 60).toString()
        const days = Math.floor((ms / (1000 * 60 * 60 * 24)) % 60).toString()
        return `${days.padStart(1, "0")}일 ${hrs.padStart(2, "0")}시간 ${min.padStart(2, "0")}분 ${sec.padStart(2, "0")}초.`
      }
      message.channel.send(`마지막 재부팅 후 봇 업타임: ${duration(client.uptime)}`)

    } else if(command.includes('serverinfo')) {
      let sicon = message.guild.iconURL;
      let serverembed = new Discord.RichEmbed()
      .setDescription("Serverinfo")
      .setColor("RANDOM")
      .setThumbnail(sicon)
      .addField("서버 이름", message.guild.name)
      .addField("서버 생성일", message.guild.createdAt)
      .addField("가입 날짜", message.member.joinedAt)
      .setFooter(message.author.tag, message.author.avatarURL)
      .setTimestamp() //메세지 생성 시간
      .addField("총합 유저들 ( 봇 포함 )", message.guild.memberCount);
  
      return message.channel.send(serverembed);

    } else if(command.includes('help')) {
      let serverembed = new Discord.RichEmbed()
      .setTitle("__**CelinaBOT Command List**__")
      .setColor("RANDOM")
      .addField("Information", "``>>profile``, ``>>serverinfo``")
      .addField("Bot Status", "``>>ping``, ``>>uptime``")
      .setFooter(message.author.tag, message.author.avatarURL)
      .setTimestamp() //메세지 생성 시간
  
      return message.channel.send(serverembed);

    } else if(command.includes('ping')) {
      let botping = await message.channel.send("계산 중...") //await로 완료되길 기다리면서 메세지 전송

      let pEmbed = new Discord.RichEmbed() //임베드 생성
      .setTitle(`${client.user.tag}의 핑:`) //제목 설정
      .addField("💬메세지: ", `${botping.createdTimestamp - message.createdTimestamp}ms`) //필드에 botping의 메세지 생성시간 - 명령어 메세지 생성 시간
      .addField('📡API: ', `${Math.round(client.ping)}ms`) //필드에 WebSocket 핑 추가
      .addField('코드 출처 ', `제로ㅣBrazil#5005 `) 
      .setFooter(message.author.tag, message.author.avatarURL) //footer에 메세지를 친 유저의 이름#태그 형식으로 쓴 후 아이콘은 해당 유저의 프사로 설정
      .setColor("RANDOM") //랜덤 컬러
      .setTimestamp() //메세지 생성 시간
      botping.edit(pEmbed) //botping를 수정

    } else if(command.includes('profile')) {
      let User = message.mentions.users.first() || message.author
      var usertime = moment(message.guild.members.get(User.id).user.createdAt).tz('Asia/Seoul');
            var membertime = moment(message.member.joinedAt).tz('Asia/Seoul');
            let UserInfoEmbed = new Discord.RichEmbed()
                .setTitle(`${User.username}님의 프로필을 조회합니다`)
                .setColor("RANDOM")
                .setImage(`${User.displayAvatarURL}`)
                .addField('이름', `${User.tag}`, false)
                .addField('아이디', `${User.id}`, false)
                .addField("봇", `${User.bot}`)
                .addField('서버 가입일', `${membertime.format('YYYY MMM Do, h:mm:ss a')}`)
                .addField('계정 생성일', `${usertime.format('YYYY MMM Do, h:mm:ss a')}`)
                .addField("상태", `${User.presence.status}`)
                .addField("게임", `${User.presence.game ? User.presence.game.name : '하고있지 않음'}`)
                .setFooter(User.tag, User.avatarURL)
                .setTimestamp();  
    
        return message.channel.send(UserInfoEmbed);
    } else if(command.includes('patchnote')) {
      let pagecount = message.content.split('patchnote').pop()

      let patchnull = new Discord.RichEmbed()
      .setTitle("PatchNote Page1")
      .setDescription(`리소스 : ${version}`)
      .addField('Version 2.0', '패치노트 기록 시작')
      .setFooter('>>patchnote <index>를 통해 패치노트를 열람합니다.')
      let patchp1 = new Discord.RichEmbed()
      .setTitle("PatchNote Page1")
      .setDescription(`리소스 : ${version}`)
      .addField('Version 2.0', '패치노트 기록 시작')
      .setFooter('>>patchnote <index>를 통해 패치노트를 열람합니다.')

      if (pagecount == null) message.channel.send(patchnull)
      else if (pagecount == 1) message.channel.send(patchp1)
      else if (pagecount > 1) return message.channel.send(`${pagecount}페이지에 기록된 패치노트가 없습니다.`)
          
    }
}

  let commandFile = client.commands.get(cmd);
  if (commandFile) commandFile.run(client, message, args);
});

client.login(process.env.TOKEN)