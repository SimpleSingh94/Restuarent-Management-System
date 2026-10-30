/* =====================================================
   ROYAL RESTAURANT
   ORDER MANAGEMENT
===================================================== */

const API_URL = "http://localhost:3000";

let allOrders = [];
let orders = [];


/* =====================================================
   PAGE LOAD
===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    loadOrders();

});


/* =====================================================
   LOAD ORDERS
===================================================== */

async function loadOrders() {

    const table =
        document.getElementById("ordersTable");

    table.innerHTML = `
        <tr>
            <td colspan="8" class="loading-cell">
                ⏳ Loading orders...
            </td>
        </tr>
    `;

    try {

        const response =
            await fetch(
                `${API_URL}/orders`,
                {
                    cache: "no-store"
                }
            );

        const data =
            await response.json();

        if (!response.ok || !data.success) {

            throw new Error(
                data.message ||
                "Failed to load orders."
            );

        }

        allOrders =
            Array.isArray(data.orders)
                ? data.orders
                : [];

        orders = [...allOrders];

        updateStats();

        renderOrders();

    }

    catch (error) {

        console.error(
            "Load Orders Error:",
            error
        );

        table.innerHTML = `
            <tr>
                <td colspan="8" class="loading-cell">

                    ❌ Failed to load orders.

                    <br><br>

                    Make sure
                    <strong>server.js</strong>
                    is running on
                    localhost:3000.

                </td>
            </tr>
        `;

    }

}


/* =====================================================
   UPDATE STATISTICS
===================================================== */

function updateStats() {

    document.getElementById(
        "totalOrders"
    ).textContent =
        allOrders.length;


    document.getElementById(
        "pendingOrders"
    ).textContent =
        allOrders.filter(order =>
            order.status === "Pending" ||
            order.status === "Confirmed"
        ).length;


    document.getElementById(
        "preparingOrders"
    ).textContent =
        allOrders.filter(order =>
            order.status === "Preparing"
        ).length;


    document.getElementById(
        "readyOrders"
    ).textContent =
        allOrders.filter(order =>
            order.status === "Ready"
        ).length;

}


/* =====================================================
   RENDER
===================================================== */

function renderOrders() {

    const table =
        document.getElementById(
            "ordersTable"
        );

    table.innerHTML = "";


    if (orders.length === 0) {

        table.innerHTML = `
            <tr>
                <td
                    colspan="8"
                    class="loading-cell">

                    📦 No customer orders found.

                </td>
            </tr>
        `;

        document.getElementById(
            "orderResult"
        ).textContent =
            "Showing 0 orders";

        return;

    }


    orders.forEach(function (order) {

        createOrderRow(order);

    });


    document.getElementById(
        "orderResult"
    ).textContent =
        `Showing ${orders.length} order(s)`;

}


/* =====================================================
   CREATE ROW
===================================================== */

function createOrderRow(order) {

    const table =
        document.getElementById(
            "ordersTable"
        );

    const row =
        document.createElement("tr");


    let itemsHTML = "No items";


    if (
        Array.isArray(order.items) &&
        order.items.length > 0
    ) {

        itemsHTML =
            order.items
                .map(item => {

                    return `
                        ${escapeHTML(
                            item.item_name
                        )}
                        × ${Number(
                            item.quantity
                        )}
                        <br>
                    `;

                })
                .join("");

    }


    const status =
        order.status || "Pending";


    row.innerHTML = `

        <td>

            <strong>
                #${order.order_id}
            </strong>

        </td>


        <td>

            <span class="customer-name">

                ${escapeHTML(
                    order.customer_name ||
                    "Unknown"
                )}

            </span>

            <span class="customer-phone">

                ${escapeHTML(
                    order.customer_phone ||
                    "-"
                )}

            </span>

        </td>


        <td>

            <div class="items-text">

                ${itemsHTML}

            </div>

        </td>


        <td>

            <span class="amount">

                ₹${Number(
                    order.total_amount || 0
                ).toFixed(2)}

            </span>

        </td>


        <td>

            ${escapeHTML(
                order.order_type ||
                "Online"
            )}

        </td>


        <td>

            ${formatOrderTime(
                order.created_at
            )}

        </td>


        <td>

            <span class="status ${escapeHTML(
                status
            )}">

                ${escapeHTML(status)}

            </span>

        </td>


        <td>

            <div class="action-buttons">

                <button
                    class="action-btn view-btn"
                    onclick="viewOrder(${order.order_id})">

                    View

                </button>

                ${getNextStatusButton(order)}

            </div>

        </td>

    `;


    table.appendChild(row);

}


/* =====================================================
   NEXT STATUS BUTTON
===================================================== */

