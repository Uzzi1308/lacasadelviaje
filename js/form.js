
// SERVICIO DE GESTIÓN DE FORMULARIOS

// Este archivo maneja toda la lógica de envío de formularios
// Requiere: config.js cargado previamente

const FormService = {
  /**
   * Método principal para enviar formularios
   * @param {Object} datos - Datos del formulario
   * @returns {Promise<Object>} Resultado del envío
   */
  async enviarFormulario(datos) {
    if (FORM_CONFIG.settings.debug) {
      console.log(' Enviando formulario...', datos);
      console.log(' Modo actual:', FORM_CONFIG.modo);
    }
    
    switch(FORM_CONFIG.modo) {
      case 'simulacion':
        return await this._simularEnvio(datos);
        
      case 'email':
        return await this._enviarPorEmail(datos);
        
      case 'api':
        return await this._enviarPorAPI(datos);
        
      case 'google-sheets':
        return await this._enviarGoogleSheets(datos);
        
      default:
        console.warn('⚠️ Modo no reconocido, usando simulación');
        return await this._simularEnvio(datos);
    }
  },
  

  // MÉTODOS DE ENVÍO POR TIPO

  
  /**
   * Simulación de envío (para pruebas)
   */
  async _simularEnvio(datos) {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (FORM_CONFIG.settings.debug) {
      console.log('Simulación completada');
      console.table(datos);
    }
    
    return { 
      success: true, 
      message: 'Formulario enviado (modo simulación)',
      mode: 'simulacion',
      data: datos
    };
  },
  
  /**
   * Envío por Email (backend PHP/Node.js)
   */
  async _enviarPorEmail(datos) {
    try {
      const payload = {
        to: 'reservas@cliente.com',
        subject: 'Nueva Reserva - Barrancas del Cobre',
        data: this._mapearDatos(datos),
        origen: 'landing-barrancas'
      };
      
      const response = await fetch(FORM_CONFIG.endpoints.email, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (FORM_CONFIG.settings.debug) {
        console.log('Email enviado exitosamente', result);
      }
      
      return result;
      
    } catch (error) {
      console.error('Error enviando email:', error);
      throw new Error('Error enviando el formulario por email: ' + error.message);
    }
  },
  
  /**
   * Envío a API REST
   */
  async _enviarPorAPI(datos) {
    try {
      const payload = this._mapearDatos(datos);
      
      const response = await fetch(FORM_CONFIG.endpoints.api, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Agregar headers adicionales si son necesarios
          // 'Authorization': 'Bearer TU_TOKEN'
        },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (FORM_CONFIG.settings.debug) {
        console.log('API respondió exitosamente', result);
      }
      
      return result;
      
    } catch (error) {
      console.error(' Error conectando con la API:', error);
      throw new Error('Error conectando con el servidor: ' + error.message);
    }
  },
  
  /**
   * Envío a Google Sheets (vía Google Apps Script)
   */
  async _enviarGoogleSheets(datos) {
    try {
      const formData = new FormData();
      
      // Agregar todos los campos del formulario
      Object.keys(datos).forEach(key => {
        formData.append(key, datos[key]);
      });
      
      // Agregar metadata
      formData.append('timestamp', new Date().toISOString());
      formData.append('fecha_legible', new Date().toLocaleString('es-MX'));
      formData.append('origen', 'barrancas-del-cobre');
      
      const response = await fetch(FORM_CONFIG.endpoints.googleSheets, {
        method: 'POST',
        mode: 'no-cors', // Importante para Google Apps Script
        body: formData
      });
      
      if (FORM_CONFIG.settings.debug) {
        console.log('Datos enviados a Google Sheets');
      }
      
      return {
        success: true,
        message: 'Datos guardados en Google Sheets',
        mode: 'google-sheets'
      };
      
    } catch (error) {
      console.error('Error guardando en Google Sheets:', error);
      throw new Error('Error guardando los datos: ' + error.message);
    }
  },
  

  // UTILIDADES

  /**
   * Mapea los datos del formulario según configuración
   */
  _mapearDatos(datos) {
    const mapeados = {};
    
    Object.keys(datos).forEach(key => {
      const nuevoKey = FORM_CONFIG.fieldMapping[key] || key;
      mapeados[nuevoKey] = datos[key];
    });
    
    // Agregar metadata automática
    mapeados.timestamp = new Date().toISOString();
    mapeados.fecha_legible = new Date().toLocaleString('es-MX');
    mapeados.origen = 'barrancas-del-cobre';
    mapeados.user_agent = navigator.userAgent;
    
    return mapeados;
  },
  
  /**
   * Valida los datos del formulario
   */
  validarDatos(datos) {
    const errores = [];
    
    if (!datos.nombre || datos.nombre.trim().length < 2) {
      errores.push('El nombre debe tener al menos 2 caracteres');
    }
    
    if (!datos.email || !this._validarEmail(datos.email)) {
      errores.push('El email no es válido');
    }
    
    if (!datos.telefono || datos.telefono.replace(/\D/g, '').length < 10) {
      errores.push('El teléfono debe tener al menos 10 dígitos');
    }
    
    return {
      valido: errores.length === 0,
      errores: errores
    };
  },
  
  /**
   * Valida formato de email
   */
  _validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }
};

