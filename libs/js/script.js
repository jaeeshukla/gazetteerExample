


var nowLat,nowLong;

 var marker;
var mymap = L.map('mapid');
var myLayer = L.geoJSON().addTo(mymap);
var redIcon = L.icon({
    iconUrl: 'https://leafletjs.com/examples/custom-icons/leaf-red.png',
    shadowUrl: 'https://leafletjs.com/examples/custom-icons/leaf-shadow.png',

    iconSize:     [38, 95], // size of the icon
    shadowSize:   [50, 64], // size of the shadow
    iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
    shadowAnchor: [4, 62],  // the same for the shadow
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});
//fetch the device's location coordionates., load the maps and set the marker to current location.

 if (navigator.geolocation) 
 {
    navigator.geolocation.getCurrentPosition(showPosition);
}
  
  function showPosition(position)
  { 
  
  window.nowLat = position.coords.latitude;
  window.nowLong = position.coords.longitude;
  
   console.log(window.nowLat + " and " +   window.nowLong);


mymap.fitBounds([
    [window.nowLat,window.nowLong],
   [window.nowLat,window.nowLong]
]);

mymap.setZoom(5);

mymap.setMaxBounds([[-90,-180],[90,180]]);

//var mymap = L.map('mapid').fitBounds([window.nowLat,window.nowLong],[window.nowLat,window.nowLong]);


//'https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png'

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	noWrap : true
}).addTo(mymap);


//this is the blue marker indication the country which is displayed
  window.marker = L.marker([window.nowLat,window.nowLong], {icon : redIcon}).addTo(mymap).on('click', onClick);
marker.bindPopup("<b>Hello!</b><br>You are here. Click for details.").openPopup();





var latlngs = [[[-104.05, 48.99],[-97.22,  48.98],[-96.58,  45.94],[-104.03, 45.94],[-104.05, 48.99]]];
		
//var latlngs = [[37, -109.05],[41, -109.03],[41, -102.05],[37, -102.04]];

getCountry();

} //end function


function onClick(e)
{
  //window.marker.closePopup();
  modal.style.display = "block";
  clickinfo();

}

function onClickMarker(e)
{
	
	var selCountrycode = document.getElementById("selCountry").value;
	console.log("onchange country " + selCountrycode);
	callCountryInfoApi(selCountrycode);

}

function callCountryInfoApi(countrycode)
{

	console.log("countrycode is " + countrycode);
			$.ajax({
			url: "libs/php/getCountryCapital.php",
			type: 'POST',
			dataType: 'json',
			data: {
				codeofcountry: countrycode
			},
			success: function(result) {

				
				//console.log(result);
				//console.log(result['data']['currencies'][0]['code']);
				if (result.status.name == "ok") {

								
					//document.getElementById("infoData").innerHTML = document.getElementById("infoData").innerHTML + "<br>" + "Capital is " +  result['data'][0]['capital'] + "<br>" + "Population is " +  result['data'][0]['population'];
					
					console.log(result['data']['capital']);
					console.log(result['data']['population']);
					console.log(result['data']['currencies'][0]['name']);
					console.log(result['data']['currencies'][0]['code']);
					
					
					document.getElementById("infoData").innerHTML = "Country Name & Code : " +  result['data']['name'] 
				+ " ( " +  countrycode + " ) "
					+ "<br>" +  " Capital : " +  result['data']['capital'] 
					+ "<br>" + "Population : " +  result['data']['population'] 
					+ "<br/>" + "Currency: " + result['data']['currencies'][0]['name'] + " ( " + result['data']['currencies'][0]['symbol']  + " ) " + result['data']['currencies'][0]['code'];
					
					
					//console.log(document.getElementById("infoData").innerHTML);
				}
	

				exchangeRate(result['data']['currencies'][0]['code']);
				funcGetWeather(window.nowLat,window.nowLong);
				console.log("latitude and longitude for weather" + window.nowLat + " and " + window.nowLong);
					
				window.modal.style.display = "block";
				
			},
			error: function(jqXHR, textStatus, errorThrown) {
				// your error code
			}
		}); 	
}


