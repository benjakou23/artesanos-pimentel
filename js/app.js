// Constantes y Elementos del DOM
const cartCountElement = document.getElementById('cart-count');
const productList = document.getElementById('product-list');
const cartItemsBody = document.getElementById('cart-items-body');
const cartSubtotalElement = document.getElementById('cart-subtotal');
const cartTotalElement = document.getElementById('cart-total');
const emptyCartMessage = document.getElementById('empty-cart-message');
const proceedToCheckoutBtn = document.getElementById('proceed-to-checkout');
const shippingCost = 15.00; // Costo de envío fijo para la simulación

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

    const card = event.target.closest('.product-card');
    const id = card.getAttribute('data-id');
    const name = card.getAttribute('data-name');
    // Asegurarse de que el precio sea numérico
    const price = parseFloat(card.getAttribute('data-price')); 

    let cart = getCart();
    const existingItem = cart.find(item => item.id === id);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ id, name, price, quantity: 1 });
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
    const cart = getCart();
    cartItemsBody.innerHTML = ''; // Limpiar la tabla

    if (cart.length === 0) {
        // Mostrar mensaje de carrito vacío si no hay ítems
        cartItemsBody.innerHTML = `<tr><td colspan="5" id="empty-cart-message">El carrito está vacío.</td></tr>`;
        
        // Actualizar resumen a 0
        if (cartSubtotalElement) {
             cartSubtotalElement.textContent = `S/ 0.00`;
             cartTotalElement.textContent = `S/ 0.00`;
             document.getElementById('cart-shipping').textContent = `S/ 0.00`;
             if (proceedToCheckoutBtn) proceedToCheckoutBtn.style.display = 'none';
        }
        return;
    }

    if (proceedToCheckoutBtn) proceedToCheckoutBtn.style.display = 'inline-block';
    document.getElementById('cart-shipping').textContent = `S/ ${shippingCost.toFixed(2)}`;

    // 1. Renderizar Ítems
    cart.forEach(item => {
        const row = document.createElement('tr');
        const subtotal = item.price * item.quantity;
        
        row.innerHTML = `
            <td>${item.name}</td>
            <td>S/ ${item.price.toFixed(2)}</td>
            <td class="quantity-controls">
                <input type="number" 
                       value="${item.quantity}" 
                       min="1" 
                       data-id="${item.id}"
                       class="item-quantity">
            </td>
            <td>S/ ${subtotal.toFixed(2)}</td>
            <td>
                <button class="remove-btn" data-id="${item.id}">Eliminar</button>
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
    // Obtener el nuevo valor y asegurar que sea un entero positivo
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
    if (!event.target.classList.contains('remove-btn')) {
        return;
    }

    const id = event.target.getAttribute('data-id');
    let cart = getCart();
    
    // Filtramos para crear un nuevo array sin el ítem a eliminar
    cart = cart.filter(item => item.id !== id);
    
    saveCart(cart);
}

// ---------------------------------------------
// INICIALIZACIÓN
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

// Asegurarse de que el contador se muestre correctamente en ambas páginas
updateCartCount();