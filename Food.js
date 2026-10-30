// =====================================================
// ROYAL RESTAURANT
// FOOD INVENTORY
// =====================================================

let foodItems = [];


// =====================================================
// PAGE LOAD
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadFood();

    }
);


// =====================================================
// LOAD DATA FROM MYSQL
// =====================================================

async function loadFood() {

    try {

        const response =
            await fetch("/api/food");


        const data =
            await response.json();


        if (
            !response.ok ||
            !data.success
        ) {

            throw new Error(
                data.message ||
                "Failed to load food."
            );

        }


        foodItems =
            data.food || [];


        renderTable();

        updateStatistics();

    }

    catch (error) {

        console.error(
            "Food loading error:",
            error
        );


        showMessage(
            "❌ Could not load food data.",
            "error"
        );

    }

}


// =====================================================
// RENDER TABLE
// =====================================================

function renderTable() {

    const table =
        document.getElementById(
            "foodTable"
        );


    const empty =
        document.getElementById(
            "emptyMessage"
        );


    table.innerHTML = "";


    if (
        foodItems.length === 0
    ) {

        empty.style.display =
            "block";

        return;

    }


    empty.style.display =
        "none";


    foodItems.forEach(
        function (food) {

            createFoodRow(
                food,
                false
            );

        }
    );

}


// =====================================================
// CREATE FOOD ROW
// =====================================================

function createFoodRow(
    food,
    isNew
) {

    const table =
        document.getElementById(
            "foodTable"
        );


    const row =
        document.createElement(
            "tr"
        );


    if (isNew) {

        row.classList.add(
            "new-row"
        );

    }


    row.dataset.id =
        food.food_id || "";


    row.innerHTML = `

        <td>

            <input
                type="text"
                class="table-input food-name-input"
                data-field="food_name"
                placeholder="Food name"
                value="${escapeHTML(
                    food.food_name || ""
                )}">

        </td>


        <td>

            <select
                class="table-input category-input"
                data-field="category">

                <option value="">
                    Select
                </option>

                <option value="Vegetables">
                    Vegetables
                </option>

                <option value="Fruits">
                    Fruits
                </option>

                <option value="Dairy">
                    Dairy
                </option>

                <option value="Meat">
                    Meat
                </option>

                <option value="Chicken">
                    Chicken
                </option>

                <option value="Seafood">
                    Seafood
                </option>

                <option value="Grains">
                    Grains
                </option>

                <option value="Spices">
                    Spices
                </option>

                <option value="Beverages">
                    Beverages
                </option>

                <option value="Other">
                    Other
                </option>

            </select>

        </td>


        <td>

            <input
                type="number"
                class="table-input quantity-input"
                data-field="quantity"
                min="0"
                step="0.01"
                value="${food.quantity ?? ""}">

        </td>


        <td>

            <select
                class="table-input unit-input"
                data-field="unit">

                <option value="">
                    Select
                </option>

                <option value="kg">
                    kg
                </option>

                <option value="gram">
                    gram
                </option>

                <option value="litre">
                    litre
                </option>

                <option value="ml">
                    ml
                </option>

                <option value="piece">
                    piece
                </option>

                <option value="packet">
                    packet
                </option>

                <option value="box">
                    box
                </option>

                <option value="dozen">
                    dozen
                </option>

            </select>

        </td>


        <td>

            <input
                type="number"
                class="table-input storage-input"
                data-field="storage_days"
                min="0"
                value="${food.storage_days ?? ""}">

        </td>


        <td>

            <input
                type="number"
                class="table-input minimum-input"
                data-field="minimum_stock"
                min="0"
                step="0.01"
                value="${food.minimum_stock ?? ""}">

        </td>


        <td>

            <input
                type="date"
                class="table-input date-input"
                data-field="purchase_date"
                value="${formatInputDate(
                    food.purchase_date
                )}">

        </td>


        <td>

            <input
                type="date"
                class="table-input date-input"
                data-field="expiry_date"
                value="${formatInputDate(
                    food.expiry_date
                )}">

        </td>


        <td>

            <input
                type="text"
                class="table-input supplier-input"
                data-field="supplier"
                placeholder="Supplier"
                value="${escapeHTML(
                    food.supplier || ""
                )}">

        </td>


        <td>

            <span
                class="status-badge ${getStatusClass(
                    food
                )}">

                ${getStatus(
                    food
                )}

            </span>

        </td>


        <td>

            <div class="action-container">

                <button
                    class="save-btn"
                    title="Save"
                    onclick="saveRow(this)">

                    💾

                </button>


                <button
                    class="delete-btn"
                    title="Delete"
                    onclick="deleteRow(this)">

                    🗑️

                </button>

            </div>

        </td>

    `;


    table.appendChild(row);


    /*
       Set selected dropdown values
    */

    const category =
        row.querySelector(
            '[data-field="category"]'
        );


    const unit =
        row.querySelector(
            '[data-field="unit"]'
        );


    category.value =
        food.category || "";


    unit.value =
        food.unit || "";


    /*
       If new row, focus first field
    */

    if (isNew) {

        row.querySelector(
            ".food-name-input"
        ).focus();

    }

}