function funcUpdateMarker(countrycode)
{
	
	
		$.ajax({
			url: "libs/php/getCountryCapital.php",
			type: 'POST',
			dataType: 'json',
			data: {
				codeofcountry: countrycode
			},
			success: function(result) {

				if (result.status.name == "ok") {
				
					console.log("new coordinates");
					console.log(result['data']['name']);
					console.log(result['data']['capital']);
					console.log(result['data']['latlng']);
					console.log(result['data']['latlng'][0]);
					console.log(result['data']['latlng'][1]);
					window.nowLat = result['data']['latlng'][0];
					window.nowLong = result['data']['latlng'][1];
					
					mymap.removeLayer(marker);
					
					//this is the blue marker indication the country which is displayed
					window.marker = L.marker(result['data']['latlng'], {icon : redIcon }).addTo(mymap).on('click', onClickMarker);
					marker.bindPopup("<b>Hello! You are here. Click for Info </b>").openPopup();
					
					mymap.fitBounds([result['data']['latlng'],result['data']['latlng']]);
					mymap.setZoom(5);
				}
	
				
			},
			error: function(jqXHR, textStatus, errorThrown) {
				// your error code
			}
		}); 
	
	
}




	 selCountry.onchange = myFunction;
	 
	 function myFunction(){
		 console.log("existing someFeatures");
		 console.log(window.someFeatures);
		 modal.style.display = "none";
		 
		 myLayer.clearLayers(); 
	
		 
		
		var selectval = document.getElementById("selCountry").value;
		console.log("onchange country " + selectval);
		
		
		//get select country name text
		  var cname =  document.getElementById("selCountry");
		var text = cname.options[cname.selectedIndex].text;
  
		console.log("Onchange country name " + text);
	
		
	
		/**********************/
		$.ajax({
			url: "libs/php/populateCountryNames.php",
			type: 'POST',
			dataType: 'json',
			success: function(result) {
			
				//console.log(result);
				//console.log(result.features.length);
				
					
					
				
				for ($x = 0; $x < result.features.length; $x++) {
					
					//console.log(result.features);
			
					
					//console.log("name is : " + result.features[$x]['properties']['name']);   //has the name of the country
					//console.log("Country code : " + result.features[$x]['properties']['iso_a2']);
				
					
					if(result.features[$x]['properties']['iso_a2'] == selectval)
					{
						console.log("Country code : " + result.features[$x]['properties']['iso_a2']);
						
						
						var someFeature = result.features[$x];
						myLayer.addData(someFeature);
							//below code makes the borders of the country on the map
					/*
						 	  window.someFeature = result.features[$x];
							console.log("new border ");
							console.log(someFeature);
					
							L.geoJSON(someFeature).addTo(mymap); */
					}
					//window.modal.style.display = "block";
					
					
					
				}
				document.getElementById("infoData").innerHTML = "";
				
				funcUpdateMarker(selectval);
			
			
				
			},
			error: function(jqXHR, textStatus, errorThrown) {
			
			}
		}); 
		
		/*********************************/
		
		
		
	 }
	 
	//btninfo.onclick = getCountry;
	
	function getCountry(){
		
		console.log("Length : " + document.getElementById("selCountry").length);
		$val = document.getElementById("selCountry");
		while ($val.options.length > 0) {
        $val.remove(0);
        }
	
	
		$.ajax({
			url: "libs/php/populateCountryNames.php",
			type: 'POST',
			dataType: 'json',
			success: function(result) {
			
				//console.log(result);
				console.log(result.features.length);
			
				 
				 var x = document.getElementById("selCountry");
				
				 var optiony = document.createElement("option");
					optiony.text = "Select";
					optiony.disabled = true;
					optiony.selected = true;
					 x.add(optiony);
					 
				 
				for ($x = 0; $x <result.features.length; $x++) {
					
					//console.log(result.features);
			
					
					//console.log("name is : " + result.features[$x]['properties']['name']);
					//console.log("Country code : " + result.features[$x]['properties']['iso_a2']);
					
					//var x = document.getElementById("selCountry");
					var option = document.createElement("option");
					option.text = result.features[$x]['properties']['name'];
					option.value = result.features[$x]['properties']['iso_a2'];
					 x.add(option);
					 
					
				}
				//console.log(result.features[0]['properties']['name']);
				sortOptionData();
			},
			error: function(jqXHR, textStatus, errorThrown) {
				// your error code
				//console.log(errorThrown);
			}
		}); 
		
		
	}	
	function sortOptionData()
	{
		var options = document.getElementById("selCountry").options;
		var optionsArray = [];
		for (var i = 0; i < options.length; i++) {
			optionsArray.push(options[i]);
		}
		  optionsArray = optionsArray.sort(function (a, b) {           
        return a.innerHTML.toLowerCase().charCodeAt(0) - b.innerHTML.toLowerCase().charCodeAt(0);    
		});

		for (var i = 0; i <= options.length; i++) {            
        options[i] = optionsArray[i];
		}
		//options[0].selected = true;
	}
	
	function exchangeRate(codeofcurrency)
	{
			
		$.ajax({
			url: "libs/php/infoCurrency.php",
			type: 'POST',
			dataType: 'json',
			
			success: function(result) {
	
				console.log("exchange rate");
				console.log(result);

				if (result.status.name == "ok") {
					
					console.log("rates lenght" + result['data']['rates'][codeofcurrency]);
					
				document.getElementById("infoData").innerHTML = document.getElementById("infoData").innerHTML + "<br>" + "Exchange Rate : " + result['data']['rates'][codeofcurrency];
				
				
				}
			
			},
			error: function(jqXHR, textStatus, errorThrown) {
				// your error code
			}
		});
	
	}
	
	
	function functionloadBorder(ccode)
	{
		
		$.ajax({
			url: "libs/php/populateCountryNames.php",
			type: 'POST',
			dataType: 'json',
			success: function(result) {
			
				console.log("functionloadBorder - load the border" + ccode);
				//console.log(result.features.length);
				
				
				
				for ($x = 0; $x < result.features.length; $x++) {
					
					//console.log(result.features);
			
					
					//console.log("name is : " + result.features[$x]['properties']['name']);
					//console.log("Country code : " + result.features[$x]['properties']['iso_a2']);
				
					
					if(result.features[$x]['properties']['iso_a2'] == ccode)
					{
						
						var someFeatures = result.features[$x];
					     myLayer.addData(someFeatures);
						
						/*
							//below code makes the borders of the country on the map
					
							 window.someFeatures = result.features[$x];
							console.log(someFeatures);
					
							L.geoJSON(someFeatures).addTo(window.minemap);
							*/
					}
					//window.modal.style.display = "block";
					
					
					
				}

			},
			error: function(jqXHR, textStatus, errorThrown) {
				// your error code
				//console.log(errorThrown);
			}
		}); 
		
	}
	
	function funcGetWeather(lati,longi)
	{
		/* -----------------------------*/
		$.ajax({
			url: "libs/php/getWeather.php",
			type: 'POST',
			dataType: 'json',
			data: {
				latitude: lati,
				longitude: longi
			},
			success: function(result) {
				console.log("weather data");
				console.log(result);

				if (result.status.name == "ok") {

			
					console.log(result['data']['main']['temp']);
					var TempCelcius = Math.round(result['data']['main']['temp'] - 273.15);
					console.log(result['data']['weather'][0]['description']);
					document.getElementById("infoData").innerHTML = document.getElementById("infoData").innerHTML 
					+ "<br>" + "Temperature : " + TempCelcius + "o".sup() + "C , " + result['data']['weather'][0]['description'];
				
				}
			
			},
			error: function(jqXHR, textStatus, errorThrown) {
				// your error code
			}
		}); 
		/* ------------------------------*/
	}
	
	
//get the counrty code and country name from findNearbyPlaceNameJSON
 //	$('#btninfo').click(function() {
	function clickinfo(){
					
		
		$.ajax({
			url: "libs/php/getCountryInfo.php",
			type: 'POST',
			dataType: 'json',
			data: {
				latitude: window.nowLat,
				longitude: window.nowLong
			},
			success: function(result) {

				console.log(result);

				if (result.status.name == "ok") {



					console.log(result['data'][0]['countryCode']);
					console.log(result['data'][0]['countryName']);
					
					//document.getElementById("infoData").innerHTML = "Country Name: " + result['data'][0]['countryName'] + "<br>" + "Country Code: " + result['data'][0]['countryCode'];
					
					callCountryInfoApi(result['data'][0]['countryCode']);
					
					
					functionloadBorder(result['data'][0]['countryCode']);
				}
			
			},
			error: function(jqXHR, textStatus, errorThrown) {
				// your error code
			}
		}); 
	}

//	});
	

	// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal 
/* btn.onclick = function() {
  modal.style.display = "block";
  clickinfo();
  
  
 // document.getElementById("infoData").innerHTML = "hey";
}
 */
// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
  
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}



