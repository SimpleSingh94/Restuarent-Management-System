// =====================================================
// DELIVERY DASHBOARD
// =====================================================

const API_URL = "http://localhost:3000";

let allDeliveries = [];

let currentFilter = "all";

let selectedDeliveryId = null;


// =====================================================
// PAGE NAVIGATION
// =====================================================

function openPage(page) {

    window.location.href = page;

}


// =====================================================
// LOAD DELIVERIES
// =====================================================

async function loadDeliveries() {

    const loading =
        document.getElementById("loading");

    const errorMessage =
        document.getElementById("errorMessage");

    try {

        loading.style.display = "block";

        errorMessage.style.display = "none";


        const response =
            await fetch(`${API_URL}/deliveries`);


        if (!response.ok) {

            throw new Error(
                "Failed to load deliveries."
            );

        }


        const data =
            await response.json();


        if (!data.success) {

            throw new Error(
                data.message ||
                "Unable to load deliveries."
            );

        }


        allDeliveries =
            data.deliveries || [];


        updateStatistics();

        renderDeliveries();

        updateConnection(true);

        updateLastUpdated();


    } catch (error) {

        console.error(
            "Delivery loading error:",
            error
        );


        errorMessage.textContent =
            "❌ " + error.message;


        errorMessage.style.display =
            "block";


        updateConnection(false);


    } finally {

        loading.style.display =
            "none";

    }

}


// =====================================================
// UPDATE STATISTICS
// =====================================================

function updateStatistics() {

    let waiting = 0;

    let assigned = 0;

    let onWay = 0;

    let delivered = 0;


    allDeliveries.forEach(
        delivery => {

            const status =
                delivery.status;


            if (
                status ===
                "Waiting for Delivery Partner" ||
                status ===
                "Finding Delivery Partner"
            ) {

                waiting++;

            }


            if (
                status ===
                "Rider Assigned" ||
                status ===
                "Rider Accepted"
            ) {

                assigned++;

            }


            if (
                status ===
                "Picked Up" ||
                status ===
                "On The Way"
            ) {

                onWay++;

            }


            if (
                status ===
                "Delivered"
            ) {

                delivered++;

            }

        }
    );


    document.getElementById(
        "waitingCount"
    ).textContent = waiting;


    document.getElementById(
        "assignedCount"
    ).textContent = assigned;


    document.getElementById(
        "onWayCount"
    ).textContent = onWay;


    document.getElementById(
        "deliveredCount"
    ).textContent = delivered;

}


// =====================================================
// FILTER
// =====================================================

function setDeliveryFilter(
    filter,
    button
) {

    currentFilter = filter;


    document
        .querySelectorAll(".filter-btn")
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


    renderDeliveries();

}


// =====================================================
// RENDER DELIVERIES
// =====================================================

function renderDeliveries() {

    const container =
        document.getElementById(
            "deliveryContainer"
        );


    const emptyMessage =
        document.getElementById(
            "emptyMessage"
        );


    let deliveries =
        [...allDeliveries];


    if (
        currentFilter !== "all"
    ) {

        deliveries =
            deliveries.filter(
                delivery =>
                    delivery.status ===
                    currentFilter
            );

    }


    deliveries.sort(
        (a, b) =>
            new Date(b.created_at) -
            new Date(a.created_at)
    );


    container.innerHTML = "";


    if (deliveries.length === 0) {

        emptyMessage.style.display =
            "block";

        return;

    }


    emptyMessage.style.display =
        "none";


    deliveries.forEach(
        delivery => {

            container.appendChild(
                createDeliveryCard(
                    delivery
                )
            );

        }
    );

}


// =====================================================
// CREATE DELIVERY CARD
// =====================================================

