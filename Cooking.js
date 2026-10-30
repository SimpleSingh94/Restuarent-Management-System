/* =====================================================
   ROYAL RESTAURANT
   COOKING / KITCHEN MANAGEMENT
===================================================== */

const API_URL = "http://localhost:3000";

let allOrders = [];

let currentFilter = "all";

let refreshTimer = null;


/* =====================================================
   LOAD ORDERS
===================================================== */

async function loadCookingOrders() {

    const loading =
        document.getElementById("loading");

    const cookingOrders =
        document.getElementById(
            "cookingOrders"
        );

    const errorMessage =
        document.getElementById(
            "errorMessage"
        );

    const connectionText =
        document.getElementById(
            "connectionText"
        );


    if (loading) {
        loading.style.display = "flex";
    }


    if (errorMessage) {
        errorMessage.style.display = "none";
    }


    try {

        const response =
            await fetch(
                `${API_URL}/orders`,
                {
                    cache: "no-store"
                }
            );


        if (!response.ok) {

            throw new Error(
                "Server returned an error."
            );

        }


        const data =
            await response.json();


        if (!data.success) {

            throw new Error(
                data.message ||
                "Unable to load orders."
            );

        }


        allOrders =
            Array.isArray(data.orders)
                ? data.orders
                : [];


        if (connectionText) {

            connectionText.textContent =
                "🟢 Live • Connected";

        }


        displayCookingOrders();

    }

    catch (error) {

        console.error(
            "Cooking Orders Error:",
            error
        );


        if (connectionText) {

            connectionText.textContent =
                "🔴 Offline";

        }


        if (errorMessage) {

            errorMessage.innerHTML = `

                ❌ Kitchen server connection failed.

                <br><br>

                Make sure
                <strong>server.js</strong>
                is running on
                <strong>localhost:3000</strong>.

            `;

            errorMessage.style.display =
                "block";

        }


        if (cookingOrders) {

            cookingOrders.innerHTML = "";

        }

    }

    finally {

        if (loading) {

            loading.style.display =
                "none";

        }

    }

}


/* =====================================================
   DISPLAY ORDERS
===================================================== */

function displayCookingOrders() {

    const cookingOrders =
        document.getElementById(
            "cookingOrders"
        );


    const activeOrders =
        allOrders.filter(order => {

            return [

                "Pending",

                "Confirmed",

                "Preparing",

                "Ready"

            ].includes(order.status);

        });


    const pendingOrders =
        allOrders.filter(order => {

            return (

                order.status === "Pending" ||

                order.status === "Confirmed"

            );

        });


    const preparingOrders =
        allOrders.filter(order => {

            return (
                order.status ===
                "Preparing"
            );

        });


    const readyOrders =
        allOrders.filter(order => {

            return (
                order.status ===
                "Ready"
            );

        });


    document.getElementById(
        "pendingCount"
    ).textContent =
        pendingOrders.length;


    document.getElementById(
        "preparingCount"
    ).textContent =
        preparingOrders.length;


    document.getElementById(
        "readyCount"
    ).textContent =
        readyOrders.length;


    document.getElementById(
        "totalKitchenOrders"
    ).textContent =
        activeOrders.length;


    let visibleOrders =
        [...activeOrders];


    if (
        currentFilter !== "all"
    ) {

        if (
            currentFilter ===
            "Pending"
        ) {

            visibleOrders =
                visibleOrders.filter(
                    order => {

                        return (

                            order.status ===
                                "Pending" ||

                            order.status ===
                                "Confirmed"

                        );

                    }
                );

        }

        else {

            visibleOrders =
                visibleOrders.filter(
                    order => {

                        return (
                            order.status ===
                            currentFilter
                        );

                    }
                );

        }

    }


    visibleOrders.sort(
        (a, b) => {

            return (
                new Date(
                    b.created_at
                ) -

                new Date(
                    a.created_at
                )
            );

        }
    );


    if (
        visibleOrders.length === 0
    ) {

        cookingOrders.innerHTML = `

            <div class="no-orders">

                <div class="no-orders-icon">
                    🍽️
                </div>

                <h2>
                    No Active Orders
                </h2>

                <p>
                    There are currently no
                    orders in this kitchen section.
                </p>

            </div>

        `;

        return;

    }


    cookingOrders.innerHTML =
        visibleOrders
            .map(order =>
                createCookingCard(order)
            )
            .join("");

}


