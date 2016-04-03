(function () {
  'use strict';

  angular
    .module('middleway')
    .controller('MapController', MapController);

  /** @ngInject */
  function MapController($timeout, webDevTec, toastr) {
    var vm = this;

    vm.location1 = "";
    vm.marker1 = null;
    vm.location2 = "";
    vm.marker2 = null;
    vm.markerCenter = null;

    var iconBase = 'http://maps.google.com/mapfiles/kml/pal2/';

    vm.initMap = function () {

      vm.googleMap = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 59.8944444, lng: 30.2641667},
        zoom: 13
      });

      vm.geocoder = new google.maps.Geocoder();

      // Create the search box and link it to the UI element.
      var input = document.getElementById('pac-input');
      var searchBox = new google.maps.places.SearchBox(input);
      vm.googleMap.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

      // Bias the SearchBox results towards current map's viewport.
      vm.googleMap.addListener('bounds_changed', function () {
        searchBox.setBounds(vm.googleMap.getBounds());
      });

      var markers = [];
      // Listen for the event fired when the user selects a prediction and retrieve
      // more details for that place.
      searchBox.addListener('places_changed', function () {
        var places = searchBox.getPlaces();

        if (places.length == 0) {
          return;
        }

        // Clear out the old markers.
        markers.forEach(function (marker) {
          marker.setMap(null);
        });

        markers = [];

        // For each place, get the icon, name and location.
        var bounds = new google.maps.LatLngBounds();
        places.forEach(function (place) {
          var icon = {
            url: place.icon,
            size: new google.maps.Size(71, 71),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(17, 34),
            scaledSize: new google.maps.Size(25, 25)
          };

          // Create a marker for each place.
          markers.push(new google.maps.Marker({
            map: vm.googleMap,
            icon: icon,
            title: place.name,
            position: place.geometry.location
          }));

          if (place.geometry.viewport) {
            // Only geocodes have viewport.
            bounds.union(place.geometry.viewport);
          } else {
            bounds.extend(place.geometry.location);
          }
        });
        vm.googleMap.fitBounds(bounds);
      })
    }

    vm.initMap();

    vm.drawMiddleWayEnabled = function () {
      return vm.location1 && vm.location1.length > 0 && vm.location2 && vm.location2.length;
    }

    vm.midPoint = function(locations) {
      var bound = new google.maps.LatLngBounds();

      for (var i = 0; i < locations.length; i++) {
        bound.extend(new google.maps.LatLng(locations[i].lat(), locations[i].lng()));
      }

     return bound.getCenter();
    }

    vm.drawMiddleWay = function () {
      vm.geocoder.geocode({address: vm.location1}, function (results1, status1) {
        if (status1 == google.maps.GeocoderStatus.OK) {
          vm.geocoder.geocode({address: vm.location2}, function (results2, status2) {
            if (status2 == google.maps.GeocoderStatus.OK) {
              var loc1 = results1[0].geometry.location;
              vm.createMarker(loc1, vm.marker1);
              var loc2 = results2[0].geometry.location;
              vm.createMarker(loc2, vm.marker2);

              var flightPlanCoordinates = [
                {lat: loc1.lat(), lng: loc1.lng()},
                {lat: loc2.lat(), lng: loc2.lng()},
              ];

              var flightPath = new google.maps.Polyline({
                path: flightPlanCoordinates,
                geodesic: true,
                strokeColor: '#FF0000',
                strokeOpacity: 1.0,
                strokeWeight: 2
              });

              flightPath.setMap(vm.googleMap);

              var midPoint = vm.midPoint([loc1, loc2]);

              vm.markerCenter = new google.maps.Marker({
                map: vm.googleMap,
                position: midPoint,
                icon: iconBase + 'icon36.png'
              });

            } else {
              toastr.info("The Geocode was not successful for : " + vm.location2);
            }
          })
        } else {
          toastr.info("The Geocode was not successful for : " + vm.location1);
        }
      })


    }

    vm.clear1 = function () {
      vm.location1 = '';
    }

    vm.clear2 = function () {
      vm.location2 = '';
    }

    vm.find = function (addressInput, marker) {
      vm.geocoder.geocode({address: addressInput}, function (results, status) {

        if (status == google.maps.GeocoderStatus.OK) {
          var loc = results[0].geometry.location;
          vm.createMarker(loc, marker);
          vm.googleMap.setCenter(loc);
          //   vm.googleMap.setZoom(17);
        } else {
          toastr.info("The Geocode was not successful for the following reason: " + status);
        }
      })
    }

    var image = new google.maps.MarkerImage(
      'assets/images/mapmarker.png',
      new google.maps.Size(50, 59),
      new google.maps.Point(0, 0),
      new google.maps.Point(25, 59)
    );

    var shadow = new google.maps.MarkerImage(
      'assets/images/mapmarkershadow.png',
      new google.maps.Size(84, 59),
      new google.maps.Point(0, 0),
      new google.maps.Point(25, 59)
    );

    var shape = {
      coord: [30, 0, 32, 1, 34, 2, 35, 3, 37, 4, 38, 5, 40, 6, 48, 7, 49, 8, 48, 9, 49, 10, 49, 11, 49, 12, 47, 13, 48, 14, 45, 15, 39, 16, 37, 17, 27, 18, 26, 19, 26, 20, 26, 21, 26, 22, 25, 23, 27, 24, 29, 25, 30, 26, 31, 27, 32, 28, 33, 29, 33, 30, 34, 31, 35, 32, 35, 33, 35, 34, 35, 35, 35, 36, 35, 37, 35, 38, 33, 39, 19, 40, 20, 41, 20, 42, 21, 43, 21, 44, 22, 45, 30, 46, 30, 47, 30, 48, 26, 49, 26, 50, 26, 51, 28, 52, 29, 53, 30, 54, 30, 55, 27, 56, 27, 57, 27, 58, 20, 58, 20, 57, 4, 56, 3, 55, 2, 54, 2, 53, 1, 52, 1, 51, 1, 50, 0, 49, 0, 48, 0, 47, 0, 46, 0, 45, 0, 44, 0, 43, 0, 42, 0, 41, 0, 40, 0, 39, 0, 38, 0, 37, 0, 36, 0, 35, 0, 34, 1, 33, 1, 32, 0, 31, 0, 30, 0, 29, 0, 28, 0, 27, 0, 26, 1, 25, 1, 24, 2, 23, 2, 22, 2, 21, 3, 20, 4, 19, 5, 18, 6, 17, 6, 16, 7, 15, 8, 14, 9, 13, 11, 12, 12, 11, 14, 10, 16, 9, 18, 8, 19, 7, 19, 6, 19, 5, 20, 4, 20, 3, 21, 2, 22, 1, 23, 0, 30, 0],
      type: 'poly'
    };

    vm.createMarker = function (latlng, marker) {
      // If the user makes another search you must clear the marker variable
      if (marker != null && marker != '') {
        marker.setMap(null);
        marker = '';
      }

      marker = new google.maps.Marker({
        map: vm.googleMap,
        position: latlng,
        icon: image,
        shadow: shadow,
        shape: shape,
      });

    }

    vm.find1 = function () {
      vm.find(vm.location1, vm.marker1);
    }

    vm.find1Enabled = function () {
      return vm.location1 && vm.location1.length > 0;
    }

    vm.find2 = function () {
      vm.find(vm.location2, vm.marker2);
    }

    vm.find2Enabled = function () {
      return vm.location2 && vm.location2.length > 0;
    }
  }
})();
