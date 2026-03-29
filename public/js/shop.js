const tyres = [
    { id: 1, name: "Michelin Pilot", size: "205/55R16", price: 8000, ev: false },
    { id: 2, name: "Bridgestone Eco", size: "215/60R16", price: 7000, ev: true },
    { id: 3, name: "Pirelli Sport", size: "225/45R17", price: 12000, ev: false },
    { id: 4, name: "Yokohama EV", size: "205/55R16", price: 9000, ev: true }
];

let cart = [];

function renderProducts(data) {
    const container = document.getElementById("products");
    container.innerHTML = "";

    data.forEach(tyre => {
        container.innerHTML += `
            <div class="product-card">
                <h3>${tyre.name}</h3>
                <p>${tyre.size}</p>
                <p>₹${tyre.price}</p>
                <button onclick="addToCart(${tyre.id})">Add to Cart</button>
            </div>
        `;
    });
}

function addToCart(id) {
    const item = tyres.find(t => t.id === id);
    cart.push(item);
    updateCart();
}

function updateCart() {
    const cartDiv = document.getElementById("cart-items");
    const totalDiv = document.getElementById("total");
    const count = document.getElementById("cart-count");

    cartDiv.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        cartDiv.innerHTML += `<p>${item.name} - ₹${item.price}</p>`;
        total += item.price;
    });

    totalDiv.innerText = "Total: ₹" + total;
    count.innerText = cart.length;
}

function applyFilter() {
    const size = document.getElementById("sizeFilter").value;
    const ev = document.getElementById("evFilter").checked;

    let filtered = tyres;

    if (size) filtered = filtered.filter(t => t.size === size);
    if (ev) filtered = filtered.filter(t => t.ev);

    renderProducts(filtered);
}

// CART TOGGLE
function toggleCart() {
    document.getElementById("cartSidebar").classList.toggle("active");
}

renderProducts(tyres);