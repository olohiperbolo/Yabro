document.addEventListener('DOMContentLoaded', () => {
    // Funkcja obsługująca kliknięcie przycisku "Dołącz" w modalu konta, który otwiera modal rejestracji
    const joinButton = document.querySelector('#accountModal .btn-outline-secondary');

    if (joinButton) {
        joinButton.addEventListener('click', () => {
            const accountModal = new bootstrap.Modal(document.getElementById('accountModal'));
            const registerModal = new bootstrap.Modal(document.getElementById('registerModal'));

            accountModal.hide();
            registerModal.show();
        });
    }

    // Inicjalizacja sekcji produktów na podstawie ich kategorii
    const sections = {
        kobieta: document.getElementById('kobieta'),
        mezczyzna: document.getElementById('mezczyzna'),
        sport: document.getElementById('sport'),
        akcesoria: document.getElementById('akcesoria'),
        ofertaspecjalna: document.getElementById('ofertaspecjalna')
    };

    // Pobranie produktów z pliku JSON i wyświetlenie ich według kategorii
    fetch('products.json')
        .then(response => response.json())
        .then(products => {
            displayProductsByCategory(products);
        });

    // Funkcja do wyświetlania produktów w odpowiednich sekcjach według kategorii
    const displayProductsByCategory = (products) => {
        products.forEach(product => {
            let newProduct = document.createElement('div');
            newProduct.classList.add('col-md-3');
            newProduct.innerHTML = `
            <div class="card no-border no-border-radius">
                <a href="produkt.html?productId=${product.id}" target="_blank" style="text-decoration: none; color: black">
                    <img src="${product.images[0]}" class="card-img-top" alt="${product.name}">
                    <div class="card-body">
                        <h5 class="card-title">${product.name}</h5>
                        <p class="card-text">${product.price} PLN</p>
                        <button class="addCart btn btn-outline-secondary" data-id="${product.id}" data-name="${product.name}" data-price="${product.price}" data-image="${product.images[0]}">
                            <i class="fas fa-shopping-cart"></i>
                        </button>
                        <button class="addFavorite btn btn-outline-secondary" data-id="${product.id}" data-name="${product.name}" data-price="${product.price}" data-image="${product.images[0]}">
                            <i class="fas fa-heart"></i>
                        </button>
                    </div>
                </a>
            </div>
        `;

            const section = sections[product.category];
            if (section) {
                section.appendChild(newProduct);
            }
        });

        setupCartButtons();
        setupFavoriteButtons();
    };

    // Funkcja ustawiająca obsługę przycisków dodawania produktów do koszyka
    const setupCartButtons = () => {
        const addCartButtons = document.querySelectorAll('.addCart');

        addCartButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                event.preventDefault();
                event.stopPropagation();

                const product = {
                    id: event.currentTarget.getAttribute('data-id'),
                    name: event.currentTarget.getAttribute('data-name'),
                    price: parseFloat(event.currentTarget.getAttribute('data-price')),
                    image: event.currentTarget.getAttribute('data-image')
                };

                if (product.id && product.name && !isNaN(product.price) && product.image) {
                    addToCart(product);
                } else {
                    console.error('Invalid product data:', product);
                }
            });
        });
    };

    // Funkcja ustawiająca obsługę przycisków dodawania produktów do ulubionych
    const setupFavoriteButtons = () => {
        const addFavoriteButtons = document.querySelectorAll('.addFavorite');

        addFavoriteButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                event.preventDefault();
                event.stopPropagation();

                const product = {
                    id: event.currentTarget.getAttribute('data-id'),
                    name: event.currentTarget.getAttribute('data-name'),
                    price: parseFloat(event.currentTarget.getAttribute('data-price')),
                    image: event.currentTarget.getAttribute('data-image')
                };

                if (product.id && product.name && !isNaN(product.price) && product.image) {
                    addToFavorites(product);
                } else {
                    console.error('Invalid product data:', product);
                }
            });
        });
    };

    // Funkcja dodająca produkt do koszyka w localStorage
    const addToCart = (product) => {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const productExists = cart.some(item => item.id === product.id);

        if (productExists) {
            alert('Ten produkt jest już w koszyku');
        } else {
            cart.push(product);
            console.log('Dodano do koszyka:', product);
            localStorage.setItem('cart', JSON.stringify(cart));
            alert('Produkt dodany do koszyka');
            displayCartItems();
        }
    };

    // Funkcja dodająca produkt do ulubionych w localStorage
    const addToFavorites = (product) => {
        let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        const favoriteExists = favorites.some(item => item.id === product.id);

        if (favoriteExists) {
            alert('Ten produkt jest już w ulubionych');
        } else {
            favorites.push(product);
            console.log('Dodano do ulubionych:', product);
            localStorage.setItem('favorites', JSON.stringify(favorites));
            alert('Produkt dodany do ulubionych');
            displayFavouriteItems();
        }
    };

    // Funkcja wyświetlająca produkty w koszyku
    const displayCartItems = () => {
        const cartItemsContainer = document.getElementById('cartItems');
        const cart = JSON.parse(localStorage.getItem('cart')) || [];

        // Czyszczenie zawartości kontenera
        cartItemsContainer.innerHTML = '';

        cart.forEach(product => {
            let newCartItem = document.createElement('div');
            newCartItem.classList.add('cart-item');
            newCartItem.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <div class="cart-item-info">
                    <h5>${product.name}</h5>
                    <p>${product.price} PLN</p>
                </div>
                <button class="remove-btn" data-id="${product.id}">Usuń</button>
            `;

            cartItemsContainer.appendChild(newCartItem);
        });

        setupRemoveButtons();
        updateTotalPrice();
    };

    // Funkcja ustawiająca obsługę przycisków usuwania produktów z koszyka
    const setupRemoveButtons = () => {
        const removeButtons = document.querySelectorAll('.remove-btn');

        removeButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                const productId = event.currentTarget.getAttribute('data-id');
                removeFromCart(productId);
                displayCartItems();
            });
        });
    };

    // Funkcja usuwająca produkt z koszyka
    const removeFromCart = (productId) => {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart = cart.filter(product => product.id !== productId);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateTotalPrice();
    };

    // Funkcja aktualizująca łączną cenę produktów w koszyku
    const updateTotalPrice = () => {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const totalPrice = cart.reduce((sum, product) => sum + product.price, 0);
        document.getElementById('total-price').textContent = totalPrice.toFixed(2);
    };

    // Funkcja wyświetlająca ulubione produkty
    const displayFavouriteItems = () => {
        const favouriteItemsContainer = document.getElementById('favouriteItems');
        const favourites = JSON.parse(localStorage.getItem('favorites')) || [];
        console.log('Ulubione produkty:', favourites);

        // Czyszczenie zawartości kontenera
        favouriteItemsContainer.innerHTML = '';

        favourites.forEach(product => {
            let newFavouriteItem = document.createElement('div');
            newFavouriteItem.classList.add('col-md-3');
            newFavouriteItem.innerHTML = `
                <div class="card no-border no-border-radius">
                    <img src="${product.image}" class="card-img-top" alt="${product.name}">
                    <div class="card-body">
                        <h5 class="card-title">${product.name}</h5>
                        <p class="card-text">${product.price} PLN</p>
                    </div>
                </div>
            `;

            favouriteItemsContainer.appendChild(newFavouriteItem);
        });
    };

    // Wywołanie funkcji podczas ładowania strony
    displayCartItems();
    displayFavouriteItems();
});

document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('productId');

    if (productId) {
        fetch('products.json')
            .then(response => response.json())
            .then(data => {
                const product = data.find(item => item.id == productId);
                if (product) {
                    const carouselInner = document.getElementById('carousel-inner');
                    const images = product.images;
                    carouselInner.innerHTML = ''; // Czyszczenie istniejących elementów

                    images.forEach((imageSrc, index) => {
                        const div = document.createElement('div');
                        div.className = index === 0 ? 'carousel-item active' : 'carousel-item';
                        const img = document.createElement('img');
                        img.className = 'd-block w-100';
                        img.src = imageSrc;
                        div.appendChild(img);
                        carouselInner.appendChild(div);
                    });

                    // Re-inicjalizacja karuzeli po dodaniu nowych elementów
                    $('#productCarousel').carousel();

                    // Aktualizacja danych produktu
                    document.getElementById('product-title').textContent = product.name;
                    document.getElementById('product-price').textContent = `${product.price} PLN`;
                    document.getElementById('product-description').innerHTML = `
                        <p>${product['product-description'] || 'Brak opisu produktu.'}</p>
                    `;

                    // Obsługa przycisków dodawania do koszyka i ulubionych
                    document.getElementById('addToCart').addEventListener('click', () => {
                        addToCart(product);
                    });
                    document.getElementById('addToFavorites').addEventListener('click', () => {
                        addToFavorites(product);
                    });
                }
            })
            .catch(error => {
                console.error('Error fetching product data:', error);
            });
    }

    // Funkcje dodawania do koszyka i ulubionych
    const addToCart = (product) => {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        if (!cart.some(item => item.id === product.id)) {
            cart.push(product);
            localStorage.setItem('cart', JSON.stringify(cart));
            alert('Product added to cart');
        } else {
            alert('Product already in cart');
        }
    };

    const addToFavorites = (product) => {
        let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        if (!favorites.some(item => item.id === product.id)) {
            favorites.push(product);
            localStorage.setItem('favorites', JSON.stringify(favorites));
            alert('Product added to favorites');
        } else {
            alert('Product already in favorites');
        }
    };
});
