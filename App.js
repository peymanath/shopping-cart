const $ = document;
const backDrop = $.getElementById('bakdrop')
const cartIcon = $.getElementById('cartIcon')
const cartModal = $.getElementById('cartModal')
const confirmModal = $.getElementById('confirmModal')
const productCards = $.querySelector('.product-cards')

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

        let result = "";

        data.forEach(item => {
            const div = $.createElement('div')
            div.classList.add('product-card');

            div.innerHTML = `
            <img src="${item.imageUrl}" alt="">
            <div class="product-card__description">
                <h2>${item.title}</h2>
                <div class="product-card__buy">
                    <p class="product-card__price">${item.price}$</p>
                    <p class="btn" data-id="${item.id}">add to cart</p>
                </div>
            </div>
            `
            productCards.appendChild(div)
        });


    }
}

// 3. save Storage
class Storage {

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
    const ui = new Ui().displayProducts(productsData)

})
backDrop.addEventListener('click', closemodalcart)
confirmModal.addEventListener('click', closemodalcart)
cartIcon.addEventListener('click', showmodalcart)