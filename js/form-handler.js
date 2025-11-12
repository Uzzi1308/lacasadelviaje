// MANEJO DE FORMULARIOS - BARRANCAS DEL COBRE

document.addEventListener('DOMContentLoaded', function() {
    console.log('Form Handler inicializado');
    
    // Seleccionar ambos formularios
    const heroForm = document.getElementById('bookingForm');
    const modalForm = document.getElementById('modalBookingForm');
    
    // Inicializar formularios
    if (heroForm) initForm(heroForm);
    if (modalForm) initForm(modalForm);
    
    // Mejoras de UX
    initFormEnhancements();
});


// INICIALIZAR FORMULARIO

function initForm(form) {
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const submitBtn = form.querySelector('.btn-submit, .btn-submit-modal');
        const originalHTML = submitBtn.innerHTML;
        const originalBg = submitBtn.style.background;
        
        // Validación del lado del cliente
        if (!validarFormulario(form)) {
            return;
        }
        
        // Obtener datos del formulario
        const formData = new FormData(form);
        
        // Estado: Enviando
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        submitBtn.disabled = true;
        submitBtn.style.cursor = 'not-allowed';
        
        try {
            // Enviar a PHP
            const response = await fetch('enviar-formulario.php', {
                method: 'POST',
                body: formData
            });
            
            // Verificar respuesta del servidor
            if (!response.ok) {
                throw new Error(`Error del servidor: ${response.status}`);
            }
            
            const result = await response.json();
            
            if (result.success) {
                // ÉXITO
                mostrarExito(form, submitBtn, originalHTML, originalBg);
            } else {
                //  Error reportado por el servidor
                throw new Error(result.message || 'Error desconocido');
            }
            
        } catch (error) {
            //  ERROR DE CONEXIÓN O SERVIDOR
            mostrarError(form, submitBtn, originalHTML, originalBg, error);
        }
    });
}


// VALIDACIÓN DEL LADO DEL CLIENTE

function validarFormulario(form) {
    const nombre = form.querySelector('[name="nombre"]').value.trim();
    const email = form.querySelector('[name="email"]').value.trim();
    const telefono = form.querySelector('[name="telefono"]').value.trim();
    const viajeros = form.querySelector('[name="viajeros"]').value;
    
    let errores = [];
    
    // Validar nombre
    if (nombre.length < 2) {
        errores.push('El nombre debe tener al menos 2 caracteres');
        form.querySelector('[name="nombre"]').focus();
    }
    
    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        errores.push('Ingresa un email válido');
        if (errores.length === 1) form.querySelector('[name="email"]').focus();
    }
    
    // Validar teléfono
    const telefonoLimpio = telefono.replace(/\D/g, '');
    if (telefonoLimpio.length < 10) {
        errores.push('El teléfono debe tener al menos 10 dígitos');
        if (errores.length === 1) form.querySelector('[name="telefono"]').focus();
    }
    
    // Validar viajeros
    if (!viajeros) {
        errores.push('Selecciona el número de viajeros');
        if (errores.length === 1) form.querySelector('[name="viajeros"]').focus();
    }
    
    if (errores.length > 0) {
        mostrarErrores(errores);
        return false;
    }
    
    return true;
}

// MOSTRAR ÉXITO

function mostrarExito(form, submitBtn, originalHTML, originalBg) {
    // Cambiar botón a estado exitoso
    submitBtn.innerHTML = '<i class="fas fa-check-circle"></i> ¡Enviado!';
    submitBtn.style.background = '#28a745';
    submitBtn.style.cursor = 'default';
    
    // Mensaje de confirmación
    mostrarNotificacion('¡Gracias por tu solicitud! Te contactaremos pronto.', 'success');
    
    // Resetear formulario después de 3 segundos
    setTimeout(() => {
        form.reset();
        submitBtn.innerHTML = originalHTML;
        submitBtn.style.background = originalBg;
        submitBtn.style.cursor = 'pointer';
        submitBtn.disabled = false;
        
        // Cerrar modal si está abierto
        const modal = document.getElementById('modalReserva');
        if (modal && modal.classList.contains('active')) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }, 3000);
}


// MOSTRAR ERROR

