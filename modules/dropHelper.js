const { MessageEmbed, Message, ReactionCollector } = require('discord.js')
const random = require('../modules/random')
const TWdata = require('../data/trolleyWitch.json')
const FDdata = require('../data/festiveDrops.json')
const helper = require('../modules/helpers')

function getChannel(guildProfile, guild) {
    let channels = guild.channels.cache.map(channel => channel.id)
    let channel = random.choice(channels)
    return channel
}

exports.festiveDrop = async function(guildProfile, channel, duration) {
    const reacted = []

    let embed = new MessageEmbed()
        .setTitle(
            FDdata.sendData.title
        )
        .setDescription(
            `${FDdata.sendData.message}`
        )
        .setColor(
            random.choice(FDdata.sendData.colours)
        )
        .setThumbnail(
            random.choice(FDdata.responseData.thumbnails)
        )
        .setImage(random.choice(
            FDdata.responseData.images))

    let msg = await channel.send({
        embeds: [
            embed
        ]
    });
    let emojis = FDdata.sendData.emojis
    for (emoj of emojis) {
        await msg.react(emoj)
    };

    const filter = (reaction, user) => {
        return reaction.message.id === msg.id && FDdata.sendData.emojis.includes(String(reaction.emoji));
    };

    const collector = msg.createReactionCollector({ filter, time: duration });

    collector.on('collect', async(reaction, user) => {
        if (!reacted.includes(user.id)) {
            let member = reaction.message.guild.members.cache.find(member => member.id === user.id)
            reacted.push(member.id)

            let reward = random.range(0, 75)
            let feedchannel = reaction.message.guild.channels.cache.find(channel =>
                channel.id === guildProfile.systems.drops.feedChannel
            )

            let responseEmbed = new MessageEmbed()
                .setTitle(
                    "A Leaf Was Caught!"
                )
                .setDescription(
                    `What's This?! Theres a message on this leaf! \n> *${random.choice(FDdata.responseData.messages)}* \n\nHere ${member.toString()}, have **${reward} points** for your efforts.`
                )
                .setColor(
                    random.choice(FDdata.responseData.colours)
                )
                .setThumbnail(
                    random.choice(FDdata.responseData.thumbnails)
                )


            let feedEmbed = new MessageEmbed()
                .setDescription(
                    `**${member.displayName}** has claimed a leaf and earned **${reward} points** for their house.`
                )
                .setColor(
                    `${random.choice(FDdata.responseData.colours)}`
                )
                .setThumbnail(
                    member.avatarURL({
                        dynamic: true
                    }) || member.user.avatarURL({
                        dynamic: true
                    })
                )

            await reaction.message.channel.send({
                embeds: [
                    responseEmbed
                ]
            });

            await feedchannel.send({
                embeds: [
                    feedEmbed
                ]
            });
        }

    });

    collector.on('end', async(collected) => {
        await msg.delete()
    });
};