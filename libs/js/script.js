var arr = new Object();

var nowLat,nowLong;
var loadcountry;
var ctEasyBtn;
var mytable = document.getElementById("mytableid");
//var marker;
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

/* 
//this is the blue marker indication the country which is displayed
  window.marker = L.marker([window.nowLat,window.nowLong], {icon : redIcon}).addTo(mymap).on('click', onClick);
marker.bindPopup("<b>Hello!</b><br>You are here.").openPopup();
 */

var circle = L.circle([window.nowLat,window.nowLong], {
    color: 'red',
    fillColor: '#f03',
    fillOpacity: 0.5,
    radius: 10000
}).addTo(mymap);


var latlngs = [[[-104.05, 48.99],[-97.22,  48.98],[-96.58,  45.94],[-104.03, 45.94],[-104.05, 48.99]]];
		
//var latlngs = [[37, -109.05],[41, -109.03],[41, -102.05],[37, -102.04]];


getCountry();
getcodeforBorder(window.nowLat,window.nowLong);

clickinfo();

loadeasybutton();
} //end function


function loadeasybutton()
{
	/*
	ctEasyBtn = L.easyButton('fa-rupee', function(){
		document.getElementById("weatherModal").show();
	}).addTo(mymap);
	*/
	
	ctEasyBtn = L.easyButton('fa-money', function(){
		alert("hello");
	}).addTo(mymap);
	
}

//function onClick(e)
function dontcallMe()
{
  //window.marker.closePopup();


//commented on 3 june to hide model
  //modal.style.display = "block";
  clickinfo();
	

}

function getcodeforBorder(lat,lon)
{

	$.ajax({
			url: "libs/php/getCountryInfo.php",
			type: 'POST',
			dataType: 'json',
			data: {
				latitude: lat,
				longitude: lon
			},
			success: function(result) {

				if (result.status.name == "ok") {
					
					//window.loadcountry = result['data'][0]['countryCode'];
					functionloadBorder(result['data'][0]['countryCode']);
				
					
				}
			
			},
			error: function(jqXHR, textStatus, errorThrown) {
				// your error code
			}
		}); 
		
	
}

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

				//console.log(result);

				if (result.status.name == "ok") {


					//console.log("clickinfo");
					console.log(result['data'][0]['countryCode'] + ", " + result['data'][0]['countryName']);
				//	console.log(result['data'][0]['countryName']);
					
					//document.getElementById("infoData").innerHTML = "Country Name: " + result['data'][0]['countryName'] + "<br>" + "Country Code: " + result['data'][0]['countryCode'];
					
					callCountryInfoApi(result['data'][0]['countryCode'],result['data'][0]['countryName']);
					
					
				//	functionloadBorder(result['data'][0]['countryCode']);
				//comment 24 may	
					
				}
			
			},
			error: function(jqXHR, textStatus, errorThrown) {
				// your error code
			}
		}); 
}