/* =====================================================
   CREATE COOKING CARD
===================================================== */

function createCookingCard(order) {

    const items =
        order.items || [];


    const itemsHTML =
        items.length > 0

            ? items.map(item => {

                return `

                    <div class="food-item">

                        <div class="food-item-name">

                            <span>
                                🍽️
                            </span>

                            <span>

                                ${escapeHTML(
                                    item.item_name
                                )}

                            </span>

                        </div>


                        <div class="food-item-right">

                            <span class="quantity">

                                × ${Number(
                                    item.quantity
                                )}

                            </span>


                            <span class="item-price">

                                ₹${Number(
                                    item.item_total ||
                                    0
                                ).toFixed(2)}

                            </span>

                        </div>

                    </div>

                `;

            }).join("")

            : `
                <div class="food-item">
                    No items found
                </div>
            `;


    const status =
        order.status ||
        "Pending";


    let actionHTML = "";


    if (
        status === "Pending" ||
        status === "Confirmed"
    ) {

        actionHTML = `

            <button
                class="start-cooking-btn"
                onclick="
                    event.stopPropagation();
                    startCooking(
                        ${order.order_id}
                    )
                ">

                🔥 Start Cooking

            </button>

        `;

    }


    else if (
        status === "Preparing"
    ) {

        actionHTML = `

            <button
                class="ready-btn"
                onclick="
                    event.stopPropagation();
                    markOrderReady(
                        ${order.order_id}
                    )
                ">

                ✅ Mark Order Ready

            </button>

        `;

    }


    else if (
        status === "Ready"
    ) {

        actionHTML = `

            <div class="ready-message">

                ✅ Order is ready for serving

            </div>

        `;

    }


    return `

        <article
            class="cooking-card ${status.toLowerCase()}"
            onclick="
                viewCookingOrder(
                    ${order.order_id}
                )
            ">


            <div class="cooking-card-header">

                <div>

                    <div class="order-number">

                        ORDER #${order.order_id}

                    </div>


                    <div class="order-time">

                        🕐
                        ${formatDate(
                            order.created_at
                        )}

                    </div>

                </div>


                <span
                    class="status-badge ${status.toLowerCase()}">

                    ${getStatusIcon(status)}

                    ${getStatusText(status)}

                </span>

            </div>


            <div class="customer-info">

                <div class="customer-row">

                    <span>
                        👤
                    </span>

                    <div>

                        <small>
                            Customer
                        </small>

                        <strong>

                            ${escapeHTML(
                                order.customer_name ||
                                "-"
                            )}

                        </strong>

                    </div>

                </div>


                <div class="customer-row">

                    <span>
                        📱
                    </span>

                    <div>

                        <small>
                            Phone
                        </small>

                        <strong>

                            ${escapeHTML(
                                order.customer_phone ||
                                "-"
                            )}

                        </strong>

                    </div>

                </div>


                <div class="customer-row">

                    <span>
                        📦
                    </span>

                    <div>

                        <small>
                            Order Type
                        </small>

                        <strong>

                            ${escapeHTML(
                                order.order_type ||
                                "Online"
                            )}

                        </strong>

                    </div>

                </div>

            </div>


            <div class="items-title">

                🍽️ Customer Order

            </div>


            <div class="food-items">

                ${itemsHTML}

            </div>


            <div class="order-total">

                <span>
                    Order Total
                </span>

                <strong>

                    ₹${Number(
                        order.total_amount ||
                        0
                    ).toFixed(2)}

                </strong>

            </div>


            <div class="order-action">

                ${actionHTML}

            </div>


            <div class="view-hint">

                👁️ Click anywhere to view
                complete order

            </div>

        </article>

    `;

}


