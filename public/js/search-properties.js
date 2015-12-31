//<![CDATA[
$(window).load(function(){
 $('.panel').mouseenter(function() {
    lat = $(this).find("[name='lat']").val();
    lng = $(this).find("[name='lng']").val();
    address1 = $(this).find("[name='address1']").val();
    address2 = $(this).find("[name='address2']").val();
    
    $('.panel').removeClass('panel-primary');
    $(this).addClass('panel-primary');
    
    var newLatLng = new google.maps.LatLng(lat, lng);
    marker.setPosition(newLatLng);
    infowindow.setContent("<div><strong>" + address1 + "</strong><br>" + address2);
 });
 initAutocomplete();
});//]]>

var myLat = Number(document.getElementById('lat').value);
var myLng = Number(document.getElementById('lng').value);
var myLatLng = {lat: myLat, lng: myLng};
var address1 = document.getElementById('address1').value;
var address2 = document.getElementById('address2').value;
var radius = document.getElementById('radius').value;

var map = new google.maps.Map(document.getElementById('map'), {
    center: myLatLng,
    zoom: 19,
    mapTypeId: google.maps.MapTypeId.SATELLITE,
    streetViewControl: false,
    mapTypeControl: false,
    panControl: false
});
var options = {
    types: ['address'],
    componentRestrictions: {country: "us"}
};
var input = /** @type {!HTMLInputElement} */(document.getElementById('pac-input'));

map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

var meterRadius = ((radius * 1609.344)+5);  //added buffer = 5 since rooftop geocodes may fall outside circle

var addressCircle = new google.maps.Circle({
      strokeColor: '#FF0000',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#FF0000',
      fillOpacity: 0.35,
      map: map,
      center: myLatLng,
      radius: meterRadius
});

var marker = new google.maps.Marker({
    position: myLatLng,
    map: map
});

var infowindow = new google.maps.InfoWindow({
    content: "<div><strong>" + address1 + "</strong><br>" + address2
});

infowindow.open(map, marker);

function initAutocomplete() {
  // Create the autocomplete object, restricting the search to geographical
  // location types.
  autocomplete = new google.maps.places.Autocomplete(
      /** @type {!HTMLInputElement} */(document.getElementById('pac-input')),
      {types: ['address'],componentRestrictions: {country: "us"}});
  
  autocomplete.addListener('place_changed', function() {
    var place = autocomplete.getPlace();
    if (!place.geometry) {
      window.alert("Google does not recognize that address.  Select an address from the dropdown.  US addresses only.");
      return;
    } else {
        SearchProperty(place.address_components,place.geometry.location.lat(),place.geometry.location.lng());
    }
  });
}

function SearchProperty(components,lat,lng) {
    var street_number, street, city, state, zip_code;
    
    for (var i = 0, component; component = components[i]; i++) {
        console.log(component);
        if (component.types[0] == 'street_number') {
            street_number = component['long_name'];
        }
        if (component.types[0] == 'route') {
            street = component['long_name'];
        }
        if (component.types[0] == 'locality') {
            city = component['long_name'];
        }
        if (component.types[0] == 'administrative_area_level_1') {
            state = component['long_name'];
        }
        if (component.types[0] == 'postal_code') {
            zip_code = component['long_name'];
        }
    }
    window.location.href = "../property-records/search?address1=" + street_number + " " + street + "&address2=" + city + ", " + state  + " " + zip_code + "&radius=.01&lat=" + lat + "&lng=" + lng+"&page=1";
}

function GetSalesHistory(propertyid) {
        
    var saleshistoryDiv = "#sales-history-" + propertyid;
    
    $(saleshistoryDiv).html('<img src="/images/loading.gif" />');
    $.ajax({
        url: '/property-records/sales-history',
        type: 'GET',
        data: 'propertyid=' + propertyid,
        success: function(data) {
              //called when successful
              $(saleshistoryDiv).html(data);
        },
        error: function(e) {
              //called when there is an error
              $(saleshistoryDiv).html(e.message);
        }
      });
};
  
function GetAssessment(propertyid) {
        
    var assessmentDiv = "#assessment-" + propertyid;
    
    $(assessmentDiv).html('<img src="/images/loading.gif" />');
    $.ajax({
        url: '/property-records/assessment',
        type: 'GET',
        data: 'propertyid=' + propertyid,
        success: function(data) {
              //called when successful
              $(assessmentDiv).html(data);
        },
        error: function(e) {
              //called when there is an error
              $(assessmentDiv).html(e.message);
        }
      });
};
  
function GetAVM(propertyid) {
        
    var avmDiv = "#avm-" + propertyid;
    
    $(avmDiv).html('<img src="/images/loading.gif" />');
    $.ajax({
        url: '/property-records/avm',
        type: 'GET',
        data: 'propertyid=' + propertyid,
        success: function(data) {
              //called when successful
              $(avmDiv).html(data);
        },
        error: function(e) {
              //called when there is an error
              $(avmDiv).html(e.message);
        }
      });
};