function getNextStatusButton(order) {

    const status =
        order.status;


    if (status === "Pending") {

        return `
            <button
                class="action-btn status-btn"
                onclick="changeOrderStatus(
                    ${order.order_id},
                    'Confirmed'
                )">

                Confirm

            </button>
        `;

    }


    if (status === "Confirmed") {

        return `
            <button
                class="action-btn status-btn"
                onclick="changeOrderStatus(
                    ${order.order_id},
                    'Preparing'
                )">

                Prepare

            </button>
        `;

    }


    if (status === "Preparing") {

        return `
            <button
                class="action-btn status-btn"
                onclick="changeOrderStatus(
                    ${order.order_id},
                    'Ready'
                )">

                Ready

            </button>
        `;

    }


    if (status === "Ready") {

        return `
            <button
                class="action-btn status-btn"
                onclick="changeOrderStatus(
                    ${order.order_id},
                    'Completed'
                )">

                Complete

            </button>
        `;

    }


    return "";

}


/* =====================================================
   CHANGE STATUS
===================================================== */

async function changeOrderStatus(
    orderId,
    newStatus
) {

    const confirmed =
        confirm(
            `Change Order #${orderId} to ${newStatus}?`
        );

    if (!confirmed) {
        return;
    }


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
                        status: newStatus
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


        await loadOrders();

    }

    catch (error) {

        console.error(
            error
        );

        alert(
            "❌ Unable to update order.\n\n" +
            error.message
        );

    }

}


/* =====================================================
   SEARCH + FILTER
===================================================== */

function filterOrders() {

    const search =
        document
            .getElementById(
                "searchOrder"
            )
            .value
            .toLowerCase()
            .trim();


    const status =
        document.getElementById(
            "statusFilter"
        ).value;


    orders =
        allOrders.filter(order => {

            const orderId =
                String(
                    order.order_id || ""
                ).toLowerCase();


            const customer =
                String(
                    order.customer_name || ""
                ).toLowerCase();


            const phone =
                String(
                    order.customer_phone || ""
                ).toLowerCase();


            const matchesSearch =
                !search ||
                orderId.includes(search) ||
                customer.includes(search) ||
                phone.includes(search);


            const matchesStatus =
                status === "All" ||
                order.status === status;


            return (
                matchesSearch &&
                matchesStatus
            );

        });


    renderOrders();

}


/* =====================================================
   CLEAR FILTER
===================================================== */

function clearFilters() {

    document.getElementById(
        "searchOrder"
    ).value = "";


    document.getElementById(
        "statusFilter"
    ).value = "All";


    orders = [...allOrders];

    renderOrders();

}


/* =====================================================
   VIEW ORDER
===================================================== */

function viewOrder(orderId) {

    const order =
        allOrders.find(
            item =>
                Number(item.order_id) ===
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

                    <div class="modal-item">

                        <span>

                            ${escapeHTML(
                                item.item_name
                            )}

                            × ${Number(
                                item.quantity
                            )}

                        </span>

                        <strong>

                            ₹${Number(
                                item.item_total || 0
                            ).toFixed(2)}

                        </strong>

                    </div>

                `;

            }).join("")

            : `
                <div class="modal-item">
                    No items found
                </div>
            `;


    document.getElementById(
        "orderDetails"
    ).innerHTML = `

        <div class="modal-title">

            <h2>
                Order #${order.order_id}
            </h2>

            <p>
                ${formatOrderTime(
                    order.created_at
                )}
            </p>

        </div>


        <div class="detail-grid">

            <div class="detail-box">

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


            <div class="detail-box">

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


            <div class="detail-box">

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


            <div class="detail-box">

                <span>
                    Status
                </span>

                <strong>
                    ${escapeHTML(
                        order.status ||
                        "Pending"
                    )}
                </strong>

            </div>

        </div>


        <div class="modal-items">

            <h3>
                🍽️ Ordered Items
            </h3>

            ${itemsHTML}


            <div class="modal-total">

                <span>
                    Total
                </span>

                <span>
                    ₹${Number(
                        order.total_amount || 0
                    ).toFixed(2)}
                </span>

            </div>

        </div>

    `;


    document.getElementById(
        "orderModal"
    ).classList.add("show");

}


/* =====================================================
   CLOSE MODAL
===================================================== */

function closeOrderModal() {

    document.getElementById(
        "orderModal"
    ).classList.remove("show");

}


/* =====================================================
   ESCAPE HTML
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
   DATE
===================================================== */

function formatOrderTime(
    dateString
) {

    if (!dateString) {
        return "-";
    }


    const date =
        new Date(dateString);


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return "-";

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
   CLOSE MODAL BY BACKGROUND
===================================================== */

document.addEventListener(
    "click",
    function (event) {

        const modal =
            document.getElementById(
                "orderModal"
            );

        if (
            event.target === modal
        ) {

            closeOrderModal();

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

            closeOrderModal();

        }

    }
);