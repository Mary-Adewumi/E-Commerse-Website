
let iconCart = document.querySelector('.icon-cart');
let closeCart = document.querySelector('.close');

let body = document.body;
let listProductHTML = document.querySelector('.listProduct');
let listCartHTML = document.querySelector('.listCart');
let iconCartSpan = document.querySelector('.icon-cart span');

let listProduct = [];
let cart = [];

// Toggle Cart Display
iconCart.addEventListener('click', () => {
    body.classList.toggle('showCart');
});
closeCart.addEventListener('click', () => {
    body.classList.toggle('showCart');
});

// Add Products to HTML
const addDataToHTML = () => {
    listProductHTML.innerHTML = '';  
    if (listProduct.length > 0) {
        listProduct.forEach(product => {
            let newProduct = document.createElement('div');
            newProduct.classList.add('item');
            newProduct.dataset.id = product.id;
            newProduct.innerHTML = `
                <img src="${product.image}" alt="">
                <h2>${product.name}</h2>
                <div class="price">$${product.price}</div>
                <button class="addCart">ADD TO CART</button>
            `;

            listProductHTML.appendChild(newProduct);
        });
    }
};

// Add Click Event for Add to Cart
listProductHTML.addEventListener('click', (event) => {
    let positionClick = event.target;
    if (positionClick.classList.contains('addCart')) {
        let product_id = parseInt(positionClick.parentElement.dataset.id);
        addToCart(product_id);
    }
});

// Add to Cart Function
const addToCart = (product_id) => {
    let positionThisProductInCart = cart.findIndex((item) => item.product_id === product_id);
    
    if (cart.length <= 0) {
        cart = [{ product_id: product_id, quantity: 1 }];
    } else if (positionThisProductInCart < 0) {
        cart.push({ product_id: product_id, quantity: 1 });
    } else {
        cart[positionThisProductInCart].quantity += 1;
    }

    addCartToHTML();
    addCartToMemory();
};

// Save Cart to Local Storage
const addCartToMemory = () => {
    localStorage.setItem('cart', JSON.stringify(cart));
};

// Display Cart Items in HTML
const addCartToHTML = () => {
    listCartHTML.innerHTML = '';
    let totalQuantity = 0;

    if (cart.length > 0) {
        cart.forEach(cartItem => {
            totalQuantity += cartItem.quantity;
            let newCart = document.createElement('div');
            newCart.classList.add('item');
            newCart.dataset.id = cartItem.product_id;

            let positionProduct = listProduct.findIndex((p) => p.id === cartItem.product_id);
            let info = listProduct[positionProduct];

            newCart.innerHTML = `
                <div class="image">
                    <img src="${info.image}" alt="Product Image">
                </div>
                <div class="name">${info.name}</div>
                <div class="totalPrice">$${info.price * cartItem.quantity}</div>
                <div class="quantity">
                    <span class="minus">-</span>
                    <span>${cartItem.quantity}</span>
                    <span class="plus">+</span>
                </div>
            `;

            listCartHTML.appendChild(newCart);
        });
    }

    iconCartSpan.innerText = totalQuantity;
};

// Change Quantity in Cart
listCartHTML.addEventListener('click', (event) => {
    let positionClick = event.target;
    if (positionClick.classList.contains('minus') || positionClick.classList.contains('plus')) {
        let product_id = parseInt(positionClick.parentElement.parentElement.dataset.id);
        let type = positionClick.classList.contains('plus') ? 'plus' : 'minus';
        changeQuantity(product_id, type);
    }
});

// Update Cart Item Quantity
const changeQuantity = (product_id, type) => {
    let positionItemInCart = cart.findIndex((item) => item.product_id === product_id);

    if (positionItemInCart >= 0) {
        if (type === 'plus') {
            cart[positionItemInCart].quantity += 1;
        } else {
            let newQuantity = cart[positionItemInCart].quantity - 1;
            if (newQuantity > 0) {
                cart[positionItemInCart].quantity = newQuantity;
            } else {
                cart.splice(positionItemInCart, 1);
            }
        }
    }

    addCartToMemory();
    addCartToHTML();
};

// Initialize App
const initApp = () => {
    fetch('E-commerse.json')
        .then(response => response.json())
        .then(data => {
            listProduct = data;
            addDataToHTML();

            if (localStorage.getItem('cart')) {
                cart = JSON.parse(localStorage.getItem('cart'));
                addCartToHTML();
            }
        })
        .catch(error => console.error("Error loading JSON:", error));
};

initApp();
