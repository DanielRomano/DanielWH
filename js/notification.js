let timeNotifactionToShow = 900000;
let notificationOn = true;
var setTimou;

if (localStorage.getItem("timeNotifactionToShow") != null) {
  timeNotifactionToShow = localStorage.getItem("timeNotifactionToShow");
  $("#notTime").val(parseInt(timeNotifactionToShow) / 1000 / 60);

}


if (localStorage.getItem("notificationOn") != null) {
  notificationOnFromStorage = localStorage.getItem("notificationOn");
  notificationOn = notificationOnFromStorage == 'true';
  $("#notTurnOnOFF").prop('checked', notificationOn);

}


if ('Notification' in window) {
  if (Notification.permission == "granted") {
    setTimou = setTimeout(setNotfication, timeNotifactionToShow)
  }
}

function setNotfication() {
  nonPersistentNotification();
  setTimou = setTimeout(setNotfication, timeNotifactionToShow);
}

function requestPermission() {
  if (!('Notification' in window)) {
    alert('Notification API not supported!');
    return;
  }

  Notification.requestPermission(function (result) {
    console.log(result);
  });
}

function nonPersistentNotification() {
  if (notificationOn) {
    if (!('Notification' in window)) {
      alert('Notification API not supported!');
      return;
    }

    try {
      var notification = new Notification('רישום שעות עבודה', {
        body: 'האם המשימה שאתה עובד עלייה עכשיו מופיעה במונה?',
        icon: './img/clock2.png'
      });
    } catch (err) {
      alert('Notification API error: ' + err);
    }
  }

}

//Settings.
$(document).on("change", "#notTurnOnOFF", function (e) {
  notificationOn = this.checked;
  localStorage.setItem("notificationOn", notificationOn);
});

$(document).on("change", "#notTime", function (e) {
  timeNotifactionToShow = $(this).val() * 1000 * 60;
  clearTimeout(setTimou);
  setTimou = setTimeout(setNotfication, timeNotifactionToShow)
  localStorage.setItem("timeNotifactionToShow", timeNotifactionToShow);


});