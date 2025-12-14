// Constantes y Elementos del DOM (Asegúrate de que 'cartCountElement' ya fue declarado arriba)
// const cartCountElement = document.getElementById('cart-count'); // Ya debe estar declarado en el script global
// const productList = document.getElementById('product-list'); // Ya debe estar declarado en el script global
// const cartItemsBody = document.getElementById('cart-items-body'); // Ya debe estar declarado en el script global
// const cartSubtotalElement = document.getElementById('cart-subtotal'); // Ya debe estar declarado en el script global
// const cartTotalElement = document.getElementById('cart-total'); // Ya debe estar declarado en el script global
// const emptyCartMessage = document.getElementById('empty-cart-message'); // Ya debe estar declarado en el script global
// const proceedToCheckoutBtn = document.getElementById('proceed-to-checkout'); // Ya debe estar declarado en el script global
// const shippingCost = 15.00; // Costo de envío fijo para la simulación

// --- Funciones de Utilidad (Guardar/Obtener Carrito) ---

function getCart() {
    const cart = localStorage.getItem('artesaniaCart');
    return cart ? JSON.parse(cart) : [];
}

function saveCart(cart) {
    localStorage.setItem('artesaniaCart', JSON.stringify(cart));
    updateCartCount();
    // Vuelve a renderizar el carrito si estamos en la página del carrito
    if (cartItemsBody) {
        renderCart();
    }
}

function updateCartCount() {
    const cart = getCart();
    // Suma la cantidad (quantity) de todos los ítems
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    if (cartCountElement) {
        cartCountElement.textContent = totalItems;
    }
}

// --- Lógica del Catálogo (Añadir al Carrito) ---

function addToCart(event) {
    if (!event.target.classList.contains('add-to-cart')) {
        return;
    }
    
    // Si el botón es un enlace, prevenimos el comportamiento por defecto
    event.preventDefault();

    const card = event.target.closest('.product-card');
    const id = card.getAttribute('data-id');
    const name = card.getAttribute('data-name');
    const price = parseFloat(card.getAttribute('data-price')); 

    let cart = getCart();
    const existingItem = cart.find(item => item.id === id);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        // Incluimos la imagen si está disponible (asumiendo que hay una imagen en la tarjeta)
        const imageUrl = card.querySelector('img') ? card.querySelector('img').src : '';
        cart.push({ id, name, price, quantity: 1, imageUrl: imageUrl }); 
    }

    saveCart(cart);
    alert(`"${name}" añadido al carrito.`);
}

// --- Lógica del Carrito (Renderizar, Actualizar, Eliminar) ---

function calculateTotals(cart) {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const total = subtotal > 0 ? subtotal + shippingCost : 0;
    return { subtotal, total };
}

function renderCart() {
    if (!cartItemsBody) return; // Salir si no estamos en carrito.html
    
    const cart = getCart();
    cartItemsBody.innerHTML = ''; // Limpiar la tabla

    if (cart.length === 0) {
        // Mostrar mensaje de carrito vacío (usando el colspan de 5 columnas)
        cartItemsBody.innerHTML = `<tr><td colspan="5" class="text-center">El carrito está vacío.</td></tr>`;
        
        // Actualizar resumen a 0
        if (cartSubtotalElement) {
            cartSubtotalElement.textContent = `S/ 0.00`;
            cartTotalElement.textContent = `S/ 0.00`;
            const cartShippingElement = document.getElementById('cart-shipping');
            if (cartShippingElement) cartShippingElement.textContent = `S/ 0.00`;
            if (proceedToCheckoutBtn) proceedToCheckoutBtn.style.display = 'none';
        }
        return;
    }

    if (proceedToCheckoutBtn) proceedToCheckoutBtn.style.display = 'inline-block';
    const cartShippingElement = document.getElementById('cart-shipping');
    if (cartShippingElement) cartShippingElement.textContent = `S/ ${shippingCost.toFixed(2)}`;

    // 1. Renderizar Ítems
    cart.forEach(item => {
        const row = document.createElement('tr');
        const subtotal = item.price * item.quantity;
        
        row.innerHTML = `
            <td data-label="Producto">${item.name}</td>
            <td data-label="Precio">S/ ${item.price.toFixed(2)}</td>
            <td data-label="Cantidad" class="quantity-controls">
                <input type="number" 
                        value="${item.quantity}" 
                        min="1" 
                        data-id="${item.id}"
                        class="item-quantity">
            </td>
            <td data-label="Subtotal">S/ ${subtotal.toFixed(2)}</td>
            <td data-label="Acción">
                <button class="remove-btn btn-delete" data-id="${item.id}"><i class="fas fa-trash"></i></button>
            </td>
        `;
        cartItemsBody.appendChild(row);
    });

    // 2. Calcular y Mostrar Totales
    const { subtotal, total } = calculateTotals(cart);
    
    if (cartSubtotalElement) {
        cartSubtotalElement.textContent = `S/ ${subtotal.toFixed(2)}`;
    }
    if (cartTotalElement) {
        cartTotalElement.textContent = `S/ ${total.toFixed(2)}`;
    }
}

// Maneja la actualización de cantidad
function updateQuantity(event) {
    if (!event.target.classList.contains('item-quantity')) {
        return;
    }

    const input = event.target;
    const id = input.getAttribute('data-id');
    // Obtener el nuevo valor y asegurar que sea un entero positivo (min="1" ya lo hace HTML, pero JS previene errores)
    const newQuantity = Math.max(1, parseInt(input.value, 10)); 
    
    let cart = getCart();
    const item = cart.find(i => i.id === id);

    if (item) {
        item.quantity = newQuantity;
        // La tabla se redibujará en saveCart, por eso no necesitamos actualizar el input aquí.
        saveCart(cart); 
    }
}

// Maneja la eliminación de ítem
function removeItem(event) {
    // Buscamos el botón .remove-btn para obtener el data-id, incluso si se hizo clic en el <i>
    const removeButton = event.target.closest('.remove-btn');
    if (!removeButton) {
        return;
    }

    const id = removeButton.getAttribute('data-id');
    let cart = getCart();
    
    // Filtramos para crear un nuevo array sin el ítem a eliminar
    cart = cart.filter(item => item.id !== id);
    
    saveCart(cart);
}

// ---------------------------------------------
// INICIALIZACIÓN (Debe estar dentro de document.addEventListener('DOMContentLoaded', ...))
// ---------------------------------------------

// Asignar listeners en la página del catálogo
if (productList) {
    productList.addEventListener('click', addToCart);
}

// Asignar listeners en la página del carrito
if (cartItemsBody) {
    renderCart(); // Cargar los ítems al entrar a la página
    cartItemsBody.addEventListener('change', updateQuantity); // Para el input de cantidad
    cartItemsBody.addEventListener('click', removeItem); // Para el botón de eliminar
}

// Asegurarse de que el contador se muestre correctamente en todas las páginas
updateCartCount();