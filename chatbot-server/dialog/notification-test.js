/**
 * Created by lkaybob on 2017. 11. 22..
 */

module.exports = function (bot, redisClient) {

    bot.dialog('/notificationTest', function (session, result, skip) {
        session.send("User will be removed from database");

        redisClient.del(session.message.address.conversation.id, function(err, reply) {
           if(err)
               console.log('[Redis Package] Error performing deletion');
           else {
               redisClient.srem("broadcast", session.message.address.conversation.id, function(err, reply) {
                   if(err)
                       console.log('[Redis Package] Error performing subscriber deletion');
                   else{
                       session.userData = {};
                       session.endDialog();
                   }
               });
           }
        });


    });

};