/**
 * @author Peyman Naderi github.com\peymanath
 * 
 * @version 1.0.0
 * 
 * {@linkcode https://github.com/peymanath/shopping-cart View On Github}
 * 
 */

//import Api to JS file
import { productsDataAPI } from "./products.js"

// Function Select Element by ID
const getID = ID => $.getElementById(ID)

// Shoping Cart
let cart = [];

// Variables
const $ = document
const backDrop = getID('bakdrop')
const cartIcon = getID('cartIcon')
const cartModal = getID('cartModal')
const confirmModal = getID('confirmModal')
const productCards = $.querySelector('.product-cards')
const totalPrice = getID('totalPrice')
const cartItem = getID('cartItem')
const cartModalItems = getID('cartModalItems')
const clearCart = getID('clearCart')

/**
 * 
 * @event DOMContentLoaded
 * 
 * @constructor
 * 
 */
$.addEventListener('DOMContentLoaded', () => {

    // Make new class
    const ui = new Ui();

    // Receive Item From API
    const productsData = Product.getProductsAPI()

    // add item to shopping cart from LocalStorage
    ui.setupApp()

    // Display Products to App
    ui.displayProducts(productsData)

    // Action buttons
    ui.addToCart()

    // Cleaning system
    ui.clearLogic()

    // After loading the application and getting the products from the API, store the product in LocalStorage
    Storage.saveProducts(productsData)

    // Modal Cart controller
    backDrop.addEventListener('click', Ui.closeModalCart)
    confirmModal.addEventListener('click', Ui.closeModalCart)
    cartIcon.addEventListener('click', Ui.showModalCart)
})


/**
 * 
 * get product list from API
 * 
 * @returns {(Object|Array)}
 * 
 */
class Product {

    static getProductsAPI(){
        return productsDataAPI
    }
    
}


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
     * @constructor
     */
    static showModalCart() {
        cartModal.style.top = "50%"
        backDrop.style.display = "block"
    }

    /**
     * @constructor
     */
    static closeModalCart() {
        cartModal.style.top = "-50%"
        backDrop.style.display = "none"
    }

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

            const elementClicked = e.target

            //cheack classList target
            if (elementClicked.classList.contains('plus')) this.incrementDecrement(elementClicked, "plus")

            else if (elementClicked.classList.contains('minus')) this.incrementDecrement(elementClicked, "minus")

            else if (elementClicked.classList.contains('trash')) {

                // Remove Item
                const removeItem = cart.find((event) => event.id == elementClicked.dataset.id)

                this.removeItem(removeItem.id)

                // Save Storage 
                Storage.saveCart(cart)

                // remove Item to Dom
                Storage.saveCart(cart)

                const test = [...cartModalItems.children];

                test.forEach((event) => {
                    if (event.dataset.id == elementClicked.dataset.id) cartModalItems.removeChild(event)
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
        Ui.closeModalCart()
    }

    /**
     * 
     * increment or decrement total item
     * 
     * @param {Element} cartItem 
     * @param {number} methode 
     */
    incrementDecrement(target, methode) {

        // get item from cart
        const addedItem = cart.find((cItem) => cItem.id == target.dataset.id)

        // Change total item
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
     * Remove Item
     * 
     * @param {Number} ID 
     * 
     */
    removeItem(ID) {

        cart = cart.filter((idItem) => idItem.id !== ID)

        // upsate price & item
        this.setCartValue(cart)

        // Update Storage
        Storage.saveCart(cart);

        // change text buttons
        this.changeTextButton(ID)
    }

    /**
     * 
     * @param {Number} ID 
     */
    changeTextButton(ID) {

        [...$.querySelectorAll('#addToCartBtn')].forEach((_cartItem) => {

            const isInCart = parseInt(_cartItem.dataset.id) === parseInt(ID)

            if (isInCart) {
                _cartItem.innerText = "add to cart"
                _cartItem.disabled = false
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

    /**
     * 
     * @param {Object} getProducts 
     */
    static saveProducts(dataProduct) {
        localStorage.setItem("products", JSON.stringify(dataProduct))
    }

    /**
     * 
     * @param {Number} idProduct 
     * 
     * @returns {Object}
     */
    static getProducts(idProduct) {
        return JSON.parse(localStorage.getItem('products')).find(p => p.id === parseInt(idProduct))
    }

    /**
     * 
     * @param {Object} getProducts 
     */
    static saveCart(getProducts) {
        localStorage.setItem('carts', JSON.stringify(getProducts))
    }

    /**
     * 
     * @returns {Object}
     */
    static getCart() {
        return JSON.parse(localStorage.getItem('carts'));
    }

}