/* =====================================================
   VIEW COOKING ORDER
===================================================== */

function viewCookingOrder(orderId) {

    const order =
        allOrders.find(
            item =>
                Number(
                    item.order_id
                ) ===
                Number(orderId)
        );


    if (!order) {

        alert(
            "Order details not found."
        );

        return;

    }


    const items =
        order.items || [];


    const itemsHTML =
        items.length > 0

            ? items.map(item => {

                return `

                    <div class="cooking-modal-item">

                        <span>

                            🍽️
                            ${escapeHTML(
                                item.item_name
                            )}

                            × ${Number(
                                item.quantity
                            )}

                        </span>

                        <strong>

                            ₹${Number(
                                item.item_total ||
                                0
                            ).toFixed(2)}

                        </strong>

                    </div>

                `;

            }).join("")

            : `
                <div class="cooking-modal-item">
                    No items found.
                </div>
            `;


    let actionHTML = "";


    if (
        order.status === "Pending" ||
        order.status === "Confirmed"
    ) {

        actionHTML = `

            <button
                class="modal-start-btn"
                onclick="
                    startCookingFromDetails(
                        ${order.order_id}
                    )
                ">

                🔥 Start Cooking

            </button>

        `;

    }


    else if (
        order.status === "Preparing"
    ) {

        actionHTML = `

            <button
                class="modal-ready-btn"
                onclick="
                    markOrderReadyFromDetails(
                        ${order.order_id}
                    )
                ">

                ✅ Mark Order Ready

            </button>

        `;

    }


    document.getElementById(
        "cookingOrderDetails"
    ).innerHTML = `

        <div class="cooking-modal-title">

            <span>
                KITCHEN ORDER
            </span>

            <h2>
                Order #${order.order_id}
            </h2>

            <p>

                ${formatDate(
                    order.created_at
                )}

            </p>

        </div>


        <div class="cooking-detail-grid">

            <div class="cooking-detail-box">

                <span>
                    Customer
                </span>

                <strong>

                    ${escapeHTML(
                        order.customer_name ||
                        "-"
                    )}

                </strong>

            </div>


            <div class="cooking-detail-box">

                <span>
                    Phone
                </span>

                <strong>

                    ${escapeHTML(
                        order.customer_phone ||
                        "-"
                    )}

                </strong>

            </div>


            <div class="cooking-detail-box">

                <span>
                    Order Type
                </span>

                <strong>

                    ${escapeHTML(
                        order.order_type ||
                        "Online"
                    )}

                </strong>

            </div>


            <div class="cooking-detail-box">

                <span>
                    Current Status
                </span>

                <strong>

                    ${getStatusText(
                        order.status
                    )}

                </strong>

            </div>

        </div>


        <div class="cooking-modal-items">

            <h3>
                🍽️ Ordered Items
            </h3>

            ${itemsHTML}


            <div class="cooking-modal-total">

                <span>
                    Total
                </span>

                <strong>

                    ₹${Number(
                        order.total_amount ||
                        0
                    ).toFixed(2)}

                </strong>

            </div>

        </div>


        <div class="cooking-modal-actions">

            ${actionHTML}

        </div>

    `;


    document.getElementById(
        "cookingModal"
    ).classList.add("show");

}


/* =====================================================
   CLOSE MODAL
===================================================== */

function closeCookingOrder() {

    document.getElementById(
        "cookingModal"
    ).classList.remove("show");

}


/* =====================================================
   START COOKING FROM MODAL
===================================================== */

