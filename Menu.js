/* =========================================================
   ROYAL RESTAURANT - MENU SYSTEM
========================================================= */


/* =========================================================
   MENU ITEMS
========================================================= */

const menuItems = [

    /* ================= STARTERS ================= */

    ["Paneer Tikka", 289, "veg", "Starters"],
    ["Chicken Tikka", 329, "nonveg", "Starters"],
    ["Vegetable Spring Rolls", 199, "veg", "Starters"],
    ["French Fries", 149, "veg", "Starters"],
    ["Cheese Garlic Bread", 179, "veg", "Starters"],
    ["Chilli Paneer", 259, "veg", "Starters"],
    ["Crispy Corn", 219, "veg", "Starters"],
    ["Hara Bhara Kabab", 229, "veg", "Starters"],
    ["Veg Seekh Kabab", 239, "veg", "Starters"],
    ["Tandoori Mushroom", 249, "veg", "Starters"],
    ["Honey Chilli Potato", 229, "veg", "Starters"],
    ["Crispy Veg Fingers", 219, "veg", "Starters"],
    ["Cheese Nachos", 249, "veg", "Starters"],
    ["Paneer 65", 269, "veg", "Starters"],
    ["Chicken Wings", 299, "nonveg", "Starters"],
    ["Chicken Seekh Kabab", 319, "nonveg", "Starters"],
    ["Chicken Malai Tikka", 349, "nonveg", "Starters"],
    ["Fish Fingers", 369, "nonveg", "Starters"],
    ["Tandoori Chicken", 379, "nonveg", "Starters"],
    ["Chicken Lollipop", 359, "nonveg", "Starters"],


    /* ================= MAIN COURSE ================= */

    ["Chicken Biryani", 329, "nonveg", "Main Course"],
    ["Mutton Biryani", 399, "nonveg", "Main Course"],
    ["Veg Biryani", 279, "veg", "Main Course"],
    ["Paneer Butter Masala", 299, "veg", "Main Course"],
    ["Butter Chicken", 349, "nonveg", "Main Course"],
    ["Chicken Curry", 329, "nonveg", "Main Course"],
    ["Kadai Chicken", 339, "nonveg", "Main Course"],
    ["Chicken Tikka Masala", 359, "nonveg", "Main Course"],
    ["Chicken Handi", 369, "nonveg", "Main Course"],
    ["Mutton Rogan Josh", 399, "nonveg", "Main Course"],
    ["Dal Makhani", 249, "veg", "Main Course"],
    ["Dal Tadka", 219, "veg", "Main Course"],
    ["Shahi Paneer", 299, "veg", "Main Course"],
    ["Kadai Paneer", 289, "veg", "Main Course"],
    ["Palak Paneer", 289, "veg", "Main Course"],
    ["Mix Veg Curry", 249, "veg", "Main Course"],
    ["Chole Masala", 229, "veg", "Main Course"],
    ["Rajma Masala", 229, "veg", "Main Course"],
    ["Veg Kofta Curry", 279, "veg", "Main Course"],
    ["Malai Kofta", 299, "veg", "Main Course"],


    /* ================= PIZZA ================= */

    ["Classic Margherita Pizza", 299, "veg", "Pizza"],
    ["Cheese Pizza", 319, "veg", "Pizza"],
    ["Tomato Basil Pizza", 329, "veg", "Pizza"],
    ["Sweet Corn Pizza", 329, "veg", "Pizza"],
    ["Veggie Delight Pizza", 349, "veg", "Pizza"],
    ["Farmhouse Pizza", 349, "veg", "Pizza"],
    ["Paneer Tikka Pizza", 379, "veg", "Pizza"],
    ["Achari Paneer Pizza", 379, "veg", "Pizza"],
    ["Capsicum & Onion Pizza", 339, "veg", "Pizza"],
    ["Mushroom Pizza", 359, "veg", "Pizza"],
    ["Jalapeno Cheese Pizza", 369, "veg", "Pizza"],
    ["Double Cheese Pizza", 379, "veg", "Pizza"],
    ["Mexican Veg Pizza", 369, "veg", "Pizza"],
    ["Peri Peri Paneer Pizza", 389, "veg", "Pizza"],
    ["Chicken Tikka Pizza", 399, "nonveg", "Pizza"],
    ["BBQ Chicken Pizza", 409, "nonveg", "Pizza"],
    ["Chicken Pepperoni Pizza", 429, "nonveg", "Pizza"],
    ["Chicken Cheese Burst Pizza", 449, "nonveg", "Pizza"],
    ["Spicy Chicken Pizza", 419, "nonveg", "Pizza"],
    ["Ultimate Loaded Pizza", 469, "nonveg", "Pizza"],


    /* ================= BURGERS ================= */

    ["Classic Veg Burger", 179, "veg", "Burgers"],
    ["Classic Chicken Burger", 249, "nonveg", "Burgers"],
    ["Cheese Burger", 219, "veg", "Burgers"],
    ["Double Cheese Burger", 279, "veg", "Burgers"],
    ["Crispy Chicken Burger", 269, "nonveg", "Burgers"],
    ["Spicy Chicken Burger", 279, "nonveg", "Burgers"],
    ["Paneer Burger", 229, "veg", "Burgers"],
    ["Paneer Tikka Burger", 249, "veg", "Burgers"],
    ["Peri Peri Chicken Burger", 289, "nonveg", "Burgers"],
    ["BBQ Chicken Burger", 299, "nonveg", "Burgers"],
    ["Mushroom Swiss Burger", 249, "veg", "Burgers"],
    ["Mexican Veg Burger", 239, "veg", "Burgers"],
    ["Jalapeno Cheese Burger", 259, "veg", "Burgers"],
    ["Double Chicken Burger", 329, "nonveg", "Burgers"],
    ["Chicken Tandoori Burger", 299, "nonveg", "Burgers"],
    ["Chicken Maharaja Burger", 349, "nonveg", "Burgers"],
    ["Loaded Veg Burger", 279, "veg", "Burgers"],
    ["Loaded Chicken Burger", 339, "nonveg", "Burgers"],
    ["Cheese Burst Burger", 319, "veg", "Burgers"],
    ["Ultimate Monster Burger", 399, "nonveg", "Burgers"],


    /* ================= CHINESE ================= */

    ["Veg Hakka Noodles", 219, "veg", "Chinese"],
    ["Chicken Hakka Noodles", 269, "nonveg", "Chinese"],
    ["Veg Fried Rice", 219, "veg", "Chinese"],
    ["Chicken Fried Rice", 269, "nonveg", "Chinese"],
    ["Schezwan Fried Rice", 249, "veg", "Chinese"],
    ["Schezwan Chicken Rice", 289, "nonveg", "Chinese"],
    ["Veg Manchurian", 229, "veg", "Chinese"],
    ["Chicken Manchurian", 279, "nonveg", "Chinese"],
    ["Chilli Paneer", 259, "veg", "Chinese"],
    ["Chilli Chicken", 289, "nonveg", "Chinese"],
    ["Honey Chilli Potato", 229, "veg", "Chinese"],
    ["Chilli Garlic Noodles", 249, "veg", "Chinese"],
    ["Singapore Noodles", 259, "veg", "Chinese"],
    ["Chicken Chowmein", 279, "nonveg", "Chinese"],
    ["Veg Chowmein", 219, "veg", "Chinese"],
    ["Spring Rolls", 199, "veg", "Chinese"],
    ["Chicken Spring Rolls", 269, "nonveg", "Chinese"],
    ["Veg Momos", 199, "veg", "Chinese"],
    ["Chicken Momos", 249, "nonveg", "Chinese"],
    ["Schezwan Momos", 269, "veg", "Chinese"],


    /* ================= DESSERTS ================= */

    ["Chocolate Brownie", 159, "veg", "Desserts"],
    ["Chocolate Lava Cake", 199, "veg", "Desserts"],
    ["Vanilla Ice Cream", 129, "veg", "Desserts"],
    ["Chocolate Ice Cream", 139, "veg", "Desserts"],
    ["Strawberry Ice Cream", 139, "veg", "Desserts"],
    ["Butterscotch Ice Cream", 149, "veg", "Desserts"],
    ["Mango Ice Cream", 149, "veg", "Desserts"],
    ["Gulab Jamun", 129, "veg", "Desserts"],
    ["Rasmalai", 159, "veg", "Desserts"],
    ["Gajar Ka Halwa", 149, "veg", "Desserts"],
    ["Kulfi", 139, "veg", "Desserts"],
    ["Kesar Pista Kulfi", 169, "veg", "Desserts"],
    ["Chocolate Sundae", 199, "veg", "Desserts"],
    ["Fruit Sundae", 189, "veg", "Desserts"],
    ["Brownie Sundae", 229, "veg", "Desserts"],
    ["Cheesecake", 249, "veg", "Desserts"],
    ["Red Velvet Cake", 259, "veg", "Desserts"],
    ["Chocolate Truffle Cake", 269, "veg", "Desserts"],
    ["Fresh Fruit Cream", 179, "veg", "Desserts"],
    ["Caramel Custard", 159, "veg", "Desserts"],


    /* ================= DRINKS ================= */

    ["Fresh Lime Soda", 99, "veg", "Drinks"],
    ["Sweet Lime Soda", 109, "veg", "Drinks"],
    ["Virgin Mojito", 149, "veg", "Drinks"],
    ["Blue Lagoon", 159, "veg", "Drinks"],
    ["Mint Mojito", 149, "veg", "Drinks"],
    ["Strawberry Mojito", 169, "veg", "Drinks"],
    ["Watermelon Cooler", 159, "veg", "Drinks"],
    ["Mango Shake", 169, "veg", "Drinks"],
    ["Chocolate Shake", 189, "veg", "Drinks"],
    ["Vanilla Shake", 179, "veg", "Drinks"],
    ["Strawberry Shake", 179, "veg", "Drinks"],
    ["Oreo Shake", 199, "veg", "Drinks"],
    ["Cold Coffee", 169, "veg", "Drinks"],
    ["Hazelnut Cold Coffee", 199, "veg", "Drinks"],
    ["Iced Tea", 129, "veg", "Drinks"],
    ["Peach Iced Tea", 149, "veg", "Drinks"],
    ["Fresh Orange Juice", 139, "veg", "Drinks"],
    ["Watermelon Juice", 129, "veg", "Drinks"],
    ["Pineapple Juice", 139, "veg", "Drinks"],
    ["Mixed Fruit Mocktail", 179, "veg", "Drinks"]

];


