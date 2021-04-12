class myRandom{
    constructor(seed){
        this.seed = new Number(seed);
        this.prev = this.seed;
    }
    
    get getSeed(){
        return this.seed;
    }
    
    get randInt(){
        return this.next();
    }
    
    get randFloat(){
        return this.next() / 0x7fff;
    }
    
    next(){
        var value = ((this.prev * 20077) + 12345) & 0x7fff;
        this.prev = value;
        
        return value;
    }
    
    range(min, max){
        var value = this.next() % (max - min) + min;
        return value;
    }
}

function getSeed(seed){
    var seeds = [695, 175, 993, 505, 46, 705, 399, 315, 632, 859, 247, 516, 968, 19, 251, 786, 830, 559, 517, 445, 41, 716, 
                 921, 504, 753, 276, 106, 571, 85, 446, 22, 740, 741, 153, 658, 717, 765, 999, 916, 266, 584, 796, 401, 654, 
                 186, 48, 316, 668, 973, 883, 520, 876, 885, 839, 856, 849, 706, 489, 751, 438, 140, 359, 127, 694, 799, 661, 
                 395, 96, 305, 729, 60, 343, 89, 610, 84, 497, 547, 744, 128, 174, 1018, 225, 892, 676, 253, 824, 418, 903, 948, 
                 586, 403, 257, 627, 11, 262, 683, 766, 792, 907, 146, 652, 185, 670, 939, 449, 873, 825, 227, 761, 645, 813, 928, 
                 978, 746, 7, 954, 355, 782, 515, 284, 711, 463, 367, 685, 300, 840, 278, 199, 119, 787, 703, 15, 901, 669, 616, 328, 
                 104, 342, 49, 68, 0, 544, 763, 214, 909, 964, 441, 726, 882, 690, 754, 129, 13, 707, 397, 731, 63, 875, 843, 828, 301, 
                 861, 835, 566, 183, 640, 638, 674, 390, 732, 160, 197, 881, 404, 295, 152, 509, 303, 248, 546, 728, 734, 406, 32, 598, 
                 74, 872, 621, 293, 942, 949, 629, 806, 335, 538, 133, 302, 223, 108, 958, 823, 922, 609, 494, 523, 589, 548, 941, 230, 
                 345, 990, 822, 723, 781, 772, 255, 923, 679, 427, 713, 969, 929, 952, 562, 646, 905, 853, 201, 514, 396, 827, 386, 437, 
                 988, 206, 764, 195, 563, 109, 289, 708, 341, 848, 75, 325, 701, 314, 774, 121, 596, 704, 675, 298, 91, 975, 895, 902, 111, 
                 700, 368, 696, 719, 553, 479, 837, 279, 408, 2, 350, 352, 560, 671, 452, 554, 585, 271, 583, 158, 532, 633, 360, 481, 273, 
                 531, 567, 996, 877, 90, 771, 603, 231, 508, 816, 1016, 443, 151, 519, 869, 857, 256, 894, 752, 946, 805, 770, 747, 636, 170, 
                 910, 29, 184, 113, 393, 1019, 101, 51, 37, 592, 971, 854, 606, 447, 1017, 238, 914, 613, 635, 998, 491, 117, 684, 40, 693, 
                 351, 205, 791, 543, 363, 760, 776, 232, 138, 1009, 383, 224, 961, 507, 620, 537, 116, 92, 358, 366, 617, 379, 755, 361, 423, 
                 818, 282, 811, 963, 663, 987, 233, 26, 415, 277, 551, 132, 178, 323, 915, 480, 461, 534, 264, 464, 495, 86, 1012, 311, 476, 656, 
                 867, 865, 555, 155, 213, 578, 320, 911, 528, 798, 469, 634, 769, 456, 720, 1008, 1023, 758, 322, 650, 169, 477, 775, 250, 249, 580, 
                 641, 518, 870, 724, 657, 42, 394, 951, 500, 614, 644, 147, 431, 659, 890, 862, 200, 299, 745, 38, 855, 221, 625, 486, 667, 470, 599, 
                 970, 762, 812, 992, 594, 69, 378, 193, 540, 220, 450, 376, 545, 59, 191, 291, 607, 595, 64, 460, 83, 924, 593, 8, 590, 387, 927, 527, 
                 615, 983, 204, 1021, 30, 863, 767, 521, 981, 991, 391, 260, 118, 156, 972, 110, 682, 709, 880, 5, 261, 678, 619, 655, 385, 574, 
                 462, 281, 347, 202, 354, 131, 124, 263, 953, 492, 326, 215, 933, 956, 357, 157, 847, 168, 280, 483, 821, 99, 1003, 665, 162, 52, 565, 
                 541, 597, 259, 372, 285, 793, 549, 34, 405, 306, 838, 130, 874, 899, 340, 240, 664, 292, 102, 976, 288, 93, 777, 327, 159, 511, 442, 896, 
                 898, 4, 417, 409, 287, 780, 329, 192, 336, 681, 286, 16, 844, 348, 365, 943, 94, 332, 283, 459, 333, 45, 100, 556, 913, 995, 297, 53, 1004, 
                 313, 819, 810, 380, 274, 33, 564, 794, 339, 217, 412, 381, 722, 587, 243, 841, 697, 308, 414, 503, 472, 356, 66, 912, 773, 789, 144, 136, 721, 
                 58, 790, 189, 845, 966, 919, 677, 436, 979, 107, 730, 1014, 783, 750, 906, 557, 513, 490, 795, 842, 739, 430, 143, 95, 36, 989, 582, 210, 
                 735, 506, 637, 642, 888, 426, 177, 622, 416, 725, 338, 267, 425, 413, 814, 577, 81, 402, 748, 980, 448, 904, 691, 608, 784, 662, 536, 212,
                 630, 14, 573, 120, 145, 499, 686, 47, 820, 71, 296, 959, 689, 467, 468, 82, 957, 236, 737, 475, 389, 18, 803, 962, 484, 736, 272, 228, 10, 
                 687, 198, 569, 154, 318, 530, 601, 612, 474, 759, 9, 831, 846, 137, 411, 324, 244, 788, 756, 67, 974, 624, 269, 680, 207, 419, 935, 211, 
                 897, 319, 778, 714, 934, 384, 258, 926, 965, 757, 77, 216, 237, 310, 239, 219, 457, 498, 525, 222, 398, 27, 252, 493, 103, 377, 785, 602, 1001, 
                 588, 24, 938, 994, 698, 410, 826, 834, 428, 241, 349, 407, 604, 1005, 188, 692, 930, 1007, 727, 194, 647, 809, 142, 62, 424, 80, 908, 688, 581, 
                 444, 172, 166, 829, 984, 887, 868, 165, 1022, 21, 229, 163, 72, 526, 986, 496, 122, 190, 749, 743, 125, 370, 1002, 535, 65, 832, 1000, 648, 388, 
                 482, 196, 429, 235, 364, 242, 576, 718, 268, 421, 815, 1010, 290, 550, 817, 226, 524, 982, 871, 382, 542, 321, 400, 126, 148, 852, 371, 
                 440, 466, 181, 465, 985, 944, 454, 715, 176, 702, 710, 265, 123, 392, 649, 50, 672, 618, 626, 510, 891, 955, 254, 733, 591, 453, 88, 936, 742, 
                 433, 858, 611, 79, 97, 977, 529, 487, 940, 712, 114, 435, 161, 139, 666, 533, 1013, 1006, 337, 112, 369, 179, 572, 800, 134, 31, 889, 660, 807, 
                 434, 330, 558, 947, 931, 422, 375, 937, 294, 420, 623, 605, 950, 455, 167, 25, 473, 643, 73, 39, 699, 738, 879, 967, 478, 552, 932, 44, 246, 6, 
                 309, 353, 768, 1, 373, 960, 631, 307, 485, 1020, 374, 579, 182, 56, 171, 836, 451, 87, 135, 639, 918, 945, 651, 234, 539, 900, 866, 76, 150, 502, 
                 850, 105, 70, 334, 458, 797, 3, 209, 218, 779, 600, 673, 628, 180, 304, 432, 471, 331, 920, 488, 568, 893, 362, 878, 575, 12, 208, 1011, 925, 141, 
                 61, 203, 98, 17, 1015, 561, 884, 802, 245, 317, 801, 55, 187, 149, 653, 312, 115, 501, 344, 78, 522, 997, 54, 57, 20, 439, 886, 275, 43, 270, 860, 
                 35, 804, 808, 570, 23, 833, 164, 851, 512, 173, 864, 28, 917, 346];
                 
    return seeds[seed];
};

