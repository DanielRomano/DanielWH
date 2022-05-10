class WHelper {
    static getGuid = () => {
        let _p8 = (s) => {
            var p = (Math.random().toString(16) + "000000000").substr(2, 8);
            return s ? "-" + p.substr(0, 4) + "-" + p.substr(4, 4) : p;
        }
        return _p8() + _p8(true) + _p8(true) + _p8();
    }

    static dateToTime = (date) => {
        let dateF = new Date(date);
        let hours = dateF.getHours();
        let minutes = dateF.getMinutes();
        if (hours < 10) {
            hours = "0" + hours;
        }
        if (minutes < 10)
            minutes = "0" + minutes;
        return hours + ":" + minutes;
    }

    static validation = (object, type) => {
        object.css("border", "1px solid red");
        if (type == "text") {
            if (object.val() == "")
                return false;
        }

        if (type == "time") {
            let time = object.val().split(":");
            let timeNow = new Date();
            if (time[0] == undefined || time[1] == undefined)
                return false;

            if (time[0].length != 2 || time[1].length != 2)
                return false;

            if (timeNow.getHours() < parseInt(time[0]))
                return false;

        }

        object.css("border", "");
        return true;
    }
}