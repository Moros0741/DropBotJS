const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js')
const helper = require('../modules/helpers')
const dropHelper = require('../modules/dropHelper')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("send-drop")
        .setDescription("Send a points drop.")
        .addStringOption(option =>
            option.setName('time')
            .setDescription("Duration of the drop. (Ex: 1m, 1h, 1d)")
            .setRequired(true)
        )
        .addChannelOption(option =>
            option.setName('channel')
            .setDescription("Channel to send drop in")
            .setRequired(true)
        ),
    async execute(interaction, guildProfile) {
        let duration;
        let time = interaction.options.getString('time')
        let channel = interaction.options.getChannel('channel')
        
        if (!time) {
            duration = 900000
        
        } else {
            duration = helper.getSeconds(time)
        }

        try {

            await interaction.reply({content: "Sending drop...", ephemeral: true});
            
            await dropHelper.festiveDrop(guildProfile, channel, duration);
            
            return interaction.editReply({content: `Drop Message Sent in ${channel.toString()}!`, ephemeral: true});
        
        } catch (err) {
            console.log(err)
        }
    },
};