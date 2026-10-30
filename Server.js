// =====================================================
// ROYAL RESTAURANT - SERVER
// Node.js + Express + MySQL
// =====================================================

require("dotenv").config();

const express = require("express");

const mysql = require("mysql2");
const cors = require("cors");
const path = require("path");
const { ok } = require("assert");

const app = express();
const PORT = process.env.PORT || 3000;

// =====================================================
// MIDDLEWARE
// =====================================================

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve HTML, CSS, JS, images, etc.
app.use(express.static(__dirname));

// =====================================================
// MYSQL (connection pool)
// =====================================================

const db = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || "restaurant_db",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

db.getConnection((err, connection) => {

    if (err) {
        console.error("❌ MySQL connection failed:", err.message);
        return;
    }

    console.log("✅ MySQL connected successfully");
    connection.release();

});

// =====================================================
// HOME
// =====================================================

app.get("/", (req, res) => {

    res.sendFile(
        path.join(__dirname, "Restro.html")
    );

});

// =====================================================
// HEALTH CHECK
// =====================================================

app.get("/api/health", (req, res) => {

    res.json({
        success: true,
        message: "Royal Restaurant server is running."
    });

});

// =====================================================
// CUSTOMER REGISTRATION
// =====================================================

// =====================================================
// CUSTOMER REGISTRATION
// =====================================================

app.post("/register", (req, res) => {

    const {

        name,
        email,
        phone,
        dietary,
        cuisine,
        spice,
        comments,
        payment_id,
        payment_status

    } = req.body;


    // ---------------------------------------------
    // VALIDATION
    // ---------------------------------------------

    if (!name || !email || !phone) {

        return res.status(400).json({

            success: false,

            message:
                "Name, email and phone are required."

        });

    }


    // ---------------------------------------------
    // PAYMENT REFERENCE
    // ---------------------------------------------

    if (!payment_id) {

        return res.status(400).json({

            success: false,

            message:
                "Payment reference is required."

        });

    }


    // ---------------------------------------------
    // INSERT REGISTRATION
    // ---------------------------------------------

    const sql = `

        INSERT INTO registrations
        (
            name,
            email,
            phone,
            dietary,
            cuisine,
            spice,
            comments,
            payment_status,
            payment_id,
            registration_status
        )

        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)

    `;


    db.query(

        sql,

        [

            String(name).trim(),

            String(email).trim(),

            String(phone).trim(),

            dietary || "",

            cuisine || "",

            spice || "",

            comments || "",

            payment_status ||
                "PENDING_VERIFICATION",

            payment_id,

            "PENDING"

        ],

        (err, result) => {


            if (err) {

                console.error(
                    "❌ Registration error:",
                    err
                );


                return res.status(500).json({

                    success: false,

                    message:
                        "Failed to save registration."

                });

            }


            // -------------------------------------
            // GENERATE REGISTRATION ID
            // -------------------------------------

            const registrationId =

                "RR-" +
                new Date()
                    .getFullYear() +
                "-" +
                String(result.insertId)
                    .padStart(6, "0");


            // -------------------------------------
            // UPDATE REGISTRATION ID
            // -------------------------------------

            const updateSQL = `

                UPDATE registrations

                SET registration_id = ?

                WHERE id = ?

            `;


            db.query(

                updateSQL,

                [
                    registrationId,
                    result.insertId
                ],

                (updateErr) => {


                    if (updateErr) {

                        console.error(
                            "❌ Registration ID error:",
                            updateErr
                        );


                        return res.status(500).json({

                            success: false,

                            message:
                                "Registration created but ID generation failed."

                        });

                    }


                    // ---------------------------------
                    // RESPONSE
                    // ---------------------------------

                    res.json({

                        success: true,

                        message:
                            "Registration submitted successfully.",

                        registrationId:
                            registrationId,

                        paymentStatus:
                            payment_status ||
                            "PENDING_VERIFICATION"

                    });

                }

            );

        }

    );

});

// =====================================================
// GET REGISTRATIONS
// =====================================================

