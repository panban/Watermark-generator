<?php
require_once __DIR__.'/../../phplibs/autoload.php';
use \WideImage\WideImage;
if($_SERVER['REQUEST_METHOD'] == 'POST'){

    $file = $_POST['imagePath'];
    $watermarkPath = $_POST['watermarkPath'];
    $scale = (int)$_POST['watermarkScale'];
    $opacity = (int)$_POST['opacity'];
    $coords = $_POST['position'];

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
    $watermark = $watermark->resize(($width * $scale) / 100);

    foreach ($coords as $coord) {
        $image = $image->merge($watermark, $coord[0], $coord[1], $opacity);
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
