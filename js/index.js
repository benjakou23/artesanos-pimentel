// js/index.js - Lógica del Carrusel/Slider

document.addEventListener('DOMContentLoaded', () => {
    const sliderWrapper = document.getElementById('slider-wrapper');
    const slides = document.querySelectorAll('.hero-slider .slide');
    const prevButton = document.querySelector('.slider-control.prev');
    const nextButton = document.querySelector('.slider-control.next');
    
    if (!sliderWrapper || slides.length === 0) return;

    let currentIndex = 0;
    const totalSlides = slides.length;
    
    // Función para mover el slider
    function updateSlider() {
        // Calcula el desplazamiento horizontal requerido (en porcentaje)
        const offset = -currentIndex * 100;
        sliderWrapper.style.transform = `translateX(${offset}%)`;
    }

    // Manejador del botón Anterior
    prevButton.addEventListener('click', () => {
        currentIndex = (currentIndex > 0) ? currentIndex - 1 : totalSlides - 1;
        updateSlider();
    });

    // Manejador del botón Siguiente
    nextButton.addEventListener('click', () => {
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