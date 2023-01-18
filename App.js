const $ = document,
    backDrop = $.getElementById('bakdrop'),
    cartIcon = $.getElementById('cartIcon'),
    cartModal = $.getElementById('cartModal'),
    confirmModal = $.getElementById('confirmModal'),
    productCards = $.querySelector('.product-cards'),
    totalPrice = $.getElementById('totalPrice'),
    cartItem = $.getElementById('cartItem'),
    cartModalItems = $.getElementById('cartModalItems'),
    clearCart = $.getElementById('clearCart')


let cart = [];

import { productsData } from "./products.js"

// 1. get Product 
class Products {

    // get frop api end points
    getProducts() {
        return productsData
    }
}

// 2. display Producr
class Ui {

    displayProducts(data) {

        data.forEach(item => {
            productCards.innerHTML += `
            <div class="product-card">
            <img src="${item.imageUrl}" alt="">
            <div class="product-card__description">
                <h2>${item.title}</h2>
                <div class="product-card__buy">
                    <p class="product-card__price">${item.price}$</p>
                    <button type="button" id="addToCartBtn" class="btn" data-id="${item.id}">add to cart</button>
                </div>
            </div>
            </div>
            `
        });

    }

    getAddToCartBtns() {
        const addToCartBtn = $.querySelectorAll('#addToCartBtn')
        const buttons = [...addToCartBtn]


        buttons.forEach((item) => {

            const id = parseInt(item.dataset.id)

            const isInCart = cart.find((carts) => carts.id === id)
            if (isInCart) {
                item.innerText = "In Cart"
                item.disabled = true
            }

            item.addEventListener('click', event => {

                event.target.innerText = "In Cart";
                event.target.disabled = true;

                const getProducts = { ...Storage.getProducts(id), quantity: 1 }

                cart = [...cart, getProducts]

                Storage.saveCart(cart)

                this.setCartValue(cart)

                this.addCartItem(getProducts)
            })

        })
    }

    setCartValue(cart) {

        let totalCartItem = 0;

        const cartTotal = cart.reduce((acc, curr) => {

            totalCartItem += curr.quantity

            return acc + curr.quantity * curr.price;

        }, 0)

        totalPrice.innerText = cartTotal.toFixed(2);
        cartItem.innerText = totalCartItem;

    }

    addCartItem(cartItem) {
        const div = $.createElement('div');
        div.classList.add("cart-modal__item");
        div.setAttribute("data-id", cartItem.id);
        div.innerHTML = `
        <div class="cart-modal__item--columns">
           <img src="${cartItem.imageUrl}" alt="">
        </div>

        <div class="cart-modal__item--columns">
            <h2>${cartItem.title}</h2>
            <p class="cart-modal__item--price-once">${cartItem.price}$</p>
        </div>

        <div class="cart-modal__quantity cart-modal__item--columns">
            <svg class="cart-icon quantity plus" color="green" data-id="${cartItem.id}">
                <use xlink:href="#plus" class="plus" data-id="${cartItem.id}"></use>
            </svg>
            <p class="unselectable">${cartItem.quantity}</p>
            <svg class="cart-icon quantity minus" color="red" data-id="${cartItem.id}">
                <use xlink:href="#minus" class="minus" data-id="${cartItem.id}"></use>
            </svg>
        </div>

        <div class="cart-modal__item--columns">
            <svg class="cart-icon trash" color="#920000" data-id="${cartItem.id}">
                <use xlink:href="#trash" class="trash" data-id="${cartItem.id}"></use>
            </svg>
        </div>`;

        cartModalItems.appendChild(div)
    }

    setupApp() {

        cart = Storage.getCart() || [];

        cart.map(item => {
            this.addCartItem(item)
        })

        this.setCartValue(cart)

    }

    clearLogic() {

        // Remove All Item to Cart
        clearCart.addEventListener('click', () => this.clearCart())

        // cart functionality
        cartModalItems.addEventListener('click', (e) => {

            //cheack classList target
            if (e.target.classList.contains('plus')) this.increment(e.target)

            else if (e.target.classList.contains('minus')) this.decrement(e.target)

            else if (e.target.classList.contains('trash')) {

                // Remove Item
                const removeItem = cart.find((event) => event.id == e.target.dataset.id);
                this.removeItem(removeItem.id)

                // Save Storage 
                Storage.saveCart(cart)

                // remove Item to Dom
                Storage.saveCart(cart)
                const test = [...cartModalItems.children];
                test.forEach((event) => {
                    if (event.dataset.id == e.target.dataset.id) cartModalItems.removeChild(event)
                })
            }
        })
    }

    increment(target) {
        // get item from cart
        const addedItem = cart.find((cItem) => cItem.id == target.dataset.id)
        addedItem.quantity++

        // update cart value
        this.setCartValue(cart)

        // save cart
        Storage.saveCart(cart)

        // Update Total Item
        target.nextElementSibling.innerText = addedItem.quantity
    }

    decrement(target) {

        // get item from cart
        const addedItem = cart.find((cItem) => cItem.id == target.dataset.id)
        addedItem.quantity--

        // update cart value
        this.setCartValue(cart)

        // save cart
        Storage.saveCart(cart)

        // Update Total Item
        target.previousElementSibling.innerText = addedItem.quantity
    }

    clearCart() {
        // Remove Item to Strorage
        cart.forEach((cItem) => this.removeItem(cItem.id))

        // Remove Item to Dom
        while (cartModalItems.children.length) {
            cartModalItems.removeChild(cartModalItems.children[0])
        }

        // Close Modal after clear
        closemodalcart()
    }

    removeItem(idItems) {

        cart = cart.filter((idItem) => idItem.id !== idItems)

        // upsate price & item
        this.setCartValue(cart)

        // Update Storage
        Storage.saveCart(cart);

        // change text buttons
        this.changeTextButton(idItems)
    }

    changeTextButton(id) {

        [...$.querySelectorAll('#addToCartBtn')].forEach((carts) => {

            const isInCart = parseInt(carts.dataset.id) === parseInt(id)

            if (isInCart) {
                carts.innerText = "add to cart"
                carts.disabled = false
            }
        })
    }
}

// 3. save Storage
class Storage {
    static saveProducts(data) {
        localStorage.setItem("products", JSON.stringify(data))
    }

    static getProducts(id) {
        return JSON.parse(localStorage.getItem('products')).find(p => p.id === parseInt(id))
    }

    static saveCart(cart) {
        localStorage.setItem('carts', JSON.stringify(cart))
    }

    static getCart() {
        return JSON.parse(localStorage.getItem('carts'));
    }
}


const showmodalcart = () => {
    cartModal.style.top = "50%"
    backDrop.style.display = "block"
}

const closemodalcart = () => {
    cartModal.style.top = "-50%"
    backDrop.style.display = "none"
}

// Events
$.addEventListener('DOMContentLoaded', () => {
    const ui = new Ui();

    ui.setupApp()

    const productsData = new Products().getProducts()

    ui.displayProducts(productsData)

    ui.getAddToCartBtns()

    ui.clearLogic()

    Storage.saveProducts(productsData)
})
backDrop.addEventListener('click', closemodalcart)
confirmModal.addEventListener('click', closemodalcart)
cartIcon.addEventListener('click', showmodalcart)