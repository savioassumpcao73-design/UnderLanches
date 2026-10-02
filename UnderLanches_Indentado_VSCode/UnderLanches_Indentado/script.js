// =========================
// CONFIGURAÇÕES
// =========================

const CART_KEY = "underlanches_cart";

// Troque pelo WhatsApp real da empresa.
// Exemplo: 55 + DDD + número.
const WHATSAPP = "5537999999999";


// =========================
// FUNÇÕES DO CARRINHO
// =========================

function getCart() {
    return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
}

function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateCartCount();
}

function formatMoney(value) {
    return value.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

function updateCartCount() {
    const cart = getCart();

    const quantity = cart.reduce(
        (total, item) => total + item.quantity,
        0
    );

    document
        .querySelectorAll(".cart-count")
        .forEach((element) => {
            element.textContent = quantity;
        });
}


// =========================
// ADICIONAR PRODUTO
// =========================

function addToCart(id, name, price) {
    const cart = getCart();

    const existingItem = cart.find(
        (item) => item.id === id
    );

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            id: id,
            name: name,
            price: price,
            quantity: 1
        });
    }

    saveCart(cart);

    alert(name + " foi adicionado ao pedido!");
}


// =========================
// ALTERAR QUANTIDADE
// =========================

function changeQuantity(id, amount) {
    let cart = getCart();

    const item = cart.find(
        (product) => product.id === id
    );

    if (!item) {
        return;
    }

    item.quantity += amount;

    if (item.quantity <= 0) {
        cart = cart.filter(
            (product) => product.id !== id
        );
    }

    saveCart(cart);
    renderCart();
}


// =========================
// REMOVER PRODUTO
// =========================

function removeItem(id) {
    const cart = getCart().filter(
        (item) => item.id !== id
    );

    saveCart(cart);
    renderCart();
}


// =========================
// MOSTRAR PEDIDO
// =========================

function renderCart() {
    const orderList = document.getElementById("orderList");

    if (!orderList) {
        return;
    }

    const cart = getCart();

    const subtotalElement =
        document.getElementById("subtotal");

    const totalElement =
        document.getElementById("total");

    if (cart.length === 0) {
        orderList.innerHTML = `
            <div class="empty">
                <h3>Seu pedido está vazio</h3>

                <p>
                    Escolha algum lanche no cardápio.
                </p>

                <br>

                <a
                    class="btn red"
                    href="cardapio.html"
                >
                    VER CARDÁPIO
                </a>
            </div>
        `;

        subtotalElement.textContent = formatMoney(0);
        totalElement.textContent = formatMoney(0);

        return;
    }

    let total = 0;

    orderList.innerHTML = cart
        .map((item) => {
            const itemTotal =
                item.price * item.quantity;

            total += itemTotal;

            return `
                <div class="order-item">

                    <div>
                        <b>${item.name}</b>

                        <div class="qty">

                            <button
                                onclick="
                                    changeQuantity(
                                        '${item.id}',
                                        -1
                                    )
                                "
                            >
                                −
                            </button>

                            <span>
                                ${item.quantity}
                            </span>

                            <button
                                onclick="
                                    changeQuantity(
                                        '${item.id}',
                                        1
                                    )
                                "
                            >
                                +
                            </button>

                            <button
                                class="remove"
                                onclick="
                                    removeItem(
                                        '${item.id}'
                                    )
                                "
                            >
                                remover
                            </button>

                        </div>
                    </div>

                    <div class="price">
                        ${formatMoney(itemTotal)}
                    </div>

                </div>
            `;
        })
        .join("");

    subtotalElement.textContent =
        formatMoney(total);

    totalElement.textContent =
        formatMoney(total);
}


// =========================
// FINALIZAR PEDIDO
// =========================

function finalizeOrder(event) {
    event.preventDefault();

    const cart = getCart();

    if (cart.length === 0) {
        alert("Adicione pelo menos um produto.");

        return false;
    }

    const name =
        document
            .getElementById("customerName")
            .value
            .trim();

    const phone =
        document
            .getElementById("customerPhone")
            .value
            .trim();

    const address =
        document
            .getElementById("address")
            .value
            .trim();

    const payment =
        document
            .getElementById("payment")
            .value;

    if (!name || !phone || !address) {
        alert(
            "Preencha nome, telefone e endereço."
        );

        return false;
    }

    const products = cart
        .map((item) => {
            const itemTotal =
                item.price * item.quantity;

            return (
                item.quantity +
                "x " +
                item.name +
                " - " +
                formatMoney(itemTotal)
            );
        })
        .join("\n");

    const total = cart.reduce(
        (sum, item) =>
            sum + item.price * item.quantity,
        0
    );

    const message = `
Olá! Quero fazer um pedido na UnderLanches.

Nome: ${name}
Telefone: ${phone}
Endereço/Observações: ${address}
Pagamento: ${payment}

${products}

Total: ${formatMoney(total)}
    `.trim();

    const url =
        "https://wa.me/" +
        WHATSAPP +
        "?text=" +
        encodeURIComponent(message);

    window.open(url, "_blank");

    return false;
}


// =========================
// INICIAR SITE
// =========================

document.addEventListener(
    "DOMContentLoaded",
    () => {
        updateCartCount();
        renderCart();
    }
);
