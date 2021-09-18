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
        .addStringOption(option =>
            option.setName('house')
            .setDescription("Please choose the house that applys. None if none.")
            .addChoice('Gryffindor', 'gryffindor')
            .addChoice('Slytherin', 'slytherin')
            .addChoice('Ravenclaw', 'ravenclaw')
            .addChoice('Hufflepuff', 'hufflepuff')
            .addChoice('Minister', 'minister')
            .addChoice('None', 'none')
        )
        .addRoleOption(option =>
            option.setName('role')
            .setDescription('Mention the role to add/remove')
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
            let color = helper.getColor()
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
                    return interaction.reply({embeds: [embed => new MessageEmbed().setDescription(`Drops are now \`${setInfo}\``).setColor(color)], ephemeral: true})
                }
            } else if (choice === 'duration') {
                 let interval = interaction.options.getNumber('duration')
                 if (!interval) {
                     return interaction.reply({contents: "Please try again and use the 'duration' option. \n\n**Example:** \n> \`/setup [Action: duration] [duration: your-set-time]\` \n**Note:** Duration is a number followed by a letter indicatiing time. \n> m = minutes (ex: 1m, 5m, 30m) \n> h = hours (1h, 5h, 12h)", ephemeral: true})
                 } else {
                     let time = helper.getSeconds(interval)
                     guildProfile.systems.drops.duration = time;
                     guildProfile.save();
                     return interaction.reply({embeds: [embed => new MessageEmbed().setDescription(`The duration between drops has been set to \`${interval}\``).setColor(color)], ephemeral: true})
                 }
            } else if (choice === 'setFeed') {
                let channel = interaction.options.getChannel('channel')
                if (!channel) {
                    return interaction.reply({contents: "Please try again and use the 'channel' option. \n\n**Example:** \n> \`/setup [Action: Feed Channel] [Channel: #channel-mention]\`", ephemeral: true})
                } else {
                    guildProfile.systems.drops.feedChannel = channel.id;
                    guildProfile.save();
                    return interaction.reply({embeds: [embed => new MessageEmbed().setDescription(`Drop reactions will now be sent to ${channel.toString()}`).setColor(color)], ephemeral: true})
                }
            } else if (choice === 'addCategory') {
                let channel = interaction.options.getChannel('channel')
                if (!channel) {
                    return interaction.reply({contents: "Please try again and use the 'channel' option. \n\n**Example:** \n> \`/setup [Action: Add Category] [Channel: <#category-ID>]\`", ephemeral: true})
                } else {
                    guildProfile.systems.drops.channels.push(channel.id);
                    guildProfile.save();
                    return interaction.reply({embeds: [embed => new MessageEmbed().setDescription(`Drops will now be randomly sent in \`${channel.name}\` category.`).setColor(color)], ephemeral: true})
                }
            } else if (choice === 'removeCategory') {
                let channel = interaction.options.getChannel('channel')
                if (!channel) {
                    return interaction.reply({contents: "Please try again and use the 'channel' option. \n\n**Example:** \n> \`/setup [Action: Remove Category] [Channel: <#category-ID>]\`", ephemeral: true})
                } else {
                    guildProfile.systems.drops.channels.pull(channel.id);
                    guildProfile.save();
                    return interaction.reply({embeds: [embed => new MessageEmbed().setDescription(`Drops will no longer randomly be sent to \`${channel.name}\` category.`).setColor(color)], ephemeral: true})
                }
            } else if (choice === 'addHouseRole') {
                let role = interaction.options.getRole('house-role')
                let houseName = interaction.options.getString('house')
                if (!houseName || !role) {
                    return interaction.reply({contents: "Please try again and use the 'house' and 'role' options. \n\n**Example:** \n> \`/setup [Choice: Add House Role] [House: House option] [Role: @role]\`", ephemeral: true})
                } else {
                    let house = guildProfile.houses
                    let name;
                    if (houseName === 'none') {
                        return interaction.reply({embeds: [embed => new Message.embed().setDescription(`House was None. Nowhere to put role.`).setColor(color)], ephemeral: true})
                    } else {
                        if (houseName === 'gryffindor') {
                            house.gryffindor.roleID = role.id
                            name = house.gryffindor.name
                        } else if (houseName === 'hufflepuff') {
                            house.hufflepuff.roleID = role.id
                            name = house.hufflepuff.name
                        } else if (houseName === 'ravenclaw') {
                            house.ravenclaw.roleID = role.id
                            name = house.ravenclaw.name
                        } else if (houseName === 'slytherin') {
                            house.slytherin.roleID = role.id
                            name = house.slytherin.name
                        } else if (houseName === 'ministry') {
                            house.ministry.roleID = role.id
                            name = house.ministry.name
                        }
                        return interaction.reply({embeds: [embed => new MessageEmbed().setDescription(`Role has been updated for ${name}. New role is set to ${role.toString()}`).setColor(color)], ephemeral: true})
                    }
                }
            } else if (choice === 'removeHouseRole') {
                
            }
        }
    },
};
