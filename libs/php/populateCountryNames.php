<?php

/*
  // JSON string
  //$someJSON = '[{"name":"Jonathan Suh","gender":"male"},{"name":"William Philbin","gender":"male"},{"name":"Allison McKinnery","gender":"female"}]';
  $someJSON = '{"Peter":35,"Ben":37,"Joe":43}';
  // Convert JSON string to Object
  $someObject = json_decode($someJSON);
  echo json_encode($someObject); // Access Object data
  
  */
 // $strJsonFileContents = file_get_contents("log2.json");
 
 $strJsonFileContents = file_get_contents("countryBorders.geo.json");
 $array = json_decode($strJsonFileContents, true);
 echo json_encode($array);
?>