function banPlayer(playFabId){
    var warnNumber = 0;
    
    try{
        warnNumber = server.GetUserInternalData({PlayFabId : playFabId, Keys : ["warn"]}).Data.warn.Value;
        
        if(warnNumber){
            warnNumber++;
        }
        else{
            warnNumber = 1;
        }
    }
    catch{
        warnNumber = 1;
    }
    
    if(warnNumber >= 3){
        server.BanUsers({PlayFabId : playFabId, Reason : "Auto BAN! You have a three warns."});
    }
    
    updatePlayerInternalData(playFabId, "warn", warnNumber);
};

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

function getObjectInGameNumber(maxNumbers, probability){
    var value = 0;
    
    for(let i = 0; i < maxNumbers; i++){
        var currentProbability = Math.random();
        
        if(currentProbability < probability){
            value++;
        }
    }
    
    return new Number(value);
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
    
    //Cards
    updatePlayerReadOnlyData(currentID, "Cards", null);
    updatePlayerReadOnlyData(currentID, "CardsCollections", null);
    
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
                    if(!args || !args.isX2Spin){
                        handlers.addEnergy({energyCount : getTitleData[i].addresourceenergy});
                        log.debug({addEnergy : getTitleData[i].addresourceenergy});
                    }
                    else{
                        handlers.addEnergy({energyCount : 2 * getTitleData[i].addresourceenergy});
                        log.debug({addEnergy :(2 * getTitleData[i].addresourceenergy)});
                    }
                }
                else if(getTitleData[i].id == "normalChest"){
                    handlers.getChestWithType({type : "normal", count : getTitleData[i].addresourcechest});
                }
                else if(getTitleData[i].id == "megicalChest"){
                    handlers.getChestWithType({type : "magical", count : getTitleData[i].addresourcechest});
                }
                else if(getTitleData[i].id == "epicChest"){
                    handlers.getChestWithType({type : "epic", count : getTitleData[i].addresourcechest});
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
                banPlayer(currentID);
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
    
    return {result : forts, tag : building.name};
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
    var serverData = getServerDataAsObject(["gameParams", "GiftsTypes", "Store", "Artefacts", "PlayerStats", "FortificationUpgrades", "ServerParams"], true);
    
    return {result : {  upgradesList : createUpgradesList(), 
                        gameParams : JSON.parse(serverData["gameParams"]), 
                        giftsTypes : JSON.parse(serverData["GiftsTypes"]), 
                        storeData : JSON.parse(serverData["Store"]),
                        artefacts : JSON.parse(serverData["Artefacts"]),
                        playerStats : createPlayerModel(JSON.parse(serverData["PlayerStats"])),
                        upgradesCosts : createUpgradesPriceList(JSON.parse(serverData["FortificationUpgrades"]), JSON.parse(serverData["ServerParams"]))
                     }
            };
}

