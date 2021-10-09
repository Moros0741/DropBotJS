const { MessageEmbed } = require('discord.js');
const guildSchema = require('../models/guildSchema')
const userSchema = require('../models/userSchema')
const random = require('../modules/random')
const JBdata = require('../data/JBdata.json')

async function beanMessage(member, channel, reward) {
    let embed = new MessageEmbed()
        .setTitle("WHOOOOOO BEANS!")
        .setColor(random.choice(JBdata.colours))
        .setDescription(`${member.toString()} <:jellyBeans:895779343127687198> You got **${random.choice(JBdata.responses)} Flavored**. \n> *${random.choice(JBdata.secondary)}* \n\nHere have **${reward} points**. You deserve it!`)
        .setThumbnail(random.choice(JBdata.thumbails))
    
    return channel.send({embeds: [embed]});
};

async function feedMessage(member, channel, reward) {
    let embed = new MessageEmbed()
        .setDescription(`**${member.displayName}** used \`!beans\` and earned: **${reward} points** for their house.`)
        .setColor(random.choice(JBdata.colours))
        .setThumbnail(member.avatarURL({dynamic: true}) || member.user.avatarURL({dynamic: true}))

    return channel.send({embeds: [embed]});
};

module.exports = {
    name: "messageCreate",
    once: false,
    async execute(message) {
        if (!message.guild) return;

        if (!message.content.startsWith('!bean') || message.author.bot) return;
    
        let guildProfile = await guildSchema.findOne({guildID: message.guild.id})
        let acceptedChannel = guildProfile.systems.bean.channel

        if (!guildProfile.systems.bean.isActive) return;

        if (message.channel.id != acceptedChannel) return;
        let member = message.guild.members.cache.find(member => member.id === message.author.id)
        let memberProfile = await userSchema.findOne({userID: member.id})
        let feedChannel = message.guild.channels.cache.find(channel => channel.id === guildProfile.systems.bean.feedChannel)
        let reward = random.range(0, 50)

        if (!memberProfile) {
            let newProfile = new userSchema({
                userID: member.id,
                cooldowns: [
                    {
                        command: "bean",
                        used: Date.now()
                    }
                ]
            });
            newProfile.save();
            await beanMessage(member, message.channel, reward)
            await feedMessage(member, feedChannel, reward)
        
        } else if (!memberProfile.cooldowns.find(cooldown => cooldown.command === 'bean')) {
            memberProfile.cooldowns.push({
                command: "bean",
                used: Date.now()
            });
            memberProfile.save();
            await beanMessage(member, message.channel, reward)
            await feedMessage(member, feedChannel, reward)

        } else {
            let cooldown = memberProfile.cooldowns.find(cooldown => cooldown.command === 'bean')
            let difference = Date.now() - cooldown.used
            let cooldownMS = 10800000
            let remains = new Date(cooldownMS - difference).toISOString().slice(11, 19).split(":")

            if (difference >= cooldownMS) {
                cooldown.used = Date.now();
                memberProfile.save();

                await beanMessage(member, message.channel, reward)
                await feedMessage(member, feedChannel, reward)

            } else {
                return message.reply({content: `You can't use this command yet. Please try again in \`${remains[0]}\` Hours \`${remains[1]}\` Minutes \`${remains[2]}\` Seconds`});
            
            }
        }
    },
};