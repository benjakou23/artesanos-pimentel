// js/checkout.js - Lógica de la página de Finalizar Compra

document.addEventListener('DOMContentLoaded', () => {
    // 1. Mostrar el total final al cargar
    if (typeof getCart === 'function' && typeof calculateTotals === 'function') {
        const cart = getCart();
        const { subtotal, total } = calculateTotals(cart); // Asume que calculateTotals devuelve {subtotal, total, shipping}
        
        const summarySubtotal = document.getElementById('summary-subtotal');
        const finalTotalElement = document.getElementById('final-total');
        const summaryShipping = document.getElementById('summary-shipping');
        
        if (summarySubtotal) summarySubtotal.textContent = `S/ ${subtotal.toFixed(2)}`;
        if (finalTotalElement) finalTotalElement.textContent = `S/ ${total.toFixed(2)}`;
        // Asumiendo S/ 15.00 es la tarifa fija, si no, se calcularía en app.js/calculateTotals
        if (summaryShipping) summaryShipping.textContent = 'S/ 15.00'; 

        // Si el carrito está vacío, redirigir
        if (cart.length === 0) {
            alert("Tu carrito está vacío. Redirigiendo a la tienda.");
            window.location.href = 'tienda.html';
            return;
        }

    } else {
        console.error("Faltan funciones de carrito (getCart, calculateTotals) en app.js.");
    }

    // 2. Manejar el envío simulado del formulario
    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simular validación básica (ya hecho con 'required' en HTML, pero para demostración)
            const name = document.getElementById('name').value;
            if (!name || name.length < 3) {
                 alert("Por favor, introduce tu nombre completo.");
                 return;
            }
            
            // SIMULACIÓN DE PROCESO DE PAGO EXITOSO
            
            // 1. Mostrar mensaje de éxito
            alert('¡Pedido Confirmado con Éxito! Recibirás un correo electrónico con los detalles para la transferencia bancaria. (Simulación)');
            
            // 2. Limpiar el carrito después de la "compra" simulada
            if (typeof localStorage !== 'undefined') {
                localStorage.removeItem('artesaniaCart');
            }
            
            // 3. Actualizar el contador del header
            if (typeof updateCartCount === 'function') {
                updateCartCount();
            }
            
            // 4. Redirigir a la página de inicio o a una página de agradecimiento
            window.location.href = 'index.html'; 
        });
    }
});