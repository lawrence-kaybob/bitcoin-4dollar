/**
 * Created by lkaybob on 2017. 11. 22..
 */
module.exports = {
    greetings: "내 꿈은 1비트코인이 4달라가 되어 많은 사람들이 비트코인을 사는 것이라네.<br/>그 꿈을 이룰 수 있도록 내가 도와주겠네",
    selection: "내가 어떻게 도와주면 되겠나?",

    askDealRate : "어떤 시세를 알고 싶은가?",
    dealChoices : ['일반', '매수', '매도'],

    askShowRateCurrency: "어떤 화폐의 시세를 알고 싶은가?",
    choiceNotifyCurrency: ['비트코인', '비트코인 캐쉬', '이더리움', '이더리움 클래식', '리플'],

    returnQueryResult : "%d년 %d월 %d일 %d시 %d분의 %s의 %s시세 현황이라네<br/>",
    resultBidTemplate: "[%s] 최고 %s원 최저 %s원", // 거래소, 최저 매도/일반 시세, 최고 매도/일반 시세
    resultAskTemplate: "[%s] 최저 %s원 최고 %s원", // 거래소, 최고 매수 시세, 최저 매수 시세
    resultMarketTemplate: "[%s] %s원",

    askDuplicateNotification: "자네는 이미 알림해달라고 한게 있군. <br/>그러나 내 능력이 부족해서 지금은 1인 1알림 밖에 안 된다네<br/>지금 알림은 삭제할텐가?",
    choiceYN: ["네", "아니오"],

    returnToMainSelection: "그럼 처음으로 돌아가지",

    notifyCaution: "알림은 아직 1인당 1개 밖에 안 된다네<br/>그것만 명심해두게",

    askNotifyCurrency:"어떤 화폐의 알림을 받고 싶은가?",

    askNotifyDeal: "어떤 시세를 알림받고 싶은가?",
    choiceNotifyDeal: ["매수", "매도"],

    askNotifyThreshold: "얼마쯤 됐을 떄 알려줄까?",

    confirmNotifyRegistered: "알겠네. 때가 되면 알려주도록 하지",

    notificationFormat: "%s가 원하는 %s 시세 범위 안에 들어왔네! 지금이 기회일세!"
};