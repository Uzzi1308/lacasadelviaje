<?php
// CONFIGURACIÓN

// Email donde llegarán las reservas
$emailDestino = 'info@lacasadelviaje.com';

// Email de respuesta (opcional)
$emailRespaldo = ' '; // CC opcional

// Activar modo debug (mostrar errores - solo en desarrollo)
$debug = false; // Cambiar a true solo para probar


// SEGURIDAD BÁSICA

// Solo aceptar POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    die(json_encode(['success' => false, 'message' => 'Método no permitido']));
}

// Headers de seguridad
header('Content-Type: application/json; charset=utf-8');

// Protección contra bots (honeypot)
if (isset($_POST['website']) && !empty($_POST['website'])) {
    // Campo trampa 
    http_response_code(400);
    die(json_encode(['success' => false, 'message' => 'Spam detectado']));
}


// OBTENER Y LIMPIAR DATOS

function limpiarDato($dato) {
    return htmlspecialchars(strip_tags(trim($dato)), ENT_QUOTES, 'UTF-8');
}

$nombre = limpiarDato($_POST['nombre'] ?? '');
$email = limpiarDato($_POST['email'] ?? '');
$telefono = limpiarDato($_POST['telefono'] ?? '');
$viajeros = limpiarDato($_POST['viajeros'] ?? '');


// VALIDACIÓN DE DATOS

$errores = [];

// Validar nombre
if (empty($nombre) || strlen($nombre) < 2) {
    $errores[] = 'El nombre debe tener al menos 2 caracteres';
}

// Validar email
if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errores[] = 'El email no es válido';
}

// Validar teléfono
$telefonoLimpio = preg_replace('/\D/', '', $telefono);
if (empty($telefonoLimpio) || strlen($telefonoLimpio) < 10) {
    $errores[] = 'El teléfono debe tener al menos 10 dígitos';
}

// Validar viajeros
if (empty($viajeros)) {
    $errores[] = 'Debes seleccionar el número de viajeros';
}

// Si hay errores, retornar
if (!empty($errores)) {
    http_response_code(400);
    die(json_encode([
        'success' => false, 
        'message' => 'Errores de validación',
        'errores' => $errores
    ]));
}


// PREPARAR EMAIL HTML CON DISEÑO

$fecha = date('d/m/Y');
$hora = date('H:i:s');
$navegador = $_SERVER['HTTP_USER_AGENT'] ?? 'Desconocido';

// Asunto del email
$asunto = "Nueva Reserva - Barrancas del Cobre - $nombre";

