// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeLucideIcons();
    generateQRCode();
    initializeChatbot();
    initializeContactForm();
    initializeNavigation();
});

// Initialize Lucide Icons
function initializeLucideIcons() {
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// Generate QR Code for menu
function generateQRCode() {
    const canvas = document.getElementById('qrcode');
    if (canvas && typeof QRCode !== 'undefined') {
        // URL del menú PDF (ajustar según tu servidor)
        const menuUrl = window.location.origin + '/attached_assets/menu_1753379753904.pdf';
        
        QRCode.toCanvas(canvas, menuUrl, {
            width: 200,
            height: 200,
            color: {
                dark: '#2c2c2c',
                light: '#ffffff'
            },
            margin: 2
        }, function(error) {
            if (error) {
                console.error('Error generando QR:', error);
                canvas.style.display = 'none';
            }
        });
    }
}

// Menu functions
function abrirMenu() {
    const menuUrl = window.location.origin + '/attached_assets/menu_1753379753904.pdf';
    window.open(menuUrl, '_blank');
}

function descargarMenu() {
    const menuUrl = window.location.origin + '/attached_assets/menu_1753379753904.pdf';
    const link = document.createElement('a');
    link.href = menuUrl;
    link.download = 'Menu_El_Sabor_del_Chef.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Smooth scroll function
function smoothScroll(targetId) {
    const element = document.getElementById(targetId);
    if (element) {
        const headerOffset = 70;
        const elementPosition = element.offsetTop;
        const offsetPosition = elementPosition - headerOffset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
}

// Navigation functionality
function initializeNavigation() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking on links
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
        });
    });
}

// Contact Form
function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
    }
}

function handleContactSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = {
        nombre: formData.get('nombre'),
        telefono: formData.get('telefono'),
        email: formData.get('email'),
        asunto: formData.get('asunto'),
        mensaje: formData.get('mensaje')
    };
    
    // Validación básica
    if (!data.nombre || !data.email || !data.mensaje) {
        showToast('Error', 'Por favor, completa todos los campos obligatorios.', 'error');
        return;
    }
    
    // Validación de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        showToast('Error', 'Por favor, introduce un email válido.', 'error');
        return;
    }
    
    // Simular envío (en un entorno real, esto se enviaría al servidor)
    showToast('¡Mensaje enviado!', 'Gracias por contactarnos. Te responderemos pronto.', 'success');
    e.target.reset();
    
    // Guardar en localStorage para simular persistencia
    const savedMessages = JSON.parse(localStorage.getItem('contactMessages') || '[]');
    savedMessages.push({
        ...data,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        responded: false
    });
    localStorage.setItem('contactMessages', JSON.stringify(savedMessages));
}