function createPlayerModel(data){
    var playerStats = {};
    
    for(let i = 0; i < data.length; i++){
        playerStats[new String(data[i].name)] = new Number(data[i].value);
    }
    
    return playerStats;
}

function createUpgradesPriceList(priceData, serverParams){
    var fortsCount = serverParams.find(e => e.name == "fortsNumber").value;
    var buildingsCount = serverParams.find(e => e.name == "buildingsInFort").value;
    var upgradesLvlsNumber = serverParams.find(e => e.name == "upgradesLvlsNumber").value;
    
    var index = 0;
    
    var upgradesCosts = [];
    
    for(let i = 1; i <= fortsCount; i++){
        upgradesCosts.push({fortID : i - 1});
        upgradesCosts[i - 1].buildingUpgradesCost = {};
        
        for(let j = 0; j < buildingsCount; j++){
            
            var buildingUpgradesCost = [];
            
            for (let k = 0; k < upgradesLvlsNumber; k++){
                var rowID = k + (buildingsCount * j);

                buildingUpgradesCost.push(priceData[rowID].payresourcegold);
            }
            //buildingUpgradesCost.sort();
            
            upgradesCosts[i - 1].buildingUpgradesCost[j] = buildingUpgradesCost;
        }
    }
    
    return upgradesCosts;
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
        case "chest":
            switch(id){
                case "zi_chest_normal":
                    handlers.getChestWithType({type : "normal", count : thing.value});
                    break;
                case "zi_chest_magical":
                    handlers.getChestWithType({type : "magical", count : thing.value});
                    break;
                case "zi_chest_epic":
                    handlers.getChestWithType({type : "epic", count : thing.value});
                    break;
            }
            return {result : getPlayerReadDataAsObject(currentID, "Chests"), outValue : "chest"};
        case "goldenPass":
            return {result : buyGoldenPass(currentID), outValue : "goldenPass"};
    }
    
    return {result : null};
}
//=======================================================

