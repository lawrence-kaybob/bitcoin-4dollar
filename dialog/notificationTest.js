/**
 * Created by lkaybob on 2017. 11. 22..
 */

module.exports = function (bot, builder) {
    var savedAddress = [];

    function startNotification() {
        for (var i in savedAddress) {
            bot.beginDialog(savedAddress[i], '/notify');
        }
    }

    bot.dialog('/notificationTest', function (session, result, skip) {
        savedAddress.push(session.message.address);
        session.send("All recipients will get a notification");

        setTimeout(function () {
            startNotification()
        }, 2000);
        session.endDialog();
    });

    bot.dialog('/notify', function (session, result, skip) {
        session.send("This is a notification for everyone");
    })

};