/* =========================================================
   VARIABLES
========================================================= */

let cart = [];

let currentCategory = "Starters";


/* =========================================================
   CATEGORY EMOJIS
========================================================= */

const categoryEmoji = {

    "Starters": "🥗",

    "Main Course": "🍛",

    "Pizza": "🍕",

    "Burgers": "🍔",

    "Chinese": "🥡",

    "Desserts": "🍰",

    "Drinks": "🥤"

};


/* =========================================================
   OPEN CATEGORY POPUP
========================================================= */

function openCategory(category) {

    currentCategory = category;

    document.getElementById("modalCategoryTitle").textContent =
        category;

    document.getElementById("menuSearch").value = "";

    document
        .getElementById("categoryModal")
        .classList.add("show");

    renderFoods(category);

}


/* =========================================================
   CLOSE CATEGORY
========================================================= */

function closeCategory() {

    document
        .getElementById("categoryModal")
        .classList.remove("show");

}


/* =========================================================
   RENDER FOODS
========================================================= */

function renderFoods(category, searchText = "") {

    const foodGrid =
        document.getElementById("foodGrid");

    foodGrid.innerHTML = "";

    let foods = menuItems.filter(item =>
        item[3] === category
    );


    /* SEARCH */

    if (searchText.trim() !== "") {

        foods = foods.filter(item =>
            item[0]
                .toLowerCase()
                .includes(searchText.toLowerCase())
        );

    }


    /* NO RESULT */

    if (foods.length === 0) {

        foodGrid.innerHTML = `

            <div style="
                grid-column:1/-1;
                text-align:center;
                padding:50px;
            ">

                <h3>No dish found 😔</h3>

                <p>Try another search.</p>

            </div>

        `;

        return;

    }


    /* CREATE FOOD CARDS */

    foods.forEach((item) => {

        const name = item[0];

        const price = item[1];

        const type = item[2];

        const categoryName = item[3];

        const emoji =
            categoryEmoji[categoryName] || "🍽️";


        const card =
            document.createElement("div");

        card.className = "food-card";


        card.innerHTML = `

            <div class="food-image">
                ${emoji}
            </div>

            <div class="food-content">

                <h3>
                    ${name}
                </h3>

                <p class="food-description">

                    ${
                        type === "veg"
                            ? "🌱 Vegetarian delicious preparation"
                            : "🍗 Non-vegetarian special preparation"
                    }

                </p>

                <div class="food-bottom">

                    <span class="food-price">
                        ₹${price}
                    </span>

                    <button
                        class="add-btn"
                        onclick="addToCart(
                            '${name.replace(/'/g, "\\'")}',
                            ${price},
                            '${categoryName}'
                        )">

                        + Add

                    </button>

                </div>

            </div>

        `;


        foodGrid.appendChild(card);

    });

}


