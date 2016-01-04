<?php
$result = '../php/result.jpg';
//header('Content-type: application/jpeg');
header('Content-Disposition: attachment; filename="result.jpg"');
readfile($result);
