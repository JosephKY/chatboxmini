const ReturnMessage = require("../models/returnMessage.model")
const returnMessageService = require("../services/returnmessage.service")

let activities = {}

function addActivity(name){
    activities[name] = {
        restrictions:[],
        figures:{}
    }
    return activities[name]
}

function addRestriction(activityName, length, max){
    let activity = activities[activityName]

    if(!activity){
        activity = addActivity(activityName)
    };

    activity.restrictions.push({
        length: length,
        max: max 
    })
}

function addInstance(activityName, id){
    let activity = activities[activityName]

    if(!activity){
        activity = addActivity(activityName)
    };

    let figure = activity.figures[id]
    if(!figure){
        activities[activityName].figures[id] = []
        figure = activity.figures[id]
    }

    figure.push(Math.floor(Date.now() / 1000))
    return figure
}

function isCapacity(activityName, id, prosecute=false){
    let activity = activities[activityName]
    if(!activity)return false;

    let figure = activity.figures[id]
    if(!figure)return false;

    let cap = false;
    let restrictions = activity.restrictions
    let first = false;
    restrictions.forEach(restriction=>{
        let max = restriction.max
        let length = restriction.length
        let caught = 0 
        let now = Math.floor(Date.now() / 1000)
        let wait = false;
        console.log(max, length, now)
        figure.forEach(instance=>{
            if((now - instance) < length){
                caught = caught + 1;
                let mywait = length - (now - instance)
                if(wait == false || wait < mywait){
                    wait = mywait
                }
            }
        })
        if(caught >= max){
            cap = true;
            if(first == false || first < wait){

            }
            first = wait
        }
        console.log(caught)
    })

    if(prosecute != false && cap == true){
        returnMessageService(
            new ReturnMessage(
                "1", 
                `You're making too many requests. Please try again in ${first} seconds`,
                400,
                'error'
                ), 
            prosecute)
    }

    return cap;
}

module.exports = { addActivity, addRestriction, addInstance, isCapacity }