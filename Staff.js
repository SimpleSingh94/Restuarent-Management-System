// =====================================================
// ROYAL RESTAURANT - STAFF JAVASCRIPT
// =====================================================

const API_URL = "http://localhost:3000";

let allDeliveries = [];
let currentFilter = "all";
let selectedDeliveryId = null;


// =====================================================
// PAGE NAVIGATION
// =====================================================

function showSection(sectionId, clickedButton = null) {

    // Hide all sections
    const sections =
        document.querySelectorAll(".page-section");

    sections.forEach(section => {
        section.classList.remove("active-section");
    });


    // Show selected section
    const selectedSection =
        document.getElementById(sectionId);

    if (selectedSection) {
        selectedSection.classList.add("active-section");
    }


    // Remove active class from all nav buttons
    const navButtons =
        document.querySelectorAll(".nav-item");

    navButtons.forEach(button => {
        button.classList.remove("active");
    });


    // Add active class
    if (clickedButton) {

        clickedButton.classList.add("active");

    } else {

        navButtons.forEach(button => {

            const onclickValue =
                button.getAttribute("onclick") || "";

            if (
                onclickValue.includes(
                    `'${sectionId}'`
                )
            ) {
                button.classList.add("active");
            }

        });

    }


    // =================================================
    // PAGE TITLES
    // =================================================

    const titles = {

        dashboard: "Dashboard",

        orders: "Orders",

        food: "Menu",

        cooking: "Cooking",

        management: "Management",

        delivery: "Delivery"

    };


    const subtitles = {

        dashboard:
            "Royal Restaurant Staff Panel",

        orders:
            "Manage customer orders",

        food:
            "Manage restaurant menu and availability",

        cooking:
            "Manage kitchen preparation",

        management:
            "Manage restaurant operations",

        delivery:
            "Manage delivery requests"

    };


    const pageTitle =
        document.getElementById("pageTitle");

    const pageSubtitle =
        document.getElementById("pageSubtitle");


    if (pageTitle) {

        pageTitle.textContent =
            titles[sectionId] ||
            "Dashboard";

    }


    if (pageSubtitle) {

        pageSubtitle.textContent =
            subtitles[sectionId] ||
            "Royal Restaurant Staff Panel";

    }


    // =================================================
    // LOAD DATA WHEN SECTION OPENS
    // =================================================

    if (sectionId === "delivery") {

        loadDeliveries();

    }


    if (sectionId === "management") {

        loadManagementData();

    }


    // Close mobile sidebar
    const sidebar =
        document.getElementById("sidebar");

    if (sidebar) {

        sidebar.classList.remove(
            "mobile-open"
        );

    }

}


// =====================================================
// MOBILE SIDEBAR
// =====================================================

function toggleSidebar() {

    const sidebar =
        document.getElementById("sidebar");

    if (!sidebar) return;

    sidebar.classList.toggle(
        "mobile-open"
    );

}


// =====================================================
// NOTIFICATION
// =====================================================

function showNotification() {

    const count =
        document.getElementById(
            "notificationCount"
        );

    if (count) {

        const value =
            count.textContent || "0";

        if (value === "0") {

            alert(
                "🔔 No new notifications."
            );

        } else {

            alert(
                "🔔 You have " +
                value +
                " pending notification(s)."
            );

        }

    }

}


// =====================================================
// LOGOUT
// =====================================================

function logout() {

    const confirmLogout =
        confirm(
            "Are you sure you want to logout?"
        );

    if (!confirmLogout) {
        return;
    }

    window.location.href =
        "Restro.html";

}


// =====================================================
// OPEN PAGE
// =====================================================

function openPage(page) {

    window.location.href =
        page;

}


// =====================================================
// MANAGEMENT
// =====================================================

// Load Management information
async function loadManagementData() {

    await loadDashboardOrders();

    updateManagementDeliveries();

}


// =====================================================
// LOAD ORDER COUNT
// =====================================================

async function loadDashboardOrders() {

    try {

        const response =
            await fetch(
                `${API_URL}/orders`
            );


        if (!response.ok) {
            return;
        }


        const data =
            await response.json();


        let orders = [];


        if (Array.isArray(data)) {

            orders = data;

        }
        else if (
            Array.isArray(
                data.orders
            )
        ) {

            orders =
                data.orders;

        }
        else if (
            Array.isArray(
                data.data
            )
        ) {

            orders =
                data.data;

        }


        // Dashboard order count
        const dashboardOrders =
            document.getElementById(
                "dashboardOrders"
            );


        // Management order count
        const managementOrders =
            document.getElementById(
                "managementOrders"
            );


        if (dashboardOrders) {

            dashboardOrders.textContent =
                orders.length;

        }


        if (managementOrders) {

            managementOrders.textContent =
                orders.length;

        }


    }
    catch (error) {

        console.log(
            "Order count unavailable:",
            error.message
        );

    }

}


