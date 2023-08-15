const {VoiceChannel, GuildEmoji} = require('discord.js');

module.exports = {
    name:"resume",
    aliases: ["povolta"],
    run: async(client, message, args) => {
        const guild = await client.guilds.fetch(message.guildId);
        const guildMember = await guild.members.fetch(message.author.id);
        if(!guildMember.voice.channelId) return; 

        const VoiceChannel = guildMember.voice.channel;

       const queue = await client.distube.getQueue(VoiceChannel);

       if(!queue)
        return message.reply("Não ta tocando nada jão");

        queue.resume(VoiceChannel);
        message.reply("boh!!");
    }
}