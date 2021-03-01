function getServerData (key){
    return server.GetTitleInternalData({ "Keys": [new String(key)] });
};

function getServerDataAsObject (key, isArray = false){
    
    var getTitleData;
    
    var value;
    
    if(!isArray){
        getTitleData = server.GetTitleInternalData({ "Keys": [new String(key)] });
        value = JSON.parse(getTitleData.Data[new String(key)]);
    }
    else{
        getTitleData = server.GetTitleInternalData({ "Keys": key });
        value = getTitleData.Data;
    }
    
    return value;
};

function getPlayerData(playFabId, key){
    var getPlayerDataRequest = {"Keys": [key], "PlayFabId": playFabId};
    
    var playerData = server.GetUserData(getPlayerDataRequest);
    
    return playerData;
}

function getPlayerDataAsObject(playFabId, key, isArray = false){
    var playerData;
    
    if(!isArray){
        try{
            playerData = server.GetUserData({"Keys": [key], "PlayFabId": playFabId});
            var value = JSON.parse(playerData.Data[new String(key)].Value);
            return value;
        }
        catch{
            return null;
        }
    }
    else{
        try{
            playerData = server.GetUserData({"Keys": key, "PlayFabId": playFabId});
            var value = playerData.Data;
            return value;
        }
        catch{
            return null;
        }
    }
}

function mixingArray(array){
    for(let i = array.length - 1; i >= 0; i--){
        var j = getRandomInt(array.length);
        
        var tmp = array[j];
        array[j] = array[i];
        array[i] = tmp;
    }
    
    return array;
}

function arrayValuesSum(array){
    var value = 0;
    
    for(let i = 0; i < array.length; i++){
        value += array[i];
    }
    
    return value;
}

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

function getFacebookName(playerInfo){
    var name = null;
    
    if(playerInfo.UserInfo.FacebookInfo != null)
        name = new String(playerInfo.UserInfo.FacebookInfo.FullName);
    
    if(name != null){
        return name;
    }
    
    return null;
}

handlers.deletePlayerData = function (args, context){
    var currentID = currentPlayerId;
    handlers.getChaptersInfo();
    handlers.getFortsModel();
    handlers.getUserModel();
    
    updatePlayerReadOnlyData(currentID, "invaders", []);
    
    var news = {"newsList" : []};
    updatePlayerReadOnlyData(currentID, "news", news);
    
    var quests = {questList : [], updateQuestDate : null};
    updatePlayerReadOnlyData(currentID, "dailyChallenges", quests);
    
    handlers.getDailyChallenges();
    
    //energy
        
    handlers.getStartEnergy();
    
    return {result : "Done"};
}

//Energy

handlers.getStartEnergy = function (args, context){
    var energy = {};
    
    var energyModel = getServerDataAsObject("EnergySystem");
    
    var reloadTimer = energyModel.find(e => e.name == "addEnergyTimer").value;
    var energyCount = energyModel.find(e => e.name == "startEnergy").value;
    
    energy = {addEnergyTimer : reloadTimer, currentAddEnergyTimer : reloadTimer, currentEnergy : energyCount };
    
    updatePlayerData(currentPlayerId, "energy", energy);
    
    return {result : energy};
}

handlers.getEnergy = function (args, context){
    var currentID = currentPlayerId;
    
    var energySystem = getServerDataAsObject("EnergySystem");
    
    var maxEnergy = energySystem.find(e => e.name == "startEnergy").value;
    
    var addEnergyTimer = energySystem.find(e => e.name == "addEnergyTimer").value;
    
    var energy = getPlayerDataAsObject(currentID, "energy");
    
    log.debug(energy);
    
    if(energy){
        if(energy.currentEnergy < maxEnergy){
        
            var timeAfterFirstEnergyUse;
            
            if(energy.lastEnergyUseDate != null){
                timeAfterFirstEnergyUse = timeSpan(new Date(), new Date(JSON.parse(energy.lastEnergyUseDate))).seconds;
            }
            else{
                timeAfterFirstEnergyUse = maxEnergy * addEnergyTimer;
            }
        
            log.debug("addEnergyTimer " + addEnergyTimer);
            
            if(timeAfterFirstEnergyUse >= addEnergyTimer){
                energy.currentEnergy += Math.floor(timeAfterFirstEnergyUse / addEnergyTimer);
        
                if(energy.currentEnergy >= maxEnergy){
                    energy.currentEnergy = maxEnergy;
                    energy.currentAddEnergyTimer = addEnergyTimer;
                    energy.lastEnergyUseDate = null;
                }
                else{
                    energy.lastEnergyUseDate = JSON.stringify(new Date());
                    energy.currentAddEnergyTimer = addEnergyTimer * (1 - ((timeAfterFirstEnergyUse / addEnergyTimer) % 1));
                }
            }
            else{
                energy.currentAddEnergyTimer = addEnergyTimer * (1 - ((timeAfterFirstEnergyUse / addEnergyTimer) % 1));
            }
        
            energy.addEnergyTimer = addEnergyTimer;
        }
    }
    else{
        energy = {addEnergyTimer : addEnergyTimer, currentAddEnergyTimer : addEnergyTimer, currentEnergy : maxEnergy };
    }
    
    log.debug(energy)
    
    updatePlayerData(currentID, "energy", energy);
    
    return {result : energy};
}