// Cuerpo del email en HTML
$mensajeHTML = <<<HTML
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nueva Reserva</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4;">
    
    <!-- Container Principal -->
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px 0;">
        <tr>
            <td align="center">
                
                <!-- Email Container -->
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
                    
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #CD1915 0%, #9e1311 100%); padding: 40px 30px; text-align: center;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">
                                Nueva Reserva
                            </h1>
                            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">
                                Barrancas del Cobre
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Información del Cliente -->
                    <tr>
                        <td style="padding: 40px 30px;">
                            
                            <h2 style="color: #CD1915; margin: 0 0 20px 0; font-size: 20px; border-bottom: 2px solid #CD1915; padding-bottom: 10px;">
                                Datos del Cliente
                            </h2>
                            
                            <table width="100%" cellpadding="10" cellspacing="0" style="border-collapse: collapse;">
                                <tr style="background-color: #f8f9fa;">
                                    <td style="padding: 15px; border-bottom: 1px solid #e0e0e0; width: 40%; color: #666; font-weight: 600;">
                                        Nombre:
                                    </td>
                                    <td style="padding: 15px; border-bottom: 1px solid #e0e0e0; color: #333; font-size: 16px;">
                                        <strong>$nombre</strong>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 15px; border-bottom: 1px solid #e0e0e0; color: #666; font-weight: 600;">
                                        Email:
                                    </td>
                                    <td style="padding: 15px; border-bottom: 1px solid #e0e0e0; color: #333;">
                                        <a href="mailto:$email" style="color: #CD1915; text-decoration: none;">$email</a>
                                    </td>
                                </tr>
                                <tr style="background-color: #f8f9fa;">
                                    <td style="padding: 15px; border-bottom: 1px solid #e0e0e0; color: #666; font-weight: 600;">
                                        Teléfono:
                                    </td>
                                    <td style="padding: 15px; border-bottom: 1px solid #e0e0e0; color: #333;">
                                        <a href="tel:$telefono" style="color: #CD1915; text-decoration: none;">$telefono</a>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 15px; color: #666; font-weight: 600;">
                                        Viajeros:
                                    </td>
                                    <td style="padding: 15px; color: #333;">
                                        <span style="background-color: #CD1915; color: white; padding: 5px 15px; border-radius: 20px; font-weight: 600;">
                                            $viajeros
                                        </span>
                                    </td>
                                </tr>
                            </table>
                            
                        </td>
                    </tr>
                    
                    <!-- Información Adicional -->
                    <tr>
                        <td style="padding: 0 30px 40px 30px;">
                            
                            <h2 style="color: #CD1915; margin: 0 0 15px 0; font-size: 18px;">
                                 Información de la Solicitud
                            </h2>
                            
                            <table width="100%" cellpadding="8" cellspacing="0">
                                <tr>
                                    <td style="color: #666; font-size: 14px;">
                                        <strong>Fecha:</strong> $fecha
                                    </td>
                                    <td style="color: #666; font-size: 14px;">
                                         <strong>Hora:</strong> $hora
                                    </td>
                                </tr>
                                <tr>
                                    <td colspan="2" style="color: #666; font-size: 14px; padding-top: 10px;">
                                        <strong>Origen:</strong> Landing Barrancas del Cobre
                                    </td>
                                </tr>
                            </table>
                            
                        </td>
                    </tr>
                    
                    <!-- Call to Action -->
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #333; padding: 20px 30px; text-align: center;">
                            <p style="color: #999; margin: 0; font-size: 12px;">
                                © 2025 La Casa del Viaje - Sistema de Reservas
                            </p>
                            <p style="color: #666; margin: 10px 0 0 0; font-size: 11px;">
                                Este email fue generado automáticamente desde el formulario de la landing page
                            </p>
                        </td>
                    </tr>
                    
                </table>
                
            </td>
        </tr>
    </table>
    
</body>
</html>
HTML;

// Versión plain text (para clientes que no soportan HTML)
$mensajeTexto = <<<TEXTO
NUEVA RESERVA - BARRANCAS DEL COBRE

DATOS DEL CLIENTE:
------------------
Nombre: $nombre
Email: $email
Teléfono: $telefono
Viajeros: $viajeros

INFORMACIÓN:
------------
Fecha: $fecha
Hora: $hora
Origen: Landing Barrancas del Cobre

---
La Casa del Viaje - Sistema de Reservas
TEXTO;


// CONFIGURAR HEADERS DEL EMAIL

$headers = [];
$headers[] = "MIME-Version: 1.0";
$headers[] = "Content-Type: text/html; charset=UTF-8";
$headers[] = "From: Reservas Web <noreply@lacasadelviaje.com.mx>";
$headers[] = "Reply-To: $nombre <$email>";
$headers[] = "X-Mailer: PHP/" . phpversion();
$headers[] = "X-Priority: 1"; // Alta prioridad



// ENVIAR EMAIL

try {
    $enviado = mail($emailDestino, $asunto, $mensajeHTML, implode("\r\n", $headers));
    
    if ($enviado) {
        // Log exitoso (opcional - para debugging)
        if ($debug) {
            error_log("[RESERVA] Email enviado a $emailDestino - Cliente: $nombre ($email)");
        }
        
        // Respuesta de éxito
        http_response_code(200);
        echo json_encode([
            'success' => true,
            'message' => '¡Solicitud enviada correctamente! Te contactaremos pronto.',
            'data' => [
                'nombre' => $nombre,
                'fecha' => $fecha,
                'hora' => $hora
            ]
        ]);
        
    } else {
        throw new Exception('Error en la función mail()');
    }
    
} catch (Exception $e) {
    // Log de error
    error_log("[ERROR RESERVA] " . $e->getMessage());
    
    // Respuesta de error
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Hubo un error al enviar la solicitud. Por favor intenta nuevamente.',
        'error' => $debug ? $e->getMessage() : null
    ]);
}

?>