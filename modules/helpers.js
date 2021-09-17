
exports.getSeconds = function (duration) {
    time = duration.splice(0, duration.length - 1)
    let index = duration.splice(duration.length - 1, duration.length)
    console.log(time, index)
    time_convert = {"s":1, "m":60, "h":3600,"d":86400}
    newtime= Number(time) * time_convert[index]
    return newtime
};

exports.getColor = function (){
    let pallet = ['#c75959', '#f68321', '#694809', '#748945', '#c1862c'];
    let color = pallet[Math.floor(Math.random() * pallet.length)];
    return color;
};