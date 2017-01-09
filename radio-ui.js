
function switchStation(name) {
   $.ajax({
      url: "/"+name,
      dataType: "json",
      success: function(data) {
          console.log(data);
          $(".selected").removeClass('selected');
          if (name != 'stop')
            $("#"+name).addClass('selected');
      },
      error: function(error, errorStr) { reportServerError(error, errorStr); }
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
