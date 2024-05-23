document.addEventListener('DOMContentLoaded', (event) => {
    const joinButton = document.querySelector('#accountModal .btn-outline-secondary');

    joinButton.addEventListener('click', () => {
        const accountModal = new bootstrap.Modal(document.getElementById('accountModal'));
        const registerModal = new bootstrap.Modal(document.getElementById('registerModal'));

        accountModal.hide();
        registerModal.show();
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const sections = {
        kobieta: document.getElementById('kobieta'),
        mezczyzna: document.getElementById('mezczyzna'),
        sport: document.getElementById('sport'),
        akcesoria: document.getElementById('akcesoria'),
        ofertaspecjalna: document.getElementById('ofertaspecjalna')
    };

    fetch('products.json')
        .then(response => response.json())
        .then(products => {
            displayProductsByCategory(products);
        });

    const displayProductsByCategory = (products) => {
        products.forEach(product => {
            let newProduct = document.createElement('div');
            newProduct.classList.add('col-md-3');
            newProduct.innerHTML = `
                <div class="card no-border no-border-radius">
                    <img src="${product.image}" class="card-img-top" alt="${product.name}">
                    <div class="card-body">
                        <h5 class="card-title">${product.name}</h5>
                        <p class="card-text">${product.price} PLN</p>
                        <button class="addCart" data-id="${product.id}" data-name="${product.name}" data-price="${product.price}" data-image="${product.image}">
                            <i class="fas fa-shopping-cart"></i>
                        </button>
                        <button class="addFavorite" data-id="${product.id}" data-name="${product.name}" data-price="${product.price}" data-image="${product.image}">
                            <i class="fas fa-heart"></i>
                        </button>
                    </div>
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

    const setupCartButtons = () => {
        const addCartButtons = document.querySelectorAll('.addCart');

        addCartButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                const product = {
                    id: event.target.getAttribute('data-id'),
                    name: event.target.getAttribute('data-name'),
                    price: parseFloat(event.target.getAttribute('data-price')),
                    image: event.target.getAttribute('data-image')
                };

                if (product.id && product.name && !isNaN(product.price) && product.image) {
                    addToCart(product);
                } else {
                    console.error('Invalid product data:', product);
                }
            });
        });
    };

    const setupFavoriteButtons = () => {
        const addFavoriteButtons = document.querySelectorAll('.addFavorite');

        addFavoriteButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                const product = {
                    id: event.target.getAttribute('data-id'),
                    name: event.target.getAttribute('data-name'),
                    price: parseFloat(event.target.getAttribute('data-price')),
                    image: event.target.getAttribute('data-image')
                };

                if (product.id && product.name && !isNaN(product.price) && product.image) {
                    addToFavorites(product);
                } else {
                    console.error('Invalid product data:', product);
                }
            });
        });
    };

    const addToCart = (product) => {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const productExists = cart.some(item => item.id === product.id);

        if (productExists) {
            alert('Ten produkt jest już w koszyku');
        } else {
            cart.push(product);
            localStorage.setItem('cart', JSON.stringify(cart));
            alert('Produkt dodany do koszyka');
            displayCartItems();
        }
    };

    const addToFavorites = (product) => {
        let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        const favoriteExists = favorites.some(item => item.id === product.id);

        if (favoriteExists) {
            alert('Ten produkt jest już w ulubionych');
        } else {
            favorites.push(product);
            localStorage.setItem('favorites', JSON.stringify(favorites));
            alert('Produkt dodany do ulubionych');
            displayFavouriteItems();
        }
    };

    const displayCartItems = () => {
        const cartItemsContainer = document.getElementById('cartItems');
        const cart = JSON.parse(localStorage.getItem('cart')) || [];

        // Clear the container
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

    const setupRemoveButtons = () => {
        const removeButtons = document.querySelectorAll('.remove-btn');

        removeButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                const productId = event.target.getAttribute('data-id');
                removeFromCart(productId);
                displayCartItems();
            });
        });
    };

    const removeFromCart = (productId) => {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart = cart.filter(product => product.id !== productId);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateTotalPrice();
    };

    const updateTotalPrice = () => {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const totalPrice = cart.reduce((sum, product) => sum + product.price, 0);
        document.getElementById('total-price').textContent = totalPrice.toFixed(2);
    };

    displayCartItems();

    const displayFavouriteItems = () => {
        const favouriteItemsContainer = document.getElementById('favouriteItems');
        const favourites = JSON.parse(localStorage.getItem('favorites')) || [];

        // Clear the container
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

    displayFavouriteItems();
});
