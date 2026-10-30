document
    .getElementById("registrationForm")
    .addEventListener("submit", function (event) {

        event.preventDefault();


        const registrationData = {

            name:
                document
                    .getElementById("name")
                    .value
                    .trim(),

            email:
                document
                    .getElementById("email")
                    .value
                    .trim(),

            phone:
                document
                    .getElementById("phone")
                    .value
                    .trim(),

            dietary:
                document
                    .getElementById("dietary")
                    ?.value || "",

            cuisine:
                document
                    .getElementById("cuisine")
                    ?.value || "",

            spice:
                document
                    .getElementById("spice")
                    ?.value || "",

            comments:
                document
                    .getElementById("comments")
                    ?.value || ""

        };


        /*
         * Save temporarily.
         * Registration is NOT created yet.
         */
        localStorage.setItem(
            "pendingRegistration",
            JSON.stringify(
                registrationData
            )
        );


        /*
         * Go to payment
         */
        window.location.href =
            "Payment.html";

    });