handlers.minusEnergy = function (args, context){
    var currentID = currentPlayerId;
    
    var energy = getPlayerDataAsObject(currentID, "energy");
    
    var energySystem = getServerDataAsObject("EnergySystem");
    
    var maxEnergy = energySystem.find(e => e.name == "startEnergy").value;
    
    var addEnergyTimer = energySystem.find(e => e.name == "addEnergyTimer").value;
    
    var timeAfterFirstEnergyUse;
    
    if(args.energyMode && energy.currentEnergy >= args.energyMode){
        energy.currentEnergy -= args.energyMode;
            
        if(energy.lastEnergyUseDate == null && energy.currentEnergy < maxEnergy){
            energy.lastEnergyUseDate = JSON.stringify(new Date());
            
            timeAfterFirstEnergyUse = timeSpan(new Date(), new Date(JSON.parse(energy.lastEnergyUseDate))).seconds;
        
            energy.currentAddEnergyTimer = addEnergyTimer * (1 - ((timeAfterFirstEnergyUse / addEnergyTimer) % 1));
        }
        
        energy.addEnergyTimer = addEnergyTimer;
        
        updatePlayerData(currentID, "energy", energy);
       
        return {result : energy, outValue : true};
    }
    else{
        timeAfterFirstEnergyUse = timeSpan(new Date(), new Date(JSON.parse(energy.lastEnergyUseDate))).seconds;
        
        energy.currentAddEnergyTimer = addEnergyTimer * (1 - ((timeAfterFirstEnergyUse / addEnergyTimer) % 1));
        energy.addEnergyTimer = addEnergyTimer;
        
        updatePlayerData(currentID, "energy", energy);
        
        return {result : energy, outValue : false};
    }
}

handlers.addEnergy = function (args, context){
    var currentID = currentPlayerId;
    
    var energy = getPlayerDataAsObject(currentID, "energy");
    
    var energySystem = getServerDataAsObject("EnergySystem");
    
    var maxEnergy = energySystem.find(e => e.name == "startEnergy").value;
    
    var addEnergyTimer = energySystem.find(e => e.name == "addEnergyTimer").value;
    
    if(args){
        if(args.energyCount){
            energy.currentEnergy += args.energyCount;
            
            if(energy.currentEnergy >= maxEnergy){
                energy.currentAddEnergyTimer = addEnergyTimer;
                energy.lastEnergyUseDate = null;
            }
            
            updatePlayerData(currentID, "energy", energy);
            
            return {result : energy};
        }
    }
    else{
        if(energy.lastEnergyUseDate != null && energy.currentEnergy < maxEnergy){
            var timeAfterFirstEnergyUse = timeSpan(new Date(), new Date(JSON.parse(energy.lastEnergyUseDate))).seconds;
            log.debug("seconds " + timeAfterFirstEnergyUse);
        
            if(timeAfterFirstEnergyUse >= energy.addEnergyTimer && energy.currentEnergy < maxEnergy){
                energy.currentEnergy += Math.floor(timeAfterFirstEnergyUse / addEnergyTimer);
                log.debug(Math.floor(timeAfterFirstEnergyUse / energy.addEnergyTimer));
            
                if(energy.currentEnergy >= maxEnergy){
                    energy.currentEnergy = maxEnergy;
                    energy.currentAddEnergyTimer = addEnergyTimer;
                    energy.lastEnergyUseDate = null;
                }
                else{
                    energy.lastEnergyUseDate = JSON.stringify(new Date());
                    timeAfterFirstEnergyUse = timeSpan(new Date(), new Date(JSON.parse(energy.lastEnergyUseDate))).seconds;
                    
                    energy.currentAddEnergyTimer = addEnergyTimer * (1 - ((timeAfterFirstEnergyUse / addEnergyTimer) % 1));
                }
                
                log.debug("Add Energy.");
            }
            else{
                energy.currentAddEnergyTimer = addEnergyTimer * (1 - ((timeAfterFirstEnergyUse / addEnergyTimer) % 1));
                
                log.debug("Can't add energy.");
            }
            
            energy.addEnergyTimer = addEnergyTimer;
            updatePlayerData(currentID, "energy", energy);
            return {result : energy};
        }
        else{
            return {result : energy};
        }
    }
}

