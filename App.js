const $ = document,
    backDrop = $.getElementById('bakdrop'),
    cartIcon = $.getElementById('cartIcon'),
    cartModal = $.getElementById('cartModal'),
    confirmModal = $.getElementById('confirmModal'),
    productCards = $.querySelector('.product-cards'),
    totalPrice = $.getElementById('totalPrice'),
    cartItem = $.getElementById('cartItem'),
    cartModalItems = $.getElementById('cartModalItems')


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
        const addToCartBtn = [...$.querySelectorAll('#addToCartBtn')]

        addToCartBtn.forEach(item => {
            const id = item.dataset.id

            const idInCart = cart.find(p => p.id === id)

            if (idInCart) {
                item.innerHTML = "In Cart"
                item.disabled = true
            }

            item.addEventListener('click', event => {
                event.target.innerHTML = "In Cart";
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
        div.innerHTML = `
        <div class="cart-modal__item--columns">
           <img src="${cartItem.imageUrl}" alt="">
        </div>

        <div class="cart-modal__item--columns">
            <h2>${cartItem.title}</h2>
            <p class="cart-modal__item--price-once">${cartItem.price}$</p>
        </div>

        <div class="cart-modal__quantity cart-modal__item--columns">
            <svg class="cart-icon quantity" color="green">
                <use xlink:href="#plus"></use>
            </svg>
            <p>${cartItem.quantity}</p>
            <svg class="cart-icon quantity" color="red">
                <use xlink:href="#minus"></use>
            </svg>
        </div>

        <div class="cart-modal__item--columns">
            <svg class="cart-icon" color="#920000">
                <use xlink:href="#trash"></use>
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
    const productsData = new Products().getProducts()
    const ui = new Ui();
    ui.displayProducts(productsData)
    ui.getAddToCartBtns()
    ui.setupApp()
    Storage.saveProducts(productsData)
})
backDrop.addEventListener('click', closemodalcart)
confirmModal.addEventListener('click', closemodalcart)
cartIcon.addEventListener('click', showmodalcart)