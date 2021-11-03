const guildSchema = require('../models/guildSchema');

module.exports = {
    name: "guildCreate",
    async execute(guild) {
        let isCreated = await guildSchema.findOne({ guildID: guild.id });
        if (!isCreated) {
            let profile = new guildSchema({
                guildID: guild.id
            });
            profile.save();
        }
    },
};