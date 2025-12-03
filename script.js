document.addEventListener("DOMContentLoaded", () => {
    updateCartCount();

    document.querySelectorAll(".add-to-cart").forEach(btn => {
        btn.addEventListener("click", () => openModal(btn));
    });

    let productAddBtn = document.querySelector(".product-page .add-to-cart");
    if (productAddBtn) {
        productAddBtn.addEventListener("click", () => handleAddToCart(productAddBtn));
    }

    if (document.getElementById("cart-items")) {
        loadCartItems();
        updateFinalTotal();
    }

    const modalClose = document.getElementById("modalClose");
    if (modalClose) modalClose.addEventListener("click", closeModal);

    const confirmAdd = document.getElementById("confirmAdd");
    if (confirmAdd) confirmAdd.addEventListener("click", addModalProduct);
});

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

function updateCartCount() {
    let cart = JSON.parse(localStorage.getItem("cart") || "[]");
    let totalQty = cart.reduce((sum, p) => sum + p.qty, 0);
    let el = document.getElementById("cart-count");
    if (el) el.textContent = totalQty;
}

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

function updateTotalPrice() {
    let cart = JSON.parse(localStorage.getItem("cart") || "[]");
    let total = cart.reduce((sum, p) => sum + p.price * p.qty, 0);
    if (document.getElementById("cart-total")) {
        document.getElementById("cart-total").textContent = "₹" + total;
    }
}

function updateFinalTotal() {
    let subtotal = Number(document.getElementById("cart-total").textContent.replace("₹","")) || 0;
    let shipping = 99;
    document.getElementById("final-total").textContent = "₹" + (subtotal + shipping);
}

function clearCart() {
    localStorage.removeItem("cart");
    loadCartItems();
    updateCartCount();
    updateFinalTotal();
}
