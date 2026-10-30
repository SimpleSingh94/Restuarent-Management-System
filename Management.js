/* =====================================================
   ROYAL RESTAURANT
   MANAGEMENT JAVASCRIPT
===================================================== */

const API_URL = "http://localhost:3000";

/* =====================================================
   MANAGEMENT DATE
===================================================== */

let selectedManagementDate = "";


/* =====================================================
   PAGE LOAD
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const dateInput =
            document.getElementById(
                "managementDate"
            );

        /*
         * Set today's date when Management opens.
         */

        if (dateInput) {

            const today =
                new Date();

            const year =
                today.getFullYear();

            const month =
                String(
                    today.getMonth() + 1
                ).padStart(2, "0");

            const day =
                String(
                    today.getDate()
                ).padStart(2, "0");

            selectedManagementDate =
                `${year}-${month}-${day}`;

            dateInput.value =
                selectedManagementDate;


            /*
             * Reload Management when
             * another date is selected.
             */

            dateInput.addEventListener(
                "change",
                function () {

                    selectedManagementDate =
                        this.value;

                    loadManagementData();

                }
            );

        }


        /*
         * Load Management data.
         */

        loadManagementData();

    }
);


/* =====================================================
   LOAD ALL MANAGEMENT DATA
===================================================== */

async function loadManagementData() {

    const loadingMessage =
        document.getElementById(
            "loadingMessage"
        );

    const errorMessage =
        document.getElementById(
            "errorMessage"
        );

    const connectionStatus =
        document.getElementById(
            "connectionStatus"
        );


    /*
     * Show loading message.
     */

    if (loadingMessage) {

        loadingMessage.style.display =
            "block";

    }


    /*
     * Hide previous error.
     */

    if (errorMessage) {

        errorMessage.style.display =
            "none";

    }


    try {

        /*
         * Load all existing APIs.
         */

        const [
            ordersResponse,
            customersResponse,
            deliveriesResponse
        ] = await Promise.all([

            fetch(
                `${API_URL}/orders`
            ),

            fetch(
                `${API_URL}/registrations`
            ),

            fetch(
                `${API_URL}/deliveries`
            )

        ]);


        /* =================================================
           CHECK API RESPONSES
        ================================================= */

        if (!ordersResponse.ok) {

            throw new Error(
                "Failed to load orders."
            );

        }


        if (!customersResponse.ok) {

            throw new Error(
                "Failed to load customers."
            );

        }


        if (!deliveriesResponse.ok) {

            throw new Error(
                "Failed to load deliveries."
            );

        }


        /* =================================================
           CONVERT RESPONSE TO JSON
        ================================================= */

        const ordersData =
            await ordersResponse.json();

        const customersData =
            await customersResponse.json();

        const deliveriesData =
            await deliveriesResponse.json();


        /* =================================================
           VALIDATE RESPONSE
        ================================================= */

        if (!ordersData.success) {

            throw new Error(
                ordersData.message ||
                "Unable to load orders."
            );

        }


        if (!customersData.success) {

            throw new Error(
                customersData.message ||
                "Unable to load customers."
            );

        }


        if (!deliveriesData.success) {

            throw new Error(
                deliveriesData.message ||
                "Unable to load deliveries."
            );

        }


        /* =================================================
           EXTRACT ARRAYS
        ================================================= */

        const orders =
            Array.isArray(
                ordersData.orders
            )
                ? ordersData.orders
                : [];


        const customers =
            Array.isArray(
                customersData.registrations
            )
                ? customersData.registrations
                : [];


        const deliveries =
            Array.isArray(
                deliveriesData.deliveries
            )
                ? deliveriesData.deliveries
                : [];


        /* =================================================
           FILTER DATA BY SELECTED DATE
        ================================================= */

        const filteredOrders =
            filterByDate(
                orders,
                selectedManagementDate,
                "created_at"
            );


        const filteredCustomers =
            filterByDate(
                customers,
                selectedManagementDate,
                "created_at"
            );


        const filteredDeliveries =
            filterByDate(
                deliveries,
                selectedManagementDate,
                "created_at"
            );


        /* =================================================
           UPDATE MANAGEMENT DASHBOARD
        ================================================= */

        updateOrderStatistics(
            filteredOrders
        );


        updateCustomerStatistics(
            filteredOrders
        );


        updateSalesStatistics(
            orders,
            filteredOrders
        );


        updateDeliveryStatistics(
            filteredDeliveries
        );


        renderRecentOrders(
            filteredOrders
        );


        updateLastUpdated();


        /* =================================================
           CONNECTION SUCCESS
        ================================================= */

        if (connectionStatus) {

            connectionStatus.textContent =
                "🟢 Connected";

            connectionStatus.style.background =
                "#ecfdf5";

            connectionStatus.style.color =
                "#166534";

        }

    }
    catch (error) {

        console.error(
            "Management loading error:",
            error
        );


        /* =================================================
           SHOW ERROR
        ================================================= */

        if (errorMessage) {

            errorMessage.textContent =
                "❌ " +
                error.message;

            errorMessage.style.display =
                "block";

        }


        /* =================================================
           CONNECTION ERROR
        ================================================= */

        if (connectionStatus) {

            connectionStatus.textContent =
                "🔴 Disconnected";

            connectionStatus.style.background =
                "#fef2f2";

            connectionStatus.style.color =
                "#991b1b";

        }

    }
    finally {

        if (loadingMessage) {

            loadingMessage.style.display =
                "none";

        }

    }

}


