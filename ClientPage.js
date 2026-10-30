// ==============================
// CART
// ==============================

let cart = JSON.parse(localStorage.getItem("cart")) || [];

if (document.getElementById("cart")) {

    document.getElementById("cart").innerText =
        "Selected Items: " +
        (cart.length ? cart.join(", ") : "None");

}


// ==============================
// REGISTRATION
// ==============================

const registrationForm =
    document.getElementById("registrationForm");


if (registrationForm) {

    registrationForm.addEventListener("submit", async function (e) {

        e.preventDefault();


        // Get form values
        let name =
            document.getElementById("name").value;

        let email =
            document.getElementById("email").value;

        let phone =
            document.getElementById("phone").value;

        let spice =
            document.getElementById("spice").value;

        let comments =
            document.getElementById("comments").value;


        // Dietary
        let dietary = [];

        // Cuisine
        let cuisine = [];


        // Get selected checkboxes
        document
            .querySelectorAll(".checkbox-group input:checked")
            .forEach(function (cb) {

                if (
                    [
                        "Vegetarian",
                        "Vegan",
                        "Gluten-Free",
                        "Dairy-Free"
                    ].includes(cb.value)
                ) {

                    dietary.push(cb.value);

                } else {

                    cuisine.push(cb.value);

                }

            });


        // Create form data
        let formData = {

            name: name,

            email: email,

            phone: phone,

            dietary: dietary.join(", "),

            cuisine: cuisine.join(", "),

            spice: spice,

            comments: comments

        };


        console.log("Sending data:");
        console.log(formData);


        // Send data to server
        try {

            let response = await fetch(
                "http://localhost:3000/register",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(formData)
                }
            );


            let result = await response.json();


            // SUCCESS
            if (result.success) {

                alert(
                    "✅ Registration Successful!\n\n" +
                    "Your data has been saved to the database."
                );


                registrationForm.reset();


            }

            // FAILED
            else {
                alert(
                    "❌ Registration Failed!\n\n" +
                    (result.message || "Your data was not saved.")
                );

                console.log("Registration failed:", result);
            }

        }


        } catch (error) {

        console.log("Error:", error);

        alert(
            "❌ Server Error!\n\n" +
            "Please make sure server.js is running."
        );

    }

});

}


// ==============================
// MENU
// ==============================

let selectedItems = [];


function selectMenuItem(element, item) {

    if (selectedItems.includes(item)) {

        selectedItems =
            selectedItems.filter(i => i !== item);

        element.style.background = "";
        element.style.color = "";

    }

    else {

        selectedItems.push(item);

        element.style.background = "green";
        element.style.color = "white";

    }


    if (document.getElementById("selectedItems")) {

        document.getElementById("selectedItems").innerText =
            "Selected Items: " +
            selectedItems.join(", ");

    }

}