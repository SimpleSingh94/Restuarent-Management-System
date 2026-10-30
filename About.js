/* =========================================================
   ROYAL RESTAURANT - AI VOICE ASSISTANT
   Dynamic + Smooth + Animated
========================================================= */


/* =========================================================
   VARIABLES
========================================================= */

let recognition = null;

let isListening = false;

let isSpeaking = false;

let conversationStarted = false;


/* =========================================================
   ELEMENTS
========================================================= */

const voiceBox =
    document.getElementById("voiceBox");

const voiceStatus =
    document.getElementById("voiceStatus");

const voiceText =
    document.getElementById("voiceText");

const assistantIcon =
    document.getElementById("assistantIcon");


/* =========================================================
   OPEN ASSISTANT
========================================================= */

function startVoiceAssistant() {

    voiceBox.classList.add("show");

    conversationStarted = true;

    assistantIcon.classList.add("active");

    setTimeout(() => {

        speak(
            "Hello! Welcome to Royal Restaurant. How can I help you today?"
        );

    }, 400);
}


/* =========================================================
   CLOSE ASSISTANT
========================================================= */

function closeVoiceAssistant() {

    stopListening();

    window.speechSynthesis.cancel();

    voiceBox.classList.remove("show");

    isSpeaking = false;

    isListening = false;

}


/* =========================================================
   START LISTENING
========================================================= */

function startListening() {

    if (isSpeaking) {

        window.speechSynthesis.cancel();

        isSpeaking = false;

    }


    const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;


    if (!SpeechRecognition) {

        showMessage(
            "Voice recognition is not supported in this browser. Please use Google Chrome."
        );

        return;

    }


    if (isListening) {

        stopListening();

        return;

    }


    recognition =
        new SpeechRecognition();


    recognition.lang = "en-IN";

    recognition.continuous = false;

    recognition.interimResults = true;

    recognition.maxAlternatives = 1;


    isListening = true;


    /* ================= UI ================= */

    setListeningUI();


    try {

        recognition.start();

    }

    catch (error) {

        console.log(error);

    }


    /* ================= RESULT ================= */

    recognition.onresult =
        function(event) {

            let transcript = "";

            for (
                let i = event.resultIndex;
                i < event.results.length;
                i++
            ) {

                transcript +=
                    event.results[i][0].transcript;

            }


            transcript =
                transcript.trim();


            if (
                event.results[
                    event.results.length - 1
                ].isFinal
            ) {

                showUserMessage(transcript);

                processVoiceCommand(
                    transcript.toLowerCase()
                );

            }

            else {

                voiceText.textContent =
                    transcript;

            }

        };


    /* ================= END ================= */

    recognition.onend =
        function() {

            isListening = false;

            if (!isSpeaking) {

                setIdleUI();

            }

        };


    /* ================= ERROR ================= */

    recognition.onerror =
        function(event) {

            isListening = false;

            console.log(
                "Voice error:",
                event.error
            );


            if (
                event.error === "no-speech"
            ) {

                showMessage(
                    "I didn't hear anything. Try speaking again."
                );

            }

            else if (
                event.error === "not-allowed"
            ) {

                showMessage(
                    "Please allow microphone access to use the voice assistant."
                );

            }

            else {

                showMessage(
                    "Something went wrong. Please try again."
                );

            }


            setIdleUI();

        };

}


/* =========================================================
   STOP LISTENING
========================================================= */

function stopListening() {

    if (recognition) {

        try {

            recognition.stop();

        }

        catch (error) {

            console.log(error);

        }

    }

    isListening = false;

    setIdleUI();

}


/* =========================================================
   LISTENING UI
========================================================= */

function setListeningUI() {

    voiceStatus.textContent =
        "I'm listening...";

    voiceText.textContent =
        "Speak naturally";

    assistantIcon.textContent =
        "🎧";

    assistantIcon.classList.add(
        "listening"
    );

}


/* =========================================================
   IDLE UI
========================================================= */

function setIdleUI() {

    voiceStatus.textContent =
        "How can I help you?";

    voiceText.textContent =
        "Tap the microphone and speak";

    assistantIcon.textContent =
        "🤖";

    assistantIcon.classList.remove(
        "listening"
    );

}


/* =========================================================
   SPEAK
========================================================= */

function speak(message) {

    if (!message) return;


    window.speechSynthesis.cancel();


    isSpeaking = true;


    /* UI */

    voiceStatus.textContent =
        "Royal Assistant";

    voiceText.textContent =
        message;

    assistantIcon.textContent =
        "🔊";

    assistantIcon.classList.add(
        "speaking"
    );


    const speech =
        new SpeechSynthesisUtterance(
            message
        );


    speech.lang =
        "en-IN";

    speech.rate =
        0.92;

    speech.pitch =
        1.05;

    speech.volume =
        1;


    /* ================= VOICE ================= */

    const voices =
        window.speechSynthesis
            .getVoices();


    const indianVoice =
        voices.find(
            voice =>
                voice.lang === "en-IN"
        );


    if (indianVoice) {

        speech.voice =
            indianVoice;

    }


    speech.onend =
        function() {

            isSpeaking = false;

            assistantIcon.textContent =
                "🤖";

            assistantIcon.classList.remove(
                "speaking"
            );

            voiceStatus.textContent =
                "How can I help you?";

        };


    speech.onerror =
        function() {

            isSpeaking = false;

            setIdleUI();

        };


    window.speechSynthesis.speak(
        speech
    );

}