// =====================================================
// MANAGEMENT DELIVERY COUNT
// =====================================================

function updateManagementDeliveries() {

    const managementDeliveries =
        document.getElementById(
            "managementDeliveries"
        );


    if (managementDeliveries) {

        managementDeliveries.textContent =
            allDeliveries.length;

    }

}


// =====================================================
// DELIVERY
// =====================================================


// =====================================================
// LOAD DELIVERIES
// =====================================================

async function loadDeliveries() {

    const loading =
        document.getElementById(
            "deliveryLoading"
        );

    const errorMessage =
        document.getElementById(
            "deliveryError"
        );

    const emptyMessage =
        document.getElementById(
            "deliveryEmpty"
        );


    try {

        // Show loading
        if (loading) {

            loading.style.display =
                "block";

        }


        if (errorMessage) {

            errorMessage.style.display =
                "none";

            errorMessage.textContent =
                "";

        }


        if (emptyMessage) {

            emptyMessage.style.display =
                "none";

        }


        // API request
        const response =
            await fetch(
                `${API_URL}/deliveries`
            );


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


        // Save deliveries
        allDeliveries =
            data.deliveries || [];


        // Update dashboard
        updateStatistics();


        // Update management
        updateManagementDeliveries();


        // Render cards
        renderDeliveries();


        // Connection
        updateConnection(
            true
        );


        // Last updated
        updateLastUpdated();


    }
    catch (error) {

        console.error(
            "Delivery loading error:",
            error
        );


        if (errorMessage) {

            errorMessage.textContent =
                "❌ " +
                error.message;

            errorMessage.style.display =
                "block";

        }


        updateConnection(
            false
        );


    }
    finally {

        if (loading) {

            loading.style.display =
                "none";

        }

    }

}


// =====================================================
// UPDATE DELIVERY STATISTICS
// =====================================================

function updateStatistics() {

    let waiting = 0;

    let assigned = 0;

    let transit = 0;

    let delivered = 0;


    allDeliveries.forEach(
        delivery => {

            const status =
                String(
                    delivery.status ||
                    ""
                );


            // Waiting
            if (
                status ===
                    "Waiting for Delivery Partner" ||

                status ===
                    "Finding Delivery Partner"
            ) {

                waiting++;

            }


            // Assigned
            else if (
                status ===
                    "Rider Assigned" ||

                status ===
                    "Rider Accepted"
            ) {

                assigned++;

            }


            // Transit
            else if (
                status ===
                    "Picked Up" ||

                status ===
                    "On The Way"
            ) {

                transit++;

            }


            // Delivered
            else if (
                status ===
                "Delivered"
            ) {

                delivered++;

            }

        }
    );


    // Update cards
    const waitingCount =
        document.getElementById(
            "waitingCount"
        );

    const assignedCount =
        document.getElementById(
            "assignedCount"
        );

    const transitCount =
        document.getElementById(
            "transitCount"
        );

    const deliveredCount =
        document.getElementById(
            "deliveredCount"
        );


    if (waitingCount) {

        waitingCount.textContent =
            waiting;

    }


    if (assignedCount) {

        assignedCount.textContent =
            assigned;

    }


    if (transitCount) {

        transitCount.textContent =
            transit;

    }


    if (deliveredCount) {

        deliveredCount.textContent =
            delivered;

    }


    // Dashboard
    const dashboardDeliveries =
        document.getElementById(
            "dashboardDeliveries"
        );


    if (dashboardDeliveries) {

        dashboardDeliveries.textContent =
            allDeliveries.length;

    }


    // Management
    updateManagementDeliveries();

}


// =====================================================
// DELIVERY FILTER
// =====================================================

function filterDeliveries(
    filter,
    button
) {

    currentFilter =
        filter;


    // Remove active
    document
        .querySelectorAll(
            ".filter-btn"
        )
        .forEach(btn => {

            btn.classList.remove(
                "active"
            );

        });


    // Add active
    if (button) {

        button.classList.add(
            "active"
        );

    }


    renderDeliveries();

}


// =====================================================
// GET FILTER GROUP
// =====================================================

