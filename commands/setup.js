const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed, Permissions } = require('discord.js')
const helper = require('../modules/helpers')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("setup")
        .setDescription("Set Feed channel")
        .addStringOption(option =>
            option.setName("choices")
            .setDescription("Which portion of a system would you like to set up?")
            .setRequired(true)
            .addChoice('Drop Feed', 'dropFeed')
            .addChoice('Bean Feed', "beanFeed")
            .addChoice('Bean Channel', 'beanChannel')
            .addChoice('Bean Toggle', "beanToggle")
        )
        .addChannelOption(option =>
            option.setName("channel")
            .setDescription("Mention the channel to send feed messages to")
            .setRequired(false)
        )
        .addBooleanOption(option =>
            option.setName("enable")
            .setDescription("Whether to turn bean command on or off")
            .setRequired(false)
        ),
    async execute(interaction, guildProfile) {
        if (!interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
            return interaction.reply({ content: "This command requires \`ADMINISTRATOR\` permissions. Which you don't have.", ephemeral: true })
        } else {
            let choice = interaction.options.getString('choices')
            let channel = interaction.options.getChannel('channel')
            let enabled = interaction.options.getBoolean('enable')
            let status = helper.getState(enabled)

            if (choice === "dropFeed") {

                guildProfile.systems.drops.feedChannel = channel.id
                guildProfile.save();
                return interaction.reply({ content: `Feed messages will now be sent to ${channel.toString()}`, ephemeral: true });

            } else if (choice === "beanFeed") {
                guildProfile.systems.bean.feedChannel = channel.id
                guildProfile.save();
                return interaction.reply({ content: `Feed message for \`!bean\` command will now be sent to ${channel.toString()}`, ephemeral: true });

            } else if (choice === "beanChannel") {
                guildProfile.systems.bean.channel = channel.id
                guildProfile.save();
                return interaction.reply({ content: `\`!bean\` command will now only work in ${channel.toString()}`, ephemeral: true });

            } else if (choice === "beanToggle") {
                guildProfile.systems.bean.isActive = enabled
                guildProfile.save();
                return interaction.reply({ content: `\`!bean\` command is now ${status}`, ephemeral: true });
            }
        }
    },
};