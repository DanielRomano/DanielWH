/*
    New js using object
*/

/* Global vars */
let arrayOfTime = localStorage.getItem("arrayOfTime");



let createNewRow = (guid, label, timeStart, timeEnd) => {
    if(timeStart == "")
        timeStart = new Date
    let tempObject = {
        name: label,
        date: timeStart,
        guid: guid,
        end: timeEnd,
        totalTime: "",
        text: ""
    }
    return tempObject;
};

let saveRow = (obj) => {

}