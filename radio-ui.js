
function ajaxCall (name, onSuccess) {

  $.ajax({
    url: "/"+name,
    dataType: "json",
    success: onSuccess,
    error: function(error, errorStr) { reportServerError(error, errorStr); }
  });

}

function switchStation(name) {

  ajaxCall(name, function(data) {
    console.log(data);
    $(".selected").removeClass('selected');
    if (name != 'stop')
      $("#"+name).addClass('selected');
    $('.volume').val(data.volume);
  });

}

function changeVolume(direction, button) {

  ajaxCall(direction, function(data) {
    $('.volume').val(data.volume);
  });

}

function reportServerError(errorObject, errorString) {

  alert(errorString);
//   $('#errorPopup').text(errorString);
//   $('#errorPopup').removeClass("hidden");
//   $('#errorPopup').addClass("visible");

}

$('.station').unbind().on('click', function (event) {
  switchStation(event.target.id);
});

$('.volumeup').unbind().on('click', function (event) {
  changeVolume('up', $(this));
});

$('.volumedown').unbind().on('click', function (event) {
  changeVolume('down', $(this));
});
