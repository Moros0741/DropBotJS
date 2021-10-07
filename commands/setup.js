const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed, Permissions } = require('discord.js')
const helper = require('../modules/helpers')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("setup-feed")
        .setDescription("Set Feed channel")
        .addChannelOption(option =>
            option.setName("channel")
            .setDescription("Mention the channel to send feed messages to")
            .setRequired(true)
        ),
    async execute(interaction, guildProfile) {
        if (!interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
            return interaction.reply({content: "This command requires \`ADMINISTRATOR\` permissions. Which you don't have.", ephemeral: true})
        } else {
            let channel = interaction.options.getChannel('channel')

            guildProfile.systems.drops.feedChannel = channel.id
            guildProfile.save();
            return interaction.reply({content: `Feed messages will now be sent to ${channel.toString()}`, ephemeral: true});
        }
    },
};
