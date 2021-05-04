<?php

	$executionStartTime = microtime(true) / 1000;

   // $url ='http://api.geonames.org/countryInfoJSON?formatted=true&country=' . $_REQUEST['codeofcountry'] . '&username=exploreapi&style=full';
   //commented the call for API countryInfoJSON -- and restcountries.eu is called below .
   
    $url = 'https://restcountries.eu/rest/v2/alpha/'.$_REQUEST['codeofcountry'];
   
	$ch = curl_init();
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL,$url);

	$result=curl_exec($ch);

	curl_close($ch);

	$decode = json_decode($result,true);	
	$output['status']['url'] = $url;
	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "mission saved";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	//$output['data'] = $decode['geonames'];   //uncomment this for   API countryInfoJSON
	$output['data'] = $decode; 
	header('Content-Type: application/json; charset=UTF-8');

	echo json_encode($output); 

?>