function callCountryInfoApi(countrycode,cname)
{
				//console.log("callCountryInfoApi");
	//console.log("countrycode is " + countrycode);
			$.ajax({
			url: "libs/php/getCountryCapital.php",
			type: 'POST',
			dataType: 'json',
			data: {
				codeofcountry: countrycode
			},
			success: function(result) {

				
				//console.log(result);
				var altname = "noname";
				//console.log(result['data']['currencies'][0]['code']);
				if (result.status.name == "ok") {

								
					//document.getElementById("infoData").innerHTML = document.getElementById("infoData").innerHTML + "<br>" + "Capital is " +  result['data'][0]['capital'] + "<br>" + "Population is " +  result['data'][0]['population'];
					console.log("callCountryInfoApi");
					console.log(result['data']['capital'] + " , " + result['data']['population']  + " , " +  result['data']['currencies'][0]['name']  + " , " +  result['data']['currencies'][0]['code']);
				//data.altSpellings[1]
					console.log("altname " + result['data']['altSpellings'][1]);
					if(typeof result['data']['altSpellings'][1] !== 'undefined')
					{
						altname = result['data']['altSpellings'][1];
					}
					//3 may
				/*
					document.getElementById("infoData").innerHTML = "Country Name & Code : " +  result['data']['name'] 
				+ " ( " +  countrycode + " ) "
					+ "<br>" +  " Capital : " +  result['data']['capital'] 
					+ "<br>" + "Population : " +  result['data']['population'] 
					+ "<br/>" + "Currency: " + result['data']['currencies'][0]['name'] + " ( " + result['data']['currencies'][0]['symbol']  + " ) " + result['data']['currencies'][0]['code'];
					*/
					
					
					arr.name = result['data']['name'];
					arr.code = countrycode;
					arr.capital = result['data']['capital'];
					arr.population =  result['data']['population'];
					arr.currency = result['data']['currencies'][0]['name'] + " ( " + result['data']['currencies'][0]['symbol']  + " ) " + result['data']['currencies'][0]['code'];
					arr.alternatename = altname;
					
					
					
					
					document.getElementById("id1").firstChild.data = result['data']['name'] + " / " + countrycode;
					document.getElementById("id2").firstChild.data = result['data']['capital'];
					//var commasep = 
					document.getElementById("id3").firstChild.data = result['data']['population'];
					document.getElementById("id4").firstChild.data = result['data']['currencies'][0]['name'] + " ( " + result['data']['currencies'][0]['symbol']  + " ) " + result['data']['currencies'][0]['code'];
					
					
				//	mytable.rows[1].cells[1].textContent = countrycode;
				//	mytable.rows[1].cells[2].textContent = altname;
				
				//this is for bootstrap modal
				document.getElementById("cid").innerHTML = result['data']['name'] + " / " + countrycode;
				document.getElementById("capid").innerHTML = result['data']['capital'];
				document.getElementById("pid").innerHTML = result['data']['population'];
				//document.getElementById("currid").innerHTML = result['data']['currencies'][0]['name'] + " ( " + result['data']['currencies'][0]['symbol']  + " ) " + result['data']['currencies'][0]['code'];
				
				document.getElementById("currencyid").innerHTML = result['data']['currencies'][0]['name'] + " ( " + result['data']['currencies'][0]['symbol']  + " ) " + result['data']['currencies'][0]['code'];
				}
				console.log("dropdown country name " + cname);
				console.log("API country name " + result['data']['name']);
				var countrynametopass = cname;
				if(cname.indexOf('.')!== -1)
				{
					countrynametopass = result['data']['name'];
				}
				
				
				functionWikipedia(countrynametopass,result['data']['currencies'][0]['code']);
				//functionWikipedia(cname,result['data']['currencies'][0]['code']);
				
				//4 may
				//funcGetWeather(window.nowLat,window.nowLong);
				//exchangeRate(result['data']['currencies'][0]['code']);
			//4may
		
				//commented on 3 june to hide the model
				//window.modal.style.display = "block";
				
				
			},
			error: function(jqXHR, textStatus, errorThrown) {
				// your error code
			}
		}); 	
}





	
	function exchangeRate(codeofcurrency)
	{
		//console.log("exchangeRate");
			
		$.ajax({
			url: "libs/php/infoCurrency.php",
			type: 'POST',
			dataType: 'json',
			
			success: function(result) {
	
				//console.log("exchange rate");
			//	console.log(result);

				if (result.status.name == "ok") {
					
				//	console.log("rates lenght" + result['data']['rates'][codeofcurrency]);
				console.log("exchangeRate");
				console.log(result['data']['rates'][codeofcurrency] + " " + result['data']['base']);
				
				//3 may
			//	document.getElementById("infoData").innerHTML = document.getElementById("infoData").innerHTML + "<br>" + "Exchange Rate : " + result['data']['rates'][codeofcurrency] + " " +result['data']['base'];
				arr.exchangerate = result['data']['rates'][codeofcurrency] + " " +result['data']['base'];
			document.getElementById("id5").firstChild.data = result['data']['rates'][codeofcurrency] + " " +result['data']['base'];
			
			//document.getElementById("exrate").innerHTML = result['data']['rates'][codeofcurrency] + " " +result['data']['base'];
			
			document.getElementById("exchangerateid").innerHTML = result['data']['rates'][codeofcurrency] + " " +result['data']['base'];
				}
				//callfuncEnd();
				funcGetWeather(window.nowLat,window.nowLong);
			
			},
			error: function(jqXHR, textStatus, errorThrown) {
				// your error code
			}
		});
	
	}
	
	function funcGetWeather(lati,longi)
	{
		//console.log("funcGetWeather");
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

			
				//	console.log(result['data']['main']['temp']);
				console.log("funcGetWeather");
					var TempCelcius = Math.round(result['data']['main']['temp'] - 273.15);
					console.log(TempCelcius);
				
				//3 may
				/*
					document.getElementById("infoData").innerHTML = document.getElementById("infoData").innerHTML 
					+ "<br>" + "Temperature : " + TempCelcius + "o".sup() + "C , " + result['data']['weather'][0]['description'];
			*/
			
					//arr.temperature = TempCelcius + "degree " + " C , " + result['data']['weather'][0]['description'];
					arr.temperature = TempCelcius; 
					arr.tempdescription = result['data']['weather'][0]['description'];
					
					var degreestring = "o".sup();
					
					document.getElementById("id6").firstChild.data = TempCelcius + " degree " + "C";
					
					
					//document.getElementById("weaid").innerHTML = TempCelcius + " degree " + "C, " + result['data']['weather'][0]['description'];
					
					document.getElementById("weatherid").innerHTML = TempCelcius + " degree " + "C, " + result['data']['weather'][0]['description'];
				}
			
				callfuncEnd();
			},
			error: function(jqXHR, textStatus, errorThrown) {
				// your error code
			}
		}); 
		/* ------------------------------*/
	}
	
	
	function functionWikipedia(countryname,curcode)
	{
		
		arr.wikipedia = "https://en.wikipedia.org/wiki/Country";
		var count = 0;
		var countrynamejoin = countryname.split(" ").join("%20");
		var altername = arr.alternatename;
		var altnamejoin = altername.split(" ").join("%20");
		
		console.log(countryname + " , " + curcode + " , " + arr.alternatename);
	//console.log("Wiki country without space : " + countrynamejoin);
		$.ajax({
			url: "libs/php/getWikipedia.php",
			type: 'POST',
			dataType: 'json',
			data: {
				countryname: countrynamejoin			
			},
			success: function(result) {

			//	console.log(result);
			//	console.log("count of wiki result");
				//console.log("length wikipedia result " + result.data.geonames.length);

				if (result.status.name == "ok") {
					
					
					for ($x = 0; $x < result.data.geonames.length; $x++) {					
						//if(result['data']['geonames'][$x]['feature'] == "country" && result['data']['geonames'][$x]['title'].toLowerCase().localeCompare(countryname.toLowerCase()) == 0) 
						//if(result['data']['geonames'][$x]['feature'] == "country")
						if(result['data']['geonames'][$x]['title'].toLowerCase().localeCompare(countryname.toLowerCase()) == 0)
						{
							console.log("Wikipedia record");
							console.log(result['data']['geonames'][$x]);
							
							//console.log(result['data']['geonames'][$x]['wikipediaUrl']);
							
							//3 may
						/*
							document.getElementById("infoData").innerHTML = document.getElementById("infoData").innerHTML
							+ "<br>" + "Wikipedia link for country: " + result['data']['geonames'][$x]['wikipediaUrl'];
						*/	arr.wikipedia = "";
							arr.wikipedia = "https://" + result['data']['geonames'][$x]['wikipediaUrl'];
							count = 1;
							document.getElementById("id7").firstChild.data = "https://" + result['data']['geonames'][$x]['wikipediaUrl'];
							
							
							document.getElementById("wikiid").innerHTML =  "https://" + result['data']['geonames'][$x]['wikipediaUrl'];
							
							 var link = document.getElementById("hlink");

   
							link.innerHTML = "Check out info";
							link.setAttribute('href', "https://" + result['data']['geonames'][$x]['wikipediaUrl']);
	
	
	
						}
						
					}
					
					
						//	console.log(arr.wikipedia);
				//start 5 may
				if(count == 0 && altername != "noname")
				{
										
						console.log("New name " + altnamejoin);
						//en.wikipedia.org/wiki/Ivory_Coast
						arr.wikipedia = "https://en.wikipedia.org/wiki/" + altnamejoin;					
					
				}
				//end 5 may 
					
					
				}
				
				
				
				//exchangeRate(curcode);
			
			},
			error: function(jqXHR, textStatus, errorThrown) {
				// your error code
			}
		});
		
		
		
		exchangeRate(curcode);
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
					     myLayer.addData(someFeatures).on('click', onClick);
						
						
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



	
function callfuncEnd()
{
	console.log("commented this function");
	/*
	//console.log("callfuncEnd : " + arr.wikipedia);
	var searchlink = arr.wikipedia;
		document.getElementById("infoData").innerHTML = "Country Name & Code: " +  arr.name
				+ " ( " +  arr.code + " ) "
					+ "<br>" +  " Capital: " +  arr.capital 
					+ "<br>" + "Population: " +  arr.population
					+ "<br/>" + "Currency: " + arr.currency
					+ "<br>" + "Exchange Rate: " + arr.exchangerate
					+ "<br>" + "Temperature: " +  arr.temperature + "o".sup() + "C , " + arr.tempdescription
					+ "<br>" + "Wikipedia link: " + '<a href="' + arr.wikipedia + '" target="_blank">' + searchlink + '</a>';
					
					*/
	 
}

//function onClickMarker(e)
function getAllData()
{
	
	var selCountrycode = document.getElementById("selCountry").value;
	
	var name = document.getElementById("selCountry");
	var selectedcountry = name.options[name.selectedIndex].text;
	
	
	
	
	console.log("onchange country name " + name.options[name.selectedIndex].text);
	
	console.log("onchange country code " + selCountrycode);
	callCountryInfoApi(selCountrycode,selectedcountry);
//	functionWikipedia(name.options[name.selectedIndex].text);
	

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
				
				//	console.log("new coordinates");
				//	console.log(result['data']['name']);
				//	console.log(result['data']['capital']);
				//	console.log(result['data']['latlng']);
					//console.log(result['data']['latlng'][0]);
					//console.log(result['data']['latlng'][1]);
					window.nowLat = result['data']['latlng'][0];
					window.nowLong = result['data']['latlng'][1];
					
					//24 may
					//mymap.removeLayer(marker);
					
					//this is the blue marker indication the country which is displayed
					//window.marker = L.marker(result['data']['latlng'], {icon : redIcon }).addTo(mymap).on('click', onClickMarker);
				//	marker.bindPopup("<b>Hello! You are here. Click for Info </b>").openPopup();
					
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
		// modal.style.display = "none";
		 
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
				//document.getElementById("infoData").innerHTML = "";
				
				funcUpdateMarker(selectval);
			
			getAllData();
				
			},
			error: function(jqXHR, textStatus, errorThrown) {
			
			}
		}); 
		
		/*********************************/
		
		
		
	 }
	/*  btncurr.onclick = testFuncJson;
	 function testFuncJson()
	 {
		 
		$.ajax({
			url: "libs/php/testDataJson.php",
			type: 'POST',
			dataType: 'json',
			success: function(result) {
			
				console.log("Test GEO JSON function ");
				console.log(result);	
	
					console.log("name is : " + result.features[5]['properties']['name']);
					console.log("Country code : " + result.features[5]['properties']['iso_a2']);				
					console.log("Country code3 : " + result.features[5]['properties']['iso_a3']);	
			},
			error: function(jqXHR, textStatus, errorThrown) {
	
			}
		}); 
	 }
	  */

	function getCountry(){
		
	//	console.log("Length : " + document.getElementById("selCountry").length);
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
			//	console.log(result.features.length);
			
				 
				 var x = document.getElementById("selCountry");
				
				/*
				 var optiony = document.createElement("option");
					optiony.text = "Select";
					optiony.value = "12";
					optiony.disabled = true;
					optiony.selected = true;
					 x.add(optiony);
					*/ 
				 
				for ($x = 0; $x <result.features.length; $x++) {
					
					//console.log(result.features);
			
					
					//console.log("name is : " + result.features[$x]['properties']['name']);
					//console.log("Country code : " + result.features[$x]['properties']['iso_a2']);
					
					//var x = document.getElementById("selCountry");
					if(result.features[$x]['properties']['iso_a2'] != -99)    //this is to eliminate N.Cyprus added this country doesnt have a marker so it shows error
					{
					var option = document.createElement("option");
					option.text = result.features[$x]['properties']['name'];
					option.value = result.features[$x]['properties']['iso_a2'];
					 x.add(option);
					}
					
				}
				//console.log(result.features[0]['properties']['name']);
				sortOptionData();
				funcSetCountry();
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
		console.log("loadcountry" + window.loadcountry);
		console.log("options....");
		console.log(options[1]);
		//options[0].selected = true;
	}
	

	
//this function is to set the current country in the dropdown

function funcSetCountry()
{
	var optval = document.getElementById("selCountry");
	console.log(optval);
	
		$.ajax({
			url: "libs/php/getCountryInfo.php",
			type: 'POST',
			dataType: 'json',
			data: {
				latitude: window.nowLat,
				longitude: window.nowLong
			},
			success: function(result) {

				if (result.status.name == "ok") {
					
					//window.loadcountry = result['data'][0]['countryCode'];
					var curCountryCode = result['data'][0]['countryCode'];
					
					for (var i = 0; i <= optval.length; i++) {            
							if(optval[i].value == curCountryCode)
							{
								console.log("selected country is " + optval[i].value + curCountryCode);
								optval.value = optval[i].value;
								
								
							}
						}
					
					
				}
		
			
		},
			error: function(jqXHR, textStatus, errorThrown) {
				// your error code
			}
		}); 
		
	
}

	
//get the counrty code and country name from findNearbyPlaceNameJSON
 //	$('#btninfo').click(function() {
	
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
