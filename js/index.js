// js/index.js - Lógica del Carrusel/Slider y Menú de Navegación

document.addEventListener('DOMContentLoaded', () => {

    // ==============================================
    // === 1. LÓGICA DEL MENÚ DE HAMBURGUESA ===
    // ==============================================

    const menuToggle = document.getElementById('menu-toggle');
    const mainNav = document.getElementById('main-nav');

    if (menuToggle && mainNav) {
        // Manejador para abrir/cerrar el menú
        menuToggle.addEventListener('click', () => {
            mainNav.classList.toggle('active');
            
            // Opcional: Cambiar el ícono de la hamburguesa a una 'X'
            const icon = menuToggle.querySelector('i');
            if (mainNav.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times'); // Usar fa-times para cerrar (X)
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });

        // Opcional: Cerrar el menú al hacer clic en un enlace (en móvil)
        const navLinks = mainNav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                // Solo si el menú está activo (móvil)
                if (mainNav.classList.contains('active')) {
                    mainNav.classList.remove('active');
                    // Restaurar el ícono de hamburguesa
                    const icon = menuToggle.querySelector('i');
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            });
        });
    }


    // ==============================================
    // === 2. LÓGICA DEL CARRUSEL/SLIDER ===
    // ==============================================

    const sliderWrapper = document.getElementById('slider-wrapper');
    const slides = document.querySelectorAll('.hero-slider .slide');
    const prevButton = document.querySelector('.slider-control.prev');
    const nextButton = document.querySelector('.slider-control.next');
    
    if (!sliderWrapper || slides.length === 0) return;

    let currentIndex = 0;
    const totalSlides = slides.length;
    
    // Función para mover el slider
    function updateSlider() {
        // Usa porcentaje, lo cual es responsive
        const offset = -currentIndex * 100;
        sliderWrapper.style.transform = `translateX(${offset}%)`;
    }

    // Manejador del botón Anterior
    prevButton.addEventListener('click', () => {
        // Ir a la diapositiva anterior (o al final si es la primera)
        currentIndex = (currentIndex > 0) ? currentIndex - 1 : totalSlides - 1;
        updateSlider();
    });

    // Manejador del botón Siguiente
    nextButton.addEventListener('click', () => {
        // Ir a la diapositiva siguiente (o al inicio si es la última)
        currentIndex = (currentIndex < totalSlides - 1) ? currentIndex + 1 : 0;
        updateSlider();
    });

    // Opcional: Auto-play (Descomentar para activar)
    /*
    setInterval(() => {
        currentIndex = (currentIndex < totalSlides - 1) ? currentIndex + 1 : 0;
        updateSlider();
    }, 5000); // Cambia cada 5 segundos
    */
});