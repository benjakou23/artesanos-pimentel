// js/tienda.js - Lógica para filtros y ordenamiento en la página de la tienda

document.addEventListener('DOMContentLoaded', () => {
    const productGrid = document.getElementById('full-product-list');
    const products = Array.from(productGrid.querySelectorAll('.product-card'));
    const priceRange = document.getElementById('price-range');
    const priceValueDisplay = document.getElementById('price-value');
    const sortBySelect = document.getElementById('sort-by');
    
    // Inicializar el valor del slider
    priceValueDisplay.textContent = priceRange.value;

    // Listener para el slider de precio
    priceRange.addEventListener('input', () => {
        priceValueDisplay.textContent = priceRange.value;
        applyFiltersAndSort();
    });

    // Listener para la barra lateral de filtros (categorías y artesanos)
    document.querySelector('.sidebar').addEventListener('click', (e) => {
        if (e.target.tagName === 'A' && e.target.closest('.filter-group')) {
            e.preventDefault();
            // Lógica simple: Marcar/desmarcar filtro de categoría
            document.querySelectorAll('.filter-group ul a').forEach(a => a.classList.remove('active-filter'));
            e.target.classList.add('active-filter');
            
            applyFiltersAndSort();
        } else if (e.target.classList.contains('btn-reset')) {
            // Limpiar filtros
            document.querySelectorAll('.filter-group ul a').forEach(a => a.classList.remove('active-filter'));
            document.getElementById('artisan-filter').value = 'all';
            priceRange.value = priceRange.max;
            priceValueDisplay.textContent = priceRange.max;
            applyFiltersAndSort();
        }
    });

    // Listener para el selector de ordenamiento
    sortBySelect.addEventListener('change', applyFiltersAndSort);
    
    // Listener para el filtro de artesano
    document.getElementById('artisan-filter').addEventListener('change', applyFiltersAndSort);


    function applyFiltersAndSort() {
        const maxPrice = parseFloat(priceRange.value);
        const selectedCategory = document.querySelector('.filter-group ul a.active-filter')?.getAttribute('data-filter') || 'all';
        const selectedArtisan = document.getElementById('artisan-filter').value;
        const sortCriteria = sortBySelect.value;
        let visibleCount = 0;

        // 1. FILTRADO
        products.forEach(product => {
            const price = parseFloat(product.getAttribute('data-price'));
            const category = product.getAttribute('data-category');
            const artisan = product.getAttribute('data-artisan');
            
            let isVisible = true;

            // Filtro por Precio
            if (price > maxPrice) {
                isVisible = false;
            }
            // Filtro por Categoría
            if (selectedCategory !== 'all' && category !== selectedCategory) {
                isVisible = false;
            }
            // Filtro por Artesano
            if (selectedArtisan !== 'all' && artisan !== selectedArtisan) {
                isVisible = false;
            }

            product.style.display = isVisible ? 'block' : 'none';
            if (isVisible) {
                visibleCount++;
            }
        });
        
        // 2. ORDENAMIENTO
        const visibleProducts = products.filter(p => p.style.display !== 'none');
        
        visibleProducts.sort((a, b) => {
            const priceA = parseFloat(a.getAttribute('data-price'));
            const priceB = parseFloat(b.getAttribute('data-price'));
            const nameA = a.getAttribute('data-name').toUpperCase();
            const nameB = b.getAttribute('data-name').toUpperCase();
            
            switch (sortCriteria) {
                case 'price-asc': return priceA - priceB;
                case 'price-desc': return priceB - priceA;
                case 'name-asc': return (nameA < nameB) ? -1 : (nameA > nameB) ? 1 : 0;
                case 'name-desc': return (nameA > nameB) ? -1 : (nameA < nameB) ? 1 : 0;
                default: return 0; // featured/default
            }
        });
        
        // 3. RE-RENDERIZADO
        productGrid.innerHTML = '';
        visibleProducts.forEach(product => productGrid.appendChild(product));
        
        // 4. ACTUALIZAR CONTADOR
        document.getElementById('product-count-display').textContent = `Mostrando ${visibleCount} resultados`;
    }

    // Ejecutar al cargar para inicializar filtros/ordenamiento
    applyFiltersAndSort(); 
});