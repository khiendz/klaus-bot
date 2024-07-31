require('dotenv').config(); 
const { Client, GatewayIntentBits } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource } = require('@discordjs/voice');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildMessages] });


client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.on('messageCreate', async message => {
    if (message.content.startsWith('!play')) {
        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel) {
            return message.reply('Bạn cần tham gia một kênh thoại!');
        }

        const connection = joinVoiceChannel({
            channelId: voiceChannel.id,
            guildId: message.guild.id,
            adapterCreator: message.guild.voiceAdapterCreator,
        });

        const player = createAudioPlayer();
        const resource = createAudioResource('path_to_your_audio_file.mp3'); // Thay bằng đường dẫn đến file âm thanh của bạn

        player.play(resource);
        connection.subscribe(player);

        player.on('error', error => {
            console.error(`Error: ${error.message}`);
        });

        message.reply('Bot đã tham gia vào kênh thoại và đang phát nhạc!');
    }

    if (message.content.startsWith('!leave')) {
        const voiceChannel = message.member.voice.channel;
        if (voiceChannel) {
            voiceChannel.leave();
            message.reply('Bot đã rời khỏi kênh thoại!');
        } else {
            message.reply('Bạn cần tham gia một kênh thoại!');
        }
    }
});

