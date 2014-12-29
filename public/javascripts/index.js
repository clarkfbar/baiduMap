(function(){
  var map;
  var socketio = io.connect('http://localhost:3001');
  var idMarkerMap = {};
  var id = null;

  $.ajax({
      url: "./getId",
      type: "GET",
      dataType: "JSON",
      async: false,
      success: function(data) {
        id = data;
      }
    }
  );

  function mapInit(){
    map = new BMap.Map("container");
    var point = new BMap.Point(120.189479,30.280454);
    map.centerAndZoom(point, 13);
    map.addControl(new BMap.NavigationControl());
    map.addControl(new BMap.ScaleControl());
    map.addControl(new BMap.OverviewMapControl());    
    map.addControl(new BMap.MapTypeControl()); 
    map.enableScrollWheelZoom();
    map.enableInertialDragging();
    map.enableContinuousZoom();

    get_location();
  }

  function get_location(){
    if(navigator.geolocation) {
      navigator.geolocation.watchPosition(update_position, onError);
    } else {
      onError();
    }
  }

  function onError(){
    console.log("on error");
    var position = {};
    position.coords = {longitude: 120.189479, latitude: 30.280454, accuracy: 0};
    update_position(position);
  }

  function update_position(position) {
    var temp_position = {};
    temp_position.id = id;
    temp_position.longitude = position.coords.longitude;
    temp_position.latitude = position.coords.latitude;
    socketio.emit("location", temp_position);
    location_changed(temp_position);
  }

  function location_changed(position){
    var point = new BMap.Point(parseFloat(position.longitude), parseFloat(position.latitude));
    if(idMarkerMap[position.id]) {
      idMarkerMap[id].marker.setPosition(position);
    } else {
      var marker = new BMap.Marker(point);
      map.addOverlay(marker);

      idMarkerMap[position.id] = {};
      idMarkerMap[position.id].marker = marker;
    }
  }

  mapInit();

  socketio.on('connection', function(socket){
    socket.on('location', function(location){
      location_changed(location);
    });
  });
})();