app.get("/registrations", (req, res) => {

    const sql = `
        SELECT
            id, name, email, phone, dietary, cuisine, spice, comments, created_at
        FROM registrations
        ORDER BY created_at DESC
    `;

    db.query(sql, (err, registrations) => {

        if (err) {

            console.error("❌ Registration fetch error:", err);

            return res.status(500).json({
                success: false,
                message: "Failed to fetch registrations."
            });

        }

        res.json({
            success: true,
            registrations
        });

    });

});

// =====================================================
// PLACE ORDER
// =====================================================

app.post("/orders", (req, res) => {

    const {
        customer_name,
        customer_phone,
        order_type,
        delivery_address,
        items
    } = req.body;

    if (!customer_name || !customer_phone) {

        return res.status(400).json({
            success: false,
            message: "Customer name and phone are required."
        });

    }

    const finalOrderType = order_type || "Online";

    if (
        finalOrderType.toLowerCase() === "delivery" &&
        !delivery_address
    ) {

        return res.status(400).json({
            success: false,
            message: "Delivery address is required."
        });

    }

    if (!Array.isArray(items) || items.length === 0) {

        return res.status(400).json({
            success: false,
            message: "Your order is empty."
        });

    }

    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {

        const name = String(item.name || "").trim();
        const quantity = Number(item.quantity);
        const price = Number(item.price);

        if (
            !name ||
            !Number.isFinite(quantity) ||
            quantity <= 0 ||
            !Number.isFinite(price) ||
            price < 0
        ) {

            return res.status(400).json({
                success: false,
                message: "Invalid item information."
            });

        }

        const itemTotal = Number((quantity * price).toFixed(2));

        subtotal += itemTotal;

        orderItems.push({ name, quantity, price, itemTotal });

    }

    subtotal = Number(subtotal.toFixed(2));
    const gst = Number((subtotal * 0.05).toFixed(2));
    const totalAmount = Number((subtotal + gst).toFixed(2));

    db.getConnection((connErr, connection) => {

        if (connErr) {

            console.error("❌ Connection error:", connErr);

            return res.status(500).json({
                success: false,
                message: "Could not connect to database."
            });

        }

        connection.beginTransaction((transactionError) => {

            if (transactionError) {

                connection.release();

                console.error("❌ Transaction error:", transactionError);

                return res.status(500).json({
                    success: false,
                    message: "Could not start transaction."
                });

            }

            const orderSQL = `
                INSERT INTO orders
                (
                    customer_name, customer_phone, order_type,
                    delivery_address, subtotal, gst, total_amount, status
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `;

            connection.query(
                orderSQL,
                [
                    String(customer_name).trim(),
                    String(customer_phone).trim(),
                    finalOrderType,
                    delivery_address || "",
                    subtotal,
                    gst,
                    totalAmount,
                    "Pending"
                ],
                (orderError, result) => {

                    if (orderError) {

                        return connection.rollback(() => {

                            connection.release();

                            console.error("❌ Order insert error:", orderError);

                            res.status(500).json({
                                success: false,
                                message: "Failed to save order."
                            });

                        });

                    }

                    const orderId = result.insertId;

                    const itemValues = orderItems.map(item => [
                        orderId, item.name, item.quantity, item.price, item.itemTotal
                    ]);

                    const itemSQL = `
                        INSERT INTO order_items
                        (order_id, item_name, quantity, price, item_total)
                        VALUES ?
                    `;

                    connection.query(
                        itemSQL,
                        [itemValues],
                        (itemError) => {

                            if (itemError) {

                                return connection.rollback(() => {

                                    connection.release();

                                    console.error("❌ Order items error:", itemError);

                                    res.status(500).json({
                                        success: false,
                                        message: "Failed to save order items."
                                    });

                                });

                            }

                            connection.commit((commitError) => {

                                if (commitError) {

                                    return connection.rollback(() => {

                                        connection.release();

                                        console.error("❌ Commit error:", commitError);

                                        res.status(500).json({
                                            success: false,
                                            message: "Failed to complete order."
                                        });

                                    });

                                }

                                connection.release();

                                console.log(`✅ Order #${orderId} created`);

                                res.json({
                                    success: true,
                                    message: "Order placed successfully.",
                                    orderId,
                                    subtotal,
                                    gst,
                                    total: totalAmount,
                                    status: "Pending"
                                });

                            });

                        }
                    );

                }
            );

        });

    });

});

