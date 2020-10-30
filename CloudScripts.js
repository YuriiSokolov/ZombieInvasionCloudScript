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
    var getPlayerDataRequest = {"Keys": [key], "PlayFabId": playFabId};
    
    var playerData = server.GetUserData(getPlayerDataRequest);
    
    return playerData;
}

function getPlayerDataAsObject(playFabId, key){
    var playerData = server.GetUserData({"Keys": [key], "PlayFabId": playFabId});
    
    var value = JSON.parse(playerData.Data[new String(key)].Value);
    
    return value;
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
    
    var questsProgress = [];
    
    try{
        userDailyQuests = JSON.parse(userDailyQuestsResult.Data.dailyChallenges.Value);
        
        playerData = userDailyQuests;
        questsProgress = getPlayerDataAsObject(currentPlayerId, "questsProgress");
        updatePlayerData(currentPlayerId, "questsProgress", questsProgress);
        
        if(timeSpan(new Date(), new Date(JSON.parse(userDailyQuests.updateQuestDate))).hours >= 24){
            log.debug(">=24");
            userDailyQuests = getThreeQuests(dailyQuestsList);
            questsProgress = initQuestsProgressModel(userDailyQuests);
            updatePlayerData(currentPlayerId, "questsProgress", questsProgress);
            playerData = {"questList" : userDailyQuests, "updateQuestDate" : JSON.stringify(new Date())};
            updatePlayerReadOnlyData(currentPlayerId, "dailyChallenges", playerData);
        }
    }
    catch{
        log.debug("catch");
        
        userDailyQuests = getThreeQuests(dailyQuestsList);
        questsProgress = initQuestsProgressModel(userDailyQuests);
        updatePlayerData(currentPlayerId, "questsProgress", questsProgress);
        playerData = {"questList" : userDailyQuests, "updateQuestDate" : JSON.stringify(new Date())};
        updatePlayerReadOnlyData(currentPlayerId, "dailyChallenges", playerData);
    }
    
    return { result : playerData };
}

handlers.getQuestReward = function (args, context){
    var userDailyQuestsResult = server.GetUserReadOnlyData({PlayFabId : currentPlayerId, Keys : ["dailyChallenges"]});
    var questList = JSON.parse(userDailyQuestsResult.Data.dailyChallenges.Value).questList;
    var questsProgress = getPlayerDataAsObject(currentPlayerId, "questsProgress");
    var playerData = getPlayerDataAsObject(currentPlayerId, "playerStats");
    
    if(args){
        for(let i = 0; i < questList.length; i++){
            if(questList[i].localizationenname == args.questName){
                if(questsProgress[i].isComplete == true){
                    playerData.coins += questList[i].addresourcegold;
                    questsProgress.splice(i, 1);
                    questList.splice(i, 1);
                    
                    questList = {"questList" : questList, "updateQuestDate" : JSON.parse(userDailyQuestsResult.Data.dailyChallenges.Value).updateQuestDate};
                    
                    updatePlayerData(currentPlayerId, "playerStats", playerData);
                    updatePlayerData(currentPlayerId, "questsProgress", questsProgress);
                    updatePlayerReadOnlyData(currentPlayerId, "dailyChallenges", questList);
                    
                    return {result : playerData};
                }   
            }
        }
    }
    
    return { result: questList[0].addresourcegold, player: playerData.coins, quest : questsProgress[0].questName };
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

function initQuestsProgressModel(userDailyQuests){
    var questsProgress = [];
    
    for(let i = 0; i < userDailyQuests.length; i++){
        questsProgress.push({questName : JSON.parse(JSON.stringify(userDailyQuests[i])).localizationenname, progress : 0, isComplete : false});
    }
    
    return questsProgress;
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

handlers.setArtefact = function (args, context){
    var playerData = getPlayerDataAsObject(currentPlayerId, "playerStats");
    
    if(args){
        if(args.value){
            log.debug(args.value);
            
            playerData.artifacts.push(JSON.parse(args.value));
            
            updatePlayerData(currentPlayerId, "playerStats", playerData);
        }
    }
    
    return {result : playerData.artifacts};
}

handlers.getArtefact = function (args, context){
    var playerData = getPlayerDataAsObject(currentPlayerId, "playerStats");
    
    if(args){
        if(args.artifactID){
            log.debug(args.artifactID);
            
            for(let i = 0; i < playerData.artifacts.length; i++){
                if(playerData.artifacts[i].id == args.artifactID){
                    playerData.artifacts.splice(i, 1);
                    updatePlayerData(currentPlayerId, "playerStats", playerData);
                    return {result : getPlayerData(currentPlayerId, "playerStats").Data["playerStats"].Value};
                }
            }
        }
    }
    
    return {result : "error"};
}

handlers.updateSave = function (args, context){
    if(args){
        var playerData = getPlayerDataAsObject(currentPlayerId, args.key);
        
        switch (args.key) {
            case 'playerStats':
                playerData.coins += args.gold;
                server.UpdatePlayerStatistics({PlayFabId : currentPlayerId, Statistics: [{"StatisticName" : "gold", "Value" : args.gold}]});
                break;
            case 'forts':
                break;
            default:
                return null;
        }
        
        updatePlayerData(currentPlayerId, args.key, playerData);
        
        return { result : getPlayerData(currentPlayerId, args.key).Data[args.key].Value, tag : args.key};
    }
}

handlers.buyUpgrade = function (args, context){
    var forts = getPlayerDataAsObject(currentPlayerId, "forts");
    var playerData = getPlayerDataAsObject(currentPlayerId, "playerStats");
    
    var building = forts[args.fortID].buildings[args.buildingID];
        
    var costs = getUpgradeCost(args.fortID, building.id, building.lvl);
    
    if(building.wear == 0){
        if((playerData.coins >= costs.upgradeCost) && (building.lvl + 1 <= 5)){
            building.lvl += 1;
            playerData.coins -= costs.upgradeCost;
        }
    }
    else{
        if(playerData.coins >= costs.repairCost){
            building.wear -= 1;
            playerData.coins -= costs.repairCost;
        }
    }

    updatePlayerData(currentPlayerId, "forts", forts);
    updatePlayerData(currentPlayerId, "playerStats", playerData);
    
    return {result : getPlayerData(currentPlayerId, "forts").Data["forts"].Value, tag : building.name};
}

function getUpgradeCost(fortID, buildingID, buildingLvl){
    var upgradeCosts = getServerDataAsObject("FortificationUpgrades");
    
    var upgradeCost;
    var repairCost;
    
    for(let i = 0; i < upgradeCosts.length; i++){
        if(upgradeCosts[i].chapter == fortID + 1){
            
            if(upgradeCosts[i].fortification == buildingID + 1){
                
                if(buildingLvl == 0){
                    if(upgradeCosts[i].upgrade == 1){
                        repairCost = upgradeCosts[i].payresourcegold / 2;
                    }
                }
                else{
                    if(upgradeCosts[i].upgrade == buildingLvl){
                        repairCost = upgradeCosts[i].payresourcegold / 2;
                    }
                    
                }
                
                if(upgradeCosts[i].upgrade == buildingLvl + 1){
                    upgradeCost = upgradeCosts[i].payresourcegold;
                    break;
                }
            }
        }
    }
    
    return {upgradeCost : upgradeCost, repairCost : repairCost};
}
    
