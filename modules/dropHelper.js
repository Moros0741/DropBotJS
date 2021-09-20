const { MessageEmbed } = require('discord.js')
const random = require('../modules/random')
const data = require('../data/trolleyWitch.json')

function getChannel(guildProfile, guild) {
    let categoryChannels = guildProfile.systems.drops.channels
    let channels = guild.channels.cache.map(channel => channel.parentId in categoryChannels)
    return channel = random.choice(channels)
}

exports.sendDrop = async function(guildProfile, interaction, duration) {
    let channel = getChannel(guildProfile, interaction.guild)
    let emojis = 
    let embed = new MessageEmbed()
        .setTitle('')
        .setDescription('')
}