function mostrarError(form, submitBtn, originalHTML, originalBg, error) {
    console.error('Error enviando formulario:', error);
    
    // Cambiar botón a estado de error
    submitBtn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Error';
    submitBtn.style.background = '#dc3545';
    submitBtn.style.cursor = 'default';
    
    // Mensaje de error
    mostrarNotificacion(
        'Hubo un error al enviar tu solicitud. Por favor intenta nuevamente.',
        'error'
    );
    
    // Restaurar botón después de 3 segundos
    setTimeout(() => {
        submitBtn.innerHTML = originalHTML;
        submitBtn.style.background = originalBg;
        submitBtn.style.cursor = 'pointer';
        submitBtn.disabled = false;
    }, 3000);
}


// SISTEMA DE NOTIFICACIONES

function mostrarNotificacion(mensaje, tipo = 'info') {
    // Crear contenedor 
    let container = document.getElementById('notification-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'notification-container';
        container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 99999;
            max-width: 400px;
        `;
        document.body.appendChild(container);
    }
    
    // Crear notificación
    const notification = document.createElement('div');
    notification.className = `notification notification-${tipo}`;
    
    const colores = {
        success: '#28a745',
        error: '#dc3545',
        info: '#17a2b8',
        warning: '#ffc107'
    };
    
    const iconos = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        info: 'fa-info-circle',
        warning: 'fa-exclamation-triangle'
    };
    
    notification.style.cssText = `
        background: white;
        border-left: 4px solid ${colores[tipo]};
        padding: 15px 20px;
        margin-bottom: 10px;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        display: flex;
        align-items: center;
        gap: 15px;
        animation: slideIn 0.3s ease;
    `;
    
    notification.innerHTML = `
        <i class="fas ${iconos[tipo]}" style="color: ${colores[tipo]}; font-size: 1.5rem;"></i>
        <p style="margin: 0; color: #333; font-size: 0.95rem; line-height: 1.4;">${mensaje}</p>
    `;
    
    // Agregar al contenedor
    container.appendChild(notification);
    
    // Auto-eliminar después de 5 segundos
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
    
    // Agregar estilos de animación si no existen
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(400px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(400px);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

function mostrarErrores(errores) {
    const mensaje = errores.join('<br>');
    mostrarNotificacion(mensaje, 'warning');
}


// MEJORAS DE UX EN FORMULARIOS

function initFormEnhancements() {
    // Formateo automático de teléfono
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(input => {
        input.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length > 0) {
                if (value.length <= 3) {
                    value = `(${value}`;
                } else if (value.length <= 6) {
                    value = `(${value.slice(0,3)}) ${value.slice(3)}`;
                } else {
                    value = `(${value.slice(0,3)}) ${value.slice(3,6)}-${value.slice(6,10)}`;
                }
            }
            
            e.target.value = value;
        });
    });
    
    // Capitalizar nombres automáticamente
    const nameInputs = document.querySelectorAll('input[name="nombre"]');
    nameInputs.forEach(input => {
        input.addEventListener('blur', function(e) {
            const words = e.target.value.trim().split(' ');
            const capitalized = words.map(word => {
                return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
            }).join(' ');
            e.target.value = capitalized;
        });
    });
    
    // Convertir email a minúsculas
    const emailInputs = document.querySelectorAll('input[type="email"]');
    emailInputs.forEach(input => {
        input.addEventListener('blur', function(e) {
            e.target.value = e.target.value.toLowerCase().trim();
        });
    });
    
    // Indicador visual de campos válidos
    const allInputs = document.querySelectorAll('input, select');
    allInputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.value && this.checkValidity()) {
                this.style.borderColor = '#28a745';
            } else if (this.value && !this.checkValidity()) {
                this.style.borderColor = '#dc3545';
            }
        });
        
        input.addEventListener('focus', function() {
            this.style.borderColor = '#CD1915';
        });
    });
}


// DEBUG (solo en desarrollo)

const DEBUG = false; // Cambiar a true para ver logs

if (DEBUG) {
    console.log('Modo debug activado');
    
    // Log de formularios encontrados
    document.querySelectorAll('form').forEach((form, i) => {
        console.log(`Form ${i + 1}:`, form.id || 'sin ID', form);
    });
}