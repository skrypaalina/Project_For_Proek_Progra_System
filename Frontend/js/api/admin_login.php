<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

$data = json_decode(file_get_contents("php://input"), true);

$email = isset($data['email']) ? trim($data['email']) : '';
$password = isset($data['password']) ? trim($data['password']) : '';

define('ADMIN_EMAIL', 'mariexssin@gmail.com');
define('ADMIN_PASSWORD', '1111');

if ($email === ADMIN_EMAIL && $password === ADMIN_PASSWORD) {
    echo json_encode([
        "status" => "success",
        "user_id" => "admin_999",
        "first_name" => "Марія",
        "user_email" => ADMIN_EMAIL,
        "is_admin" => true
    ]);
} else {
    http_response_code(401);
    echo json_encode([
        "status" => "error",
        "detail" => "Невірний адмін-пароль або email"
    ]);
}
?>
