const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed, Permissions, } = require('discord.js')
const helper = require('../modules/helpers')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup')
        .description("Set various systems/information")
        .addStringOption(option => 
            option.setName('action')
            .description("Choose what system/information to update")
            .setRequired(true)
            .addChoice('Turn On/Off', 'toggle')
            .addChoice('Duration', 'duration')
            .addChoice('Feed Channel', 'setFeed')
            .addChoice('Add Category', 'addCategory')
            .addChoice('Remove Category', "removeCategory")
            .addChoice('Add House Role', 'addHouseRole')
            .addChoice('Remove House Role', 'removeHouseRole')
        )
        .addRoleOption(option =>
            option.setName('house-role')
            .setDescription('Mention the house role to add/remove')
            .setRequired(false)
        )
        .addBooleanOption(option =>
            option.setName('enable')
            .setDescription('True for on, False for off.')
            .setRequired(false)
        )
        .addChannelOption(option =>
            option.setName('channel')
            .setDescription("Mention channel to send feed to or to post in.")
            .setRequired(false)
        )
        .addNumberOption(option =>
            option.setName('duration')
            .setDescription('Enter time to set interval of drops. (1m = 1 minute, 1h = 1 hour)')
            .setRequired(false)
        ),
    async execute(interaction, guildProfile) {
        if (!interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR) || interaction.member.id === '765324522676682803' || interaction.member.id === '700057705951395921') {
            return interaction.reply({content: "This command requires \`ADMINISTRATOR\` permissions. Which you don't have.", ephemeral: true})
        } else {
            let choice = interaction.options.getString('action')
            if (choice === 'toggle') {
                let decision = interaction.options.getBoolean('enable')
                if (!decision) {
                    return interaction.reply({content: "Please try again and use the 'enable' option. \n\n**Example:** \n> \`/setup [Action: toggle] [Enable: true/false]\`", ephemeral: true})
                } else {
                    guildProfile.systems.drops.active = decision;
                    guildProfile.save();
                    let setInfo; 
                    if (decision === true) {
                        setInfo = "Enabled"
                    } else {
                        setInfo = "Disabled"
                    }
                    return interaction.reply({embeds: [embed => new MessageEmbed().setDescription(`Drops are now \`${setInfo}\``).setColor('DARK_GOLD')], ephemeral: true})
                }
            } else if (choice === 'duration') {
                 let interval = interaction.options.getNumber('duration')
                 if (!interval) {
                     return interaction.reply({contents: "Please try again and use the 'duration' option. \n\n**Example:** \n> \`/setup [Action: duration] [duration: your-set-time]\` \n**Note:** Duration is a number followed by a letter indicatiing time. \n> m = minutes (ex: 1m, 5m, 30m) \n> h = hours (1h, 5h, 12h)", ephemeral: true})
                 } else {
                     let time = helper.getSeconds(interval)
                     guildProfile.systems.drops.duration = time;
                     guildProfile.save();
                     return interaction.reply({embeds: [embed => new MessageEmbed().setDescription(`The duration between drops has been set to \`${interval}\``).setColor('DARK_GOLD')], ephemeral: true})
                 }
            } else if (choice === 'setFeed') {
                let channel = interaction.options.getChannel('channel')
                if (!channel) {
                    return interaction.reply({contents: "Please try again and use the 'channel' option. \n\n**Example:** \n> \`/setup [Action: Feed Channel] [Channel: #channel-mention]\`", ephemeral: true})
                } else {
                    guildProfile.systems.drops.feedChannel = channel.id;
                    guildProfile.save();
                    return interaction.reply({embeds: [embed => new MessageEmbed().setDescription(`Drop reactions will now be sent to ${channel.toString()}`).setColor('DARK_GOLD')], ephemeral: true})
                }
            } else if (choice === 'addCategory') {
                let channel = interaction.options.getChannel('channel')
                if (!channel) {
                    return interaction.reply({contents: "Please try again and use the 'channel' option. \n\n**Example:** \n> \`/setup [Action: Add Category] [Channel: <#category-ID>]\`", ephemeral: true})
                } else {
                    guildProfile.systems.drops.channels.push(channel.id);
                    guildProfile.save();
                    return interaction.reply({embeds: [embed => new MessageEmbed().setDescription(`Drops will now be randomly sent in \`${channel.name}\` category.`).setColor('DARK_GOLD')], ephemeral: true})
                }
            } else if (choice === 'removeCategory') {
                let channel = interaction.options.getChannel('channel')
                if (!channel) {
                    return interaction.reply({contents: "Please try again and use the 'channel' option. \n\n**Example:** \n> \`/setup [Action: Remove Category] [Channel: <#category-ID>]\`", ephemeral: true})
                } else {
                    guildProfile.systems.drops.channels.pull(channel.id);
                    guildProfile.save();
                    return interaction.reply({embeds: [embed => new MessageEmbed().setDescription(`Drops will no longer randomly be sent to \`${channel.name}\` category.`).setColor('DARK_GOLD')], ephemeral: true})
                }
            } else if (choice === 'addHouseRole') {
                let role = interaction.options.getRole('house-role')
                let houseName = interaction.options.getString('house-name')
                if (!role || !houseName) {
                    return interaction.reply({contents: "Please try again and use the 'house-role' and 'house-name options. \n\n**Example:** \n> \`/setup [Action: Add House Role] [house-role: @role] [house-name: House's Name (ex: Gryffindor)]\`", ephemeral: true})
                } else {
                    let isHouse = guildProfile.houses.find({role: role.id})
                    if (!isHouse) {
                        guildProfile.houses.push({
                            name: houseName, 
                            role: role.id,
                            points: 0
                        });
                        guildProfile.save();
                    } else {
                        guildProfile.houses.update({
                            
                        })
                    }
                }
            }
        }
    }
}