//===================[Main game]=========================
handlers.getMainGameParams = function(args, context){
    var currentID = currentPlayerId;
    var gameParams = getServerDataAsObject("MainGameParams");
    var seed = getGameSeed(currentID);
    
    //===========[Artefacts]==================
    var maxArtefactsNumber = gameParams.find(p => p.name == "maxArtefactsNumber").value;
    var artefactsSpawnChance = JSON.parse(gameParams.find(p => p.name == "artefactsAddСhance").value);
    var artefactsInZombieChance = JSON.parse(gameParams.find(p => p.name == "artefactsInZombieChance").value);
    var minZombieNumberWithArtefacts = gameParams.find(p => p.name == "minZombieNumberWithArtefacts").value;
    var artefactsInGame = getObjectInGameNumber(maxArtefactsNumber, artefactsSpawnChance);
    //========================================
    
    //===========[Cards]======================
    var maxChestsNumber = gameParams.find(p => p.name == "maxChestsNumber").value;
    var chastInGameChance = JSON.parse(gameParams.find(p => p.name == "chastInGameChance").value);
    var chestInZombieChance = JSON.parse(gameParams.find(p => p.name == "chestInZombieChance").value);
    var minZombieWithChest = gameParams.find(p => p.name == "minZombieWithChest").value;
    var maxChestsNumberInGame = getObjectInGameNumber(maxChestsNumber, chastInGameChance);
    //========================================
    
    updatePlayerInternalData(currentID, "lastGame", {seed : seed, maxArtefactsNumber : artefactsInGame, maxChestsNumber : maxChestsNumberInGame});
    
    return {result : {  
                        seed : seed, 
                        artefactsInGame : artefactsInGame, 
                        artefactsChance : artefactsInZombieChance, 
                        minZombieWithArtefact : minZombieNumberWithArtefacts, 
                        
                        minZombieWithChest : minZombieWithChest,
                        chestInZombieChance : chestInZombieChance,
                        maxChestsNumber : maxChestsNumberInGame
                     }};
}

handlers.checkGameResult = function(args, context){
    var currentID = currentPlayerId;
    var playerData = getPlayerDataAsObject(currentID, ["playerStats", "chapters"], true);
    var playerStats = JSON.parse(playerData["playerStats"].Value);
    var currentChapterID = JSON.parse(playerData["chapters"].Value).currentChapter.id;
    var dailyStats = updateDailyStats(currentID, {addGame : 1});
    var goldenPass = handlers.loadGoldenPass({playfabID : currentID}).result;
    
    var lastGameParams = JSON.parse(server.GetUserInternalData({PlayFabId : currentID, Keys : ["lastGame"]}).Data.lastGame.Value);
    
    log.debug(lastGameParams.seed);
    
    var serverData = getServerDataAsObject(["Zombies", "ZombiesInChapters"], true);
    
    var zombies = JSON.parse(serverData["Zombies"]);
    var zombiesWeights = JSON.parse(serverData["ZombiesInChapters"]).filter(e => e.chapter == currentChapterID);
    
    var zombieTypes = generateZombiesTypes(zombiesWeights, args.zombiesNumber, lastGameParams.seed);
    var maxGold = maxGoldInRound(zombieTypes, zombies);
    
    log.debug({maxGold : maxGold});

    if((args.artefactsNumber > lastGameParams.maxArtefactsNumber) || (args.gold > maxGold * args.energyMode) || (args.chestsNumber > lastGameParams.maxChestsNumber)){
        log.debug("Cheater!!!");
        banPlayer(currentID);
        
        return null;
    }
    else{
        playerStats.coins += args.gold;
    }
    
    if(dailyStats.gamesInDay >= 3){
        goldenPass.canGetReward = true;
        updatePlayerReadOnlyData(currentID, "GoldenPass", goldenPass);
    }
    
    updatePlayerData(currentID, "playerStats", playerStats);
    
    return {result : playerStats, outValue : goldenPass};
}

