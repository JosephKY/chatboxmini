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

function isCapacity(activityName, id){
    let activity = activities[activityName]
    if(!activity)return false;

    let figure = activity.figures[id]
    if(!figure)return false;

    let cap = false;
    let restrictions = activity.restrictions
    restrictions.forEach(restriction=>{
        let max = restriction.max
        let length = restriction.length
        let caught = 0 
        let now = Math.floor(Date.now() / 1000)
        console.log(max, length, now)
        figure.forEach(instance=>{
            if((now - instance) < length)caught = caught + 1;
        })
        if(caught >= max)cap = true;
    })
    return cap;
}

module.exports = { addActivity, addRestriction, addInstance, isCapacity }