// Toast notifications
function showToast(title, description, type = 'success') {
    const toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) return;
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <div class="toast-title">${title}</div>
        <div class="toast-description">${description}</div>
    `;
    
    toastContainer.appendChild(toast);
    
    // Remove toast after 5 seconds
    setTimeout(() => {
        if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
        }
    }, 5000);
}

// Chatbot functionality
function initializeChatbot() {
    const chatbotContainer = document.getElementById('chatbotContainer');
    if (chatbotContainer) {
        chatbotContainer.classList.add('closed');
        
        const chatInput = document.getElementById('chatInput');
        if (chatInput) {
            chatInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    sendMessage();
                }
            });
        }
    }
}

function toggleChat() {
    const chatbotContainer = document.getElementById('chatbotContainer');
    chatbotContainer.classList.toggle('closed');
}

function sendMessage() {
    const chatInput = document.getElementById('chatInput');
    const message = chatInput.value.trim();
    
    if (!message) return;
    
    // Add user message
    addMessage(message, 'user');
    chatInput.value = '';
    
    // Generate bot response
    setTimeout(() => {
        const response = generateBotResponse(message);
        addMessage(response, 'bot');
    }, 1000);
}

function addMessage(message, sender) {
    const messagesContainer = document.getElementById('chatbotMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    messageDiv.textContent = message;
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function generateBotResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    // Respuestas del chatbot
    if (lowerMessage.includes('menu') || lowerMessage.includes('comida') || lowerMessage.includes('platos')) {
        return 'Puedes ver nuestro menú completo escaneando el código QR de nuestra sección de menú o descargando el PDF. ¿Te gustaría que te ayude con algo más?';
    }
    
    if (lowerMessage.includes('horario') || lowerMessage.includes('abierto') || lowerMessage.includes('hora')) {
        return 'Nuestros horarios son: Lunes a Viernes de 12:00-16:00 y 19:00-23:00. Sábados y Domingos de 13:00-17:00 y 20:00-00:00. ¿Necesitas algo más?';
    }
    
    if (lowerMessage.includes('reserva') || lowerMessage.includes('mesa') || lowerMessage.includes('reservar')) {
        return 'Para reservar una mesa, te recomiendo que nos llames directamente al +34 912 345 678. Nuestro equipo estará encantado de ayudarte con tu reserva.';
    }
    
    if (lowerMessage.includes('precio') || lowerMessage.includes('coste') || lowerMessage.includes('cuesta')) {
        return 'Puedes consultar todos nuestros precios en el menú PDF. También tenemos un menú del día por 14,90€ de lunes a viernes. ¿Te interesa algún plato en particular?';
    }
    
    if (lowerMessage.includes('ubicacion') || lowerMessage.includes('direccion') || lowerMessage.includes('donde')) {
        return 'Estamos ubicados en Calle Gourmet 123, Ciudad Sabores. Tenemos parking público disponible a 100 metros del restaurante.';
    }
    
    if (lowerMessage.includes('alergias') || lowerMessage.includes('vegano') || lowerMessage.includes('vegetariano') || lowerMessage.includes('celíaco')) {
        return 'Adaptamos nuestros platos a diferentes necesidades alimentarias. Tenemos opciones veganas, vegetarianas y sin gluten. Por favor, informa a nuestro personal sobre tus alergias al hacer la reserva.';
    }
    
    if (lowerMessage.includes('evento') || lowerMessage.includes('celebracion') || lowerMessage.includes('cumpleanos') || lowerMessage.includes('empresa')) {
        return 'Organizamos eventos especiales, cenas de empresa y celebraciones. Para más información, puedes llamarnos al +34 912 345 678 o enviarnos un mensaje a través del formulario de contacto.';
    }
    
    if (lowerMessage.includes('delivery') || lowerMessage.includes('domicilio') || lowerMessage.includes('llevar')) {
        return 'Sí, ofrecemos servicio de delivery y comida para llevar. Puedes llamarnos para hacer tu pedido al +34 912 345 678.';
    }
    
    if (lowerMessage.includes('hola') || lowerMessage.includes('buenas') || lowerMessage.includes('buenos dias')) {
        return '¡Hola! Bienvenido a El Sabor del Chef. ¿En qué puedo ayudarte hoy? Puedo informarte sobre nuestro menú, horarios, reservas o cualquier otra consulta.';
    }
    
    if (lowerMessage.includes('gracias') || lowerMessage.includes('perfecto') || lowerMessage.includes('genial')) {
        return '¡De nada! Ha sido un placer ayudarte. Si tienes alguna otra pregunta, no dudes en escribirme. ¡Esperamos verte pronto en El Sabor del Chef!';
    }
    
    // Respuesta por defecto
    return 'Gracias por tu consulta. Para información específica sobre reservas, eventos o cualquier otra consulta, te recomiendo que nos llames al +34 912 345 678 o uses nuestro formulario de contacto. ¡Estaremos encantados de ayudarte!';
}

// Scroll effects
window.addEventListener('scroll', function() {
    const nav = document.querySelector('.nav-container');
    if (window.scrollY > 100) {
        nav.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
        nav.style.backdropFilter = 'blur(10px)';
    } else {
        nav.style.backgroundColor = '#ffffff';
        nav.style.backdropFilter = 'none';
    }
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe sections for animation
document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
});