/* =========================================================
   SEARCH
========================================================= */

function searchMenu() {

    const searchText =
        document.getElementById("menuSearch").value;

    renderFoods(
        currentCategory,
        searchText
    );

}


/* =========================================================
   ADD TO CART
========================================================= */

function addToCart(name, price, category) {

    const existingItem =
        cart.find(item =>
            item.name === name
        );


    if (existingItem) {

        existingItem.quantity++;

    } else {

        cart.push({

            name: name,

            price: price,

            category: category,

            quantity: 1

        });

    }


    updateCart();


    /* Small feedback */

    alert(
        `${name} added to your order!`
    );

}


/* =========================================================
   UPDATE CART
========================================================= */

function updateCart() {

    const container =
        document.getElementById("selectedItems");

    container.innerHTML = "";


    /* EMPTY */

    if (cart.length === 0) {

        container.innerHTML = `

            <div class="empty-order">

                <div>🛒</div>

                <h3>Your order is empty</h3>

                <p>
                    Add delicious dishes from the menu.
                </p>

            </div>

        `;

    }


    /* ITEMS */

    cart.forEach((item, index) => {

        const orderItem =
            document.createElement("div");

        orderItem.className =
            "order-item";


        orderItem.innerHTML = `

            <div class="order-item-info">

                <h4>
                    ${item.name}
                </h4>

                <span>
                    ₹${item.price}
                </span>

            </div>


            <div class="quantity-box">

                <button
                    onclick="changeQuantity(${index}, -1)">
                    −
                </button>

                <span>
                    ${item.quantity}
                </span>

                <button
                    onclick="changeQuantity(${index}, 1)">
                    +
                </button>

            </div>


            <button
                class="remove-btn"
                onclick="removeFromCart(${index})">

                🗑

            </button>

        `;


        container.appendChild(orderItem);

    });


    calculateBill();

}


