const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js')
const helper = require('../modules/helpers')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('send-drop')
        .setDescription('Send a points drop.')
        .addStringOption(option =>
            option.setName('type')
            .setRequired(true)
            .addChoice('Trolley Witch', 'TW')
            .addChoice('Festive Drops', 'FD')
        )
        .addStringOption(option =>
            option.setName('time')
            .setDescription('Duration of the drop. (Ex: 1m, 1h, 1d)')
            .setRequired(false)
        ),
    async execute(interaction, guildProfile) {
        let duration;
        let time = interaction.options.getString('time')
        let channel;
        if (!time) {
            duration = 900000
        } else {
            duration = helper.getSeconds(time)
        }
        let choice = interaction.options.getString('type')
        if (choice === 'TW') {
            channel = await dropHelper.trolleyWitch(guildProfile, interaction, duration)
        } else if (choice === 'FD') {
            channel = await dropHelper.festiveDrop(guildProfile, interaction, duration)
        }
        return interaction.reply({contents: `Drop Message Sent in ${channel.toString()}!`, ephemeral: true})
    },
};