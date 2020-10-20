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
    
    return { result: array };
};