/* =========================================================
   CHANGE QUANTITY
========================================================= */

function changeQuantity(index, change) {

    cart[index].quantity += change;


    if (cart[index].quantity <= 0) {

        cart.splice(index, 1);

    }


    updateCart();

}


/* =========================================================
   REMOVE ITEM
========================================================= */

function removeFromCart(index) {

    cart.splice(index, 1);

    updateCart();

}


/* =========================================================
   CALCULATE BILL
========================================================= */

function calculateBill() {

    let subtotal = 0;

    let itemCount = 0;


    cart.forEach(item => {

        subtotal +=
            item.price * item.quantity;

        itemCount +=
            item.quantity;

    });


    const gst =
        subtotal * 0.05;

    const total =
        subtotal + gst;


    document.getElementById("subtotal")
        .textContent =
        subtotal.toFixed(2);


    document.getElementById("gst")
        .textContent =
        gst.toFixed(2);


    document.getElementById("total")
        .textContent =
        total.toFixed(2);


    const topCartCount =
        document.getElementById("topCartCount");

    if (topCartCount) {

        topCartCount.textContent =
            itemCount;

    }

}


/* =========================================================
   OPEN ORDER PANEL
========================================================= */

function openOrderPanel() {

    updateCart();

    document
        .getElementById("orderModal")
        .classList.add("show");

}


/* =========================================================
   CLOSE ORDER PANEL
========================================================= */

function closeOrderPanel() {

    document
        .getElementById("orderModal")
        .classList.remove("show");

}


/* =========================================================
   PLACE ORDER
   CONNECTED TO MYSQL
========================================================= */
/* =========================================================
   PLACE ORDER
   CONNECTED TO MYSQL + DELIVERY ADDRESS
========================================================= */