//===============================================
handlers.getUserModel = function (args, context){
    var currentID = currentPlayerId;
    var startPlayerData = getServerDataAsObject("playerStartResources");
    var artifacts = [];
    var stars = {fortsStars : 0, missionsStars : 0};
    
    var playerStats = { coins : startPlayerData.find(e => e.resource == "gold").value, energy : startPlayerData.find(e => e.resource == "energy").value, artifacts : artifacts, stars : stars };
    
    updatePlayerData(currentID, "playerStats", playerStats);
    
    return {result: playerStats};
}

handlers.getFortsModel = function (args, context){
    var currentID = currentPlayerId;
    
    var fortsModel = getServerDataAsObject("FortsModel");
    var buildings = getServerDataAsObject("FortBuildings");
    
    var forts = [];
    
    var index = 0;
    
    for(let i = 0; i < fortsModel.length; i++){
        forts.push({fortID : fortsModel[i].fortid, fortName : fortsModel[i].fortname, isCompleteFort : fortsModel[i].iscompletefort});
        forts[i].buildings = [];
        for(let j = 0; j < buildings.length / 3; j++){
            forts[i].buildings.push(buildings[j + index]);
        }
        index += buildings.length / 3;
    }
    
    updatePlayerData(currentID, "forts", forts);
    server.UpdatePlayerStatistics({PlayFabId : currentID, Statistics: [{"StatisticName" : "fortStars", "Value" : 0}]});
    
    try{
        var playerStats = getPlayerDataAsObject(currentID, "playerStats");
    
        playerStats.stars.fortsStars = 0;
    
        updatePlayerData(currentID, "playerStats", playerStats);
    }
    catch{
        log.debug("playerStats don't found");
    }
    
    return {result : forts};
}

handlers.getSpinThingID = function (args, context){
    var currentID = currentPlayerId;
    var thingID = 0;
    
    var userData = getPlayerDataAsObject(currentID, "playerStats");
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
                    updatePlayerStatistics(currentID, "gold", userData.coins);
                }
                else if(getTitleData[i].id == "energy"){
                    //var energy = getPlayerDataAsObject(currentID, "energy");
                    
                    if(!args || !args.isX2Spin){
                        //energy.currentEnergy += getTitleData[i].addresourceenergy;
                        handlers.addEnergy({energyCount : getTitleData[i].addresourceenergy});
                        log.debug({addEnergy : getTitleData[i].addresourceenergy});
                    }
                    else{
                        //energy.currentEnergy += 2 * getTitleData[i].addresourceenergy;
                        handlers.addEnergy({energyCount : 2 * getTitleData[i].addresourceenergy});
                        log.debug({addEnergy :(2 * getTitleData[i].addresourceenergy)});
                    }
                    
                    //updatePlayerData(currentID, "energy", energy);
                }
                
                updatePlayerData(currentID, "playerStats", userData);
            
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

function getPlayerReadData(playFabId, key){
    return server.GetUserReadOnlyData({PlayFabId : playFabId, Keys : [key]});
}

function getPlayerReadDataAsObject(playFabId, key){
    return JSON.parse(getPlayerReadData(playFabId, key).Data[new String(key)].Value);
}

handlers.getPlayerForSabotage = function (args, context){
    var currentID = currentPlayerId;
    
    var randomPlayer;
    var randomPlayfabId;
    var randomPlayerGold;
    var randomPlayerInfo;
    var randomPlayerName;
    var randomPlayerFort;
    var randomPlayerStats;
    
    var gameParams = getServerDataAsObject("ServerParams");
    var sabotageValues = JSON.parse(gameParams.find(e => e.name == "sabotageValues").value);
    
    sabotageValues = mixingArray(sabotageValues);
    sabotageValues.splice(3, 2);
    
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
    
    randomPlayer = getPlayerDataAsObject(randomPlayfabId, new Array("playerStats", "forts"), true);

    randomPlayerStats = JSON.parse(randomPlayer["playerStats"].Value);

    var stealValue = Math.floor(randomPlayerStats.coins * arrayValuesSum(sabotageValues));
    
    randomPlayerGold = randomPlayerStats.coins;
    
    randomPlayerInfo = server.GetUserAccountInfo({ "PlayFabId" : randomPlayfabId });
    
    randomPlayerName = getFacebookName(randomPlayerInfo) ? getFacebookName(randomPlayerInfo) : "Anonimus";
    
    randomPlayerFort = JSON.parse(randomPlayer["forts"].Value);
    
    var currentFortID = getCurrentFortID(randomPlayerFort);
    
    updatePlayerInternalData(currentID, randomPlayfabId, { gold : stealValue });

    //Steal money from player
    randomPlayerStats.coins -= stealValue;
    updatePlayerData(randomPlayfabId, "playerStats", randomPlayerStats);
    setNews(currentID, randomPlayfabId, "steal", stealValue);
    //=======================
    
    return { result : {playerID : randomPlayfabId, fortMoney : randomPlayerGold, fortName : randomPlayerName, fort : randomPlayerFort[currentFortID], sabotageValues : sabotageValues} };
};