async function startCookingFromDetails(
    orderId
) {

    closeCookingOrder();

    await startCooking(orderId);

}


/* =====================================================
   READY FROM MODAL
===================================================== */

async function markOrderReadyFromDetails(
    orderId
) {

    closeCookingOrder();

    await markOrderReady(orderId);

}


/* =====================================================
   START COOKING
===================================================== */

async function startCooking(orderId) {

    const confirmed =
        confirm(
            `Start cooking Order #${orderId}?`
        );


    if (!confirmed) {
        return;
    }


    await updateOrderStatus(
        orderId,
        "Preparing"
    );

}


/* =====================================================
   MARK READY
===================================================== */

async function markOrderReady(orderId) {

    const confirmed =
        confirm(
            `Mark Order #${orderId} as READY?`
        );


    if (!confirmed) {
        return;
    }


    await updateOrderStatus(
        orderId,
        "Ready"
    );

}


/* =====================================================
   UPDATE STATUS
===================================================== */

async function updateOrderStatus(
    orderId,
    status
) {

    try {

        const response =
            await fetch(
                `${API_URL}/orders/${orderId}/status`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        status: status
                    })

                }
            );


        const data =
            await response.json();


        if (
            !response.ok ||
            !data.success
        ) {

            throw new Error(
                data.message ||
                "Status update failed."
            );

        }


        await loadCookingOrders();

    }

    catch (error) {

        console.error(
            "Status Update Error:",
            error
        );

        alert(
            "❌ Unable to update order.\n\n" +
            error.message
        );

    }

}


/* =====================================================
   FILTER
===================================================== */

function setKitchenFilter(
    filter,
    button
) {

    currentFilter =
        filter;


    document
        .querySelectorAll(
            ".filter-btn"
        )
        .forEach(btn => {

            btn.classList.remove(
                "active"
            );

        });


    if (button) {

        button.classList.add(
            "active"
        );

    }


    displayCookingOrders();

}


/* =====================================================
   STATUS ICON
===================================================== */

function getStatusIcon(status) {

    switch (status) {

        case "Pending":
            return "🆕";

        case "Confirmed":
            return "🔵";

        case "Preparing":
            return "🔥";

        case "Ready":
            return "✅";

        default:
            return "📦";

    }

}


/* =====================================================
   STATUS TEXT
===================================================== */

function getStatusText(status) {

    switch (status) {

        case "Pending":
            return "PENDING";

        case "Confirmed":
            return "CONFIRMED";

        case "Preparing":
            return "PREPARING";

        case "Ready":
            return "READY";

        default:
            return String(
                status || ""
            ).toUpperCase();

    }

}


/* =====================================================
   DATE
===================================================== */

function formatDate(dateString) {

    if (!dateString) {
        return "N/A";
    }


    const date =
        new Date(dateString);


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return "N/A";

    }


    return date.toLocaleString(
        "en-IN",
        {
            day: "2-digit",

            month: "short",

            year: "numeric",

            hour: "2-digit",

            minute: "2-digit"
        }
    );

}


/* =====================================================
   HTML SECURITY
===================================================== */

function escapeHTML(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }


    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}


/* =====================================================
   AUTO REFRESH
===================================================== */

function startAutoRefresh() {

    if (refreshTimer) {

        clearInterval(
            refreshTimer
        );

    }


    refreshTimer =
        setInterval(
            loadCookingOrders,
            5000
        );

}


/* =====================================================
   MODAL BACKGROUND
===================================================== */

document.addEventListener(
    "click",
    function (event) {

        const modal =
            document.getElementById(
                "cookingModal"
            );


        if (
            event.target === modal
        ) {

            closeCookingOrder();

        }

    }
);


/* =====================================================
   ESC KEY
===================================================== */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Escape"
        ) {

            closeCookingOrder();

        }

    }
);


/* =====================================================
   INITIALIZE
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadCookingOrders();

        startAutoRefresh();

    }
);