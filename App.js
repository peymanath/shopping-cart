/**
 * @author Peyman Naderi github.com\peymanath
 * 
 * @version 1.0.0
 * 
 * {@linkcode https://github.com/peymanath/shopping-cart View On Github}
 * 
 */

//import Api to JS file
import { productsData } from "./products.js"

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

/**
 * 
 * get product list from API
 * 
 * @returns {(Object|Array)}
 * 
 */
const getProductsAPI = () => productsData

/**
 * 
 * Make all design application from Ui class
 * 
 * @public
 * 
 * @class
 * 
 */
class Ui {

    /**
     * 
     * Make product list after DOM content loaded
     * 
     * @param {Element} data 
     * 
     */
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

    /**
     * action Add to cart with buttons
     * 
     * @param {string} [query=#addToCartBtn] id or className or tagName
     * 
     * {@link https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelectorAll | Doc QuerySelector}
     * 
     */
    addToCart(query = '#addToCartBtn') {

        const buttons = [...$.querySelectorAll(query)]


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

    /**
     * 
     * @param {Array[Object]} ListItem 
     * 
     */
    setCartValue(ListItem) {

        let totalCartItem = 0;

        /**
         * @arg {Number} acc
         * 
         * @arg {Object} curr
         * 
         * @returns {Number}
         */
        const cartTotal = ListItem.reduce((acc, curr) => {

            totalCartItem += curr.quantity

            return acc + curr.quantity * curr.price;

        }, 0)

        // Update Total Price
        totalPrice.innerText = cartTotal.toFixed(2);

        // Update Toral Itam
        cartItem.innerText = totalCartItem;

    }

    /**
     * 
     * add item to cart (DOM)
     * 
     * @param {Object} cartItem 
     */
    addCartItem(cartItem) {

        // product ID
        const id = cartItem.id

        // add content to Element
        const elementCartArea = `
        <div class="cart-modal__item" data-id="${id}">

            <div class="cart-modal__item--columns">
                <img src="${cartItem.imageUrl}" alt="">
            </div>

            <div class="cart-modal__item--columns">
                <h2>${cartItem.title}</h2>
                <p class="cart-modal__item--price-once">${cartItem.price}$</p>
            </div>

            <div class="cart-modal__quantity cart-modal__item--columns">
                <svg class="cart-icon quantity plus" color="green" data-id="${id}">
                    <use xlink:href="#plus" class="plus" data-id="${id}"></use>
                </svg>
                <p class="unselectable">${cartItem.quantity}</p>
                <svg class="cart-icon quantity minus" color="red" data-id="${id}">
                    <use xlink:href="#minus" class="minus" data-id="${id}"></use>
                </svg>
            </div>

            <div class="cart-modal__item--columns">
                <svg class="cart-icon trash" color="#920000" data-id="${id}">
                    <use xlink:href="#trash" class="trash" data-id="${id}"></use>
                </svg>
            </div>

        </div>
        `;

        // append Element to DOM
        cartModalItems.innerHTML += elementCartArea;
    }

    /**
     * 
     * After loading Dom, add the local storage item to the cart
     * 
     * @constructor
     * 
     */
    setupApp() {

        // Check the shopping cart that is empty or has items
        cart = Storage.getCart() || [];

        // Looping over cart items
        cart.map(item => {
            this.addCartItem(item)
        })

        // Update Cart Value
        this.setCartValue(cart)
    }

    /**
     * 
     * Clear item to shopping cart
     */
    clearLogic() {

        // Remove All Item to Cart
        clearCart.addEventListener('click', () => this.clearCartButton())

        // cart functionality
        cartModalItems.addEventListener('click', (e) => {

            //cheack classList target
            if (e.target.classList.contains('plus')) this.incrementDecrement(e.target, "plus")

            else if (e.target.classList.contains('minus')) this.incrementDecrement(e.target, "minus")

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

    /**
     * 
     * After clicking "Clear Cart", all items in the cart will be removed
     * 
     */
    clearCartButton() {

        // Cart Item children
        const _cartItem = cartModalItems.children;

        // Remove Item to Strorage
        cart.forEach((cItem) => this.removeItem(cItem.id))

        // Remove Item to Dom
        while (_cartItem.length) cartModalItems.removeChild(_cartItem[0])

        // Close Modal after clear
        closemodalcart()
    }

    /**
     * 
     * @param {*} cartItem 
     * @param {number} methode 
     */
    incrementDecrement(target, methode) {

        // get item from cart
        const addedItem = cart.find((cItem) => cItem.id == target.dataset.id)

        if (methode === "minus") addedItem.quantity--
        else if (methode === "plus") addedItem.quantity++

        // update cart value
        this.setCartValue(cart)

        // save cart
        Storage.saveCart(cart)

        // Update Total Item

        if (methode === "minus") target.previousElementSibling.innerText = addedItem.quantity
        else if (methode === "plus") target.nextElementSibling.innerText = addedItem.quantity
    }

    /**
     * 
     * @param {*} idItems 
     */
    removeItem(idItems) {

        cart = cart.filter((idItem) => idItem.id !== idItems)

        // upsate price & item
        this.setCartValue(cart)

        // Update Storage
        Storage.saveCart(cart);

        // change text buttons
        this.changeTextButton(idItems)
    }

    /**
     * 
     * @param {*} id 
     */
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

/**
 * 
 * Store information in LocalStorage
 * 
 * @public
 * 
 * @class
 * 
 */
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

/**
 * @event DOMContentLoaded
 * 
 * 
 */
$.addEventListener('DOMContentLoaded', () => {

    const ui = new Ui();

    ui.setupApp()

    const productsData = getProductsAPI()

    ui.displayProducts(productsData)

    ui.addToCart()

    ui.clearLogic()

    Storage.saveProducts(productsData)
})

backDrop.addEventListener('click', closemodalcart)
confirmModal.addEventListener('click', closemodalcart)
cartIcon.addEventListener('click', showmodalcart)