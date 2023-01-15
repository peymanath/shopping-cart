const $ = document;
const backDrop = $.getElementById('bakdrop')
const cartIcon = $.getElementById('cartIcon')
const cartModal = $.getElementById('cartModal')
const confirmModal = $.getElementById('confirmModal')

const showmodalcart = () => {
    cartModal.style.top = "50%"
    backDrop.style.display = "block"
}

const closemodalcart = () => {
    cartModal.style.top = "-50%"
    backDrop.style.display = "none"
}

// Events
backDrop.addEventListener('click', closemodalcart)
confirmModal.addEventListener('click', closemodalcart)
cartIcon.addEventListener('click', showmodalcart)