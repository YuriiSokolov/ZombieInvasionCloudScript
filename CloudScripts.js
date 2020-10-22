handlers.helloWorld = function (args, context) {    
    var message = "Hello " + currentPlayerId + "!";

    log.info(message);
    var inputValue = null;
    if (args && args.inputValue){
        inputValue = args.inputValue;
        message += " " + inputValue;
    }
        
    log.debug("helloWorld:", { input: args.inputValue });

    return { result: message };
};

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function getRandomIntWithoutNumbers(numbers, max){
    var result = getRandomInt(max);
    
    var flag = 0;
    
    do{
        flag = 0;
        
        for(let i = 0; i < numbers.length; i++){
            if(result == numbers[i]){
                flag++;
                break;
            }
        }
        result = getRandomInt(max);
    }while(flag != 0);
    
    return result;
}

function sumArray(array){
    var sum = 0;
    
    for(let i = 0; i < array.length; i++){
        sum += array[i];
    }
    
    return sum;
}

handlers.getSpinThingID = function (args, context){
    var thingID = 0;
    
    var getTitleDataRequest ={ "Keys": ["rouletteData"] };
    
    var getTitleData = server.GetTitleInternalData(getTitleDataRequest);
    
    var json = JSON.parse(getTitleData.Data.rouletteData);
    
    var weights = json.weight;
    
    var weightSum = sumArray(weights);
    
    var randomValue = getRandomInt(weightSum);
    
    for(let i = 0; i < weights.length; i++){
        if(randomValue < weights[i]){
            thingID = i;
            return { result: thingID };
        }
        randomValue -= weights[i];
    }
    
    return { result: thingID };
};

handlers.getServerDataTest = function (args, context){
    var getTitleDataRequest ={ "Keys": ["jsonTest"] };
    
    var getTitleData = server.GetTitleInternalData(getTitleDataRequest);
    
    var json = JSON.parse(getTitleData.Data.jsonTest);
    
    var array = json.array;
    
    return { result: getTitleData };
};

function getPlayerData(playFabId, key){
    var getPlayerDataRequest = {"Keys": [key], "PlayFabId": playFabId}
    
    var playerData = server.GetUserData(getPlayerDataRequest);
    
    return playerData;
}

handlers.getPlayerForSabotage = function (args, context){
    var randomPlayfabId;
    var randomPlayerGold;
    var randomPlayerName;
    var randomPlayerFort;
    
    var getLeaderboardAroundPlayerRequest = { "MaxResultsCount" : 100, "StatisticName" : "gold", "PlayFabId" : currentPlayerId };
    
    var leaderBoardAroundPlayer = server.GetLeaderboard(getLeaderboardAroundPlayerRequest);
    
    var playerCount = leaderBoardAroundPlayer.Leaderboard.length;
    
    var randomPlayerIndex = getRandomInt(playerCount);
    
    var badPlayersIndexs = [];
    
    if(playerCount > 1){
        while(true){
            if(leaderBoardAroundPlayer.Leaderboard[randomPlayerIndex].PlayFabId != currentPlayerId){
                randomPlayfabId = leaderBoardAroundPlayer.Leaderboard[randomPlayerIndex].PlayFabId;
                break;
            }
            else{
                badPlayersIndexs.push(randomPlayerIndex);
                randomPlayerIndex = getRandomIntWithoutNumbers(badPlayersIndexs, playerCount);
            }
        }
    }
    else{
        return { result: null };
    }
    
    randomPlayerGold = JSON.parse(getPlayerData(randomPlayfabId, "playerStats").Data.playerStats.Value).coins;
    
    randomPlayerName = server.GetUserAccountInfo({ "PlayFabId" : randomPlayfabId }).UserInfo.TitleInfo.DisplayName;
    
    randomPlayerFort = JSON.parse(getPlayerData(randomPlayfabId, "forts").Data.forts.Value);
    
    return { result : {playerID : randomPlayfabId, fortMoney : randomPlayerGold, fortName : randomPlayerName, fort : randomPlayerFort[0] } };
};
