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

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    // Funkcja obsługująca rejestrację
    const registerForm = document.querySelector('#registerModal form');
    if (registerForm) {
        registerForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const username = document.getElementById('registerUsername').value;
            const email = document.getElementById('registerEmail').value;
            const password = document.getElementById('registerPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            if (!validateEmail(email)) {
                alert('Proszę podać prawidłowy adres e-mail.');
                return;
            }

            if (password.length < 8) {
                alert('Hasło musi zawierać co najmniej 8 znaków.');
                return;
            }

            if (password !== confirmPassword) {
                alert('Hasła muszą być zgodne.');
                return;
            }

            const users = JSON.parse(localStorage.getItem('users')) || [];

            if (users.find(user => user.email === email)) {
                alert('Użytkownik z tym emailem już istnieje');
                return;
            }

            users.push({ username, email, password });
            localStorage.setItem('users', JSON.stringify(users));
            alert('Rejestracja zakończona sukcesem');
            const registerModal = new bootstrap.Modal(document.getElementById('registerModal'));
            registerModal.hide();
        });
    }


    // Funkcja obsługująca logowanie
    const loginForm = document.querySelector('#accountModal form');
    if (loginForm) {
        loginForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;

            const users = JSON.parse(localStorage.getItem('users')) || [];

            const user = users.find(user => user.email === email && user.password === password);

            if (user) {
                alert('Logowanie zakończone sukcesem');
                const accountModal = new bootstrap.Modal(document.getElementById('accountModal'));
                accountModal.hide();
            } else {
                alert('Logowanie nie powiodło się: Nieprawidłowy email lub hasło');
            }
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

    // Funkcja do wyświetlania produktów według kategorii
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
                        </div>
                    </a>
                    <button class="btn btn-secondary add-to-cart" data-id="${product.id}">
                        <i class="fas fa-shopping-cart"></i> Dodaj do koszyka
                    </button>
                </div>
            `;

            const section = sections[product.category];
            if (section) {
                section.appendChild(newProduct);
            }
        });

        setupAddToCartButtons();
    };

    const setupAddToCartButtons = () => {
        const addToCartButtons = document.querySelectorAll('.add-to-cart');

        addToCartButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                const productId = event.currentTarget.getAttribute('data-id');
                fetch('products.json')
                    .then(response => response.json())
                    .then(products => {
                        const product = products.find(item => item.id == productId);
                        if (product) {
                            addToCart(product);
                        }
                    });
            });
        });
    };

    const addToCart = (product) => {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const productExists = cart.some(item => item.id === product.id);

        if (productExists) {
            alert('Produkt już znajduje się w koszyku');
        } else {
            cart.push(product);
            localStorage.setItem('cart', JSON.stringify(cart));
            alert('Produkt został dodany do koszyka');
        }
    };

    // Funkcja wyświetlająca produkty w koszyku
    const displayCartItems = () => {
        const cartItemsContainer = document.getElementById('cartItems');
        const cart = JSON.parse(localStorage.getItem('cart')) || [];

        // Czyszczenie zawartości kontenera
        cartItemsContainer.innerHTML = '';

        // Tworzenie listy produktów
        const list = document.createElement('ul');
        list.className = 'list-group w-100';

        cart.forEach(product => {
            let listItem = document.createElement('li');
            listItem.className = 'list-group-item d-flex justify-content-between align-items-center';
            listItem.innerHTML = `
                <div class="d-flex align-items-center">
                    <img src="${product.images[0]}" class="img-thumbnail mr-3" style="width: 50px; height: 50px;" alt="${product.name}">
                    <div>
                        <h5 class="mb-0">${product.name}</h5>
                        <small class="text-muted">${product.price} PLN</small>
                    </div>
                </div>
                <button class="btn btn-danger btn-sm remove-btn" data-id="${product.id}">Usuń</button>
            `;

            list.appendChild(listItem);
        });

        cartItemsContainer.appendChild(list);

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
        cart = cart.filter(product => product.id !== parseInt(productId));
        localStorage.setItem('cart', JSON.stringify(cart));
        updateTotalPrice();
    };

    // Funkcja aktualizująca łączną cenę produktów w koszyku
    const updateTotalPrice = () => {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const totalPrice = cart.reduce((sum, product) => sum + product.price, 0);
        document.getElementById('total-price').textContent = totalPrice.toFixed(2);
    };

    // Funkcja czyszcząca koszyk
    const clearCart = () => {
        localStorage.removeItem('cart');
        displayCartItems();
        updateTotalPrice();
    };

    // Dodanie event listenera do przycisku "Wyczyść koszyk"
    const clearCartButton = document.getElementById('clearCart');
    if (clearCartButton) {
        clearCartButton.addEventListener('click', clearCart);
    }

    displayCartItems();
});

// Obsługa szczegółów produktu na stronie produkt.html
document.addEventListener('DOMContentLoaded', () => {
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
                    const productCarousel = new bootstrap.Carousel(document.getElementById('productCarousel'));

                    // Aktualizacja danych produktu
                    document.getElementById('product-title').textContent = product.name;
                    document.getElementById('product-price').textContent = `${product.price} PLN`;
                    document.getElementById('product-description').innerHTML = `
                        <p>${product['product-description'] || 'Brak opisu produktu.'}</p>
                    `;
                    document.getElementById('product-size').textContent = product.size || "N/A";
                    document.getElementById('product-color').textContent = product.color || "N/A";
                    document.getElementById('product-brand').textContent = product.brand || "N/A";
                    document.getElementById('product-condition').textContent = product.condition || "N/A";

                    // Dodanie obsługi przycisków
                    document.getElementById('addToCart').addEventListener('click', () => addToCart(product));
                }
            })
            .catch(error => {
                console.error('Error fetching product data:', error);
            });
    }

    const addToCart = (product) => {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const productExists = cart.some(item => item.id === product.id);

        if (productExists) {
            alert('Produkt już znajduje się w koszyku');
        } else {
            cart.push(product);
            localStorage.setItem('cart', JSON.stringify(cart));
            alert('Produkt został dodany do koszyka');
        }
    };
});

function getProductIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return parseInt(params.get('id'));
}