function createDeliveryCard(
    delivery
) {

    const card =
        document.createElement("article");


    card.className =
        "delivery-card";


    const statusClass =
        getStatusClass(
            delivery.status
        );


    const createdTime =
        formatDate(
            delivery.created_at
        );


    let riderHTML = "";


    if (
        delivery.partner_name
    ) {

        riderHTML = `

            <div class="rider-section">

                <div class="rider-title">
                    DELIVERY PARTNER
                </div>

                <div class="rider-box">

                    <div class="rider-icon">
                        🚴
                    </div>

                    <div class="rider-info">

                        <strong>
                            ${escapeHTML(
                                delivery.partner_name
                            )}
                        </strong>

                        <span>
                            ${escapeHTML(
                                delivery.vehicle_type ||
                                "Vehicle"
                            )}

                            •

                            ${escapeHTML(
                                delivery.vehicle_number ||
                                "N/A"
                            )}

                            •

                            ${escapeHTML(
                                delivery.partner_phone ||
                                ""
                            )}
                        </span>

                    </div>

                </div>

            </div>

        `;

    }


    card.innerHTML = `

        <div class="delivery-card-header">

            <div>

                <div class="order-number">

                    Order #${delivery.order_id}

                </div>

                <div class="delivery-time">

                    Created:
                    ${createdTime}

                </div>

            </div>


            <span
                class="status-badge ${statusClass}">

                ${escapeHTML(
                    delivery.status
                )}

            </span>

        </div>


        <div class="delivery-card-body">


            <div class="customer-section">


                <div class="info-box">

                    <span class="info-label">
                        CUSTOMER
                    </span>

                    <span class="info-value">

                        ${escapeHTML(
                            delivery.customer_name ||
                            "N/A"
                        )}

                    </span>

                </div>


                <div class="info-box">

                    <span class="info-label">
                        PHONE
                    </span>

                    <span class="info-value">

                        ${escapeHTML(
                            delivery.customer_phone ||
                            "N/A"
                        )}

                    </span>

                </div>


            </div>


            <div class="address-section">

                <span class="info-label">
                    PICKUP LOCATION
                </span>

                <div class="address-box">

                    <div class="address-title">
                        🏪 Restaurant
                    </div>

                    <div class="address-text">

                        ${escapeHTML(
                            delivery.pickup_address
                        )}

                    </div>

                </div>


                <div
                    class="address-box"
                    style="
                        border-left-color:#2563eb;
                        background:#eff6ff;
                    ">

                    <div class="address-title">
                        📍 CUSTOMER DESTINATION
                    </div>

                    <div class="address-text">

                        ${escapeHTML(
                            delivery.delivery_address
                        )}

                    </div>

                </div>

            </div>


            ${riderHTML}


            <div class="delivery-actions">

                ${getActionButtons(
                    delivery
                )}

            </div>


        </div>

    `;


    return card;

}


// =====================================================
// ACTION BUTTONS
// =====================================================

function getActionButtons(
    delivery
) {

    const status =
        delivery.status;


    // Waiting

    if (
        status ===
            "Waiting for Delivery Partner" ||
        status ===
            "Finding Delivery Partner"
    ) {

        return `

            <button
                class="action-btn primary-btn"
                onclick="
                    findDeliveryPartner(
                        ${delivery.delivery_id}
                    )
                ">

                🚴 Find Partner

            </button>

        `;

    }


    // Assigned

    if (
        status ===
        "Rider Assigned"
    ) {

        return `

            <button
                class="action-btn success-btn"
                onclick="
                    updateDeliveryStatus(
                        ${delivery.delivery_id},
                        'Picked Up'
                    )
                ">

                📦 Mark Picked Up

            </button>

        `;

    }


    // Picked Up

    if (
        status ===
        "Picked Up"
    ) {

        return `

            <button
                class="action-btn warning-btn"
                onclick="
                    updateDeliveryStatus(
                        ${delivery.delivery_id},
                        'On The Way'
                    )
                ">

                🛵 Start Delivery

            </button>

        `;

    }


    // On The Way

    if (
        status ===
        "On The Way"
    ) {

        return `

            <button
                class="action-btn success-btn"
                onclick="
                    updateDeliveryStatus(
                        ${delivery.delivery_id},
                        'Delivered'
                    )
                ">

                ✅ Mark Delivered

            </button>

        `;

    }


    // Delivered

    if (
        status ===
        "Delivered"
    ) {

        return `

            <button
                class="action-btn disabled-btn"
                disabled>

                ✅ Delivery Completed

            </button>

        `;

    }


    return "";

}


// =====================================================
// FIND DELIVERY PARTNER
// =====================================================

async function findDeliveryPartner(
    deliveryId
) {

    selectedDeliveryId =
        deliveryId;


    try {

        const response =
            await fetch(
                `${API_URL}/delivery/available-partners`
            );


        const data =
            await response.json();


        if (!data.success) {

            throw new Error(
                data.message ||
                "Unable to find partners."
            );

        }


        showPartnerModal(
            data.partners || []
        );


    } catch (error) {

        alert(
            "❌ " + error.message
        );

    }

}


// =====================================================
// PARTNER MODAL
// =====================================================

