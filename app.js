const products = [
    {
        id: 1,
        name: 'Altavoz Bluetooth Premium',
        price: 89.99,
        category: 'audio',
        image: 'assets/speaker.png',
        description: 'Altavoz portátil con sonido estéreo de alta calidad, batería de 12 horas y resistencia al agua IPX7. Perfecto para llevar tu música a cualquier lugar.',
        stock: 15
    },
    {
        id: 2,
        name: 'Auriculares Inalámbricos',
        price: 149.99,
        category: 'audio',
        image: 'assets/headphones.png',
        description: 'Auriculares con cancelación activa de ruido, hasta 30 horas de batería y conexión Bluetooth 5.0. Diseño ergonómico para máximo confort.',
        stock: 8
    },
    {
        id: 3,
        name: 'Smartwatch Deportivo',
        price: 199.99,
        category: 'wearables',
        image: 'assets/smartwatch.png',
        description: 'Reloj inteligente con monitor de frecuencia cardíaca, GPS integrado y resistencia al agua 5ATM. Compatible con iOS y Android.',
        stock: 12
    },
    {
        id: 4,
        name: 'PowerBank 20000mAh',
        price: 39.99,
        category: 'accesorios',
        image: 'assets/powerbank.png',
        description: 'Batería externa de alta capacidad con carga rápida y dos puertos USB. Diseño compacto y ligero, ideal para viajes.',
        stock: 25
    },
    {
        id: 5,
        name: 'Cable USB-C Premium',
        price: 19.99,
        category: 'accesorios',
        image: 'assets/cable.png',
        description: 'Cable de carga y datos trenzado de nylon de 2 metros. Soporta carga rápida hasta 100W y transferencia de datos USB 3.1.',
        stock: 50
    },
    {
        id: 6,
        name: 'Cargador Inalámbrico',
        price: 29.99,
        category: 'accesorios',
        image: 'assets/charger.png',
        description: 'Pad de carga inalámbrica Qi con indicador LED. Compatible con todos los dispositivos de carga inalámbrica. Diseño minimalista.',
        stock: 20
    },
    {
        id: 7,
        name: 'Earbuds Pro',
        price: 129.99,
        category: 'audio',
        image: 'assets/earbuds.png',
        description: 'Auriculares inalámbricos True Wireless con cancelación de ruido adaptativa, estuche de carga y hasta 24 horas de batería total.',
        stock: 10
    },
    {
        id: 8,
        name: 'Soporte para Laptop',
        price: 49.99,
        category: 'accesorios',
        image: 'assets/laptop-stand.png',
        description: 'Soporte ergonómico de aluminio ajustable en altura, compatible con laptops de 10 a 17 pulgadas. Mejora tu postura al trabajar.',
        stock: 18
    }
];

let filteredProducts = [...products];
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

const productGrid = document.getElementById('product-grid');
const searchInput = document.getElementById('search-input');
const categoryFilter = document.getElementById('category-filter');
const noResults = document.getElementById('no-results');
const modal = document.getElementById('product-modal');
const modalOverlay = modal.querySelector('.modal-overlay');
const modalClose = modal.querySelector('.modal-close');

let focusBeforeModal = null;
let modalFocusTrapHandler = null;

function renderProducts() {
    productGrid.innerHTML = '';
    
    if (filteredProducts.length === 0) {
        productGrid.style.display = 'none';
        noResults.style.display = 'block';
        return;
    }
    
    productGrid.style.display = 'grid';
    noResults.style.display = 'none';
    
    filteredProducts.forEach(product => {
        const isFavorite = favorites.includes(product.id);
        
        const card = document.createElement('article');
        card.className = 'product-card';
        card.setAttribute('role', 'listitem');
        
        card.innerHTML = `
            <div class="product-image-container">
                <img 
                    src="${product.image}" 
                    alt="${product.name}" 
                    class="product-image"
                    width="300"
                    height="300"
                    loading="lazy"
                >
                <button 
                    class="favorite-btn ${isFavorite ? 'active' : ''}" 
                    data-id="${product.id}"
                    aria-label="${isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}"
                    aria-pressed="${isFavorite}"
                >
                    ${isFavorite ? '❤️' : '🤍'}
                </button>
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-category">${product.category}</p>
                <p class="product-price">$${product.price.toFixed(2)}</p>
                <button 
                    class="view-btn" 
                    data-id="${product.id}"
                    aria-label="Ver detalles de ${product.name}"
                >
                    Ver Detalles
                </button>
            </div>
        `;
        
        productGrid.appendChild(card);
    });
    
    attachEventListeners();
}

