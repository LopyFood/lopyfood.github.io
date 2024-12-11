import {addCSSInHead} from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.1.6/element.js";
import Swal from 'https://cdn.jsdelivr.net/npm/sweetalert2@11/src/sweetalert2.js';

await addCSSInHead("https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.css");

let cart = [];

window.addToCart=addToCart;
window.checkout=checkout;

function addToCart(name, price) {
    // Cek jika item sudah ada di keranjang
    const itemIndex = cart.findIndex(item => item.name === name);
    if (itemIndex !== -1) {
        cart[itemIndex].quantity += 1;
    } else {
        cart.push({ name, price, quantity: 1 });
    }
    updateCart();
}

function updateCart() {
    const cartItemsContainer = document.getElementById("cart-items");
    const totalPriceElement = document.getElementById("total-price");
    const cartCountElement = document.getElementById("cart-count");

    // Bersihkan tampilan keranjang sebelum menambah item baru
    cartItemsContainer.innerHTML = "";

    let total = 0;
    let totalQuantity = 0; // Variabel untuk menghitung total jumlah item
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        totalQuantity += item.quantity; // Tambahkan jumlah item

        const cartItem = document.createElement("li");
        cartItem.innerText = `${item.name} - Rp ${(item.price.toLocaleString('id-ID'))} x ${item.quantity} = Rp ${(itemTotal.toLocaleString('id-ID'))}`;

        // Buat tombol +
        const plusButton = document.createElement("button");
        plusButton.innerText = "+";
        plusButton.classList.add("item-btn");
        plusButton.onclick = () => {
            addToCart(item.name, item.price); // Tambah item
        };

        // Buat tombol -
        const minusButton = document.createElement("button");
        minusButton.innerText = "-";
        minusButton.classList.add("item-btn");
        minusButton.onclick = () => {
            removeFromCart(item.name); // Hapus item
        };

        // Tambahkan tombol ke item
        cartItem.appendChild(minusButton);
        cartItem.appendChild(plusButton);
        cartItemsContainer.appendChild(cartItem);
    });

    totalPriceElement.innerText = `Total Harga: Rp ${(total.toLocaleString('id-ID'))}`;
    
    // Perbarui jumlah item di ikon shopping-cart
    if (totalQuantity > 0) {
        cartCountElement.innerText = totalQuantity;
        cartCountElement.style.display = 'inline'; // Tampilkan elemen
    } else {
        cartCountElement.style.display = 'none'; // Sembunyikan elemen
    }
}

function removeFromCart(name) {
    const itemIndex = cart.findIndex(item => item.name === name);
    if (itemIndex !== -1) {
        cart[itemIndex].quantity -= 1;
        if (cart[itemIndex].quantity === 0) {
            cart.splice(itemIndex, 1); // Hapus item jika jumlahnya 0
        }
    }
    updateCart();
}

// toggle class aktif shopping-cart
const shoppingCart = document.querySelector('.shopping-cart');
document.querySelector('#shopping-cart-button').onclick = (e) => {
    shoppingCart.classList.toggle('active');
    e.preventDefault();
}

// klik di luar elemen
const sc = document.querySelector('#shopping-cart-button');
const btn = document.querySelector('.item-btn')

document.addEventListener('click', function (e) {
    if (!sc.contains(e.target) && !shoppingCart.contains(e.target) && !btn.contains(e.target)) {
        shoppingCart.classList.remove('active');
}
});

function checkout() {
    if (cart.length === 0) {
        Swal.fire({
            icon: "warning",  //success,warning,info,question
            title: "Keranjang Anda kosong. Tambahkan item sebelum checkout.",
            text: cart.length,
        });
        return;
    }

    let orderSummary = "Halo, saya ingin memesan:\n";
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        orderSummary += `${item.name} x ${item.quantity} - Rp ${itemTotal.toLocaleString('id-ID')}\n`;
    });

    const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    orderSummary += `\nTotal: Rp ${total.toLocaleString('id-ID')}`;
    //alert(orderSummary);
    Swal.fire({
        icon: "success",
        title: "Checkout Berhasil",
        text: "Anda akan dialihkan ke WhatsApp untuk menyelesaikan pesanan.",
        showCancelButton: true,
        confirmButtonText: "Lanjut ke WhatsApp",
        cancelButtonText: "Batal",
    }).then((result) => {
        if (result.isConfirmed) {
            // Encode pesan untuk digunakan di URL WhatsApp
            const encodedMessage = encodeURIComponent(orderSummary);
            const whatsappNumber = "6289523744749";

            // Buat URL WhatsApp
            const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

            // Redirect ke WhatsApp
            window.location.href = whatsappURL;

            // Reset keranjang setelah berhasil checkout
            cart = [];
            updateCart();
        }
    });
}