function showPartnerModal(
    partners
) {

    let modal =
        document.getElementById(
            "partnerModal"
        );


    if (!modal) {

        modal =
            document.createElement(
                "div"
            );

        modal.id =
            "partnerModal";

        modal.className =
            "modal-overlay";


        modal.innerHTML = `

            <div class="partner-modal">

                <div class="modal-header">

                    <h2>
                        🚴 Available Delivery Partners
                    </h2>

                    <button
                        class="close-modal"
                        onclick="
                            closePartnerModal()
                        ">

                        ×

                    </button>

                </div>

                <div
                    id="partnerList"
                    class="partner-list">

                </div>

            </div>

        `;


        document.body.appendChild(
            modal
        );

    }


    const list =
        document.getElementById(
            "partnerList"
        );


    list.innerHTML = "";


    if (partners.length === 0) {

        list.innerHTML = `

            <div class="empty-message"
                 style="display:block">

                <div class="empty-icon">
                    🚫
                </div>

                <h2>
                    No Partner Available
                </h2>

                <p>
                    Please try again later.
                </p>

            </div>

        `;

    }


    partners.forEach(
        partner => {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "partner-option";


            item.innerHTML = `

                <div class="partner-details">

                    <div class="partner-avatar">
                        🚴
                    </div>

                    <div>

                        <strong>
                            ${escapeHTML(
                                partner.name
                            )}
                        </strong>

                        <span>

                            ${escapeHTML(
                                partner.vehicle_type ||
                                "Vehicle"
                            )}

                            •

                            ${escapeHTML(
                                partner.vehicle_number ||
                                "N/A"
                            )}

                            •

                            ${escapeHTML(
                                partner.phone ||
                                ""
                            )}

                        </span>

                    </div>

                </div>


                <button
                    class="assign-btn"
                    onclick="
                        assignDeliveryPartner(
                            ${partner.partner_id}
                        )
                    ">

                    Assign

                </button>

            `;


            list.appendChild(item);

        }
    );


    modal.classList.add("show");

}


// =====================================================
// CLOSE PARTNER MODAL
// =====================================================

function closePartnerModal() {

    const modal =
        document.getElementById(
            "partnerModal"
        );


    if (modal) {

        modal.classList.remove(
            "show"
        );

    }

}


// =====================================================
// ASSIGN PARTNER
// =====================================================

async function assignDeliveryPartner(
    partnerId
) {

    if (!selectedDeliveryId) {

        return;

    }


    try {

        const response =
            await fetch(
                `${API_URL}/delivery/${selectedDeliveryId}/assign`,
                {

                    method: "PUT",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body: JSON.stringify({

                        partner_id:
                            partnerId

                    })

                }
            );


        const data =
            await response.json();


        if (!data.success) {

            throw new Error(
                data.message ||
                "Failed to assign partner."
            );

        }


        closePartnerModal();


        alert(
            "🚴 Delivery partner assigned successfully!"
        );


        await loadDeliveries();


    } catch (error) {

        alert(
            "❌ " + error.message
        );

    }

}


// =====================================================
// UPDATE DELIVERY STATUS
// =====================================================

async function updateDeliveryStatus(
    deliveryId,
    status
) {

    const confirmation =
        confirm(
            `Change delivery status to "${status}"?`
        );


    if (!confirmation) {

        return;

    }


    try {

        const response =
            await fetch(
                `${API_URL}/delivery/${deliveryId}/status`,
                {

                    method: "PUT",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body: JSON.stringify({

                        status:
                            status

                    })

                }
            );


        const data =
            await response.json();


        if (!data.success) {

            throw new Error(
                data.message ||
                "Failed to update status."
            );

        }


        await loadDeliveries();


    } catch (error) {

        alert(
            "❌ " + error.message
        );

    }

}


// =====================================================
// STATUS CLASS
// =====================================================

function getStatusClass(
    status
) {

    switch (status) {

        case "Waiting for Delivery Partner":
        case "Finding Delivery Partner":

            return "status-waiting";


        case "Rider Assigned":
        case "Rider Accepted":

            return "status-assigned";


        case "Picked Up":

            return "status-picked";


        case "On The Way":

            return "status-way";


        case "Delivered":

            return "status-delivered";


        default:

            return "status-waiting";

    }

}


// =====================================================
// CONNECTION STATUS
// =====================================================

function updateConnection(
    connected
) {

    const element =
        document.getElementById(
            "connectionStatus"
        );


    if (!element) return;


    if (connected) {

        element.textContent =
            "🟢 Connected";

        element.style.color =
            "#166534";

    } else {

        element.textContent =
            "🔴 Connection Error";

        element.style.color =
            "#991b1b";

    }

}


// =====================================================
// LAST UPDATED
// =====================================================

function updateLastUpdated() {

    const element =
        document.getElementById(
            "lastUpdated"
        );


    if (!element) return;


    element.textContent =
        new Date().toLocaleTimeString(
            "en-IN"
        );

}


// =====================================================
// DATE FORMAT
// =====================================================

function formatDate(
    date
) {

    if (!date) {

        return "N/A";

    }


    return new Date(date)
        .toLocaleString(
            "en-IN",
            {

                dateStyle: "medium",

                timeStyle: "short"

            }
        );

}


// =====================================================
// HTML SECURITY
// =====================================================

function escapeHTML(
    value
) {

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


// =====================================================
// LOGOUT
// =====================================================

function staffLogout() {

    const confirmLogout =
        confirm(
            "Are you sure you want to logout?"
        );


    if (confirmLogout) {

        window.location.href =
            "Restro.html";

    }

}


// =====================================================
// AUTO REFRESH
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadDeliveries();


        // Refresh every 5 seconds

        setInterval(
            loadDeliveries,
            5000
        );

    }
);