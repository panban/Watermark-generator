<?php
require_once __DIR__.'/../phplibs/autoload.php';
use \WideImage\WideImage;

if($_SERVER['REQUEST_METHOD'] == 'POST'){

    $file = empty($_POST['imagePath'])?"":(__DIR__.'/..'.$_POST['imagePath']);
    $watermarkPath = empty($_POST['watermarkPath'])?"":(__DIR__.'/..'.$_POST['watermarkPath']);
    $scale = floatval($_POST['watermarkScale']);
    $opacity = (int)(floatval($_POST['opacity'])*100);
    $coords = $_POST['position'];
	//die(var_dump($_POST));
	
    // Если какого-то файла уже нет на сервере
    if(!file_exists($file) || !file_exists($watermarkPath)){
        echo json_encode(
            array(
                'error' => 2,
                'message' => 'Одного или обоих файлов нет на сервере'
            )
        );
        exit;
    }
    

	$image = WideImage::loadFromFile($file);
    $watermark = WideImage::loadFromFile($watermarkPath);
    list($width, $height) = getimagesize($watermarkPath);
    //$watermark = $watermark->resize(($width * $scale));
	
	
	if ($width > $image->getWidth()) {
		$watermark = $watermark->resize($image->getWidth(), $height*$image->getWidth()/$width);
		} elseif ($height > $image->getHeight()) {
		$watermark = $watermark->resize($width*$image->getHeight()/$height, $image->getHeight());
		}
	
	list($width, $height) = getimagesize($watermarkPath);
	
	if ($image->getWidth() > 653) {	
		$maxX = 653;
		} else {
		$maxX = $image->getWidth();
	}
	
	if ($image->getHeight() > 535) {	
		$maxY = 535;
		} else {
		$maxY = $image->getHeight();
	}
	
	$ratio = $image->getWidth()/$image->getHeight();	
	
	if (isset($_POST['count'])) {
		$count = $_POST['count'];
				
		if ($ratio > 1) { 
						$gutterX = $coords[1][0]*$image->getWidth()/$maxX;
						$gutterY = $coords[1][1]*$image->getHeight()/($maxX/$ratio);
						$x = $coords[0][0]*$image->getWidth()/$maxX + $gutterX;
						$y = $coords[0][1]*$image->getHeight()/($maxX/$ratio)+ $gutterY;
					} else {
						$gutterX = $coords[1][0]*$image->getWidth()/($maxY*$ratio);
						$gutterY = $coords[1][1]*$image->getHeight()/$maxY;
						$x = $coords[0][0]*$image->getWidth()/($maxY*$ratio) + $gutterX;
						$y = $coords[0][1]*$image->getHeight()/$maxY + $gutterY;
					}
				
		for ($i=0; $i < $count["horizont"]; $i++) {
			for ($j=0; $j < $count["vertical"]; $j++) {
						$image = $image->merge($watermark, $x+($gutterX+$width)*$i, $y+($gutterY+$height)*$j, $opacity);
			}
		}
		//die(var_dump($i, $j));
	} else {
		if ($ratio > 1) { 
			$image = $image->merge($watermark, $coords[0][0]*$image->getWidth()/$maxX, $coords[0][1]*$image->getHeight()/($maxX/$ratio), $opacity);
		} else {
			$image = $image->merge($watermark, $coords[0][0]*$image->getWidth()/($maxY*$ratio), $coords[0][1]*$image->getHeight()/$maxY, $opacity);
		}
	}

    $image->saveToFile('result.jpg');
    header('Content-Disposition: attachment; filename=result.jpg');
    readfile('result.jpg');
    exit;



} else {
    header('Content-Type: application/json');
    echo json_encode(
        array(
            'error' => 1,
            'message' => 'Пошел на хуй ломать мой сайт'
        )
    );
    exit;
}
