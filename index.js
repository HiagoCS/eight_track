console.clear();
require('dotenv').config()
const { Client, Collection, GatewayIntentBits, ChannelType  }  = require("discord.js");
const YoutubePoster = require("discord-youtube");
const logs = require('discord-logs');

const { DisTube } = require("distube");
const {SpotifyPlugin} = require("@distube/spotify");


const fs = require('fs');

const client = new Client({intents:[
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildVoiceStates
]});
client.distube = new DisTube(client, {
    emitNewSongOnly: true,
    leaveOnFinish: true,
    emitAddSongWhenCreatingQueue: false,
    plugins:[new SpotifyPlugin()]
});
client.ytp =  new YoutubePoster(client,{
    loop_delay_in_min:1
})
client.commands = new Collection();
client.aliases = new Collection();

fs.readdirSync('./src/commands').forEach(local =>{
    const commands = fs.readdirSync(`./src/commands/${local}`).filter(file => file.endsWith('.js'));

    commands.forEach(file =>{
        file = require(`./src/commands/${local}/${file}`);

        if(file.name)client.commands.set(file.name, file);
        if(file.aliases)client.commands.set(file.name, file);
    });
});

client.login(process.env.TOKEN);

client.on("ready", () =>{
    console.log(`eight-track ligado, ${client.user.username} está pronto!`)
});

client.on("messageCreate", (message) =>{
    let prefix = `${client.user.username},`

    if(message.author.bot) return;
    if(message.channel.type === ChannelType.DM) return;
    if(!message.content.toLowerCase().startsWith(prefix.toLowerCase())) return;
    if(!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/g);

    let cmd = args.shift().toLowerCase();
    if(cmd.length === 0) return;

    let command = client.commands.get(cmd);
    if(!command) command = client.commands.get(client.aliases.get(cmd));

    try{
        command.run(client, message, args);
    }catch(err){
        console.log("Error: "+err);
    }


});