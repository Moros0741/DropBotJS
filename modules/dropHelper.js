const { MessageEmbed, Message, ReactionCollector } = require('discord.js')
const random = require('../modules/random')
const TWdata = require('../data/trolleyWitch.json')
const FDdata = require('../data/festiveDrops.json')
const helper = require('../modules/helpers')

function getChannel(guildProfile, guild) {
    let categoryChannels = guildProfile.systems.drops.channels
    let channels = guild.channels.cache.map(channel => channel.parentId in categoryChannels)
    return channel = random.choice(channels)
}

exports.festiveDrop = async function(guildProfile, interaction, duration) {
    let channel = getChannel(guildProfile, interaction.guild)
    const reacted = []
    let embed = new MessageEmbed()
        .setTitle(FDdata.sendData.title)
        .setDescription(FDdata.sendData.description)
        .setColor(color => helper.getColor())
        .setThumbnail(imageLink => random.choice(FDdata.sendData.thumbnails))
    
        const msg = await channel.send({embeds: [embed]})

        const filter = (reaction, user) => {
            return reaction.message.id === msg.id && FDdata.sendData.emojis.includes(reaction.emoji);
        };
        
        const collector = msg.createReactionCollector({ filter, time: duration });
        
        collector.on('collect', (reaction, user) => {
            if (!reacted.includues(user.id)) {
                let member = reaction.message.guild.members.cache.find(member => member.id === user.id)
                reacted.push(member.id)
                let profile;
                try {
                    let userProfile = await userSchema.findOne({userId: member.id})
                    if (!userProfile) {
                        let roles = ['Gryffindor', 'Hufflepuff', 'Slytherin', 'Ravenclaw', "Minister for Magic"]
                        let houseRole = member.roles.find(role => role.name.includes(roles))
                        let houseName = role.name.substring()
                        const newProfile = new userSchema({
                            userID: member.id,
                            houseRole: houseRole.id,


                        });
                    }
                } catch(error) {
                    console.error(error)
                }
            }

        });
        
        collector.on('end', collected => {
            console.log(`Collected ${collected.size} reactions`);
        });
}