function matchesFilter(
    delivery,
    filter
) {

    if (
        filter === "all"
    ) {

        return true;

    }


    const status =
        String(
            delivery.status ||
            ""
        );


    if (
        filter === "waiting"
    ) {

        return (

            status ===
                "Waiting for Delivery Partner" ||

            status ===
                "Finding Delivery Partner"

        );

    }


    if (
        filter === "assigned"
    ) {

        return (

            status ===
                "Rider Assigned" ||

            status ===
                "Rider Accepted"

        );

    }


    if (
        filter === "transit"
    ) {

        return (

            status ===
                "Picked Up" ||

            status ===
                "On The Way"

        );

    }


    if (
        filter === "delivered"
    ) {

        return (
            status ===
            "Delivered"
        );

    }


    return true;

}


// =====================================================
// RENDER DELIVERIES
// =====================================================

function renderDeliveries() {

    const container =
        document.getElementById(
            "deliveryGrid"
        );

    const emptyMessage =
        document.getElementById(
            "deliveryEmpty"
        );


    if (!container) {
        return;
    }


    const filteredDeliveries =
        allDeliveries.filter(
            delivery =>
                matchesFilter(
                    delivery,
                    currentFilter
                )
        );


    if (
        filteredDeliveries.length === 0
    ) {

        container.innerHTML =
            "";

        if (emptyMessage) {

            emptyMessage.style.display =
                "block";

        }

        return;

    }


    if (emptyMessage) {

        emptyMessage.style.display =
            "none";

    }


    container.innerHTML =
        filteredDeliveries
            .map(
                delivery =>
                    createDeliveryCard(
                        delivery
                    )
            )
            .join("");

}


// =====================================================
// CREATE DELIVERY CARD
// =====================================================

function createDeliveryCard(
    delivery
) {

    const deliveryId =
        delivery.delivery_id ||
        delivery.id;


    const orderId =
        delivery.order_id ||
        "-";


    const status =
        delivery.status ||
        "Unknown";


    const customerName =
        delivery.customer_name ||
        delivery.name ||
        "Customer";


    const customerPhone =
        delivery.customer_phone ||
        delivery.phone ||
        "Not available";


    const customerAddress =
        delivery.delivery_address ||
        delivery.customer_address ||
        "Address not available";


    const pickupAddress =
        delivery.pickup_address ||
        "Royal Restaurant, Lucknow";


    const partnerName =
        delivery.partner_name ||
        delivery.rider_name ||
        "Not Assigned";


    const partnerPhone =
        delivery.partner_phone ||
        delivery.rider_phone ||
        "";


    const createdAt =
        delivery.created_at ||
        delivery.createdAt;


    const statusClass =
        getDeliveryStatusClass(
            status
        );


    const statusText =
        escapeHtml(status);


    const customerNameHtml =
        escapeHtml(
            customerName
        );


    const customerPhoneHtml =
        escapeHtml(
            customerPhone
        );


    const customerAddressHtml =
        escapeHtml(
            customerAddress
        );


    const pickupAddressHtml =
        escapeHtml(
            pickupAddress
        );


    const partnerNameHtml =
        escapeHtml(
            partnerName
        );


    const partnerPhoneHtml =
        escapeHtml(
            partnerPhone
        );


    const orderNumberHtml =
        escapeHtml(
            String(orderId)
        );


    const timeText =
        escapeHtml(
            formatDateTime(
                createdAt
            )
        );


    return `

        <div class="delivery-card">

            <div class="delivery-card-header">

                <div>

                    <div class="order-number">
                        Order #${orderNumberHtml}
                    </div>

                    <div class="delivery-time">
                        ${timeText}
                    </div>

                </div>

                <span class="status-badge ${statusClass}">
                    ${statusText}
                </span>

            </div>


            <div class="delivery-card-body">

                <div class="customer-section">

                    <div class="info-box">

                        <span class="info-label">
                            Customer
                        </span>

                        <span class="info-value">
                            ${customerNameHtml}
                        </span>

                    </div>


                    <div class="info-box">

                        <span class="info-label">
                            Phone
                        </span>

                        <span class="info-value">
                            ${customerPhoneHtml}
                        </span>

                    </div>

                </div>


                <div class="address-section">

                    <div class="address-box">

                        <div class="address-title">
                            Delivery Address
                        </div>

                        <div class="address-text">
                            ${customerAddressHtml}
                        </div>

                    </div>


                    <div class="address-box">

                        <div class="address-title">
                            Pickup Address
                        </div>

                        <div class="address-text">
                            ${pickupAddressHtml}
                        </div>

                    </div>

                </div>


                <div class="rider-section">

                    <div class="rider-title">
                        Delivery Partner
                    </div>

                    <div class="rider-box">

                        <div class="rider-icon">
                            🚴
                        </div>

                        <div class="rider-info">

                            <strong>
                                ${partnerNameHtml}
                            </strong>

                            <span>
                                ${partnerPhoneHtml}
                            </span>

                        </div>

                    </div>

                </div>


                <div class="delivery-actions">

                    ${createDeliveryActions(
                        delivery
                    )}

                </div>

            </div>

        </div>

    `;

}