async function placeOrder() {

    /* ---------------------------------------------
       CHECK CART
    --------------------------------------------- */

    if (cart.length === 0) {

        alert("Please add at least one item to your order.");

        return;
    }


    /* ---------------------------------------------
       CUSTOMER NAME
    --------------------------------------------- */

    const customerName = prompt("Enter your name:");

    if (!customerName || customerName.trim() === "") {

        alert("Please enter your name.");

        return;
    }


    /* ---------------------------------------------
       CUSTOMER PHONE
    --------------------------------------------- */

    const customerPhone = prompt("Enter your phone number:");

    if (!customerPhone || customerPhone.trim() === "") {

        alert("Please enter your phone number.");

        return;
    }


    /* ---------------------------------------------
       DELIVERY ADDRESS
    --------------------------------------------- */

    const house = document.getElementById("house")?.value.trim();
    const area = document.getElementById("area")?.value.trim();
    const city = document.getElementById("city")?.value.trim();
    const state = document.getElementById("state")?.value.trim();
    const pincode = document.getElementById("pincode")?.value.trim();
    const landmark = document.getElementById("landmark")?.value.trim();


    /* ---------------------------------------------
       VALIDATE ADDRESS
    --------------------------------------------- */

    if (!house || !area || !city || !state || !pincode) {

        alert(
            "📍 Please complete your delivery address."
        );

        return;
    }


    /* ---------------------------------------------
       VALIDATE PINCODE
    --------------------------------------------- */

    if (!/^\d{6}$/.test(pincode)) {

        alert(
            "Please enter a valid 6-digit pincode."
        );

        return;
    }


    /* ---------------------------------------------
       CREATE COMPLETE ADDRESS
    --------------------------------------------- */

    let deliveryAddress =
        `${house}, ${area}, ${city}, ${state} - ${pincode}`;


    if (landmark) {

        deliveryAddress +=
            `, Landmark: ${landmark}`;

    }


    /* ---------------------------------------------
       PREPARE ORDER ITEMS
    --------------------------------------------- */

    const orderItems = cart.map(item => ({

        name: item.name,

        quantity: item.quantity,

        price: item.price

    }));


    /* ---------------------------------------------
       SEND ORDER TO SERVER
    --------------------------------------------- */

    try {

        const response = await fetch(
            "http://localhost:3000/orders",
            {

                method: "POST",

                headers: {

                    "Content-Type": "application/json"

                },

                body: JSON.stringify({

                    customer_name:
                        customerName.trim(),

                    customer_phone:
                        customerPhone.trim(),

                    order_type:
                        "Online Delivery",

                    delivery_address:
                        deliveryAddress,

                    items:
                        orderItems

                })

            }
        );


        /* -----------------------------------------
           SERVER RESPONSE
        ----------------------------------------- */

        const data =
            await response.json();


        /* -----------------------------------------
           SERVER ERROR
        ----------------------------------------- */

        if (
            !response.ok ||
            !data.success
        ) {

            alert(

                "❌ ORDER FAILED!\n\n" +

                (
                    data.message ||
                    "Something went wrong."
                )

            );

            console.error(
                "Order failed:",
                data
            );

            return;

        }


        /* -----------------------------------------
           ORDER SUCCESS
        ----------------------------------------- */

        alert(

            "✅ ORDER PLACED SUCCESSFULLY!\n\n" +

            "Order ID: #" +
            data.orderId +

            "\n\n" +

            "📍 Delivery Address:\n" +
            deliveryAddress +

            "\n\n" +

            "Subtotal: ₹" +
            Number(data.subtotal).toFixed(2) +

            "\n" +

            "GST: ₹" +
            Number(data.gst).toFixed(2) +

            "\n" +

            "Total: ₹" +
            Number(data.total).toFixed(2) +

            "\n\n" +

            "Your order has been sent to the restaurant."

        );


        /* -----------------------------------------
           CLEAR CART
        ----------------------------------------- */

        cart = [];

        updateCart();


        /* -----------------------------------------
           CLEAR ADDRESS FIELDS
        ----------------------------------------- */

        if (document.getElementById("house"))
            document.getElementById("house").value = "";

        if (document.getElementById("area"))
            document.getElementById("area").value = "";

        if (document.getElementById("city"))
            document.getElementById("city").value = "";

        if (document.getElementById("state"))
            document.getElementById("state").value = "";

        if (document.getElementById("pincode"))
            document.getElementById("pincode").value = "";

        if (document.getElementById("landmark"))
            document.getElementById("landmark").value = "";


        /* -----------------------------------------
           CLOSE ORDER POPUP
        ----------------------------------------- */

        closeOrderPanel();


    } catch (error) {

        console.error(
            "Order Error:",
            error
        );


        alert(

            "❌ SERVER ERROR!\n\n" +

            "Please make sure server.js is running."

        );

    }

}
/*=======================================================
   SCROLL TO CATEGORY
========================================================= */

function scrollToCategories() {

    document
        .getElementById("categories")
        .scrollIntoView({

            behavior: "smooth"

        });

}


/* =========================================================
   CLOSE POPUPS WHEN CLICKING OUTSIDE
========================================================= */

document.addEventListener(
    "click",
    function(event) {

        const categoryModal =
            document.getElementById(
                "categoryModal"
            );

        const orderModal =
            document.getElementById(
                "orderModal"
            );


        if (
            event.target ===
            categoryModal
        ) {

            closeCategory();

        }


        if (
            event.target ===
            orderModal
        ) {

            closeOrderPanel();

        }

    }
);


/* =========================================================
   INITIAL CART
========================================================= */

updateCart();