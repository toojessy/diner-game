window.onload = function () {
    const titleScreen = document.getElementById("titleScreen");
    const instructionScreen = document.getElementById("instructionScreen");
    const gameScreen = document.getElementById("gameScreen");

    const startBtn = document.getElementById("startBtn");
    const instructionBtn = document.getElementById("instructionBtn");

    const customerImage = document.getElementById("customerImage");
    const characterName = document.getElementById("characterName");
    const orderBubble = document.getElementById("orderBubble");

    const gameButtons = document.getElementById("gameButtons");
    const serveBtn = document.getElementById("serveBtn");
    const rejectBtn = document.getElementById("rejectBtn");

    const streakText = document.getElementById("streak");

    const realCustomers = [
        { image: "customer1.png", name: "ZingZingZingbah" },
        { image: "customer2.png", name: "BabyBoo" },
        { image: "customer3.png", name: "Jabber" },
        { image: "customer4.png", name: "CaseOh" },
        { image: "customer5.png", name: "Jade" },
        { image: "customer6.png", name: "Sea Lion" },
        { image: "customer7.png", name: "Art" },
        { image: "customer8.png", name: "James Doakes" },
        { image: "customer9.png", name: "Guy Pointing at Himself" },
        { image: "customer10.png", name: "Abby Lee Miller" }
    ];

    const fakeCustomers = [
        { image: "imposter1.png", name: "Boo-Ha-Ha" },
        { image: "imposter2.png", name: "Jade" },
        { image: "imposter3.png", name: "CaseOzempic" },
        { image: "imposter4.png", name: "Aby Le Miler" },
        { image: "imposter5.png", name: "Bweep" }
    ];

    const realOrders = [
        "Burger",
        "French Fries",
        "Pancakes",
        "Milkshake",
        "Cherry Pie",
        "Banana Split",
        "Mozzarella Sticks",
        "Omlette",
        "Water",
        "Sweet Tea",
        "Chicken Tenders",
        "Hashbrowns",
        "Salad"
    ];

    const fakeOrders = [
        "Spaghetti",
        "Taco",
        "Pizza"
    ];

    let score = 0;
    let streak = 0;
    let bestStreak = 0;
    let mistakes = 0;

    let currentCustomerIsImposter = false;
    let currentOrderIsFake = false;

    startBtn.onclick = function () {
        titleScreen.style.display = "none";
        instructionScreen.style.display = "flex";
    };

    instructionBtn.onclick = function () {
        instructionScreen.style.display = "none";
        gameScreen.style.display = "flex";

        score = 0;
        streak = 0;
        bestStreak = 0;
        mistakes = 0;

        updateScore();
        startRound();
    };

    serveBtn.onclick = function () {
        const wrong = currentCustomerIsImposter || currentOrderIsFake;

        if (wrong) {
            streak = 0;
            mistakes++;
        } else {
            score++;
            streak++;
            if (streak > bestStreak) {
                bestStreak = streak;
            }
        }

        updateScore();
        checkGameOver();
    };

    rejectBtn.onclick = function () {
        const wrong = !(currentCustomerIsImposter || currentOrderIsFake);

        if (wrong) {
            streak = 0;
            mistakes++;
        } else {
            score++;
            streak++;
            if (streak > bestStreak) {
                bestStreak = streak;
            }
        }

        updateScore();
        checkGameOver();
    };

    function updateScore() {
        streakText.textContent =
            "Score: " + score +
            " | Streak: " + streak +
            " | Mistakes: " + mistakes + "/3";
    }

    function randomChoice(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    function startRound() {
        orderBubble.style.display = "none";
        gameButtons.style.display = "none";

        const roundType = Math.floor(Math.random() * 4);

        let chosenCustomer;
        let chosenOrder;

        currentCustomerIsImposter = false;
        currentOrderIsFake = false;

        if (roundType === 0) {
            chosenCustomer = randomChoice(realCustomers);
            chosenOrder = randomChoice(realOrders);
        } else if (roundType === 1) {
            chosenCustomer = randomChoice(fakeCustomers);
            chosenOrder = randomChoice(realOrders);
            currentCustomerIsImposter = true;
        } else if (roundType === 2) {
            chosenCustomer = randomChoice(realCustomers);
            chosenOrder = randomChoice(fakeOrders);
            currentOrderIsFake = true;
        } else {
            chosenCustomer = randomChoice(fakeCustomers);
            chosenOrder = randomChoice(fakeOrders);
            currentCustomerIsImposter = true;
            currentOrderIsFake = true;
        }

        characterName.textContent = chosenCustomer.name;

        customerImage.classList.remove("walkIn");
        customerImage.src = "images/" + chosenCustomer.image;

        void customerImage.offsetWidth;

        customerImage.classList.add("walkIn");

        setTimeout(function () {
            orderBubble.textContent = "I'd like " + chosenOrder + ".";
            orderBubble.style.display = "block";
            gameButtons.style.display = "block";
        }, 1600);
    }

    function checkGameOver() {
        if (mistakes >= 3) {
            showDeathScreen();
        } else {
            startRound();
        }
    }

    function showDeathScreen() {
        gameScreen.innerHTML = `
            <div style="
                min-height:100vh;
                display:flex;
                flex-direction:column;
                justify-content:center;
                align-items:center;
                background-size:cover;
                background-position:center;
                text-align:center;
                padding:30px;
                box-sizing:border-box;
                color:white;
            ">
                <h1 style="
                    font-size:90px;
                    color:gold;
                    text-shadow:4px 4px 10px black;
                    margin-bottom:20px;
                ">
                    YOU WERE EXPOSED
                </h1>

                <div style="
                    background:rgba(0,0,0,.7);
                    padding:30px 40px;
                    border-radius:14px;
                    max-width:700px;
                ">
                    <p style="
                        font-size:38px;
                        margin:10px 0;
                        text-shadow:2px 2px 6px black;
                    ">
                        Too many wrong calls.
                    </p>

                    <p style="
                        font-size:34px;
                        margin:10px 0;
                        text-shadow:2px 2px 6px black;
                    ">
                        Final Score: ${score}
                    </p>

                    <p style="
                        font-size:30px;
                        margin:10px 0;
                        text-shadow:2px 2px 6px black;
                    ">
                        Best Streak: ${bestStreak}
                    </p>
                </div>

                <button id="restartBtn" style="
                    margin-top:30px;
                    font-size:30px;
                    padding:15px 40px;
                    background:gold;
                    border:none;
                    border-radius:10px;
                    cursor:pointer;
                ">
                    Restart
                </button>
            </div>
        `;

        document.getElementById("restartBtn").onclick = function () {
            location.reload();
        };
    }
};