// =====================================================
// GET ALL ORDERS
// =====================================================

app.get("/orders", (req, res) => {

    const orderSQL = `
        SELECT
            order_id, customer_name, customer_phone, order_type,
            delivery_address, subtotal, gst, total_amount, status,
            created_at, updated_at
        FROM orders
        ORDER BY created_at DESC
    `;

    db.query(orderSQL, (err, orders) => {

        if (err) {

            console.error("❌ Orders fetch error:", err);

            return res.status(500).json({
                success: false,
                message: "Failed to fetch orders."
            });

        }

        if (orders.length === 0) {

            return res.json({ success: true, orders: [] });

        }

        const orderIds = orders.map(order => order.order_id);

        const itemSQL = `
            SELECT item_id, order_id, item_name, quantity, price, item_total
            FROM order_items
            WHERE order_id IN (?)
            ORDER BY item_id ASC
        `;

        db.query(itemSQL, [orderIds], (itemErr, items) => {

            if (itemErr) {

                console.error("❌ Order items fetch error:", itemErr);

                return res.status(500).json({
                    success: false,
                    message: "Failed to fetch order items."
                });

            }

            const finalOrders = orders.map(order => ({
                ...order,
                items: items.filter(item => item.order_id === order.order_id)
            }));

            res.json({ success: true, orders: finalOrders });

        });

    });

});

// =====================================================
// GET SINGLE ORDER
// =====================================================

app.get("/orders/:id", (req, res) => {

    const orderId = Number(req.params.id);

    if (!Number.isInteger(orderId) || orderId <= 0) {

        return res.status(400).json({
            success: false,
            message: "Invalid order ID."
        });

    }

    const orderSQL = `
        SELECT
            order_id, customer_name, customer_phone, order_type,
            delivery_address, subtotal, gst, total_amount, status,
            created_at, updated_at
        FROM orders
        WHERE order_id = ?
    `;

    db.query(orderSQL, [orderId], (err, orders) => {

        if (err) {

            return res.status(500).json({
                success: false,
                message: "Failed to fetch order."
            });

        }

        if (orders.length === 0) {

            return res.status(404).json({
                success: false,
                message: "Order not found."
            });

        }

        const itemSQL = `
            SELECT item_id, order_id, item_name, quantity, price, item_total
            FROM order_items
            WHERE order_id = ?
            ORDER BY item_id ASC
        `;

        db.query(itemSQL, [orderId], (itemErr, items) => {

            if (itemErr) {

                return res.status(500).json({
                    success: false,
                    message: "Failed to fetch order items."
                });

            }

            res.json({
                success: true,
                order: { ...orders[0], items }
            });

        });

    });

});

// =====================================================
// UPDATE ORDER STATUS
// COMPLETED -> AUTO CREATE DELIVERY
// =====================================================

