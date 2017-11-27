module.exports = function (builder, bot) {
    bot.dialog('/checkDuplicateNotification', function (session) {
        if(session.userData.notification) {
            // 만약 기존에 정보가 있으면 알림
            bot.replaceDialog('/notifyDuplicate');
        } else {
            // 없으면 바로 추가 실행
            bot.replaceDialog('/setNotification');
        }
    });

    bot.dialog('/setNotification', [function (session) {

    }])
}

session.userData.notification = {
    dealChoice: result.response.entity,
    currency: null,
    threshold: null
};