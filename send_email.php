<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    $nombre = filter_var($input['nombre'], FILTER_SANITIZE_STRING);
    $email = filter_var($input['email'], FILTER_VALIDATE_EMAIL);
    $telefono = filter_var($input['telefono'], FILTER_SANITIZE_STRING);
    $viajeros = filter_var($input['viajeros'], FILTER_SANITIZE_STRING);
    
    // Validaciones
    if (!$nombre || !$email || !$telefono || !$viajeros) {
        echo json_encode(['success' => false, 'message' => 'Por favor completa todos los campos correctamente.']);
        exit;
    }
    
    // Configuración del email - CAMBIA ESTO POR TU EMAIL REAL
    $to = "becarioslcv@lacasadelviaje.com";
    $subject = "📦 Nueva Reserva - Barrancas del Cobre";
    
    $message = "
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; }
            .header { background: #CD1915; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; border: 1px solid #ddd; }
            .field { margin-bottom: 10px; }
            .label { font-weight: bold; color: #CD1915; }
        </style>
    </head>
    <body>
        <div class='header'>
            <h2>¡Nueva Solicitud de Reserva!</h2>
        </div>
        <div class='content'>
            <div class='field'><span class='label'>Nombre:</span> $nombre</div>
            <div class='field'><span class='label'>Email:</span> $email</div>
            <div class='field'><span class='label'>Teléfono:</span> $telefono</div>
            <div class='field'><span class='label'>Número de Viajeros:</span> $viajeros</div>
            <div class='field'><span class='label'>Fecha:</span> " . date('d/m/Y H:i:s') . "</div>
        </div>
    </body>
    </html>
    ";
    
    $headers = "MIME-Version: 1.0" . "\r\n";
    $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
    $headers .= "From: Barrancas del Cobre <no-reply@lacasadelviaje.com>" . "\r\n";
    $headers .= "Reply-To: $email" . "\r\n";
    
    if (mail($to, $subject, $message, $headers)) {
        echo json_encode(['success' => true, 'message' => '✅ ¡Solicitud enviada! Te contactaremos pronto.']);
    } else {
        echo json_encode(['success' => false, 'message' => '❌ Error al enviar el mensaje. Por favor intenta de nuevo.']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Método no permitido']);
}
?>