app.put("/orders/:id/status", (req, res) => {

    const orderId = Number(req.params.id);
    const { status } = req.body;

    const allowedStatuses = [
        "Pending", "Confirmed", "Preparing", "Ready", "Completed", "Cancelled"
    ];

    if (!Number.isInteger(orderId) || orderId <= 0) {

        return res.status(400).json({
            success: false,
            message: "Invalid order ID."
        });

    }

    if (!allowedStatuses.includes(status)) {

        return res.status(400).json({
            success: false,
            message: "Invalid order status."
        });

    }

    const getOrderSQL = `
        SELECT order_id, customer_name, customer_phone, delivery_address, status
        FROM orders
        WHERE order_id = ?
    `;

    db.query(getOrderSQL, [orderId], (err, orders) => {

        if (err) {

            console.error("❌ Order lookup error:", err);

            return res.status(500).json({
                success: false,
                message: "Failed to find order."
            });

        }

        if (orders.length === 0) {

            return res.status(404).json({
                success: false,
                message: "Order not found."
            });

        }

        const order = orders[0];

        if (status === "Completed" && !order.delivery_address) {

            return res.status(400).json({
                success: false,
                message: "Delivery address is missing."
            });

        }

        const updateSQL = `UPDATE orders SET status = ? WHERE order_id = ?`;

        db.query(updateSQL, [status, orderId], (updateErr, result) => {

            if (updateErr) {

                console.error("❌ Order status error:", updateErr);

                return res.status(500).json({
                    success: false,
                    message: "Failed to update order status."
                });

            }

            if (result.affectedRows === 0) {

                return res.status(404).json({
                    success: false,
                    message: "Order not found."
                });

            }

            if (status !== "Completed") {

                console.log(`📦 Order #${orderId} → ${status}`);

                return res.json({
                    success: true,
                    message: `Order #${orderId} is now ${status}.`,
                    orderId,
                    status
                });

            }

            const checkDeliverySQL = `
                SELECT delivery_id FROM deliveries WHERE order_id = ? LIMIT 1
            `;

            db.query(checkDeliverySQL, [orderId], (checkErr, existing) => {

                if (checkErr) {

                    console.error("❌ Delivery check error:", checkErr);

                    return res.status(500).json({
                        success: false,
                        message: "Failed to check delivery."
                    });

                }

                if (existing.length > 0) {

                    return res.json({
                        success: true,
                        message: `Order #${orderId} completed. Delivery already exists.`,
                        orderId,
                        status,
                        deliveryId: existing[0].delivery_id
                    });

                }

                const deliverySQL = `
                    INSERT INTO deliveries
                    (order_id, provider, pickup_address, delivery_address,
                     customer_name, customer_phone, status)
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                `;

                db.query(
                    deliverySQL,
                    [
                        orderId,
                        "Virtual Delivery",
                        "Royal Restaurant, Lucknow",
                        order.delivery_address,
                        order.customer_name,
                        order.customer_phone,
                        "Waiting for Delivery Partner"
                    ],
                    (deliveryErr, deliveryResult) => {

                        if (deliveryErr) {

                            console.error("❌ Delivery creation error:", deliveryErr);

                            return res.status(500).json({
                                success: false,
                                message: "Order completed but delivery creation failed.",
                                error: deliveryErr.message
                            });

                        }

                        console.log(`🚚 Delivery #${deliveryResult.insertId} created for Order #${orderId}`);

                        return res.json({
                            success: true,
                            message: `Order #${orderId} completed and sent to Delivery.`,
                            orderId,
                            status,
                            deliveryId: deliveryResult.insertId
                        });

                    }
                );

            });

        });

    });

});

// =====================================================
// MANUAL DELIVERY CREATION
// =====================================================

