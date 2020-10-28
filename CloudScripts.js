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

function getServerData (key){
    return server.GetTitleInternalData({ "Keys": [new String(key)] });
};

function getServerDataAsObject (key){
    var getTitleData = server.GetTitleInternalData({ "Keys": [new String(key)] });
    
    var value = JSON.parse(getTitleData.Data[new String(key)]);
    
    return value;
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
    
    updatePlayerInternalData(randomPlayfabId, currentPlayerId, { gold : randomPlayerGold });
    
    return { result : {playerID : randomPlayfabId, fortMoney : randomPlayerGold, fortName : randomPlayerName, fort : randomPlayerFort[0]} };
};

handlers.stealMoneyFromPlayer = function (args, context){
    var randomPlayfabId;
    var userInternalData;
    var goldBeforeSteal;
    var maxStealGold;
    var gold;
    var userData;
    var userStats;
    
    if(args){
        if(args.playFabId && args.gold){
            randomPlayfabId = args.playFabId;
            gold = args.gold;
            
            userInternalData = server.GetUserInternalData({ Keys: [currentPlayerId], PlayFabId : randomPlayfabId });
            
            goldBeforeSteal = JSON.parse(userInternalData.Data[currentPlayerId].Value).gold;
            maxStealGold = Math.floor(0.25 * goldBeforeSteal);
            
            if(gold <= maxStealGold){
                userData = server.GetUserData({Keys: ["playerStats"], PlayFabId : randomPlayfabId});
                userStats = JSON.parse(userData.Data.playerStats.Value);
                
                if(userStats.coins >= gold){
                    userStats.coins -= gold;
                }
                else{
                    userStats.coins = 0;
                }
                
                userData = updatePlayerData(randomPlayfabId, "playerStats", userStats);
                
                var statsCoins = 0;
                statsCoins = userStats.coins;
                
                server.UpdatePlayerStatistics({PlayFabId : randomPlayfabId, Statistics: [{"StatisticName" : "gold", "Value" : statsCoins}]});
                
                updatePlayerInternalData(randomPlayfabId, currentPlayerId, null);
            }
        }
    }
    
    return {result : userData};
}

function updatePlayerData(playFabId, key, value){
    var playerData = {};
    playerData[new String(key)] = JSON.stringify(value);
    var result = server.UpdateUserData({PlayFabId : playFabId, Data : playerData});
    
    return result;
}

function updatePlayerInternalData(playFabId, key, value){
    var playerData = {};
    
    if(value == null){
        playerData[new String(key)] = null;
    }
    else{
        playerData[new String(key)] = JSON.stringify(value);
    }
    
    var updatePlayerInternalDataRequest = { PlayFabId : playFabId , Data : playerData };
    var result = server.UpdateUserInternalData(updatePlayerInternalDataRequest);
    
    return result;
}

handlers.getDailyChallenges = function (args, context){
    var dailyQuestsList = getServerDataAsObject("DailyQuests");
    
    var userDailyQuestsResult = server.GetUserReadOnlyData({PlayFabId : currentPlayerId, Keys : ["dailyChallenges"]});
    
    var userDailyQuests;
    
    var playerData;
    
    try{
        log.debug("after JSON");
        userDailyQuests = JSON.parse(userDailyQuestsResult.Data.dailyChallenges.Value);
        log.debug("before JSON");
        
        playerData = userDailyQuests;
        
        if(timeSpan(new Date(), new Date(JSON.parse(userDailyQuests.updateQuestDate))).hours >= 24){
            log.debug(">=24");
            userDailyQuests = getThreeQuests(dailyQuestsList);
            playerData = {"questList" : userDailyQuests, "updateQuestDate" : JSON.stringify(new Date())};
            updatePlayerReadOnlyData(currentPlayerId, "dailyChallenges", playerData);
        }
    }
    catch{
        log.debug("catch");
        
        userDailyQuests = getThreeQuests(dailyQuestsList);
        playerData = {"questList" : userDailyQuests, "updateQuestDate" : JSON.stringify(new Date())};
        updatePlayerReadOnlyData(currentPlayerId, "dailyChallenges", playerData);
    }
    
    return { result : playerData };
}

function getThreeQuests(dailyQuestsList){
    var threeQuests = [];
    var badNumbers = [];
    var randomNumber = getRandomInt(dailyQuestsList.length);
    
    do{
        threeQuests.push(dailyQuestsList[randomNumber]);
        badNumbers.push(randomNumber);
        randomNumber = getRandomIntWithoutNumbers(badNumbers, dailyQuestsList.length);
    }while(threeQuests.length < 3);
    
    return threeQuests;
}

function timeSpan(date0, date1){
    var mseconds = Math.abs(date0 - date1);
    var seconds = mseconds / 1000;
    var minutes = seconds / 60;
    var hours = minutes / 60;
    var days = hours / 24;
    
    return { mseconds : mseconds, seconds : seconds, minutes : minutes, hours : hours, days : days };
}

function updatePlayerReadOnlyData(playFabId, key, value){
    var playerData = {};
    
    if(value == null){
        playerData[new String(key)] = null;
    }
    else{
        playerData[new String(key)] = JSON.stringify(value);
    }
    
    var result = server.UpdateUserReadOnlyData({ PlayFabId : playFabId , Data : playerData });
    
    return result;
}
