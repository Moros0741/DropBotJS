const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leave-guild')
        .setDescription("Tell the bot to leave a server (MOROS ONLY COMMAND)")
        .addStringOption(option =>
            option.setName('guild-id')
            .setDescription("ID of the guild to leave")
            .setRequired(true)
        ),
    async execute(interaction) {
        let accepted_ids = ["765324522676682803", "700057705951395921"]
        if (!accepted_ids.includes(interaction.user.id)) {
            return interaction.reply({content: "This is a developer command, for use in emergencies. Only \`Moros#0741\` or \`Rach#5242\` can use this command.", ephemeral: true});
        } else {
            let guildId = interaction.options.getString('guild-id')
            let guild = interaction.client.guilds.cache.find(guild => guild.id === guildId)
            await guild.leave()
            return interaction.reply({content: `I've left ${guild.name}`});
        }
    },
};