app.post("/delivery/create", (req, res) => {

    const { order_id, pickup_address, delivery_address } = req.body;

    const orderId = Number(order_id);

    if (!Number.isInteger(orderId) || orderId <= 0) {

        return res.status(400).json({
            success: false,
            message: "Valid order ID is required."
        });

    }

    const orderSQL = `
        SELECT order_id, customer_name, customer_phone, delivery_address, status
        FROM orders
        WHERE order_id = ?
    `;

    db.query(orderSQL, [orderId], (err, orders) => {

        if (err) {

            return res.status(500).json({
                success: false,
                message: "Failed to find order."
            });

        }

        if (orders.length === 0) {

            return res.status(404).json({
                success: false,
                message: "Order not found."
            });

        }

        const order = orders[0];

        const finalPickup = pickup_address || "Royal Restaurant, Lucknow";
        const finalDelivery = delivery_address || order.delivery_address;

        if (!finalDelivery) {

            return res.status(400).json({
                success: false,
                message: "Delivery address is required."
            });

        }

        const checkSQL = `SELECT delivery_id FROM deliveries WHERE order_id = ? LIMIT 1`;

        db.query(checkSQL, [orderId], (checkErr, existing) => {

            if (checkErr) {

                return res.status(500).json({
                    success: false,
                    message: "Failed to check delivery."
                });

            }

            if (existing.length > 0) {

                return res.json({
                    success: true,
                    message: "Delivery already exists.",
                    deliveryId: existing[0].delivery_id
                });

            }

            const insertSQL = `
                INSERT INTO deliveries
                (order_id, provider, pickup_address, delivery_address,
                 customer_name, customer_phone, status)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `;

            db.query(
                insertSQL,
                [
                    orderId,
                    "Virtual Delivery",
                    finalPickup,
                    finalDelivery,
                    order.customer_name,
                    order.customer_phone,
                    "Waiting for Delivery Partner"
                ],
                (insertErr, result) => {

                    if (insertErr) {

                        console.error("❌ Delivery creation error:", insertErr);

                        return res.status(500).json({
                            success: false,
                            message: "Failed to create delivery."
                        });

                    }

                    res.json({
                        success: true,
                        message: "Delivery created successfully.",
                        deliveryId: result.insertId,
                        orderId
                    });

                }
            );

        });

    });

});

// =====================================================
// GET ALL DELIVERIES
// =====================================================

app.get("/deliveries", (req, res) => {

    const sql = `
        SELECT
            d.delivery_id, d.order_id, d.partner_id, d.provider, d.provider_order_id,
            d.pickup_address, d.delivery_address, d.customer_name, d.customer_phone,
            d.status, d.tracking_url, d.estimated_pickup_time, d.estimated_delivery_time,
            d.assigned_at, d.picked_up_at, d.delivered_at, d.created_at, d.updated_at,
            p.name AS partner_name, p.phone AS partner_phone,
            p.vehicle_type, p.vehicle_number
        FROM deliveries d
        LEFT JOIN delivery_partners p ON d.partner_id = p.partner_id
        ORDER BY d.created_at DESC
    `;

    db.query(sql, (err, deliveries) => {

        if (err) {

            console.error("❌ Deliveries fetch error:", err);

            return res.status(500).json({
                success: false,
                message: "Failed to fetch deliveries."
            });

        }

        res.json({ success: true, deliveries });

    });

});

// =====================================================
// AVAILABLE DELIVERY PARTNERS
// (must come BEFORE /delivery/:deliveryId — fixed path first)
// =====================================================

app.get("/delivery/available-partners", (req, res) => {

    const sql = `
        SELECT
            partner_id, name, phone, vehicle_type, vehicle_number,
            status, current_latitude, current_longitude
        FROM delivery_partners
        WHERE status = 'Available'
        ORDER BY partner_id ASC
    `;

    db.query(sql, (err, partners) => {

        if (err) {

            console.error("❌ Error fetching available partners:", err);

            return res.status(500).json({
                success: false,
                message: "Failed to fetch available delivery partners.",
                error: err.message
            });

        }

        res.json({ success: true, partners });

    });

});

// =====================================================
// GET SINGLE DELIVERY
// =====================================================

app.get("/delivery/:deliveryId", (req, res) => {

    const deliveryId = Number(req.params.deliveryId);

    if (!Number.isInteger(deliveryId) || deliveryId <= 0) {

        return res.status(400).json({
            success: false,
            message: "Invalid delivery ID."
        });

    }

    const sql = `
        SELECT
            d.*,
            p.name AS partner_name, p.phone AS partner_phone,
            p.vehicle_type, p.vehicle_number,
            p.current_latitude, p.current_longitude
        FROM deliveries d
        LEFT JOIN delivery_partners p ON d.partner_id = p.partner_id
        WHERE d.delivery_id = ?
    `;

    db.query(sql, [deliveryId], (err, deliveries) => {

        if (err) {

            return res.status(500).json({
                success: false,
                message: "Failed to fetch delivery."
            });

        }

        if (deliveries.length === 0) {

            return res.status(404).json({
                success: false,
                message: "Delivery not found."
            });

        }

        res.json({ success: true, delivery: deliveries[0] });

    });

});

