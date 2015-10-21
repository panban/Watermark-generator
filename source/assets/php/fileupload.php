<?php
header('Content-Type: application/json');
$uploadDir = __DIR__."/../../img/";

if(!file_exists($uploadDir)){
    mkdir($uploadDir);
}


$data = array();
if($_SERVER['REQUEST_METHOD'] == 'POST'){

    if(!isset($_FILES['image']) && !isset($_FILES['watermark'])){
        $data = array(
            'error' => 1,
            'message' => 'Вы не выбрали файл изображения или водяной знак',
            'path' => null,
            'width' => 0,
            'height' => 0
        );
    } else {

        $image = null;
        // максимальный размер файла
        $maxFileSize = 1024*1024*2;
        // устанавливаем валидные MYME-types
        $types = array("image/gif", "image/png", "image/jpeg", "image/pjpeg", "image/x-png");

        // устанавливаем путь к папке для загрузки
        $uploadDir = $uploadDir."upload/";
        if (!file_exists($uploadDir)) {
            mkdir($uploadDir, 0777);
        }

        if(isset($_FILES['image'])){
            $image = $_FILES['image'];
        } elseif(isset($_FILES['watermark'])){
            $image = $_FILES['watermark'];
        }


        // если размер файла
        if ($image['size'] > $maxFileSize) {
            $data = array(
                'error' => 3,
                'message' => 'Файл слишком большой. Максимальный размер файла 2МБ',
                'path' => null,
                'width' => 0,
                'height' => 0
            );
        }
        // если MYME-type файла не соответствует допустимому
        elseif (!in_array($image['type'], $types)) {
            $data = array(
                'error' => 4,
                'message' => 'Вы выбрали некорректный тип файла. Можно загружать только JPG, JPEG, PNG и GIF',
                'path' => null,
                'width' => 0,
                'height' => 0
            );
        }else if ($image['error'] == 0) {
            // получаем имя файла
            $filename = basename($image['name']);
            // перемещаем файл из временной папки в  нужную
            if (move_uploaded_file($image['tmp_name'], $uploadDir . $filename)) {
                // получаем размеры изображения
                list($width, $height) = getimagesize($uploadDir . $filename);
                // Отправляем данные на frontend
                $data = array(
                    'error' => 0,
                    'message' => 'Файл успешно загружен',
                    'path' => $uploadDir . $filename . '.' . $extension,
                    'width' => $width,
                    'height' => $height
                );
            } // ошибка при перемещении файла
            else {
                $data = array(
                    'error' => 5,
                    'message' => 'Неведомая хуйня',
                    'path' => null,
                    'width' => 0,
                    'height' => 0
                );
            }
        }

    }

} else {
    $data = array(
        'error' => 2,
        'message' => 'Не верное обращение к ресурсу',
        'path' => null,
        'width' => 0,
        'height' => 0
    );
}

echo json_encode($data);
exit;