function generateZombiesTypes(zombies, max, seed){
    var rand = new myRandom(seed);
    var types = [];
    var totalWeight = 0;
    
    for(let i = 0; i < zombies.length; i++){
        totalWeight += zombies[i].weight;
    }
    
    log.debug({totalWeight : totalWeight});
    
    for(let i = 0; i < max; i++){
        var randomNum = rand.range(0, totalWeight);
        
        for(let j = 0; j < zombies.length; j++){
            if(randomNum < zombies[j].weight){
                types.push(zombies[j].zombie);
                break;
            }
            randomNum -= zombies[j].weight;
        }
    }
    
    return types;
}

function maxGoldInRound(zombieTypes, zombiesInfo){
    var gold = 0;
    
    for(let i = 0; i < zombieTypes.length; i++){
        gold += zombiesInfo.find(e => e.id == zombieTypes[i]).addresourcegold;
    }
    
    return gold;
}

function maxGoldFromZombies(zombieTypes, zombiesInfo, zombiesIDS){
    var gold = 0;
    
    for(let i = 0; i < zombiesIDS.length; i++){
        gold += zombiesInfo.find(e => e.id == zombieTypes[zombiesIDS[i]]).addresourcegold;
    }
    
    return gold;
}

function getGameSeed(playfabID){
    var seed;
    
    try{
        seed = server.GetUserInternalData({ Keys: ["seed"], PlayFabId : playfabID }).Data.seed.Value;
        
        if(seed){
            seed = getSeed(seed);
        }
        else{
            seed = getSeed(getRandomInt(1023));
        }
    }
    catch{
        seed = getSeed(getRandomInt(1023));
    }
    
    try{
        updatePlayerInternalData(playfabID, "seed", seed);
    }
    catch{
        log.debug("Can't save seed");
    }
    
    return seed;
}
//=======================================================

//=====================[Cards]===========================
handlers.getCardsList = function(args, context){
    var currentID = currentPlayerId;
    var playerCards = [];
    var chests = [];
    var collection = getServerDataAsObject("CardsCollections");
    var playerCollection = [];

    try{
        playerCards = getPlayerReadDataAsObject(currentID, "Cards");
    }
    catch{
        playerCards = [];
        updatePlayerReadOnlyData(currentID, "Cards", playerCards);
    }
    
    try{
        chests = getPlayerReadDataAsObject(currentID, "Chests");
    }
    catch{
        chests = [];
        updatePlayerReadOnlyData(currentID, "Chests", chests);
    }
    
    try{
        playerCollection = getPlayerReadDataAsObject(currentID, "CardsCollections");
    }
    catch{
        playerCollection = [];
        playerCollection = collection;
        
        for(let i = 0; i < playerCollection.length; i++){
            playerCollection[i].isswapped = false;
        }
        
        updatePlayerReadOnlyData(currentID, "CardsCollections", playerCollection);
    }
    
    return {result : { playerCards : playerCards, chests : chests, collection : playerCollection }};
}

function getCard(playfabID, cards, playerCards, type){
    var tempCards;
    var totalWeight = 0;
    var cardID;
    
    if(type){
        tempCards = cards.filter(e => e.type == type);
    }
    else{
        tempCards = cards;
    }
    
    for(let i = 0; i < tempCards.length; i++){
        totalWeight += tempCards[i].rate;
    } 
    
    var randomNum = getRandomInt(totalWeight);
        
    for(let j = 0; j < tempCards.length; j++){
        if(randomNum < tempCards[j].rate){
            cardID = tempCards[j].id;
            
            var card = playerCards.find(e => e.id == cardID);
            
            if(card){
                card.count = card.count ? (card.count + 1) : 1;
            }
            else{
                playerCards.push(tempCards[j]);
                playerCards[playerCards.length - 1].count = 1;
            }
            
            break;
        }
        randomNum -= tempCards[j].rate;
    }
    
    return cardID;
}

