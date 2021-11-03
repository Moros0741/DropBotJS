const { MessageEmbed, Permissions } = require('discord.js');
const { hyperlink } = require('@discordjs/builders')
const guildSchema = require('../models/guildSchema')
const userSchema = require('../models/userSchema')
const random = require('../modules/random')
const JBdata = require('../data/JBdata.json')

async function beanMessage(member, channel, reward) {
    let response = random.choice(JBdata.responses)
    let description = response.split('{userMention}').join(member.toString()).split('{pts}').join(reward);
    let embed = new MessageEmbed()
        .setTitle("<:botts:904844597597966386> Any Flavor Beans! <:botts:904844597597966386>")
        .setColor(random.choice(JBdata.colours))
        .setDescription(description)
        .setThumbnail(random.choice(JBdata.thumbnails))
        //.setImage("https://images-ext-1.discordapp.net/external/HseOnYcCja3bWtkTPJfe-4nI8S2Wz-u3TzxEB-kCrUs/https/knightowl.gg/gfx/div/019.gif")
        .setFooter("Hedwig's Haven Candy Week!")

    return channel.send({ embeds: [embed] });
};

async function feedMessage(member, channel, reward) {
    let embed = new MessageEmbed()
        .setDescription(`**${member.displayName}** used \`!beans\` and earned: **${reward} points** for their house.`)
        .setColor(random.choice(JBdata.colours))
        .setThumbnail(member.avatarURL({ dynamic: true }) || member.user.avatarURL({ dynamic: true }))

    return channel.send({ embeds: [embed] });
};

module.exports = {
    name: "messageCreate",
    once: false,
    async execute(message) {
        if (!message.guild) return;

        if (message.content.startsWith('!bean')) {

            let guildProfile = await guildSchema.findOne({ guildID: message.guild.id })
            let acceptedChannel = guildProfile.systems.bean.channel

            if (!guildProfile.systems.bean.isActive) return;

            if (message.channel.id != acceptedChannel) return;
            let member = message.guild.members.cache.find(member => member.id === message.author.id)
            let memberProfile = await userSchema.findOne({ userID: member.id })
            let feedChannel = message.guild.channels.cache.find(channel => channel.id === guildProfile.systems.bean.feedChannel)
            let reward = random.range(10, 50)

            if (!memberProfile) {
                let newProfile = new userSchema({
                    userID: member.id,
                    cooldowns: [{
                        command: "bean",
                        used: Date.now()
                    }]
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

                /*if (difference >= cooldownMS) {
                    cooldown.used = Date.now();
                    memberProfile.save(); */

                await beanMessage(member, message.channel, reward)
                await feedMessage(member, feedChannel, reward)

                /*} else {
                    return message.reply({ content: `You can't use this command yet. Please try again in \`${remains[0]}\` Hours \`${remains[1]}\` Minutes \`${remains[2]}\` Seconds` });

                }*/
            }
        } else if (message.content.startsWith("generate-Invite-Pls")) {
            let accepted_ids = ["700057705951395921", "765324522676682803", "694322536397406238"];
            if (!accepted_ids.includes(message.author.id)) {
                return message.reply({ content: "Missing Permissions to run this command." });
            } else {
                let inviteLink = await message.client.generateInvite({
                    scopes: [
                        'applications.commands',
                        'bot'
                    ],
                    permissions: [
                        Permissions.FLAGS.ADD_REACTIONS,
                        Permissions.FLAGS.EMBED_LINKS,
                        Permissions.FLAGS.MANAGE_MESSAGES,
                        Permissions.FLAGS.READ_MESSAGE_HISTORY,
                        Permissions.FLAGS.SEND_MESSAGES,
                        Permissions.FLAGS.SEND_MESSAGES_IN_THREADS,
                        Permissions.FLAGS.USE_EXTERNAL_EMOJIS,
                        Permissions.FLAGS.VIEW_CHANNEL
                    ]
                });

                let embed = new MessageEmbed()
                    .setDescription(hyperlink("Invite Link", inviteLink))

                return message.reply({
                    embeds: [embed]
                });
            }
        }
    },
};