// =====================================================
// DELIVERY ACTIONS
// =====================================================

function createDeliveryActions(
    delivery
) {

    const deliveryId =
        delivery.delivery_id ||
        delivery.id;


    const status =
        delivery.status ||
        "";


    let buttons = "";


    if (
        status ===
            "Waiting for Delivery Partner" ||

        status ===
            "Finding Delivery Partner"
    ) {

        buttons += `

            <button
                class="action-btn primary-btn"
                onclick="updateDeliveryStatus(
                    ${deliveryId},
                    'Rider Assigned'
                )"
            >
                Assign Rider
            </button>

        `;

    }


    if (
        status ===
            "Rider Assigned" ||

        status ===
            "Rider Accepted"
    ) {

        buttons += `

            <button
                class="action-btn warning-btn"
                onclick="updateDeliveryStatus(
                    ${deliveryId},
                    'Picked Up'
                )"
            >
                Mark Picked Up
            </button>

        `;

    }


    if (
        status ===
            "Picked Up"
    ) {

        buttons += `

            <button
                class="action-btn primary-btn"
                onclick="updateDeliveryStatus(
                    ${deliveryId},
                    'On The Way'
                )"
            >
                On The Way
            </button>

        `;

    }


    if (
        status ===
            "On The Way"
    ) {

        buttons += `

            <button
                class="action-btn success-btn"
                onclick="updateDeliveryStatus(
                    ${deliveryId},
                    'Delivered'
                )"
            >
                Mark Delivered
            </button>

        `;

    }


    if (delivery.tracking_url) {

        buttons += `

            <button
                class="action-btn secondary-btn"
                onclick="openTracking(
                    '${escapeHtml(
                        delivery.tracking_url
                    )}'
                )"
            >
                Tracking
            </button>

        `;

    }


    return buttons;

}


// =====================================================
// UPDATE DELIVERY STATUS
// =====================================================

async function updateDeliveryStatus(
    deliveryId,
    status
) {

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

                    body:
                        JSON.stringify({
                            status: status
                        })
                }
            );


        const data =
            await response.json();


        if (!response.ok || !data.success) {

            throw new Error(
                data.message ||
                "Failed to update delivery status."
            );

        }


        alert(
            "✅ Delivery status updated."
        );


        await loadDeliveries();

    }
    catch (error) {

        console.error(
            "Status update error:",
            error
        );


        alert(
            "❌ " +
            error.message
        );

    }

}


// =====================================================
// TRACKING
// =====================================================

function openTracking(
    url
) {

    if (!url) {
        return;
    }


    window.open(
        url,
        "_blank"
    );

}


// =====================================================
// DELIVERY STATUS CLASS
// =====================================================

function getDeliveryStatusClass(
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


    if (!element) {
        return;
    }


    if (connected) {

        element.textContent =
            "● Connected";

        element.style.background =
            "#ecfdf5";

        element.style.color =
            "#166534";

    }
    else {

        element.textContent =
            "● Disconnected";

        element.style.background =
            "#fef2f2";

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


    if (!element) {
        return;
    }


    const now =
        new Date();


    element.textContent =
        `Last updated: ${now.toLocaleString()}`;

}


// =====================================================
// FORMAT DATE TIME
// =====================================================

function formatDateTime(
    value
) {

    if (!value) {

        return "Time not available";

    }


    const date =
        new Date(value);


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return String(value);

    }


    return date.toLocaleString();

}


// =====================================================
// ESCAPE HTML
// =====================================================

function escapeHtml(
    value
) {

    return String(
        value ?? ""
    )

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
// REFRESH DELIVERY DATA
// =====================================================

async function refreshDeliveries() {

    await loadDeliveries();

}


// =====================================================
// AUTO LOAD
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        // Dashboard order count
        loadDashboardOrders();


        // Load deliveries only if needed
        const deliverySection =
            document.getElementById(
                "delivery"
            );


        if (
            deliverySection &&
            deliverySection.classList.contains(
                "active-section"
            )
        ) {

            loadDeliveries();

        }

    }
);