handlers.stealMoneyFromPlayer = function (args, context){
    var currentID = currentPlayerId;
    
    var randomPlayfabId;
    var gold;
    
    var userInternalData;
    var playerStats = getPlayerDataAsObject(currentID, "playerStats");
    
    var canStealGoldValue;
    
    if(args){
        if(args.playFabId && args.gold){
            randomPlayfabId = args.playFabId;
            gold = args.gold;
            
            userInternalData = server.GetUserInternalData({ Keys: [randomPlayfabId], PlayFabId : currentPlayerId });
            
            canStealGoldValue = JSON.parse(userInternalData.Data[randomPlayfabId].Value).gold;
            
            if(gold <= canStealGoldValue){
                playerStats.coins += gold;
                updatePlayerData(currentID, "playerStats", playerStats);
            }
            else{
                log.debug("Cheater!!!");
            }
            
            updatePlayerInternalData(currentID, randomPlayfabId, null);
        }
    }
    
    return {result : playerStats};
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

function isQuestDataAndProgressSync(quests, progress){
    var foundQuestValue = 0;
    var questsList = quests.questList;
    
    for(let i = 0; i < questsList.length; i++){
        for(let j = 0; j < progress.length; j++){
            
            if(questsList[i].localizationenname == progress[j].questName){
                foundQuestValue++;
                break;
            }
        }
    }
    
    if(foundQuestValue != questsList.length){
        return false;
    }
    
    return true;
}

handlers.getDailyChallenges = function (args, context){
    var currentID = currentPlayerId;
    
    var dailyQuestsList = getServerDataAsObject("DailyQuests");
    
    var userDailyQuestsResult = server.GetUserReadOnlyData({PlayFabId : currentID, Keys : ["dailyChallenges"]});
    
    var userDailyQuests;
    
    var playerData;
    
    var questsProgress = [];
    
    try{
        userDailyQuests = JSON.parse(userDailyQuestsResult.Data.dailyChallenges.Value);
        
        playerData = userDailyQuests;
        questsProgress = getPlayerDataAsObject(currentID, "questsProgress");
        
        if(timeSpan(new Date(), new Date(JSON.parse(userDailyQuests.updateQuestDate))).hours >= 24 || !isQuestDataAndProgressSync(userDailyQuests, questsProgress)){
            log.debug(">=24");
            userDailyQuests = getThreeQuests(dailyQuestsList);
            questsProgress = initQuestsProgressModel(userDailyQuests);
            updatePlayerData(currentID, "questsProgress", questsProgress);
            playerData = {"questList" : userDailyQuests, "updateQuestDate" : JSON.stringify(new Date())};
            updatePlayerReadOnlyData(currentID, "dailyChallenges", playerData);
        }
    }
    catch{
        log.debug("catch");
        
        userDailyQuests = getThreeQuests(dailyQuestsList);
        questsProgress = initQuestsProgressModel(userDailyQuests);
        updatePlayerData(currentID, "questsProgress", questsProgress);
        playerData = {"questList" : userDailyQuests, "updateQuestDate" : JSON.stringify(new Date())};
        updatePlayerReadOnlyData(currentID, "dailyChallenges", playerData);
    }
    
    return { result : playerData };
}

handlers.getQuestReward = function (args, context){
    var currentID = currentPlayerId;
    var userDailyQuestsResult = server.GetUserReadOnlyData({PlayFabId : currentID, Keys : ["dailyChallenges"]});
    var questList = JSON.parse(userDailyQuestsResult.Data.dailyChallenges.Value).questList;
    var questsProgress = getPlayerDataAsObject(currentID, "questsProgress");
    var playerData = getPlayerDataAsObject(currentID, "playerStats");
    
    if(args){
        for(let i = 0; i < questList.length; i++){
            if(questList[i].localizationenname == args.questName){
                if(questsProgress[i].isComplete == true){
                    playerData.coins += questList[i].addresourcegold;
                    questsProgress.splice(i, 1);
                    questList.splice(i, 1);
                    
                    questList = {"questList" : questList, "updateQuestDate" : JSON.parse(userDailyQuestsResult.Data.dailyChallenges.Value).updateQuestDate};
                    
                    updatePlayerData(currentID, "playerStats", playerData);
                    updatePlayerData(currentID, "questsProgress", questsProgress);
                    updatePlayerReadOnlyData(currentID, "dailyChallenges", questList);
                    
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
    var currentID = currentPlayerId;
    var playerData = getPlayerDataAsObject(currentID, "playerStats");
    
    if(args){
        if(args.value){
            log.debug(args.value);
            
            playerData.artifacts.push(JSON.parse(args.value));
            
            updatePlayerData(currentID, "playerStats", playerData);
        }
    }
    
    return {result : playerData.artifacts};
}

handlers.getArtefact = function (args, context){
    var currentID = args.currentID ? args.currentID : currentPlayerId;
    var playerData = args.playerData ? args.playerData : getPlayerDataAsObject(currentID, "playerStats");
    
    if(args){
        if(args.artifactID){
            log.debug(args.artifactID);
            
            for(let i = 0; i < playerData.artifacts.length; i++){
                if(playerData.artifacts[i].id == args.artifactID){
                    playerData.artifacts.splice(i, 1);
                    updatePlayerData(currentID, "playerStats", playerData);
                    return {result : getPlayerData(currentID, "playerStats").Data["playerStats"].Value};
                }
            }
        }
    }
    
    return {result : "error"};
}

handlers.updateSave = function (args, context){
    if(args){
        var currentID = currentPlayerId;
        var playerData = getPlayerDataAsObject(currentID, args.key);
        
        switch (args.key) {
            case 'playerStats':
                playerData.coins += args.gold;
                server.UpdatePlayerStatistics({PlayFabId : currentID, Statistics: [{"StatisticName" : "gold", "Value" : args.gold}]});
                break;
            case 'forts':
                break;
            default:
                return null;
        }
        
        updatePlayerData(currentPlayerId, args.key, playerData);
        
        return { result : JSON.stringify(playerData), tag : args.key};
    }
}

handlers.buyUpgrade = function (args, context){
    var maxStarsInChapter = 25;
    var currentID = currentPlayerId;
    var forts = getPlayerDataAsObject(currentID, "forts");
    var playerData = getPlayerDataAsObject(currentID, "playerStats");
    
    var building = forts[args.fortID].buildings[args.buildingID];
        
    var costs = getUpgradeCost(args.fortID, building.id, building.lvl);
    
    if(building.wear == 0){
        if((playerData.coins >= costs.upgradeCost) && (building.lvl + 1 <= 5)){
            building.lvl += 1;
            playerData.stars.fortsStars = getFortsStars(forts);
            server.UpdatePlayerStatistics({PlayFabId : currentID, Statistics: [{"StatisticName" : "fortStars", "Value" : playerData.stars.fortsStars}]});
            playerData.coins -= costs.upgradeCost;
        }
    }
    else{
        if(playerData.coins >= costs.repairCost){
            building.wear -= 1;
            playerData.coins -= costs.repairCost;
        }
    }

    playerData.stars.fortsStars = getFortsStars(forts);
    updatePlayerData(currentID, "playerStats", playerData);

    if(playerData.stars.fortsStars == maxStarsInChapter || playerData.stars.fortsStars == 2 * maxStarsInChapter){ //Open new chapter.
        forts[args.fortID].isCompleteFort = true;
        log.debug(forts[args.fortID].isCompleteFort);
        var chapters = openNewChapter((playerData.stars.fortsStars % (maxStarsInChapter - 1)));
        log.debug(chapters);
        
        updatePlayerData(currentID, "forts", forts);
        
        return {result : getPlayerData(currentID, "forts").Data["forts"].Value, tag : building.name, outValue : chapters};
    }
    
    updatePlayerData(currentID, "forts", forts);
    
    return {result : getPlayerData(currentID, "forts").Data["forts"].Value, tag : building.name};
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

function getCurrentFortID(forts){
    for(let i = 0; i < forts.length; i++){
        if(!forts[i].isCompleteFort){
            return forts[i].fortID;
        }
    }
}
    
handlers.getPlayerForInvasion = function (args, context){
    var maxStarsInChapter = 25;
    var randomPlayfabId;
    var randomPlayerFort;
    var currentFort = 0;
    var randomPlayerInfo;
    var randomPlayerName;
    var isProtected = false;
    
    var getLeaderboardAroundPlayerRequest = { "MaxResultsCount" : 100, "StatisticName" : "fortStars", "PlayFabId" : currentPlayerId };
    
    var leaderBoardAroundPlayer = server.GetLeaderboard(getLeaderboardAroundPlayerRequest);
    
    var playerCount = leaderBoardAroundPlayer.Leaderboard.length;
    
    var randomPlayerIndex = getRandomInt(playerCount);
    
    var badPlayersIndexs = [];
    
    if(playerCount > 1){
        for(let i = 0; i < playerCount; i++){
            if(leaderBoardAroundPlayer.Leaderboard[randomPlayerIndex].PlayFabId != currentPlayerId){
                randomPlayfabId = leaderBoardAroundPlayer.Leaderboard[randomPlayerIndex].PlayFabId;
                
                if(leaderBoardAroundPlayer.Leaderboard[randomPlayerIndex].StatValue > 0 && (leaderBoardAroundPlayer.Leaderboard[randomPlayerIndex].StatValue != maxStarsInChapter 
                && leaderBoardAroundPlayer.Leaderboard[randomPlayerIndex].StatValue != (2 * maxStarsInChapter))){
                    break;
                }
                else{
                    if(leaderBoardAroundPlayer.Leaderboard.length == badPlayersIndexs.length){
                        return {result : null};
                    }
                    else if (i != playerCount - 1){
                        badPlayersIndexs.push(randomPlayerIndex);
                        randomPlayerIndex = getRandomIntWithoutNumbers(badPlayersIndexs, playerCount);  
                    }
                    else{
                        log.debug("not found");
                        return {result : null};
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
    
    randomPlayerInfo = server.GetUserAccountInfo({ "PlayFabId" : randomPlayfabId });
    
    randomPlayerName = getFacebookName(randomPlayerInfo) ? getFacebookName(randomPlayerInfo) : "Anonimus";
    
    var protectionResult = handlers.getProtection({currentID : randomPlayfabId});
    
    randomPlayerFort = protectionResult.result;
    
    isProtected = protectionResult.outValue;
    
    currentFort = getCurrentFortID(randomPlayerFort);
    
    return { result : {playerID : randomPlayfabId, isProtected : isProtected, fortName : randomPlayerName, fort : randomPlayerFort[currentFort]}, outValue : JSON.stringify(getInvaders(currentPlayerId)) };
};

handlers.getPlayerForRevenge = function (args, context){
    var currentID = currentPlayerId;
    var playerID = args.playerID;
    var playerFort = getPlayerDataAsObject(playerID, "forts");
    var currentFort = 0;
    var playerName;
    var isProtected = false;
    var invaders = [];
    var stars = getFortsStars(playerFort);
    var randomPlayerInfo;
    
    log.debug("stars: " + stars);
    
    log.debug("playerID: " + playerID);
    
    try{
        invaders = getPlayerReadDataAsObject(currentID, "invaders");
    }
    catch{
        log.debug("can't load invaders");
    }
    
    //playerFort = getPlayerDataAsObject(playerID, "forts");
    randomPlayerInfo = server.GetUserAccountInfo({ "PlayFabId" : playerID });
    
    playerName = getFacebookName(randomPlayerInfo) ? getFacebookName(randomPlayerInfo) : "Anonimus";
    
    for(let i = invaders.length - 1; i >= 0; i--){
        log.debug("id: " + invaders[i].id);
        if(invaders[i].id == playerID){
            invaders.splice(i, 1);
            break;
        }
    }
    
    if(stars != 25 && stars != 50){
        var protectionResult = handlers.getProtection({currentID : playerID, forts : playerFort});
    
        playerFort = protectionResult.result;
    
        isProtected = protectionResult.outValue;
    }
    else{
        log.debug("Full fort");
        isProtected = true;
    }
    
    updatePlayerReadOnlyData(currentID, "invaders", invaders);
    
    currentFort = getCurrentFortID(playerFort);
    
    return {result : {playerID : playerID, isProtected : isProtected, fortName: playerName, fort : playerFort[currentFort]}, outValue : JSON.stringify(invaders) };
}

handlers.damageBuilding = function (args, context){
    var currentID = currentPlayerId;
    
    var userData = getPlayerDataAsObject(currentID, "playerStats");
    var reward = getServerDataAsObject("gameParams").find(e => e.name == "invasionReward").value;
    
    if(args.playerID){
        var playerID = args.playerID;
        var playerFort = JSON.parse(getPlayerData(playerID, "forts").Data.forts.Value);
    
        log.debug("reward: " + reward);
    
        if(playerFort[args.fortID].buildings[args.buildingID].wear < 3){
            playerFort[args.fortID].buildings[args.buildingID].wear += args.multiplier;
        
            if(playerFort[args.fortID].buildings[args.buildingID].wear >= 3){
                playerFort[args.fortID].buildings[args.buildingID].wear = 0;
            
                if(playerFort[args.fortID].buildings[args.buildingID].lvl > 0){
                    playerFort[args.fortID].buildings[args.buildingID].lvl = 0;
                    server.UpdatePlayerStatistics({PlayFabId : playerID, Statistics: [{"StatisticName" : "fortStars", "Value" : getFortsStars(playerFort)}]});
                }
            }
        }
    
        setNews(currentID, playerID, "invasion", playerFort[args.fortID].buildings[args.buildingID].name);
    
        updatePlayerData(playerID, "forts", playerFort);
    
        setInvader(currentID, playerID, args.stars);
    }
    
    userData.coins += reward * args.multiplier;
    updatePlayerData(currentID, "playerStats", userData);
    
    return {result : JSON.stringify(userData)};
}

function getInvaders(playerID){
    var invaders = [];
    
    try{
        invaders = getPlayerReadDataAsObject(new String(playerID), "invaders");
    }
    catch{
        
    }
    
    return invaders;
}

function setInvader(from, playerID, stars){
    var invaders = [];
    var currentID = from;
    var fromName = server.GetUserAccountInfo({ "PlayFabId" : currentID }).UserInfo.TitleInfo.DisplayName;
    
    try{
        invaders = getPlayerReadDataAsObject(new String(playerID), "invaders");
        
        invaders.unshift({id : currentID, playerName : fromName, isFriend : false, stars : stars});
    }
    catch{
        invaders.push({id : currentID, fromName : fromName, isFriend : false, stars : stars});
    }
    
    updatePlayerReadOnlyData(playerID, "invaders", invaders);
}

handlers.getProtection = function(args, context){
    var isProtected = false;
    var currentID; 
    
    if(args && args.currentID){
        currentID = args.currentID;
    }
    else{
        currentID = currentPlayerId;
    }
    
    var forts = getPlayerDataAsObject(currentID, "forts");
    
    if(args.forts){
        forts = args.forts;
    }
    else{
        forts = getPlayerDataAsObject(currentID, "forts");
    }
    
    var playerData = getPlayerDataAsObject(currentID, "playerStats");
    
    if(handlers.getArtefact({"currentID" : currentID, "playerData" : playerData, "artifactID" : "shield"}).result != "error"){
        for(let i = 0; i < forts.length; i++){
            forts[i].protectionStartDate = dateTODateTime();
            forts[i].serverProtectionStartDate = JSON.stringify(new Date());
        }
        isProtected = true;
        updatePlayerData(currentID, "forts", forts);
    }
    else{
        log.debug("shield artifact not exists");
    }
    
    return {result : forts, outValue : isProtected};
}

handlers.getChaptersInfo = function(args, context){
    var chapters = getServerDataAsObject("Chapters");
    
    updatePlayerData(currentPlayerId, "chapters", {chapters : chapters, currentChapter : chapters[0]});
    
    return {result : chapters, outValue : chapters[0].id};
}

function openNewChapter(chapterID){
    var currentID = currentPlayerId;
    var chapters = getPlayerDataAsObject(currentID, "chapters");
    chapters.currentChapter = chapters.chapters[new Number(chapterID)];
    
    log.debug(chapters.currentChapter);
    
    updatePlayerData(currentID, "chapters", chapters);
    
    return chapters;
}

handlers.openNewChapter = function(args, context){
    var currentID = currentPlayerId;
    var chapters = getPlayerDataAsObject(currentID, "chapters");
    
    chapters.currentChapter = chapters.chapters[new Number(args.chapterID)];
    
    log.debug(chapters.currentChapter);
    
    updatePlayerData(currentID, "chapters", chapters);
    
    return chapters;
}

handlers.getEnemiesData = function(args, context){
    return {result : getServerDataAsObject("Zombies"), outValue : getServerDataAsObject("ZombiesInChapters")};
}

handlers.getGameProperties = function(args, context){
    var serverData = getServerDataAsObject(["gameParams", "GiftsTypes", "Store"], true);
    
    return {result : {  upgradesList : createUpgradesList(), 
                        gameParams : JSON.parse(serverData["gameParams"]), 
                        giftsTypes : JSON.parse(serverData["GiftsTypes"]), 
                        storeData : JSON.parse(serverData["Store"])
                     }
            };
}

function createUpgradesList(){
    var upgradesList = [];
    
    var fortification = getServerDataAsObject("Fortification");
    var fortificationBonuses = getServerDataAsObject("FortificationBonuses");
    var fortificationUpgrades = getServerDataAsObject("FortificationUpgrades");
    var chapters = getServerDataAsObject("Chapters");
    
    for(let i = 0; i < fortificationUpgrades.length; i = i + 5){
        var buildingID = fortificationUpgrades[i].fortification - 1;
        var upgradeName = fortification[buildingID].upgrade;
        var multiplier = fortificationBonuses.find(e => e.upgrade == upgradeName).bonus;
        var chapterID = chapters.find(c => c.order == (fortificationUpgrades[i].chapter - 1)).id;
        
        upgradesList.push({ upgradeName : upgradeName, multiplier : multiplier, chapterID : chapterID, buildingID : buildingID });
    }
    
    return upgradesList;
}

//==========[Gifts]=========================
function createGift(from, to, gift){
    var friendGiftsData = [];
    var yourInfo = server.GetUserAccountInfo({ "PlayFabId" : from });
    
    try{
        friendGiftsData = getPlayerReadDataAsObject(to, "Gifts");
        
        if(friendGiftsData.length > 0){
            gift.id = friendGiftsData[friendGiftsData.length - 1].id + 1;
        }
        else{
            gift.id = 0;
        }
    }
    catch{
        log.debug("Gifts not found");
        friendGiftsData = [];
        gift.id = 0;
    }
    finally{
        gift.from = getFacebookName(yourInfo) ? getFacebookName(yourInfo) : "Anonimus";
        friendGiftsData.push(gift);
    }
    
    updatePlayerReadOnlyData(to, "Gifts", friendGiftsData);
}

handlers.sendGift = function(args, context){
    var currentID = currentPlayerId;
    var friendID;
    var gift = {};
    var playerData = getPlayerDataAsObject(currentID, "playerStats");
    
    if(args){
        friendID = args.playfabID;
        gift = args.gift;
        
        switch(gift.type){
            case "gold":
                if(playerData.coins >= gift.value){
                    playerData.coins -= gift.value;
                    createGift(currentID, friendID, gift);
                    updatePlayerData(currentID, "playerStats", playerData);
                    return {result : playerData};
                }
                else{
                    return null;
                }
            default:
                return null;
        }
    }
    else{
        return null;
    }
}

handlers.getGifts = function(args, context){
    var currentID = currentPlayerId;
    var gifts = [];
    
    try{
        gifts = getPlayerReadDataAsObject(currentID, "Gifts");
    }
    catch{
        log.debug("Gifts not found");
        gifts = [];
        updatePlayerReadOnlyData(currentID, "Gifts", gifts);
    }
    finally{
        return {result : gifts};
    }
}

handlers.openGift = function(args, context){
    var currentID = currentPlayerId;
    var gift;
    var playerData;
    var giftsData = getPlayerReadDataAsObject(currentID, "Gifts");
    
    if(args){
        gift = args.gift;
        
        switch(gift.type){
            case "gold":
                playerData = getPlayerDataAsObject(currentID, "playerStats");
                playerData.coins += gift.value;
                updatePlayerData(currentID, "playerStats", playerData);
                giftsData.splice(giftsData.indexOf(giftsData.find(e => e.id == gift.id)), 1);
                updatePlayerReadOnlyData(currentID, "Gifts", giftsData);
                log.debug(giftsData);
                return {result : playerData, outValue : giftsData};
            default:
                return null;
        }
    }
    else{
        return null;
    }
}

handlers.openAllGifts = function(args, context){
    var currentID = currentPlayerId;
    var gifts = getPlayerReadDataAsObject(currentID, "Gifts");
    var assortedGifts = {};
    var playerStats;
    
    for(let i = 0; i < gifts.length; i++){
        
        switch(gifts[i].type){
            case "gold":
                log.debug("gold " + gifts[i].value);
                if(assortedGifts.gold){
                    assortedGifts.gold += new Number(gifts[i].value);
                }
                else{
                    assortedGifts.gold = new Number(gifts[i].value);
                }
                break;
            default:
                break;
        }
    }
    
    log.debug(assortedGifts);
    
    if(assortedGifts.gold && assortedGifts.gold > 0){
        playerStats = getPlayerDataAsObject(currentID, "playerStats");
        playerStats.coins += assortedGifts.gold;
        updatePlayerData(currentID, "playerStats", playerStats);
    }
    
    if(!assortedGifts){
        return null;
    }
    else{
        gifts = [];
        updatePlayerReadOnlyData(currentID, "Gifts", gifts);
    }
    
    return {result : playerStats};
}

//============[In App Purchase]==========================
handlers.getPurchase = function(args, context){
    var currentID = currentPlayerId;
    var id = args.id;
    var date = args.date;
    var storeData = getServerDataAsObject("Store");
    var thing;
    var playerData;
    
    log.debug("PurchaseID: " + args.id + " Date: " + date);
    
    thing = storeData.find(e => e.id == id);
    
    log.debug(thing);
    
    switch(thing.type){
        case "gold":
            playerData = getPlayerDataAsObject(currentID, "playerStats");
            playerData.coins += thing.value;
            updatePlayerData(currentID, "playerStats", playerData);
            return {result : playerData, outValue : "gold"};
        case "energy":
            handlers.addEnergy({energyCount : thing.value});
            return {result : getPlayerDataAsObject(currentID, "energy"), outValue : "energy"};
    }
    
    return {result : null};
}
//=======================================================