// INICIALIZACIÓN DE FORMULARIOS

const initForms = () => {
  const forms = document.querySelectorAll('form[id="bookingForm"], form[id="modalBookingForm"]');
  
  forms.forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const submitBtn = form.querySelector('.btn-submit, .btn-submit-modal');
      const originalText = submitBtn.innerHTML;
      const originalBg = submitBtn.style.background;
      
      // Obtener datos del formulario
      const formData = new FormData(form);
      const datos = Object.fromEntries(formData);
      
      // Validación
      const validacion = FormService.validarDatos(datos);
      if (!validacion.valido) {
        alert('Errores en el formulario:\n' + validacion.errores.join('\n'));
        return;
      }
      
      // Estado: enviando
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
      submitBtn.disabled = true;
      
      try {
        const resultado = await FormService.enviarFormulario(datos);
        
        if (resultado.success) {
          // Éxito
          submitBtn.innerHTML = '<i class="fas fa-check"></i> ¡Enviado!';
          submitBtn.style.background = '#28a745';
          
          // Reset después del timeout configurado
          setTimeout(() => {
            form.reset();
            submitBtn.innerHTML = originalText;
            submitBtn.style.background = originalBg;
            submitBtn.disabled = false;
            
            // Cerrar modal si está abierto
            const modal = document.getElementById('modalReserva');
            if (modal?.classList.contains('active')) {
              modal.classList.remove('active');
              document.body.style.overflow = '';
            }
          }, FORM_CONFIG.settings.timeoutSuccess);
          
        } else {
          throw new Error(resultado.message || 'Error en el servidor');
        }
        
      } catch (error) {
        console.error('❌ Error enviando formulario:', error);
        submitBtn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Error';
        submitBtn.style.background = '#dc3545';
        
        setTimeout(() => {
          alert('Hubo un error al enviar el formulario. Por favor intenta nuevamente.');
          submitBtn.innerHTML = originalText;
          submitBtn.style.background = originalBg;
          submitBtn.disabled = false;
        }, FORM_CONFIG.settings.timeoutError);
      }
    });
  });
};

const initFormEnhancements = () => {
  // Formateo automático de teléfono
  const phoneInputs = document.querySelectorAll('input[type="tel"]');
  
  phoneInputs.forEach(input => {
    input.addEventListener('input', (e) => {
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
  
  // Validación en tiempo real de email
  const emailInputs = document.querySelectorAll('input[type="email"]');
  
  emailInputs.forEach(input => {
    input.addEventListener('blur', (e) => {
      const email = e.target.value;
      if (email && !FormService._validarEmail(email)) {
        input.setCustomValidity('Por favor ingresa un email válido');
        input.reportValidity();
      } else {
        input.setCustomValidity('');
      }
    });
  });
};

if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initForms();
      initFormEnhancements();
    });
  } else {
    initForms();
    initFormEnhancements();
  }
}