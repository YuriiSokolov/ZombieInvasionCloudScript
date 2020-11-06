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
    
    while(true){
        if(numbers.indexOf(result) === -1){
            break;
        }
        
        result = getRandomInt(max);
    }
    
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
    
    var userData = getPlayerDataAsObject(currentPlayerId, "playerStats");
    var getTitleData = getServerDataAsObject("rouletteData");
    
    if(!userData.serverNextSpinDate || timeSpan(new Date(), new Date(JSON.parse(userData.serverNextSpinDate))).hours >= 24){
        
        var weights = [];
    
        for(let i = 0; i < getTitleData.length; i++){
            weights.push(getTitleData[i].weight);
        }
    
        var weightSum = sumArray(weights);
    
        var randomValue = getRandomInt(weightSum);
    
        for(let i = 0; i < weights.length; i++){
            if(randomValue < weights[i]){
                thingID = i;
                userData.nextSpinDate = dateTODateTime();
                userData.serverNextSpinDate = JSON.stringify(new Date());
            
                if(getTitleData[i].id == "gold"){
                    log.debug("gold");
                    if(!args || !args.isX2Spin){
                        userData.coins += getTitleData[i].addresourcegold;
                        log.debug({ goldAdd : getTitleData[i].addresourcegold });
                    }
                    else{
                        userData.coins += 2 * getTitleData[i].addresourcegold;
                        log.debug({ goldAdd : (2 * getTitleData[i].addresourcegold) });
                    }
                    updatePlayerStatistics(currentPlayerId, "gold", userData.coins);
                }
                
                updatePlayerData(currentPlayerId, "playerStats", userData);
            
                return { result: thingID };
            }
            randomValue -= weights[i];
        }
    }
    
    return { result: -1 };
};

handlers.getSpinThings = function (args, context){
    return {result : JSON.stringify(getServerDataAsObject("rouletteData"))};
}

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

function getPlayerReadData(playFabId, key){
    return server.GetUserReadOnlyData({PlayFabId : playFabId, Keys : [key]});
}