/* =========================================================
   SHOW MESSAGE
========================================================= */

function showMessage(message) {

    voiceText.textContent =
        message;

}


/* =========================================================
   USER MESSAGE
========================================================= */

function showUserMessage(message) {

    voiceText.textContent =
        `"${message}"`;

}


/* =========================================================
   COMMAND PROCESSOR
========================================================= */

function processVoiceCommand(command) {


    /* =====================================================
       GREETING
    ===================================================== */

    if (
        command.includes("hello") ||
        command.includes("hi") ||
        command.includes("hey")
    ) {

        speak(
            "Hello! Welcome to Royal Restaurant. What would you like to know?"
        );

        return;

    }


    /* =====================================================
       MENU
    ===================================================== */

    if (
        command.includes("menu") ||
        command.includes("show food") ||
        command.includes("food menu") ||
        command.includes("show dishes")
    ) {

        speak(
            "Sure. I'm opening our delicious menu for you."
        );


        setTimeout(
            () => {

                window.location.href =
                    "Menu.html";

            },
            1400
        );


        return;

    }


    /* =====================================================
       PIZZA
    ===================================================== */

    if (
        command.includes("pizza")
    ) {

        speak(
            "We have twenty different pizza options, including Margherita, Farmhouse, Paneer Tikka, BBQ Chicken and Cheese Burst Pizza."
        );

        return;

    }


    /* =====================================================
       BURGER
    ===================================================== */

    if (
        command.includes("burger") ||
        command.includes("burgers")
    ) {

        speak(
            "Our burger menu includes vegetarian, chicken, paneer, barbecue and loaded burgers."
        );

        return;

    }


    /* =====================================================
       STARTERS
    ===================================================== */

    if (
        command.includes("starter") ||
        command.includes("starters")
    ) {

        speak(
            "We have twenty starters including Paneer Tikka, Chicken Tikka, Spring Rolls, French Fries, Garlic Bread and Chicken Lollipop."
        );

        return;

    }


    /* =====================================================
       DESSERT
    ===================================================== */

    if (
        command.includes("dessert") ||
        command.includes("desserts")
    ) {

        speak(
            "Our desserts include Chocolate Brownie, Lava Cake, Ice Cream, Gulab Jamun, Cheesecake and Chocolate Truffle Cake."
        );

        return;

    }


    /* =====================================================
       DRINKS
    ===================================================== */

    if (
        command.includes("drink") ||
        command.includes("drinks") ||
        command.includes("beverage")
    ) {

        speak(
            "We serve fresh juices, mojitos, shakes, cold coffee, iced tea and refreshing mocktails."
        );

        return;

    }


    /* =====================================================
       CHINESE
    ===================================================== */

    if (
        command.includes("chinese")
    ) {

        speak(
            "Our Chinese menu includes Hakka Noodles, Fried Rice, Manchurian, Chilli Paneer, Momos and Chowmein."
        );

        return;

    }


    /* =====================================================
       INDIAN FOOD
    ===================================================== */

    if (
        command.includes("indian food") ||
        command.includes("indian cuisine")
    ) {

        speak(
            "We offer Indian favourites including Biryani, Butter Chicken, Paneer Butter Masala, Dal Makhani, Kadai Paneer and Rogan Josh."
        );

        return;

    }


    /* =====================================================
       ABOUT
    ===================================================== */

    if (
        command.includes("about") ||
        command.includes("restaurant")
    ) {

        speak(
            "Royal Restaurant is a modern dining destination focused on delicious food, quality ingredients and a comfortable dining experience."
        );

        return;

    }


    /* =====================================================
       REGISTRATION
    ===================================================== */

    if (
        command.includes("registration") ||
        command.includes("register") ||
        command.includes("booking") ||
        command.includes("book table")
    ) {

        speak(
            "Sure. I'm opening the registration page for you."
        );


        setTimeout(
            () => {

                window.location.href =
                    "Registration.html";

            },
            1400
        );


        return;

    }


    /* =====================================================
       HOME
    ===================================================== */

    if (
        command.includes("home") ||
        command.includes("homepage")
    ) {

        speak(
            "Sure. I'm taking you to the restaurant home page."
        );


        setTimeout(
            () => {

                window.location.href =
                    "ClientPage.html";

            },
            1400
        );


        return;

    }


    /* =====================================================
       HELP
    ===================================================== */

    if (
        command.includes("help") ||
        command.includes("what can you do")
    ) {

        speak(
            "I can tell you about our restaurant, explain our menu, tell you about pizzas, burgers, Chinese food, starters, desserts and drinks, or open the menu and registration pages."
        );

        return;

    }


    /* =====================================================
       THANK YOU
    ===================================================== */

    if (
        command.includes("thank you") ||
        command.includes("thanks")
    ) {

        speak(
            "You're very welcome. Enjoy your experience at Royal Restaurant!"
        );

        return;

    }


    /* =====================================================
       GOODBYE
    ===================================================== */

    if (
        command.includes("bye") ||
        command.includes("goodbye")
    ) {

        speak(
            "Goodbye! We hope to serve you soon."
        );

        return;

    }


    /* =====================================================
       UNKNOWN COMMAND
    ===================================================== */

    speak(
        "I'm not sure I understood that. You can ask me about our menu, pizza, burgers, Chinese food, starters, desserts, drinks or the restaurant."
    );

}