// =====================================================
// ADD NEW ROW
// =====================================================

function addNewRow() {

    const existingNewRow =
        document.querySelector(
            ".new-row"
        );


    if (existingNewRow) {

        existingNewRow
            .querySelector(
                ".food-name-input"
            )
            .focus();

        return;

    }


    const emptyFood = {

        food_name: "",

        category: "",

        quantity: "",

        unit: "",

        storage_days: "",

        minimum_stock: "",

        purchase_date: "",

        expiry_date: "",

        supplier: ""

    };


    createFoodRow(
        emptyFood,
        true
    );

}


// =====================================================
// SAVE ROW
// =====================================================

async function saveRow(button) {

    const row =
        button.closest("tr");


    const foodId =
        row.dataset.id;


    const data =
        getRowData(row);


    if (
        !data.food_name
    ) {

        alert(
            "Please enter the food name."
        );

        return;

    }


    if (
        !data.category
    ) {

        alert(
            "Please select a category."
        );

        return;

    }


    if (
        data.quantity === "" ||
        data.quantity === null
    ) {

        alert(
            "Please enter quantity."
        );

        return;

    }


    if (
        !data.unit
    ) {

        alert(
            "Please select the unit."
        );

        return;

    }


    try {

        let url =
            "/api/food";

        let method =
            "POST";


        /*
           Existing row = UPDATE
           New row = INSERT
        */

        if (foodId) {

            url =
                `/api/food/${foodId}`;

            method =
                "PUT";

        }


        const response =
            await fetch(
                url,
                {

                    method:

                        method,

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify(
                            data
                        )

                }
            );


        const result =
            await response.json();


        if (
            !response.ok ||
            !result.success
        ) {

            throw new Error(
                result.message ||
                "Save failed."
            );

        }


        showMessage(
            foodId
                ?
                "✅ Food updated successfully."
                :
                "✅ Food added successfully.",
            "success"
        );


        await loadFood();

    }

    catch (error) {

        console.error(
            "Save error:",
            error
        );


        showMessage(
            "❌ " +
            error.message,
            "error"
        );

    }

}


// =====================================================
// GET DATA FROM ROW
// =====================================================

function getRowData(row) {

    const getValue =
        function (field) {

            const element =
                row.querySelector(
                    `[data-field="${field}"]`
                );


            return element
                ?
                element.value.trim()
                :
                "";

        };


    return {

        food_name:
            getValue(
                "food_name"
            ),

        category:
            getValue(
                "category"
            ),

        quantity:
            getValue(
                "quantity"
            ),

        unit:
            getValue(
                "unit"
            ),

        storage_days:
            getValue(
                "storage_days"
            ),

        minimum_stock:
            getValue(
                "minimum_stock"
            ),

        purchase_date:
            getValue(
                "purchase_date"
            ) ||
            null,

        expiry_date:
            getValue(
                "expiry_date"
            ) ||
            null,

        supplier:
            getValue(
                "supplier"
            )

    };

}


// =====================================================
// DELETE ROW
// =====================================================

