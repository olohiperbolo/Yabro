document.addEventListener('DOMContentLoaded', () => {
    const sections = {
        kobieta: document.getElementById('kobieta'),
        mezczyzna: document.getElementById('mezczyzna'),
        sport: document.getElementById('sport'),
        akcesoria: document.getElementById('akcesoria'),
        ofertaspecjalna: document.getElementById('ofertaspecjalna')
    };

    // Fetch products from the JSON file
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
                    </div>
                </div>
            `;

            const section = sections[product.category];
            if (section) {
                section.appendChild(newProduct);
            }
        });

        setupCartButtons();
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

    const addToCart = (product) => {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart.push(product);
        localStorage.setItem('cart', JSON.stringify(cart));
        alert('Produkt dodany do koszyka');
    };
});