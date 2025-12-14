// js/carrito.js - Lógica de renderizado y actualización del Carrito

const SHIPPING_COST = 15.00; // Costo fijo de envío

document.addEventListener('DOMContentLoaded', () => {
    renderCart();
    
    // Asignar listeners a los botones de la tabla
    document.getElementById('cart-items-body').addEventListener('click', handleCartAction);
});

// ---------------------------------------------
// FUNCIONES DE RENDERIZADO
// ---------------------------------------------

function renderCart() {
    const cart = getCart(); // Asumimos que getCart está en app.js
    const cartBody = document.getElementById('cart-items-body');
    const emptyMessage = document.getElementById('empty-cart-message');

    // Limpiar tabla antes de renderizar
    cartBody.innerHTML = ''; 

    if (cart.length === 0) {
        emptyMessage.classList.remove('hidden');
        document.getElementById('cart-summary').style.display = 'none';
        return;
    }

    emptyMessage.classList.add('hidden');
    document.getElementById('cart-summary').style.display = 'block';

    cart.forEach(item => {
        const subtotal = item.price * item.quantity;
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.name}</td>
            <td>S/ ${item.price.toFixed(2)}</td>
            <td>
                <div class="quantity-controls">
                    <button data-action="decrease" data-id="${item.id}"><i class="fas fa-minus"></i></button>
                    <input type="number" value="${item.quantity}" min="1" data-id="${item.id}" readonly>
                    <button data-action="increase" data-id="${item.id}"><i class="fas fa-plus"></i></button>
                </div>
            </td>
            <td>S/ ${subtotal.toFixed(2)}</td>
            <td>
                <button class="remove-btn" data-action="remove" data-id="${item.id}" title="Eliminar Ítem">
                    <i class="fas fa-trash-can"></i>
                </button>
            </td>
        `;
        cartBody.appendChild(row);
    });

    calculateTotals(cart);
}

function calculateTotals(cart) {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const total = subtotal + SHIPPING_COST;

    document.getElementById('cart-subtotal').textContent = `S/ ${subtotal.toFixed(2)}`;
    document.getElementById('cart-shipping').textContent = `S/ ${SHIPPING_COST.toFixed(2)}`;
    document.getElementById('cart-total').textContent = `S/ ${total.toFixed(2)}`;
    
    // Actualizar el contador del header (asumido en app.js)
    if (typeof updateCartCount === 'function') {
        updateCartCount();
    }
}

// ---------------------------------------------
// FUNCIONES DE INTERACCIÓN
// ---------------------------------------------

function handleCartAction(event) {
    const target = event.target.closest('button');
    if (!target) return;

    const action = target.getAttribute('data-action');
    const id = target.getAttribute('data-id');
    let cart = getCart();
    const itemIndex = cart.findIndex(item => item.id === id);

    if (itemIndex === -1) return;

    switch (action) {
        case 'increase':
            cart[itemIndex].quantity++;
            break;
        case 'decrease':
            if (cart[itemIndex].quantity > 1) {
                cart[itemIndex].quantity--;
            }
            break;
        case 'remove':
            cart.splice(itemIndex, 1); // Eliminar el ítem
            break;
        default:
            return;
    }

    saveCart(cart); // Asumimos que saveCart está en app.js
    renderCart(); // Volver a dibujar la tabla
}