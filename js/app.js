
function CreateGuid() {
    function _p8(s) {
        var p = (Math.random().toString(16) + "000000000").substr(2, 8);
        return s ? "-" + p.substr(0, 4) + "-" + p.substr(4, 4) : p;
    }
    return _p8() + _p8(true) + _p8(true) + _p8();
}

function dateToTime(date) {
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

function createList() {
    let arrayOf = localStorage.getItem("arrayOfTime");
    if (arrayOf == null || arrayOf == "null" || JSON.parse(arrayOf).length == 0) {

        $("#clean").hide();
        $("#list table > tbody").html("<tr><td colspan='6'>No Items</td></tr>");
    } else {
        $("#clean").show();
        $("#list table tbody").html("");
        arrayOf = JSON.parse(arrayOf);
        arrayOf.forEach(element => {
            let totalTimeWh = Number(element.totalTime / 60);
            totalTimeWh = totalTimeWh.toFixed(2);
            let ElDate = new Date(element.date);
            let dateS = ElDate.getDate() + "/" + (ElDate.getMonth() + 1);
            let color = element.text != "" ? "red" : "black";
            if (element.end == "") {
                $("#list table > tbody").append("<tr><td class='table_msum'><input class='multiselect' data-id='"+ element.guid +"' type='checkbox' /></td><td><button class='btn btn-light remove' data-id='" + element.guid + "'>x</button></td><th class='table_date'>" + dateS + "</th><td class='table_label' style='color: " + color + "' data-toggle='modal' data-target='.notesPop' data-whatever='" + element.guid + "'>" + element.name + "</td><td class='table_sdate'>" + dateToTime(element.date) + "</td><td class='table_edate'></td><td><div class='endByGUID btn btn-danger table_total' data-id='" + element.guid + "'>End now</div></td></tr>");
            } else {
                $("#list table > tbody").append("<tr><td class='table_msum'><input class='multiselect' data-id='"+ element.guid +"' type='checkbox' /></td><td><button class='btn btn-light remove' data-id='" + element.guid + "'>x</button></td><th class='table_date'>" + dateS + "</th><td class='table_label' style='color: " + color + "' data-toggle='modal' data-target='.notesPop' data-whatever='" + element.guid + "'>" + element.name + "</td><td class='table_sdate'>" + dateToTime(element.date) + "</td><td class='table_edate'>" + dateToTime(element.end) + "</td><td class='table_total'>" + totalTimeWh + "</td></tr>");
            }
        });
    }

    $(".options input:checkbox:not(:checked)").each(function() {
        var column = "table ." + $(this).attr("name");
        $(column).hide();
    });

}

function valid(object, type) {
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

$(document).ready(function () {

    let memo = localStorage.getItem("memo");
    if (memo == null || memo == "null")
        memo = new Array();
    else
        memo = JSON.parse(memo);

    memo.forEach(element => {
        let html = '<div class="memoBlock"> <div class="tile"><input type="text" class="inputMemo" data-id="'+ element.guid +'" value="'+ element.title +'"/></div><button class="btn btn-light m-3 removeMemo" data-id="'+ element.guid +'">x</button> <textarea class="memoText" data-id="'+ element.guid +'">'+ element.text +'</textarea> </div>';
        $("#memoModel").find(".modal-body").find("#memoBody").prepend(html);
    });

    $("#newMemo").on("click", function() {
        let tempGuidNew = CreateGuid();
        let temp = {
            guid: tempGuidNew,
            text: "",
            title: ""
        }
        memo.push(temp);
        localStorage.setItem("memo", JSON.stringify(memo));
        let html = '<div class="memoBlock"> <div class="tile"><input type="text" class="inputMemo" data-id="'+ tempGuidNew +'" value="" /></div><button class="btn btn-light m-3 removeMemo" data-id="'+ tempGuidNew +'">x</button> <textarea class="memoText" data-id="'+ tempGuidNew +'"></textarea> </div>';
        $("#memoModel").find(".modal-body").find("#memoBody").prepend($(html).hide().fadeIn(1000));
    });

   
    $(document).on("change", ".memoText", function() {
        let thisGuid = $(this).attr("data-id");
        memo.forEach(element => {
            if(element.guid == thisGuid) {
                element.text = $(this).val();
            }
        });
        localStorage.setItem("memo", JSON.stringify(memo));
    });

    $(document).on("change", ".inputMemo", function() {
        let thisGuid = $(this).attr("data-id");
        memo.forEach(element => {
            if(element.guid == thisGuid) {
                element.title = $(this).val();
            }
        });
        localStorage.setItem("memo", JSON.stringify(memo));
    });
    
    $(document).on("click", ".removeMemo", function() {
        var r = confirm("האם אתה בטוח שאתה רוצה למחוק?");
        if(r)
        {
            let id = $(this).attr("data-id");
            let theIndex = 'w';
            memo.forEach(function (element, index) {
                if (element.guid == id) {
                    theIndex = index;
                }
            });
            if (theIndex != 'w') {
                memo.splice(theIndex, 1);
                $(this).parent().fadeOut(1000, function() {
                    $(this).remove();
                });
            }
            localStorage.setItem("memo", JSON.stringify(memo));
        }
        
    });

    $("#searchMemo").on("keyup", function() {
        var value = $(this).val().toLowerCase();
        $("#memoBody .memoBlock").filter(function() {
            let memoInput = $(this).find(".inputMemo").val().toLowerCase().indexOf(value);
            let memoText = $(this).find(".memoText").val().toLowerCase().indexOf(value);
            let show = false;
            if(memoInput > -1 || memoText > -1)
                show = true;
          $(this).toggle(show);
        });
      });

    $('#memoModel').on('hidden.bs.modal', function () {
        $("#searchMemo").val("");
        $("#searchMemo").trigger("keyup");
    });

    /* OLD memo */
    // if (localStorage.getItem("memo1") != null) {
    //     $("#memo1").val(localStorage.getItem("memo1"));
    // }
    
    // if (localStorage.getItem("memo2") != null) {
    //     $("#memo2").val(localStorage.getItem("memo2"));
    // }
    // if (localStorage.getItem("memo3") != null) {
    //     $("#memo3").val(localStorage.getItem("memo3"));
    // }
    // $("#memoModel textarea").on("change", function() {
    //     // localStorage.setItem(this.id, $("#"+this.id).val());
    //     //OLD!
    // });

    let guid = CreateGuid();
    let arrayOf = localStorage.getItem("arrayOfTime");
    if (arrayOf == null || arrayOf == "null")
        arrayOf = new Array();
    else
        arrayOf = JSON.parse(arrayOf);

    createList();



    $("#start").on("click", function () {
        let dateNow = new Date();
        let name = $("#name").val();
        if (valid($("#name"), "text")) {
            let te = {
                name: name,
                date: dateNow,
                guid: guid,
                end: "",
                totalTime: "",
                text: ""
            }
            arrayOf.push(te);
            localStorage.setItem("arrayOfTime", JSON.stringify(arrayOf));

            $("#form").hide();
            $("#end").show();
            $("#now").html(name);
            $("#now").attr("data-whatever", guid);
            $("#nowStartTime").html(dateToTime(dateNow));

        }

    });

    $("#end").on("click", function () {
        let dateNow = new Date();
        arrayOf.forEach(element => {
            if (element.guid == guid) {
                element.end = dateNow;
                let elementDate = new Date(element.date);
                let diffDays = Math.round(Math.abs(((elementDate - dateNow) / 1000) / 60));
                element.totalTime = diffDays;
            }
        });
        localStorage.setItem("arrayOfTime", JSON.stringify(arrayOf));
        $(this).hide();
        $("#name").val("");
        $("#form").show();
        $("#now").html("");
        $("#nowStartTime").html("");

        guid = CreateGuid();

        createList();
    });

    $("#insertManual").on("click", () => {
        let validS = true;
        let timeStart = $("#TimeStart").val();
        let nameM = $("#namem").val();
        let endValue = $("#TimeEnd").val();
        if (valid($("#TimeStart"), "time") && valid($("#namem"), "text")) {
            timeStart = timeStart.split(":");
            let dateRnow = new Date();
            let year = dateRnow.getFullYear();
            let month = dateRnow.getMonth();
            let day = dateRnow.getDate();
            let end = "";
            let finalDate = new Date(year, month, day, timeStart[0], timeStart[1]);
            let total = "";
            if(endValue != "")
            {
                if(valid($("#TimeEnd"), "time")) 
                {
                    let = tempArrayTime = endValue.split(":");
                    end = new Date(year, month, day, tempArrayTime[0], tempArrayTime[1]);
                    total = Math.round(Math.abs(((finalDate - end) / 1000) / 60));
                }else{
                    validS = false;
                }
            }
            if(validS)
            {
                let te = {
                    name: nameM,
                    date: finalDate,
                    guid: guid,
                    end: end,
                    totalTime: total,
                    text: ""
                }
                arrayOf.push(te);
                localStorage.setItem("arrayOfTime", JSON.stringify(arrayOf));

                $("#insertModalCenter").modal("hide");
                $("#TimeStart").val("");
                $("#TimeEnd").val("");
                $("#namem").val("");
                if(endValue == "") {
                    $("#form").hide();
                    $("#end").show();
                    $("#now").html(nameM);
                    $("#now").attr("data-whatever", guid);
                    $("#nowStartTime").html(dateToTime(finalDate));
                }else{
                    guid = CreateGuid();
                    createList();
                }
            }
            
        }

    });

    $("#clean").on("click", () => {
        localStorage.setItem("arrayOfTime", null);
        arrayOf = new Array();
        createList();
    });
    $(document).on("click", ".endByGUID", function () {
        let tempGuid = $(this).attr("data-id");
        let dateNow = new Date();
        arrayOf.forEach(element => {
            if (element.guid == tempGuid) {
                element.end = dateNow;
                let elementDate = new Date(element.date);
                let diffDays = Math.round(Math.abs(((elementDate - dateNow) / 1000) / 60));
                element.totalTime = diffDays;
            }
        });
        localStorage.setItem("arrayOfTime", JSON.stringify(arrayOf));
        createList();
    });

    $('.notesPop').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget);
        var guidNow = button.data('whatever');
        var modal = $(this);
        arrayOf.forEach(element => {
            if (element.guid == guidNow) {
                modal.find('.modal-title').text(element.name);
                modal.find('textarea').val(element.text);
                modal.find('textarea').attr("data-id", element.guid);
                $("#saveThis").attr("data-id", element.guid);
            }
        });
    });

    
    const saveText = (text, tGuid) => {
        
        arrayOf.forEach(element => {
            if (element.guid == tGuid) {
                element.text = text;
            }
        });
        localStorage.setItem("arrayOfTime", JSON.stringify(arrayOf));
    }


    $(document).on("click", "#saveThis", function () {
        let tGuid = $(this).attr("data-id");
        saveText($(".notesPop").find("#notes").val(), tGuid);
        createList();
        $(".notesPop").find("#notes").val("");
        $(".notesPop").modal("hide");
    });


    $(document).on("focusout", "#notes", function() {
        $("#saved").fadeIn("slow");
        let tGuid = $(this).attr("data-id");
        saveText($(".notesPop").find("#notes").val(), tGuid);
        $("#saved").fadeOut("slow");
    });

    $(document).on("click", ".remove", function () {
        let id = $(this).attr("data-id");
        let theIndex = 'w';
        arrayOf.forEach(function (element, index) {
            if (element.guid == id) {
                theIndex = index;
            }
        });
        if (theIndex != 'w') {
            arrayOf.splice(theIndex, 1);
        }
        localStorage.setItem("arrayOfTime", JSON.stringify(arrayOf));
        createList();
    });

    $("#sumWh").on("click", function () {
        let sum = 0;
        let warning = false;
        arrayOf.forEach(function (element, index) {
            if(element.totalTime != "") {
                let totalTimeWh = Number(element.totalTime / 60);
                totalTimeWh = totalTimeWh.toFixed(2);
                sum += parseFloat(totalTimeWh);
            }else{
                let dn = new Date();
                let elementDate = new Date(element.date);
                let diffDays = Math.round(Math.abs(((elementDate - dn) / 1000) / 60));
                let totalTimeWh = Number(diffDays / 60);
                totalTimeWh = totalTimeWh.toFixed(2);
                sum += parseFloat(totalTimeWh);
                warning = true;
            }
        });
        sum = sum.toFixed(2);
        let warningLabel = "";
        if(warning) {
            warningLabel = "\n**שים לב נבחרו שעות לא סופיות**";
        }
        alert("כרגע יש " + sum + " שעות בטבלה" + warningLabel);
    });

    $("#timeLeft").on("click", function () {
        let today = new Date();
        let wh = 9;
        if (today.getDay() + 1 == 5) {
            wh = 8;
        }
        let warning =false;
        let sum = 0;
        arrayOf.forEach(function (element, index) {
            if(element.totalTime != "") {
                let totalTimeWh = Number(element.totalTime / 60);
                totalTimeWh = totalTimeWh.toFixed(2);
                sum += parseFloat(totalTimeWh);
            }else{
                let dn = new Date();
                let elementDate = new Date(element.date);
                let diffDays = Math.round(Math.abs(((elementDate - dn) / 1000) / 60));
                let totalTimeWh = Number(diffDays / 60);
                totalTimeWh = totalTimeWh.toFixed(2);
                sum += parseFloat(totalTimeWh);
                warning = true;
            }
            
        });

        
    



        let left = wh - sum;
        left = left.toFixed(2);
        let warningLabel = "";
        if(warning) {
            warningLabel = "\n**שים לב נבחרו שעות לא סופיות**";
        }
        alert("נותרו " + left + " שעות עבודה" + warningLabel);

    });

    function downloadToFile(content, filename, contentType) {
        const a = document.createElement('a');
        const file = new Blob([content], { type: contentType });
        a.href = URL.createObjectURL(file);
        a.download = filename;
        a.click();
        URL.revokeObjectURL(a.href);
    }

    $("#saveNotes").on("click", function () {
        let text = '';
        let today = new Date();
        let fileName = "notes-" + today.getDate() + "-" + (today.getMonth() + 1) + "-" + today.getFullYear() + ".txt";
        arrayOf.forEach(function (element, index) {
            if (element.text != "") {
                text += "-------------------------\n##" + element.name + "##\n-------------------------\n";
                text += element.text + "\n\n";
            }
        });
        if (text != "")
            downloadToFile(text, fileName, 'text/plain');

    });

    $("#saveLog").on("click", function () {
        let text = '';
        let today = new Date();
        let fileName = "log-" + today.getDate() + "-" + (today.getMonth() + 1) + "-" + today.getFullYear() + ".txt";
        arrayOf.forEach(function (element, index) {
            text += element.date + " " + element.end + " " + element.guid + " " + element.name + " " + element.totalTime + "\n";
        });
        if (text != "")
            downloadToFile(text, fileName, 'text/plain');
    });


    $(".options input:checkbox:not(:checked)").each(function() {
        var column = "table ." + $(this).attr("name");
        $(column).hide();
    });
    
    $(".options input:checkbox").click(function(){
        var column = "table ." + $(this).attr("name");
        $(column).toggle();
    });

    $("#checkMH").on("click", function() {
        let tempArray = new Array();
        $(".multiselect").each(function() {
            if(this.checked)
            {
                tempArray.push($(this).attr("data-id"));
            }
        });

        let sum = 0;
        let warning = false;
        arrayOf.forEach(function (element, index) {
            if(tempArray.includes(element.guid)) {
                if(element.totalTime != "") {
                    let totalTimeWh = Number(element.totalTime / 60);
                    totalTimeWh = totalTimeWh.toFixed(2);
                    sum += parseFloat(totalTimeWh);
                }else{
                    let dn = new Date();
                    let elementDate = new Date(element.date);
                    let diffDays = Math.round(Math.abs(((elementDate - dn) / 1000) / 60));
                    let totalTimeWh = Number(diffDays / 60);
                    totalTimeWh = totalTimeWh.toFixed(2);
                    sum += parseFloat(totalTimeWh);
                    warning = true;
                }
            
            }
            
        });
        sum = sum.toFixed(2);
        let warningLabel = "";
        if(warning) {
            warningLabel = "\n**שים לב נבחרו שעות לא סופיות**";
        }
        alert("נבחרו: " + sum+ " שעות" + warningLabel);
    });



    $(document).on("click", ".table_msum", function(e) {
        if(e.target.classList.contains('table_msum')) {
            let tempObj = $(this).find("input:checkbox");
            if(tempObj.is(":checked")) {
                tempObj.prop('checked', false);
            }else{
                tempObj.prop('checked', true);
            }
        }
    });

    

    $(document).click(function (event) {
        var clickover = $(event.target);
        var _opened = $(".theSettings ").hasClass("show");
        if (_opened === true && clickover.closest('#theSettings').length == 0) {
            $("#settingsIcon").click();
        }
    });

    $(document).on("click", "#logo", function(e) {
        e.preventDefault();
        /*
            You can use the logo button for testing :)
            for Example print WHs array:
            console.log(arrayOf);
        */  

        let today = new Date();
        let wh = 9;
        if (today.getDay() + 1 == 5) {
            wh = 8;
        }
        let startDate = new Date();
        startDate.setHours(09, 00, 00);
        let timeNow = Math.round(Math.abs(((startDate - today) / 1000) / 60));
        let totalTimeWh = Number(timeNow / 60);
        totalTimeWh = totalTimeWh.toFixed(2);
        let sum = wh - parseFloat(totalTimeWh);
        alert(sum.toFixed(2));
        
    });
});

