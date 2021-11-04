exports.getSeconds = function(duration) {
    time = duration.slice(0, duration.length - 1)
    let index = duration.slice(duration.length - 1, duration.length)
    console.log(time, index)
    time_convert = { "s": 1000, "m": 60000, "h": 3600000, "d": 86400000 }
    newtime = Number(time) * time_convert[index]
    return newtime
};

exports.getColor = function(member) {
    const houses = ["694323794126569564", "694324508399632407", "694324672891977749", "694324237032226887"];
    const role = member.roles.cache.find(role => houses.includes(role.id));

    /*
    Hufflepuff: 694323794126569564
    Gryffindor: 694324508399632407
    Slytherin: 694324672891977749
    Ravenclaw: 694324237032226887 */

    switch (role.id) {
        case "694324508399632407":
            return "RED"
        case "694323794126569564":
            return "GOLD"
        case "694324237032226887":
            return "BLUE"
        case "694324672891977749":
            return "GREEN"
        default:
            return "PURPLE"
    };

};

exports.getState = function(bool) {
    if (bool === true) {
        return "<a:green:848971267050176513> \`Enabled\`"
    } else if (bool === false) {
        return "<a:red:848971266676883506> \`Disabled\`"
    } else if (!bool) {
        return "<a:yellow:848971267050307624> \`Malfuntioned\`"
    }
};