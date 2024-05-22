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
                            Add To Cart
                        </button>
                        <button class="addFavorite" data-id="${product.id}" data-name="${product.name}" data-price="${product.price}" data-image="${product.image}">
                            Add To Favorites
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
                    price: event.target.getAttribute('data-price'),
                    image: event.target.getAttribute('data-image')
                };

                addToCart(product);
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
                    price: event.target.getAttribute('data-price'),
                    image: event.target.getAttribute('data-image')
                };

                addToFavorites(product);
            });
        });
    };

    const addToCart = (product) => {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart.push(product);
        localStorage.setItem('cart', JSON.stringify(cart));
        alert('Produkt dodany do koszyka');
    };

    const addToFavorites = (product) => {
        let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        favorites.push(product);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        alert('Produkt dodany do ulubionych');
    };

    const displayCartItems = () => {
        const cartItemsContainer = document.getElementById('cartItems');
        const cart = JSON.parse(localStorage.getItem('cart')) || [];

        // Clear the container
        cartItemsContainer.innerHTML = '';

        cart.forEach(product => {
            let newCartItem = document.createElement('div');
            newCartItem.classList.add('col-md-3');
            newCartItem.innerHTML = `
            <div class="card no-border no-border-radius">
                <img src="${product.image}" class="card-img-top" alt="${product.name}">
                <div class="card-body">
                    <h5 class="card-title">${product.name}</h5>
                    <p class="card-text">${product.price} PLN</p>
                </div>
            </div>
        `;

            cartItemsContainer.appendChild(newCartItem);
        });
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