function attachEventListeners() {
    const favoriteButtons = productGrid.querySelectorAll('.favorite-btn');
    const viewButtons = productGrid.querySelectorAll('.view-btn');
    
    favoriteButtons.forEach(btn => {
        btn.addEventListener('click', toggleFavorite);
    });
    
    viewButtons.forEach(btn => {
        btn.addEventListener('click', openModal);
    });
}

function toggleFavorite(e) {
    const productId = parseInt(e.currentTarget.dataset.id);
    const index = favorites.indexOf(productId);
    
    if (index > -1) {
        favorites.splice(index, 1);
        e.currentTarget.classList.remove('active');
        e.currentTarget.innerHTML = '🤍';
        e.currentTarget.setAttribute('aria-label', 'Agregar a favoritos');
        e.currentTarget.setAttribute('aria-pressed', 'false');
    } else {
        favorites.push(productId);
        e.currentTarget.classList.add('active');
        e.currentTarget.innerHTML = '❤️';
        e.currentTarget.setAttribute('aria-label', 'Quitar de favoritos');
        e.currentTarget.setAttribute('aria-pressed', 'true');
    }
    
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

function filterProducts() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    const selectedCategory = categoryFilter.value;
    
    filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm);
        const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
        
        return matchesSearch && matchesCategory;
    });
    
    renderProducts();
}

function openModal(e) {
    const productId = parseInt(e.currentTarget.dataset.id);
    const product = products.find(p => p.id === productId);
    
    if (!product) return;
    
    focusBeforeModal = document.activeElement;
    
    document.getElementById('modal-title').textContent = product.name;
    document.getElementById('modal-description').textContent = product.description;
    document.getElementById('modal-price').textContent = `$${product.price.toFixed(2)}`;
    document.getElementById('modal-stock').innerHTML = `<strong>Stock disponible:</strong> ${product.stock} unidades`;
    document.getElementById('modal-category').innerHTML = `<strong>Categoría:</strong> ${product.category}`;
    
    const modalImage = document.getElementById('modal-image');
    modalImage.src = product.image;
    modalImage.alt = product.name;
    
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    
    setTimeout(() => {
        modalClose.focus();
    }, 100);
    
    trapFocus();
}

function closeModal() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    
    if (modalFocusTrapHandler) {
        modal.removeEventListener('keydown', modalFocusTrapHandler);
        modalFocusTrapHandler = null;
    }
    
    if (focusBeforeModal) {
        focusBeforeModal.focus();
    }
}

function trapFocus() {
    if (modalFocusTrapHandler) {
        modal.removeEventListener('keydown', modalFocusTrapHandler);
    }
    
    const focusableElements = modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];
    
    modalFocusTrapHandler = function(e) {
        if (e.key === 'Tab') {
            if (e.shiftKey) {
                if (document.activeElement === firstFocusable) {
                    e.preventDefault();
                    lastFocusable.focus();
                }
            } else {
                if (document.activeElement === lastFocusable) {
                    e.preventDefault();
                    firstFocusable.focus();
                }
            }
        }
    };
    
    modal.addEventListener('keydown', modalFocusTrapHandler);
}

searchInput.addEventListener('input', filterProducts);
categoryFilter.addEventListener('change', filterProducts);

modalClose.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModal();
    }
});

renderProducts();