/* =====================================================
   FILTER DATA BY SELECTED DATE
===================================================== */

function filterByDate(
    records,
    selectedDate,
    dateField
) {

    /*
     * If no date is selected,
     * return all records.
     */

    if (!selectedDate) {

        return records;

    }


    return records.filter(
        function (record) {

            /*
             * Ignore records without
             * a valid date.
             */

            if (!record[dateField]) {

                return false;

            }


            const date =
                new Date(
                    record[dateField]
                );


            /*
             * Invalid date.
             */

            if (
                Number.isNaN(
                    date.getTime()
                )
            ) {

                return false;

            }


            const year =
                date.getFullYear();


            const month =
                String(
                    date.getMonth() + 1
                ).padStart(2, "0");


            const day =
                String(
                    date.getDate()
                ).padStart(2, "0");


            const recordDate =
                `${year}-${month}-${day}`;


            return (
                recordDate ===
                selectedDate
            );

        }
    );

}


/* =====================================================
   ORDER STATISTICS
===================================================== */

function updateOrderStatistics(
    orders
) {

    let pending = 0;

    let confirmed = 0;

    let preparing = 0;

    let ready = 0;

    let completed = 0;

    let cancelled = 0;


    orders.forEach(
        function (order) {

            const status =
                String(
                    order.status || ""
                ).trim();


            switch (status) {

                case "Pending":

                    pending++;

                    break;


                case "Confirmed":

                    confirmed++;

                    break;


                case "Preparing":

                    preparing++;

                    break;


                case "Ready":

                    ready++;

                    break;


                case "Completed":

                    completed++;

                    break;


                case "Cancelled":

                    cancelled++;

                    break;

            }

        }
    );


    /* =================================================
       TOTAL ORDERS
    ================================================= */

    setText(
        "totalOrders",
        orders.length
    );


    /* =================================================
       MAIN ORDER CARDS
    ================================================= */

    setText(
        "pendingOrders",
        pending
    );


    setText(
        "preparingOrders",
        preparing
    );


    setText(
        "readyOrders",
        ready
    );


    /* =================================================
       ORDER STATUS SECTION
    ================================================= */

    setText(
        "statusPending",
        pending
    );


    setText(
        "statusConfirmed",
        confirmed
    );


    setText(
        "statusPreparing",
        preparing
    );


    setText(
        "statusReady",
        ready
    );


    setText(
        "statusCompleted",
        completed
    );


    setText(
        "statusCancelled",
        cancelled
    );

}


/* =====================================================
   CUSTOMER STATISTICS
===================================================== */

function updateCustomerStatistics(
    orders
) {

    /*
     * "Customers" are counted from real orders
     * (unique phone numbers), not from the
     * separate Registration/preferences form,
     * since most customers order without ever
     * filling that form.
     */

    const uniquePhones =
        new Set();

    orders.forEach(
        function (order) {

            const phone =
                String(
                    order.customer_phone || ""
                ).trim();

            if (phone) {

                uniquePhones.add(phone);

            }

        }
    );

    setText(
        "totalCustomers",
        uniquePhones.size
    );

}


/* =====================================================
   SALES STATISTICS
===================================================== */

function sumSales(
    orders
) {

    let total = 0;

    orders.forEach(
        function (order) {

            /*
             * Cancelled orders are not
             * counted as sales.
             */

            const status =
                String(
                    order.status || ""
                ).trim();


            if (status === "Cancelled") {

                return;

            }


            const amount =
                Number(
                    order.total_amount || 0
                );


            /*
             * Ignore invalid amounts.
             */

            if (
                !Number.isFinite(amount)
            ) {

                return;

            }


            total += amount;

        }
    );

    return total;

}


function updateSalesStatistics(
    allOrders,
    dateFilteredOrders
) {

    /* =================================================
       TOTAL SALES (all-time, unaffected by the
       date picker)
    ================================================= */

    setText(
        "totalSales",
        formatCurrency(
            sumSales(allOrders)
        )
    );


    /* =================================================
       SALES FOR THE SELECTED DATE
       (HTML element id is "todaySales")
    ================================================= */

    setText(
        "todaySales",
        formatCurrency(
            sumSales(dateFilteredOrders)
        )
    );

}


/* =====================================================
   DELIVERY STATISTICS
===================================================== */