// =====================================================
// ASSIGN DELIVERY PARTNER
// =====================================================

app.put("/delivery/:deliveryId/assign", (req, res) => {

    const deliveryId = Number(req.params.deliveryId);
    const partnerId = Number(req.body.partner_id);

    if (!Number.isInteger(deliveryId) || deliveryId <= 0) {

        return res.status(400).json({
            success: false,
            message: "Invalid delivery ID."
        });

    }

    if (!Number.isInteger(partnerId) || partnerId <= 0) {

        return res.status(400).json({
            success: false,
            message: "Valid partner ID is required."
        });

    }

    const deliverySQL = `
        SELECT delivery_id, order_id, partner_id, status
        FROM deliveries
        WHERE delivery_id = ?
    `;

    db.query(deliverySQL, [deliveryId], (deliveryErr, deliveries) => {

        if (deliveryErr) {

            console.error("❌ Error checking delivery:", deliveryErr);

            return res.status(500).json({
                success: false,
                message: "Failed to check delivery.",
                error: deliveryErr.message
            });

        }

        if (deliveries.length === 0) {

            return res.status(404).json({
                success: false,
                message: "Delivery not found."
            });

        }

        const delivery = deliveries[0];

        if (delivery.status !== "Waiting for Delivery Partner") {

            return res.status(400).json({
                success: false,
                message: `Delivery cannot be assigned because its current status is "${delivery.status}".`
            });

        }

        if (delivery.partner_id) {

            return res.status(400).json({
                success: false,
                message: "A delivery partner is already assigned."
            });

        }

        const partnerSQL = `
            SELECT partner_id, name, phone, vehicle_type, vehicle_number, status
            FROM delivery_partners
            WHERE partner_id = ?
        `;

        db.query(partnerSQL, [partnerId], (partnerErr, partners) => {

            if (partnerErr) {

                console.error("❌ Error checking partner:", partnerErr);

                return res.status(500).json({
                    success: false,
                    message: "Failed to check delivery partner.",
                    error: partnerErr.message
                });

            }

            if (partners.length === 0) {

                return res.status(404).json({
                    success: false,
                    message: "Delivery partner not found."
                });

            }

            const partner = partners[0];

            if (partner.status !== "Available") {

                return res.status(400).json({
                    success: false,
                    message: "This delivery partner is not available."
                });

            }

            const updateDeliverySQL = `
                UPDATE deliveries
                SET partner_id = ?, status = 'Rider Assigned', assigned_at = NOW()
                WHERE delivery_id = ?
            `;

            db.query(
                updateDeliverySQL,
                [partnerId, deliveryId],
                (updateErr, updateResult) => {

                    if (updateErr) {

                        console.error("❌ Error assigning delivery partner:", updateErr);

                        return res.status(500).json({
                            success: false,
                            message: "Failed to assign delivery partner.",
                            error: updateErr.message
                        });

                    }

                    if (updateResult.affectedRows === 0) {

                        return res.status(400).json({
                            success: false,
                            message: "Delivery was not updated."
                        });

                    }

                    const updatePartnerSQL = `
                        UPDATE delivery_partners SET status = 'Busy' WHERE partner_id = ?
                    `;

                    db.query(updatePartnerSQL, [partnerId], (partnerUpdateErr) => {

                        if (partnerUpdateErr) {

                            console.error("❌ Error updating partner status:", partnerUpdateErr);

                            return res.status(500).json({
                                success: false,
                                message: "Delivery assigned, but partner status could not be updated.",
                                error: partnerUpdateErr.message
                            });

                        }

                        res.json({
                            success: true,
                            message: "Delivery partner assigned successfully.",
                            delivery_id: deliveryId,
                            partner_id: partnerId,
                            status: "Rider Assigned",
                            partner: {
                                partner_id: partner.partner_id,
                                name: partner.name,
                                phone: partner.phone,
                                vehicle_type: partner.vehicle_type,
                                vehicle_number: partner.vehicle_number
                            }
                        });

                    });

                }
            );

        });

    });

});

