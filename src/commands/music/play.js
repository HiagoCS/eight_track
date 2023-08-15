//const {VoiceChannel, GuildEmoji} = require('discord.js');
require('dotenv').config()
const  { PaginatedEmbed  } =  require('embed-paginator');

module.exports = {
    name:"play",
    aliases: ["euqueroouvir", "tocapramim"],
    run: async(client, message, args) => {
        const guild = await client.guilds.fetch(message.guildId);
        const guildMember = await guild.members.fetch(message.author.id);
        if(!guildMember.voice.channelId) return; 
        const channel = client.channels.cache.get(message.channelId);
        const query = args[0];
        const volume = args[1];
        const VoiceChannel = guildMember.voice.channel;
        if(!VoiceChannel)
            message.reply("Não está em um canal de voz");
        if(!guildMember.voice.channelId == guild.members.me.voice.channelId)
            message.reply(`${client.user.username} ta tocando em outro canal agora!!`);

        try{
            if(query.includes('https://www.youtube.com/watch'))
                YoutubePlay(client, message, [query, volume],VoiceChannel, guildMember, channel);
        }catch(err){
            console.log(err);
        }
    }
}

const YoutubePlay = async (client, message, [query, volume], VoiceChannel, member, channel) =>{
    if(!query) return;
    if(!VoiceChannel) return;

    await client.distube.play(VoiceChannel, query, {textChannel: channel,member:member});
    message.reply("Ovo toca");

    if(volume){
        await client.distube.setVolume(VoiceChannel, parseInt(volume.replace('%', '')));
        message.reply("Volume setado para "+volume);
    }

    const queue = await client.distube.getQueue(VoiceChannel);
    playlistEmbed(queue.songs, member).then(paginatedEmbed =>{
        paginatedEmbed.send({options:{channel:channel}})
    });
}

const playlistEmbed = async (songs, member) =>{
    const randomBetween = (min, max) => Math.floor(Math.random()*(max-min+1)+min);
    const color = [
        randomBetween(0, 255),
        randomBetween(0, 255),
        randomBetween(0, 255),
    ];  
    const embed = new PaginatedEmbed({
            fields:songs.map((song, id) => {return {name:`*${id+1}#*`, value:`${song.name} - ${song.formattedDuration}`}}),
            itemsPerPage:8,
            paginationType:'field',
            duration: 60 * 1000
    }).setDescriptions(['Playlist do lil-bot, sistema eight.track!']);
    return embed;
}