function updateDeliveryStatistics(
    deliveries
) {

    let waiting = 0;

    let assigned = 0;

    let transit = 0;

    let delivered = 0;


    deliveries.forEach(
        function (delivery) {

            const status =
                String(
                    delivery.status || ""
                ).trim();


            /* =================================================
               WAITING
            ================================================= */

            if (

                status ===
                "Waiting for Delivery Partner"

                ||

                status ===
                "Finding Delivery Partner"

            ) {

                waiting++;

            }


            /* =================================================
               ASSIGNED
            ================================================= */

            else if (

                status ===
                "Rider Assigned"

                ||

                status ===
                "Rider Accepted"

            ) {

                assigned++;

            }


            /* =================================================
               TRANSIT
            ================================================= */

            else if (

                status ===
                "Picked Up"

                ||

                status ===
                "On The Way"

            ) {

                transit++;

            }


            /* =================================================
               DELIVERED
            ================================================= */

            else if (

                status ===
                "Delivered"

            ) {

                delivered++;

            }

        }
    );


    /* =================================================
       MAIN DELIVERY CARD
    ================================================= */

    setText(
        "totalDeliveries",
        deliveries.length
    );


    /* =================================================
       DELIVERY OVERVIEW
    ================================================= */

    setText(
        "deliveryTotal",
        deliveries.length
    );


    setText(
        "deliveryWaiting",
        waiting
    );


    setText(
        "deliveryAssigned",
        assigned
    );


    setText(
        "deliveryTransit",
        transit
    );


    setText(
        "deliveryDelivered",
        delivered
    );

}


/* =====================================================
   RECENT ORDERS
===================================================== */

function renderRecentOrders(
    orders
) {

    const tableBody =
        document.getElementById(
            "recentOrdersBody"
        );


    if (!tableBody) {

        return;

    }


    /*
     * Newest orders first.
     */

    const sortedOrders =
        [...orders].sort(
            function (a, b) {

                const dateA =
                    new Date(
                        a.created_at || 0
                    );


                const dateB =
                    new Date(
                        b.created_at || 0
                    );


                return dateB - dateA;

            }
        );


    /*
     * Show latest 10 orders.
     */

    const recentOrders =
        sortedOrders.slice(
            0,
            10
        );


    /* =================================================
       NO ORDERS
    ================================================= */

    if (
        recentOrders.length === 0
    ) {

        tableBody.innerHTML = `

            <tr>

                <td
                    colspan="6"
                    class="empty-cell">

                    No orders found
                    for the selected date.

                </td>

            </tr>

        `;

        return;

    }


    /* =================================================
       DISPLAY ORDERS
    ================================================= */

    tableBody.innerHTML =
        recentOrders.map(
            function (order) {

                const status =
                    String(
                        order.status ||
                        "Unknown"
                    );


                const statusClass =
                    getStatusClass(
                        status
                    );


                const amount =
                    Number(
                        order.total_amount ||
                        0
                    );


                return `

                    <tr>

                        <td>

                            <strong>

                                #${escapeHTML(
                                    order.order_id
                                )}

                            </strong>

                        </td>


                        <td>

                            ${escapeHTML(
                                order.customer_name ||
                                "N/A"
                            )}

                        </td>


                        <td>

                            ${escapeHTML(
                                order.order_type ||
                                "Online"
                            )}

                        </td>


                        <td>

                            ₹${amount.toFixed(2)}

                        </td>


                        <td>

                            <span
                                class="order-status ${statusClass}">

                                ${escapeHTML(
                                    status
                                )}

                            </span>

                        </td>


                        <td>

                            ${formatDate(
                                order.created_at
                            )}

                        </td>

                    </tr>

                `;

            }
        ).join("");

}


/* =====================================================
   STATUS CLASS
===================================================== */

function getStatusClass(
    status
) {

    switch (status) {

        case "Pending":

            return "status-pending";


        case "Confirmed":

            return "status-confirmed";


        case "Preparing":

            return "status-preparing";


        case "Ready":

            return "status-ready";


        case "Completed":

            return "status-completed";


        case "Cancelled":

            return "status-cancelled";


        default:

            return "";

    }

}


/* =====================================================
   FORMAT CURRENCY
===================================================== */

function formatCurrency(
    amount
) {

    return (

        "₹" +

        Number(
            amount || 0
        ).toFixed(2)

    );

}


/* =====================================================
   FORMAT DATE
===================================================== */

function formatDate(
    dateValue
) {

    if (!dateValue) {

        return "N/A";

    }


    const date =
        new Date(
            dateValue
        );


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
   LAST UPDATED
===================================================== */

function updateLastUpdated() {

    const element =
        document.getElementById(
            "lastUpdated"
        );


    if (!element) {

        return;

    }


    element.textContent =
        "Last updated: " +

        new Date().toLocaleTimeString(
            "en-IN",
            {

                hour: "2-digit",

                minute: "2-digit",

                second: "2-digit"

            }
        );

}


/* =====================================================
   SAFE TEXT
===================================================== */

function setText(
    elementId,
    value
) {

    const element =
        document.getElementById(
            elementId
        );


    if (element) {

        element.textContent =
            value;

    }

}


/* =====================================================
   ESCAPE HTML
===================================================== */

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


/* =====================================================
   BACK TO STAFF
===================================================== */

function goBackToStaff() {

    /*
     * If Management is opened inside an iframe,
     * navigate the parent page.
     */

    if (
        window.parent &&
        window.parent !== window
    ) {

        window.parent.location.href =
            "Staff.html";

    }

    else {

        window.location.href =
            "Staff.html";

    }

}