// =====================================================
// UPDATE DELIVERY STATUS
// =====================================================

app.put("/delivery/:deliveryId/status", (req, res) => {

    const deliveryId = Number(req.params.deliveryId);
    const { status } = req.body;

    const allowedStatuses = [
        "Waiting for Delivery Partner", "Finding Delivery Partner",
        "Rider Assigned", "Rider Accepted", "Picked Up",
        "On The Way", "Delivered", "Cancelled"
    ];

    if (!Number.isInteger(deliveryId) || deliveryId <= 0) {

        return res.status(400).json({
            success: false,
            message: "Invalid delivery ID."
        });

    }

    if (!allowedStatuses.includes(status)) {

        return res.status(400).json({
            success: false,
            message: "Invalid delivery status."
        });

    }

    const getDeliverySQL = `
        SELECT delivery_id, order_id, partner_id, status
        FROM deliveries
        WHERE delivery_id = ?
    `;

    db.query(getDeliverySQL, [deliveryId], (findErr, deliveries) => {

        if (findErr) {

            return res.status(500).json({
                success: false,
                message: "Failed to find delivery."
            });

        }

        if (deliveries.length === 0) {

            return res.status(404).json({
                success: false,
                message: "Delivery not found."
            });

        }

        const delivery = deliveries[0];

        let sql = `UPDATE deliveries SET status = ?`;
        const values = [status];

        if (status === "Picked Up") {
            sql += ", picked_up_at = NOW()";
        }

        if (status === "Delivered") {
            sql += ", delivered_at = NOW()";
        }

        sql += ` WHERE delivery_id = ?`;
        values.push(deliveryId);

        db.query(sql, values, (err, result) => {

            if (err) {

                console.error("❌ Delivery status error:", err);

                return res.status(500).json({
                    success: false,
                    message: "Failed to update delivery status."
                });

            }

            if (
                (status === "Delivered" || status === "Cancelled") &&
                delivery.partner_id
            ) {

                db.query(
                    `UPDATE delivery_partners SET status = 'Available' WHERE partner_id = ?`,
                    [delivery.partner_id],
                    (partnerErr) => {

                        if (partnerErr) {
                            console.error("⚠️ Partner release error:", partnerErr);
                        }

                    }
                );

            }

            console.log(`🚚 Delivery #${deliveryId} → ${status}`);

            res.json({
                success: true,
                message: "Delivery status updated successfully.",
                deliveryId,
                orderId: delivery.order_id,
                status
            });

        });

    });

});

// =====================================================
// UPDATE TRACKING URL
// =====================================================

app.put("/delivery/:deliveryId/tracking", (req, res) => {

    const deliveryId = Number(req.params.deliveryId);
    const tracking_url = req.body.tracking_url || null;

    if (!Number.isInteger(deliveryId) || deliveryId <= 0) {

        return res.status(400).json({
            success: false,
            message: "Invalid delivery ID."
        });

    }

    const sql = `UPDATE deliveries SET tracking_url = ? WHERE delivery_id = ?`;

    db.query(sql, [tracking_url, deliveryId], (err, result) => {

        if (err) {

            console.error("❌ Tracking update error:", err);

            return res.status(500).json({
                success: false,
                message: "Failed to update tracking URL."
            });

        }

        if (result.affectedRows === 0) {

            return res.status(404).json({
                success: false,
                message: "Delivery not found."
            });

        }

        res.json({
            success: true,
            message: "Tracking information updated successfully."
        });

    });

});

// =====================================================
// ERROR HANDLER
// =====================================================

app.use((err, req, res, next) => {

    console.error("❌ Server error:", err);

    res.status(500).json({
        success: false,
        message: "Internal server error."
    });

});

// =====================================================
// START SERVER
// =====================================================

app.listen(PORT, () => {

    console.log("==============================================");
    console.log("🍽️  ROYAL RESTAURANT SERVER");
    console.log("==============================================");
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log("🗄️  Database: restaurant_db");
    console.log("==============================================");

});