function getPlayerReadDataAsObject(playFabId, key){
    return JSON.parse(getPlayerReadData(playFabId, key).Data[new String(key)].Value);
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
                
                setNews(currentPlayerId, randomPlayfabId, "steal", gold);
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

function updatePlayerStatistics(playFabId, key, value){
    server.UpdatePlayerStatistics({PlayFabId : playFabId, Statistics: [{"StatisticName" : new String(key), "Value" : JSON.stringify(value)}]});
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
    var randomNumber;
    
    do{
        randomNumber = getRandomInt(dailyQuestsList.length);
        
        if(badNumbers.indexOf(randomNumber) === -1){
            threeQuests.push(dailyQuestsList[randomNumber]);
            badNumbers.push(randomNumber);
        }
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
            playerData.stars.fortsStars = getFortsStars(forts) + 1;
            //server.UpdatePlayerStatistics({PlayFabId : currentPlayerId, Statistics: [{"StatisticName" : "fortStars", "Value" : playerData.stars.fortsStars}]});
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
    playerData.stars.fortsStars = getFortsStars(forts);
    server.UpdatePlayerStatistics({PlayFabId : currentPlayerId, Statistics: [{"StatisticName" : "fortStars", "Value" : playerData.stars.fortsStars}]});
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
                    if(upgradeCosts[i].upgrade === 1){
                        repairCost = upgradeCosts[i].payresourcegold / 2;
                    }
                }
                else{
                    if(upgradeCosts[i].upgrade === Number(buildingLvl)){
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

function getFortsStars(forts){
    var stars = 0;
    
    for(let i = 0; i < forts.length; i++){
        for(let j = 0; j < forts[i].buildings.length; j++){
            stars += forts[i].buildings[j].lvl;
        }
    }
    
    return stars;
}

function setNews(from, to, type, info){
    var fromName = server.GetUserAccountInfo({ "PlayFabId" : from }).UserInfo.TitleInfo.DisplayName;
    var news;
    var newsList = [];
    
    if(!fromName || fromName === ""){
        fromName = new String(from);
    }
    
    try{
        news = getPlayerReadDataAsObject(to, "news");
    }
    catch{
        news = {newsList : newsList};
    }
    
    var newsInfo = {"from": fromName, "id": new String(type), "info": new String(info), "date": dateTODateTime()};
        
    if(!news.newsList || news.newsList.length == 0){
        newsList.push(newsInfo);
        news.newsList = newsList;
    }
    else{
        news.newsList.unshift(newsInfo);
    }
    
    updatePlayerReadOnlyData(to, "news", news);
}

handlers.getNews = function(args, context){
    var news;
    try{
        news = getPlayerReadData(currentPlayerId, "news");
        
        return {result : news.Data["news"].Value};
    }
    catch{
        return {result : null};
    }
}

function dateTODateTime(){
    var date = new Date();
    var day = date.getDate();      
    var month = date.getMonth() + 1;    
    var year = date.getFullYear();  
    var hour = date.getHours();     
    var minute = date.getMinutes(); 
    var second = date.getSeconds(); 

    var time = day + "/" + month + "/" + year + " " + hour + ':' + minute + ':' + second; 
    
    return time;
}
    
handlers.getPlayerForInvasion = function (args, context){
    var randomPlayfabId;
    var randomPlayerFort;
    var randomPlayerName;
    var isProtected = false;
    
    var getLeaderboardAroundPlayerRequest = { "MaxResultsCount" : 100, "StatisticName" : "fortStars", "PlayFabId" : currentPlayerId };
    
    var leaderBoardAroundPlayer = server.GetLeaderboard(getLeaderboardAroundPlayerRequest);
    
    var playerCount = leaderBoardAroundPlayer.Leaderboard.length;
    
    var randomPlayerIndex = getRandomInt(playerCount);
    
    log.debug(randomPlayerIndex);
    
    var badPlayersIndexs = [];
    
    if(playerCount > 1){
        while(true){
            if(leaderBoardAroundPlayer.Leaderboard[randomPlayerIndex].PlayFabId != currentPlayerId){
                log.debug(leaderBoardAroundPlayer.Leaderboard[randomPlayerIndex].StatValue);
                randomPlayfabId = leaderBoardAroundPlayer.Leaderboard[randomPlayerIndex].PlayFabId;
                
                if(leaderBoardAroundPlayer.Leaderboard[randomPlayerIndex].StatValue > 0){
                    break;
                }
                else{
                    if(leaderBoardAroundPlayer.Leaderboard.length == badPlayersIndexs.length){
                        return {result : null};
                    }
                    else{
                        badPlayersIndexs.push(randomPlayerIndex);
                        randomPlayerIndex = getRandomIntWithoutNumbers(badPlayersIndexs, playerCount);  
                    }
                }
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
    
    randomPlayerName = server.GetUserAccountInfo({ "PlayFabId" : randomPlayfabId }).UserInfo.TitleInfo.DisplayName;
    
    randomPlayerFort = JSON.parse(getPlayerData(randomPlayfabId, "forts").Data.forts.Value);
    
    //updatePlayerInternalData(randomPlayfabId, currentPlayerId, { Invader : currentPlayerId });
    
    return { result : {playerID : randomPlayfabId, isProtected : isProtected, fortName : randomPlayerName, fort : randomPlayerFort[0]} };
};

handlers.damageBuilding = function (args, context){
    var currentID = currentPlayerId;
    var playerID = args.playerID;
    var playerFort = JSON.parse(getPlayerData(playerID, "forts").Data.forts.Value);
    
    if(playerFort[args.fortID].buildings[args.buildingID].wear < 3){
        playerFort[args.fortID].buildings[args.buildingID].wear += 1;
        
        if(playerFort[args.fortID].buildings[args.buildingID].wear == 3){
            playerFort[args.fortID].buildings[args.buildingID].wear = 0;
            
            if(playerFort[args.fortID].buildings[args.buildingID].lvl > 0){
                playerFort[args.fortID].buildings[args.buildingID].lvl -= 1;
                server.UpdatePlayerStatistics({PlayFabId : playerID, Statistics: [{"StatisticName" : "fortStars", "Value" : getFortsStars(playerFort)}]});
            }
        }
    }
    
    setInvader(currentID, playerID, args.stars);
    setNews(currentID, playerID, "invasion", playerFort[args.fortID].buildings[args.buildingID].name);
    
    updatePlayerData(playerID, "forts", playerFort);
}

function setInvader(from, playerID, stars){
    var invaders = [];
    var currentID = from;
    
    try{
        invaders = getPlayerReadDataAsObject(new String(playerID), "invaders");
        
        for(let i = 0; i < invaders.length; i++){
            if(invaders[i].id == currentID){
                log.debug("exists");
                break;
            }
            else{
                if(i === invaders.length - 1){
                    invaders.unshift({id : currentID, isFriend : false, stars : stars});
                }
            }
        }
    }
    catch{
        invaders.push({id : currentID, isFriend : false, stars : stars});
    }
    
    updatePlayerReadOnlyData(playerID, "invaders", invaders);
}
