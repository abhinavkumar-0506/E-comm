document.addEventListener("DOMContentLoaded", () => {



    updateCartCount();



    // For SHOP PAGE — open size modal instead of adding directly

    document.querySelectorAll(".add-to-cart").forEach(btn => {

        btn.addEventListener("click", () => openModal(btn));

    });



    // For PRODUCT PAGE (sizes already on page)

    let productAddBtn = document.querySelector(".product-page .add-to-cart");

    if (productAddBtn) {

        productAddBtn.addEventListener("click", () => handleAddToCart(productAddBtn));

    }



    // Cart page

    if (document.getElementById("cart-items")) {

        loadCartItems();

        updateFinalTotal();

    }



    // Modal close

    const modalClose = document.getElementById("modalClose");

    if (modalClose) modalClose.addEventListener("click", closeModal);



    // Confirm Add button inside modal

    const confirmAdd = document.getElementById("confirmAdd");

    if (confirmAdd) confirmAdd.addEventListener("click", addModalProduct);

});



// ---------------- SHOP PAGE MODAL LOGIC -----------------



let currentProduct = null;



function openModal(btn) {

    currentProduct = btn;



    document.getElementById("modalImg").src = btn.dataset.img;

    document.getElementById("modalTitle").textContent = btn.dataset.name;

    document.getElementById("modalPrice").textContent = "₹" + btn.dataset.price;



    document.getElementById("sizeModal").style.display = "block";

}



function closeModal() {

    document.getElementById("sizeModal").style.display = "none";



    // Uncheck previous selected size

    document.querySelectorAll('#sizeOptions input[name="size"]').forEach(el => el.checked = false);

}



function addModalProduct() {



    const sizeInput = document.querySelector('#sizeOptions input[name="size"]:checked');

    if (!sizeInput) {

        alert("Please select a size");

        return;

    }



    const size = sizeInput.value;



    let prod = {

        id: currentProduct.dataset.img + "::" + size,

        name: currentProduct.dataset.name,

        price: Number(currentProduct.dataset.price),

        img: currentProduct.dataset.img,

        size: size,

        qty: 1

    };



    addProductToCart(prod);



    closeModal();

    alert(`Added to cart: ${prod.name} (${size})`);

}



// ----------- PRODUCT PAGE DIRECT ADD LOGIC ----------------



function handleAddToCart(btn) {



    let sizeInput = document.querySelector('input[name="size"]:checked');



    if (document.querySelector('input[name="size"]') && !sizeInput) {

        alert("Please select a size");

        return;

    }



    let size = sizeInput ? sizeInput.value : "NOSIZE";



    let prod = {

        id: btn.dataset.img + "::" + size,

        name: btn.dataset.name,

        price: Number(btn.dataset.price),

        img: btn.dataset.img,

        size: size,

        qty: 1

    };



    addProductToCart(prod);



    alert(`Added to cart: ${prod.name} (${size})`);

}



// ------------------- UNIVERSAL ADD FUNCTION -------------------



function addProductToCart(prod) {

    let cart = JSON.parse(localStorage.getItem("cart") || "[]");



    let existing = cart.find(p => p.id === prod.id);

    if (existing) {

        existing.qty++;

    } else {

        cart.push(prod);

    }



    localStorage.setItem("cart", JSON.stringify(cart));

    updateCartCount();

}



// ------------------- NAVBAR CART COUNT -------------------



function updateCartCount() {

    let cart = JSON.parse(localStorage.getItem("cart") || "[]");

    let totalQty = cart.reduce((sum, p) => sum + p.qty, 0);



    let el = document.getElementById("cart-count");

    if (el) el.textContent = totalQty;

}



// ---------------- CART PAGE LOGIC ------------------



function loadCartItems() {

    let cart = JSON.parse(localStorage.getItem("cart") || "[]");

    let container = document.getElementById("cart-items");

    container.innerHTML = "";



    cart.forEach((item, i) => {

        container.innerHTML += `

            <div class="cart-item">

                <img src="${item.img}" class="cart-img">

                <div class="cart-info">

                    <h3>${item.name}</h3>

                    <p>Size: ${item.size}</p>

                    <p>Qty: ${item.qty}</p>

                    <p>₹${item.price * item.qty}</p>

                </div>

                <button class="remove-btn" onclick="removeItem(${i})">Remove</button>

            </div>

        `;

    });



    updateTotalPrice();

}



function removeItem(i) {

    let cart = JSON.parse(localStorage.getItem("cart") || "[]");

    cart.splice(i, 1);

    localStorage.setItem("cart", JSON.stringify(cart));



    loadCartItems();

    updateCartCount();

    updateFinalTotal();

}



// Subtotal

function updateTotalPrice() {

    let cart = JSON.parse(localStorage.getItem("cart") || "[]");

    let total = cart.reduce((sum, p) => sum + p.price * p.qty, 0);



    if (document.getElementById("cart-total")) {

        document.getElementById("cart-total").textContent = "₹" + total;

    }

}



// Final including shipping

function updateFinalTotal() {

    let subtotal = Number(document.getElementById("cart-total").textContent.replace("₹","")) || 0;

    let shipping = 99;

    document.getElementById("final-total").textContent = "₹" + (subtotal + shipping);

}



// Clear entire cart

function clearCart() {

    localStorage.removeItem("cart");

    loadCartItems();

    updateCartCount();

    updateFinalTotal();

}