handlers.swapCollection = function(args, context){
    var currentID = currentPlayerId;
    var serverData = getServerDataAsObject(["CardsCollections", "CollectionsRewards"], true);
    var rewards = JSON.parse(serverData["CollectionsRewards"]);
    var collection = JSON.parse(serverData["CardsCollections"]);
    var playerCollection = getPlayerReadDataAsObject(currentID, "CardsCollections");
    var playerCards = getPlayerReadDataAsObject(currentID, "Cards");
    var collectionID = args.collection;
    
    var playerStats = getPlayerDataAsObject(currentID, "playerStats");
    
    var collectionCards = playerCards.filter(e => e.collectionid == collectionID);
    var reward = rewards.find(e => e.id == collectionID);
    
    if(collectionCards.length == collection.find(e => e.id == collectionID).allcardsnumber){
        
        if(reward.energyreward && reward.energyreward > 0){
            handlers.addEnergy({energyCount : reward.energyreward});
        }
        
        deleteCards(playerCards, collectionCards);
        
        log.debug(playerCards);
        
        playerCollection.find(e => e.id == collectionID).isswapped = true;
        
        playerStats.coins += reward.goldreward;
        
        updatePlayerData(currentID, "playerStats", playerStats);
        updatePlayerReadOnlyData(currentID, "CardsCollections", playerCollection);
        updatePlayerReadOnlyData(currentID, "Cards", playerCards);
        
        return {result : { playerCards : playerCards, collection : playerCollection }, outValue : {gold : reward.goldreward, energy : reward.energyreward}};
    }
    
    return {result : null};
}

function deleteCards(playerCards, collectionCards){
    collectionCards.forEach(e => e.count -= 1);
    
    log.debug(playerCards);
    
    for(let i = 0; i < collectionCards.length; i++){
        var index = playerCards.findIndex(e => e.name == collectionCards.name);
        playerCards[index] = collectionCards[i];
        
        if(playerCards[index].count == 0){
            playerCards.splice(index, 1);
        }
    }
}
//=======================================================

//====================[Chests]===========================
handlers.spawnChest = function(args, context){
    var currentID = currentPlayerId;
    var chests = getServerDataAsObject("Chests");
    var playerChests = [];
    var totalWeight = 0;
    var chestID;
    
    try{
        playerChests = getPlayerReadDataAsObject(currentID, "Chests");
    }
    catch{
        playerChests = [];
    }
    
    for(let i = 0; i < chests.length; i++){
        totalWeight += chests[i].weight;
    }    
    
    var randomNum = getRandomInt(totalWeight);
        
    for(let j = 0; j < chests.length; j++){
        if(randomNum < chests[j].weight){
            chestID = chests[j].id;
            playerChests.push(chests[j])
            break;
        }
        randomNum -= chests[j].weight;
    }
    
    log.debug(playerChests);
    
    updatePlayerReadOnlyData(currentID, "Chests", playerChests);
    
    return {result : playerChests, outValue : chestID};
}

handlers.getChestWithType = function(args, context){
    var currentID = currentPlayerId;
    var chests = getServerDataAsObject("Chests");
    var chest = {};
    var playerChests = [];
    var count = args.count ? args.count : 1;
    
    try{
        playerChests = getPlayerReadDataAsObject(currentID, "Chests");
    }
    catch{
        playerChests = [];
    }
    
    chest = chests.find(e => e.id == args.type);
    
    for(let i = 0; i < count; i++)
        playerChests.push(chest);
    
    updatePlayerReadOnlyData(currentID, "Chests", playerChests);
    
    return {result : playerChests};
}

handlers.getChests = function(args, context){
    var currentID = currentPlayerId;
    var playerChests = [];
    
    try{
        playerChests = getPlayerReadDataAsObject(currentID, "Chests");
    }
    catch{
        playerChests = [];
        updatePlayerReadOnlyData(currentID, "Chests", playerChests);
    }
    
    return {result : playerChests};
}

