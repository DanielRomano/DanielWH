class WorkingHours {
    constructor(storageName = "arrayOfTime2")
    {
        this.storageName = storageName;
        this.arrayOfTime = localStorage.getItem(this.storageName);
        if(this.arrayOfTime == null)
            this.arrayOfTime = new Array;
        else
            this.arrayOfTime = JSON.parse(this.arrayOfTime);
    }

    createObject = (guid, label, timeStart, timeEnd, totalTime, text) => {
        if(timeStart == "")
            timeStart = new Date
        let tempObject = {
            name: label,
            date: timeStart,
            guid: guid,
            end: timeEnd,
            totalTime: totalTime,
            text: text
        }
        return tempObject;
    }

    findRowByGuid = (guid) => {
        let theIndex = false;
        this.arrayOfTime.forEach((element, index) => {
            if(element.guid == guid) 
                theIndex = index;
        });
        return theIndex;
    }
    
    createRow = (label, timeStart, timeEnd) => {
        let guid = WHelper.getGuid();
        let tempObject = this.createObject(guid, label, timeStart, timeEnd, "", "");
        this.arrayOfTime.push(tempObject);
        this.saveObject();
    };

    updateRow = (guid, label, timeStart, timeEnd, text) => {
        let rowIndex = this.findRowByGuid(guid);
        if(rowIndex === false)
            return false;
        let theObject = this.arrayOfTime[rowIndex];
        let tempObject = this.createObject(guid, label, timeStart, timeEnd, theObject.totalTime, text);
        this.arrayOfTime[rowIndex] = tempObject;
        this.saveObject();
        return true;
    }

    saveObject = () => {
        localStorage.setItem(this.storageName, JSON.stringify(this.arrayOfTime));
    }
}

