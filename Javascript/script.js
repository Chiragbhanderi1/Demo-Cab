// for active tab on navbar
const activePage = window.location.pathname;
const navlink  = document.querySelectorAll('nav ul li a').
forEach(link=>{
    if(link.href.includes(`${activePage}`)){
        link.classList.add('active');
    };
});
// active tab on navbar ends here 

// google map in location picker
var map;
var marker;
var searchBox;
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 37.7749, lng: -122.4194},
    zoom: 13
  });
  marker = new google.maps.Marker({
    map: map,
    position: map.getCenter()
  });
  searchBox = new google.maps.places.SearchBox(document.getElementById('search-box'));
  searchBox.addListener('places_changed', function() {
    var places = searchBox.getPlaces();
    if (places.length == 0) {
      return;
    }
    var bounds = new google.maps.LatLngBounds();
    places.forEach(function(place) {
      if (!place.geometry) {
        console.log("Returned place contains no geometry");
        return;
      }
      if (place.geometry.viewport) {
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });
    map.fitBounds(bounds);
    marker.setPosition(map.getCenter());
  });
}