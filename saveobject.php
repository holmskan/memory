<?php

	// finns det någon postvariabel
	if(isset($_POST['object'])) {
		$fp = fopen('game2.json', 'w');
		fwrite($fp, $_POST['object']);
		fclose($fp);
	}