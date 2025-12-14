document.addEventListener('DOMContentLoaded', () => {

    // =========================================================
    // === 1. LÓGICA DEL MENÚ DE HAMBURGUESA (GLOBAL) ===
    // =========================================================

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
                if (mainNav.classList.contains('active')) {
                    mainNav.classList.remove('active');
                    const icon = menuToggle.querySelector('i');
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            });
        });
    }

    // =========================================================
    // === 2. LÓGICA DEL CARRITO DE COMPRAS (GLOBAL) ===
    // =========================================================
    
    // Constantes y Elementos del DOM del Carrito
    const cartCountElement = document.getElementById('cart-count');
    const productList = document.getElementById('product-list'); // En tienda.html o index.html
    const cartItemsBody = document.getElementById('cart-items-body'); // En carrito.html
    const cartSubtotalElement = document.getElementById('cart-subtotal');
    const cartTotalElement = document.getElementById('cart-total');
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

    // Exportada para poder ser llamada desde cualquier lugar si es necesario (aunque aquí está encapsulada)
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
            // Se asume que el producto tiene una imagen que se mostrará en el carrito
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
        const cart = getCart();
        cartItemsBody.innerHTML = ''; // Limpiar la tabla

        if (cart.length === 0) {
            // Mostrar mensaje de carrito vacío
            cartItemsBody.innerHTML = `<tr><td colspan="5" class="text-center">El carrito está vacío.</td></tr>`;
            
            // Actualizar resumen a 0 y ocultar botón de pago
            if (cartSubtotalElement) {
                cartSubtotalElement.textContent = `S/ 0.00`;
                cartTotalElement.textContent = `S/ 0.00`;
                const cartShippingElement = document.getElementById('cart-shipping');
                if (cartShippingElement) cartShippingElement.textContent = `S/ 0.00`;
                if (proceedToCheckoutBtn) proceedToCheckoutBtn.style.display = 'none';
            }
            return;
        }

        // Mostrar costos de envío y botón de pago
        if (proceedToCheckoutBtn) proceedToCheckoutBtn.style.display = 'inline-block';
        const cartShippingElement = document.getElementById('cart-shipping');
        if (cartShippingElement) cartShippingElement.textContent = `S/ ${shippingCost.toFixed(2)}`;

        // 1. Renderizar Ítems
        cart.forEach(item => {
            const row = document.createElement('tr');
            const subtotal = item.price * item.quantity;
            
            // Asegúrate de que el HTML de tu carrito.html tenga una estructura de tabla que acepte 5 columnas.
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
        // Obtener el nuevo valor y asegurar que sea un entero positivo
        const newQuantity = Math.max(1, parseInt(input.value, 10)); 
        
        let cart = getCart();
        const item = cart.find(i => i.id === id);

        if (item) {
            item.quantity = newQuantity;
            // Guardamos, lo cual dispara renderCart() para actualizar toda la interfaz
            saveCart(cart); 
        }
    }

    // Maneja la eliminación de ítem
    function removeItem(event) {
        if (!event.target.closest('.remove-btn')) { // Usar closest para asegurar que el click funcione en el ícono o el botón
            return;
        }

        // Obtener el ID del botón o de su ancestro (si el ícono fue clickeado)
        const id = event.target.closest('.remove-btn').getAttribute('data-id'); 
        let cart = getCart();
        
        // Filtramos para crear un nuevo array sin el ítem a eliminar
        cart = cart.filter(item => item.id !== id);
        
        saveCart(cart);
    }

    // ---------------------------------------------
    // INICIALIZACIÓN DE LISTENERS
    // ---------------------------------------------

    // 1. Asignar listeners en la página del catálogo/tienda
    if (productList) {
        productList.addEventListener('click', addToCart);
    }

    // 2. Asignar listeners en la página del carrito
    if (cartItemsBody) {
        renderCart(); // Cargar los ítems al entrar a la página
        cartItemsBody.addEventListener('change', updateQuantity); // Para el input de cantidad
        cartItemsBody.addEventListener('click', removeItem); // Para el botón de eliminar
    }

    // 3. Asegurarse de que el contador de todas las páginas se muestre correctamente
    updateCartCount();
});