async function deleteRow(button) {

    const row =
        button.closest("tr");


    const foodId =
        row.dataset.id;


    /*
       If this is a new unsaved row,
       simply remove it.
    */

    if (!foodId) {

        row.remove();

        return;

    }


    const confirmDelete =
        confirm(
            "Are you sure you want to delete this food item?"
        );


    if (!confirmDelete) {

        return;

    }


    try {

        const response =
            await fetch(
                `/api/food/${foodId}`,
                {

                    method:
                        "DELETE"

                }
            );


        const result =
            await response.json();


        if (
            !response.ok ||
            !result.success
        ) {

            throw new Error(
                result.message ||
                "Delete failed."
            );

        }


        showMessage(
            "✅ Food deleted successfully.",
            "success"
        );


        await loadFood();

    }

    catch (error) {

        console.error(
            "Delete error:",
            error
        );


        showMessage(
            "❌ " +
            error.message,
            "error"
        );

    }

}


// =====================================================
// SEARCH
// =====================================================

function searchFood() {

    const search =
        document.getElementById(
            "searchInput"
        )
        .value
        .toLowerCase()
        .trim();


    const rows =
        document.querySelectorAll(
            "#foodTable tr"
        );


    rows.forEach(
        function (row) {

            const text =
                row.innerText
                    .toLowerCase();


            row.style.display =
                text.includes(search)
                    ?
                    ""
                    :
                    "none";

        }
    );

}


// =====================================================
// STATUS
// =====================================================

function getStatus(food) {

    const quantity =
        Number(
            food.quantity || 0
        );


    const minimum =
        Number(
            food.minimum_stock || 0
        );


    /*
       Expiry
    */

    if (
        food.expiry_date
    ) {

        const expiry =
            new Date(
                food.expiry_date
            );


        const today =
            new Date();


        today.setHours(
            0,
            0,
            0,
            0
        );


        const days =
            Math.ceil(
                (
                    expiry -
                    today
                ) /
                (
                    1000 *
                    60 *
                    60 *
                    24
                )
            );


        if (
            days < 0
        ) {

            return "Expired";

        }


        if (
            days <= 3
        ) {

            return "Expiring Soon";

        }

    }


    /*
       Low stock
    */

    if (
        quantity <= minimum
    ) {

        return "Low Stock";

    }


    return "Available";

}


// =====================================================
// STATUS CLASS
// =====================================================

function getStatusClass(food) {

    const status =
        getStatus(food);


    if (
        status === "Expired"
    ) {

        return "status-expired";

    }


    if (
        status === "Expiring Soon"
    ) {

        return "status-expiring";

    }


    if (
        status === "Low Stock"
    ) {

        return "status-low";

    }


    return "status-available";

}


// =====================================================
// STATISTICS
// =====================================================

function updateStatistics() {

    let lowStock = 0;

    let expiring = 0;

    let expired = 0;


    foodItems.forEach(
        function (food) {

            const status =
                getStatus(food);


            if (
                status === "Low Stock"
            ) {

                lowStock++;

            }


            if (
                status === "Expiring Soon"
            ) {

                expiring++;

            }


            if (
                status === "Expired"
            ) {

                expired++;

            }

        }
    );


    document.getElementById(
        "totalItems"
    ).innerText =
        foodItems.length;


    document.getElementById(
        "lowStockItems"
    ).innerText =
        lowStock;


    document.getElementById(
        "expiringItems"
    ).innerText =
        expiring;


    document.getElementById(
        "expiredItems"
    ).innerText =
        expired;

}


// =====================================================
// MESSAGE
// =====================================================

function showMessage(
    message,
    type
) {

    const element =
        document.getElementById(
            "message"
        );


    element.innerText =
        message;


    element.className =
        "message " +
        type;


    setTimeout(
        function () {

            element.className =
                "message";

            element.innerText =
                "";

        },
        3000
    );

}


// =====================================================
// DATE FORMAT
// =====================================================

function formatInputDate(
    value
) {

    if (!value) {

        return "";

    }


    return String(
        value
    ).substring(
        0,
        10
    );

}


// =====================================================
// BACK TO STAFF
// =====================================================

function goBack() {

    window.location.href =
        "../Staff.html";

}


// =====================================================
// ESCAPE HTML
// =====================================================

function escapeHTML(value) {

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