handlers.openChest = function(args, context){
    var currentID = currentPlayerId;
    var serverData = getServerDataAsObject(["Cards", "CardsCollections"], true);
    var cards = JSON.parse(serverData["Cards"]);
    var collections =  JSON.parse(serverData["CardsCollections"]);
    var collectionsIDs = [];
    
    var chests = [];
    var chest = {};
    var normalCardsNumber = 0;
    var magicalCardsNumber = 0;
    var epicCardsNumber = 0;
    var cardsNumber = 0;
    
    var playerCards = [];
    var cardsIDs = [];
    var chapters = getPlayerDataAsObject(currentID, "chapters");
    
    collections = collections.filter(e => e.minchapter <= chapters.currentChapter.order);
    
    collections.forEach(e => collectionsIDs.push(e.id));
    
    log.debug({ collectionsIDs : collectionsIDs });
    
    cards = cards.filter(e => collectionsIDs.includes(e.collectionid) == true);
    
    log.debug({cards : cards});
    
    try{
        chests = getPlayerReadDataAsObject(currentID, "Chests");
        chest = chests[0];
        
        log.debug({chest : chest});
        
        normalCardsNumber = chest.normalcardsnumber;
        magicalCardsNumber = chest.magicalcardsnumber;
        epicCardsNumber = chest.epiccardsnumber;
        cardsNumber = chest.allcardsnumber;
        
        log.debug({normalCardsNumber : normalCardsNumber, magicalCardsNumber : magicalCardsNumber, epicCardsNumber : epicCardsNumber, cardsNumber : cardsNumber});
    }
    catch{
        return null;
    }
    
    try{
        playerCards = getPlayerReadDataAsObject(currentID, "Cards");
    }
    catch{
        playerCards = [];
    }
    
    if(normalCardsNumber == 0 && magicalCardsNumber == 0 && epicCardsNumber == 0){
        for(let i = 0; i < cardsNumber; i++){
            cardsIDs.push(getCard(currentID, cards, playerCards));
        }
    }
    else{
        if(normalCardsNumber > 0){
            for(let i = 0; i < normalCardsNumber; i++){
                cardsIDs.push(getCard(currentID, cards, playerCards, "normal"));
            }
            
            cardsNumber -= normalCardsNumber;
        }
        
        if(magicalCardsNumber > 0){
            for(let i = 0; i < magicalCardsNumber; i++){
                cardsIDs.push(getCard(currentID, cards, playerCards, "magical"));
            }
            
            cardsNumber -= magicalCardsNumber;
        }
        
        if(epicCardsNumber > 0){
            for(let i = 0; i < epicCardsNumber; i++){
                cardsIDs.push(getCard(currentID, cards, playerCards, "epic"));
            }
            
            cardsNumber -= epicCardsNumber;
        }
        
        if(cardsNumber > 0){
            for(let i = 0; i < cardsNumber; i++){
                cardsIDs.push(getCard(currentID, cards, playerCards));
            }
        }
    }
    
    chests.shift();
    
    log.debug(chests);
    log.debug(playerCards);
    
    updatePlayerReadOnlyData(currentID, "Chests", chests);
    updatePlayerReadOnlyData(currentID, "Cards", playerCards);
    
    return {result : { playerCards : playerCards, chests : chests }, outValue : { cardsIDs : cardsIDs, chestType : chest.id }};
}
//=======================================================

