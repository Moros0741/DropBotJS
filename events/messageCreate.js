const { MessageEmbed, Permissions } = require('discord.js');
const guildSchema = require('../models/guildSchema')
const userSchema = require('../models/userSchema')
const random = require('../modules/random')
const JBdata = require('../data/JBdata.json')
const { developerIds } = require('../data/config.json');
const helper = require('../modules/helpers');

async function beanMessage(member, channel, reward) {
    let response = random.choice(JBdata.responses)
    let description = response.split('{userMention}').join(member.toString()).split('{pts}').join(reward);
    let embed = new MessageEmbed()
        .setTitle("<:botts:904844597597966386> EVERY FLAVOUR BEANS! <:botts:904844597597966386>")
        .setColor(random.choice(JBdata.colours))
        .setDescription(description)
        .setThumbnail(random.choice(JBdata.thumbnails))
        .setImage("https://knightowl.gg/gfx/div/019.gif")
        .setFooter(" Hedwig Haven's Candy Week", "https://cdn.discordapp.com/emojis/904844597228879872.png?size=96")

    return channel.send({ embeds: [embed] });
};

async function feedMessage(member, channel, reward) {
    let embed = new MessageEmbed()
        .setDescription(`**${member.displayName}** used \`!beans\` and earned: **${reward} points** for their house.`)
        .setColor(helper.getColor(member))
        .setThumbnail(member.avatarURL({ dynamic: true }) || member.user.avatarURL({ dynamic: true }))


    return channel.send({ embeds: [embed] });
};

module.exports = {
    name: "messageCreate",
    once: false,
    async execute(message) {
        if (!message.guild) return;

<<<<<<< HEAD
        if (message.content === '!beans' && !message.author.bot) {
=======
        if (message.content.startsWith('!bean') && !message.author.bot) {
>>>>>>> b2ea11bc11e80a57056291710bd894fd305848b5

            let guildProfile = await guildSchema.findOne({ guildID: message.guild.id })
            let acceptedChannel = guildProfile.systems.bean.channel

            if (!guildProfile.systems.bean.isActive) return;

            if (message.channel.id != acceptedChannel) return;
            let member = message.guild.members.cache.find(member => member.id === message.author.id)
            let memberProfile = await userSchema.findOne({ userID: member.id })
            let feedChannel = message.guild.channels.cache.find(channel => channel.id === guildProfile.systems.bean.feedChannel)
            let reward = random.choice([5, 10, 15, 20, 25, 30, 35, 40, 45, 50]);

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
<<<<<<< HEAD
                let cooldown = memberProfile.cooldowns.find(cooldown => cooldown.command === 'bean')
=======
                /*let cooldown = memberProfile.cooldowns.find(cooldown => cooldown.command === 'bean')
>>>>>>> b2ea11bc11e80a57056291710bd894fd305848b5
                let difference = Date.now() - cooldown.used
                let cooldownMS = 10800000
                let remains = new Date(cooldownMS - difference).toISOString().slice(11, 19).split(":")

                if (difference >= cooldownMS) {
                    cooldown.used = Date.now();
<<<<<<< HEAD
                    memberProfile.save();

                    await beanMessage(member, message.channel, reward)
                    await feedMessage(member, feedChannel, reward)

                } else {
                    return message.reply({ content: `You can't use this command yet. Please try again in \`${remains[0]}\` Hours \`${remains[1]}\` Minutes \`${remains[2]}\` Seconds` });
                }
=======
                    memberProfile.save();*/

                await beanMessage(member, message.channel, reward)
                await feedMessage(member, feedChannel, reward)

                /*} else {
                    return message.reply({ content: `You can't use this command yet. Please try again in \`${remains[0]}\` Hours \`${remains[1]}\` Minutes \`${remains[2]}\` Seconds` });
                */
>>>>>>> b2ea11bc11e80a57056291710bd894fd305848b5
            }
        } else if (message.content.startsWith("!invite-pls")) {
            if (!developerIds.includes(message.author.id)) return;

            const link = await message.client.generateInvite({
                scopes: [
                    "bot",
                    "applications.commands"
                ],
                permissions: [
                    Permissions.FLAGS.SEND_MESSAGES,
                    Permissions.FLAGS.ADD_REACTIONS,
                    Permissions.FLAGS.EMBED_LINKS,
                    Permissions.FLAGS.MANAGE_MESSAGES,
                    Permissions.FLAGS.READ_MESSAGE_HISTORY,
                    Permissions.FLAGS.VIEW_CHANNEL,
                    Permissions.FLAGS.USE_EXTERNAL_EMOJIS,
                    Permissions.FLAGS.USE_APPLICATION_COMMANDS
                ]
            });

            let embed = new MessageEmbed()
                .setDescription(`[Invite Link](${link})`)
                .setColor(message.guild.me.displayHexColor)
            await message.reply({
                embeds: [embed]
            });
        }
    },
};