//==================[GoldenPass]=========================
handlers.loadGoldenPass = function(args, context){
    var currentID = args ? args.playfabID : currentPlayerId;
    
    var goldenPassRewards = [];
    
    var goldenPass = {};
    
    var dailyStats = updateDailyStats(currentID);
    
    try{
        goldenPass = getPlayerReadDataAsObject(currentID, "GoldenPass");
    }
    catch{
        goldenPassRewards = getServerDataAsObject("GoldenPassRewards");
        
        goldenPass.rewards = goldenPassRewards;
        goldenPass.currentDay = 1;
        goldenPass.dayComplete = false;
        goldenPass.isBought = false;
        goldenPass.canGetReward = false;
        
        updatePlayerReadOnlyData(currentID, "GoldenPass", goldenPass);
    }
    
    if(goldenPass.isBought){
        var date = new Date();
        date.setHours(0,0,0,0);
        
        var currentDay = timeSpan(date, new Date(JSON.parse(goldenPass.buyDate))).days + 1;
        
        if(currentDay != goldenPass.currentDay){
            if(currentDay <= 30){
                goldenPass.dayComplete = false;
                goldenPass.currentDay = currentDay;
            }
            else{
                goldenPassRewards = getServerDataAsObject("GoldenPassRewards");
                goldenPass.rewards = goldenPassRewards;
                goldenPass.currentDay = 1;
                goldenPass.dayComplete = false;
                goldenPass.isBought = false;
                goldenPass.canGetReward = false;
            }
        }
        
        if(!goldenPass.dayComplete){
            if(dailyStats.gamesInDay >= 3){
                goldenPass.canGetReward = true;
            }
        }
        
        updatePlayerReadOnlyData(currentID, "GoldenPass", goldenPass);
    }
    
    return {result : goldenPass};
}

function buyGoldenPass(playfabID){
    var goldenPass = handlers.loadGoldenPass({playfabID : playfabID}).result;
    
    goldenPass.isBought = true;
    
    var buyDate = new Date();
    buyDate.setHours(0,0,0,0);
    
    goldenPass.currentDay = 1;
    goldenPass.dayComplete = false;
    goldenPass.buyDate = JSON.stringify(buyDate);
    
    updatePlayerReadOnlyData(playfabID, "GoldenPass", goldenPass);
    
    return goldenPass;
}

handlers.getGoldenPassReward = function(args, context){
    var currentID = currentPlayerId;
    
    var goldenPass = handlers.loadGoldenPass({playfabID : currentID}).result;
    
    var reward = goldenPass.rewards.find(e => e.day == goldenPass.currentDay);
    
    var dailyStats = updateDailyStats(currentID);
    
    if(goldenPass.isBought){
        if(!goldenPass.dayComplete && dailyStats.gamesInDay >= 3){
            goldenPass.dayComplete = true;
            goldenPass.canGetReward = false;
            updatePlayerReadOnlyData(currentID, "GoldenPass", goldenPass);
        
            switch(reward.rewardid){
                case "gold":
                    var playerStats = getPlayerDataAsObject(currentID, "playerStats");
                    playerStats.coins += reward.count;
                    updatePlayerData(currentID, "playerStats", playerStats);
                    return {result : playerStats, outValue : goldenPass, tag : "gold"};
                case "energy":
                    return {result : handlers.addEnergy({energyCount : reward.count}).result, outValue : goldenPass, tag : "energy"};
                case "normalChest":
                    return {result : handlers.getChestWithType({type : "normal", count : thing.value}).result, outValue : goldenPass, tag : "chest"};
                    break;
                case "magicalChest":
                    return {result : handlers.getChestWithType({type : "magical", count : thing.value}).result, outValue : goldenPass, tag : "chest"};
                    break;
                case "epicChest":
                    return {result : handlers.getChestWithType({type : "epic", count : thing.value}).result, outValue : goldenPass, tag : "chest"};
                    break;
            }
        }
    }
    
    return null;
}

function updateDailyStats(playfabID, data){
    var dailyStats = {};
    var date = new Date();
    date.setHours(0,0,0,0);
    
    try{
        dailyStats = getPlayerDataAsObject(playfabID, "dailyStats");
        
        if(!dailyStats){
            dailyStats = {date : JSON.stringify(date), gamesInDay : 0};
        }
    }
    catch{
        dailyStats = {date : JSON.stringify(date), gamesInDay : 0};
    }
    
    if(timeSpan(date, new Date(JSON.parse(dailyStats.date))).days > 0){
        dailyStats.date = JSON.stringify(date);
        dailyStats.gamesInDay = 0;
    }
    
    if(data){
        if(data.addGame){
            dailyStats.gamesInDay += data.addGame;
        }
    }
    
    updatePlayerData(playfabID, "dailyStats", dailyStats);
    
    return dailyStats;
}
//=======================================================
