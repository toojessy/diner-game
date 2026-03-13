window.onload = function () {

    const titleScreen = document.getElementById("titleScreen");
    const instructionScreen = document.getElementById("instructionScreen");
    const gameScreen = document.getElementById("gameScreen");

    const startBtn = document.getElementById("startBtn");
    const instructionBtn = document.getElementById("instructionBtn");
    const exitBtn = document.getElementById("exitBtn");

    const customerImage = document.getElementById("customerImage");
    const foodImage = document.getElementById("foodImage");
    const characterName = document.getElementById("characterName");
    const orderBubble = document.getElementById("orderBubble");

    const gameButtons = document.getElementById("gameButtons");
    const serveBtn = document.getElementById("serveBtn");
    const rejectBtn = document.getElementById("rejectBtn");

    const streakText = document.getElementById("streak");

    const menuToggle = document.getElementById("menuToggle");
    const collapsibleMenu = document.getElementById("collapsibleMenu");
    const menuContainer = document.getElementById("menuContainer");

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
        "Pizza",
        "Sushi",
        "Ramen",
        "Burrito",
        "Nachos",
        "Lasagna",
        "Mystery Meat Surprise",
        "Suspicious Soup",
        "Phil Collins"
    ];

    const orderImageMap = {
        "Burger": "burger.png",
        "French Fries": "french fries.png",
        "Pancakes": "pancakes.png",
        "Milkshake": "milkshake.png",
        "Cherry Pie": "cherry pie.png",
        "Banana Split": "banana split.png",
        "Mozzarella Sticks": "mozzarella sticks.png",
        "Omlette": "omlette.png",
        "Water": "water.png",
        "Sweet Tea": "sweet tea.png",
        "Chicken Tenders": "chicken tenders.png",
        "Hashbrowns": "hashbrowns.png",
        "Salad": "salad.png",

        "Spaghetti": "shaghetti.png",
        "Taco": "taco.png",
        "Pizza": "pizza.png",
        "Sushi": "sushi.png",
        "Ramen": "ramen.png",
        "Burrito": "burrito.png",
        "Nachos": "nachos.png",
        "Lasagna": "lasagna.png",
        "Mystery Meat Surprise": "mystery meat surprise.png",
        "Suspicious Soup": "suspicious soup.png",
        "Phil Collins": "Phil Collins.png"
    };

    let score = 0;
    let streak = 0;
    let bestStreak = 0;
    let mistakes = 0;

    let currentCustomerIsImposter = false;
    let currentOrderIsFake = false;
    let currentOrderName = "";

    let currentShift = 1;
    let shiftCorrect = 0;
    const maxShifts = 5;

    function getShiftGoal(shiftNumber) {
        return shiftNumber * 10;
    }

    function resetGameState() {
        score = 0;
        streak = 0;
        bestStreak = 0;
        mistakes = 0;

        currentCustomerIsImposter = false;
        currentOrderIsFake = false;
        currentOrderName = "";

        currentShift = 1;
        shiftCorrect = 0;

        orderBubble.style.display = "none";
        gameButtons.style.display = "none";
        foodImage.style.display = "none";
        foodImage.classList.remove("serveFood");

        updateScore();
    }

    function showTitleScreen() {
        titleScreen.style.display = "flex";
        instructionScreen.style.display = "none";
        gameScreen.style.display = "none";
        menuContainer.style.display = "none";
        collapsibleMenu.classList.add("hidden");
        foodImage.style.display = "none";
    }

    menuToggle.onclick = function () {
        collapsibleMenu.classList.toggle("hidden");
    };

    startBtn.onclick = function () {
        titleScreen.style.display = "none";
        instructionScreen.style.display = "flex";
        gameScreen.style.display = "none";
        menuContainer.style.display = "none";
        collapsibleMenu.classList.add("hidden");
    };

    instructionBtn.onclick = function () {
        instructionScreen.style.display = "none";
        gameScreen.style.display = "flex";
        menuContainer.style.display = "block";
        collapsibleMenu.classList.add("hidden");

        resetGameState();
        startRound();
    };

    exitBtn.onclick = function () {
        showTitleScreen();
    };

    serveBtn.onclick = function () {
        const wrong = currentCustomerIsImposter || currentOrderIsFake;

        if (wrong) {
            streak = 0;
            mistakes++;
            updateScore();
            serveFoodAnimation();
        } else {
            score++;
            streak++;
            shiftCorrect++;

            if (streak > bestStreak) {
                bestStreak = streak;
            }

            updateScore();
            serveFoodAnimation();
        }
    };

    rejectBtn.onclick = function () {
        const wrong = !(currentCustomerIsImposter || currentOrderIsFake);

        if (wrong) {
            streak = 0;
            mistakes++;
        } else {
            score++;
            streak++;
            shiftCorrect++;

            if (streak > bestStreak) {
                bestStreak = streak;
            }
        }

        updateScore();
        checkProgressAfterChoice();
    };

    function updateScore() {
        streakText.textContent =
            "Shift: " + currentShift + " (" + shiftCorrect + "/" + getShiftGoal(currentShift) + ")" +
            " | Score: " + score +
            " | Streak: " + streak +
            " | Mistakes: " + mistakes + "/3";
    }

    function randomChoice(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    function startRound() {
        orderBubble.style.display = "none";
        gameButtons.style.display = "none";
        foodImage.style.display = "none";
        foodImage.classList.remove("serveFood");

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

        currentOrderName = chosenOrder;

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

    function serveFoodAnimation() {
        const imageFile = orderImageMap[currentOrderName];

        if (!imageFile) {
            checkProgressAfterChoice();
            return;
        }

        foodImage.src = "images/" + imageFile;
        foodImage.style.display = "block";

        foodImage.classList.remove("serveFood");
        void foodImage.offsetWidth;
        foodImage.classList.add("serveFood");

        setTimeout(function () {
            foodImage.style.display = "none";
            checkProgressAfterChoice();
        }, 900);
    }

    function checkProgressAfterChoice() {
        if (mistakes >= 3) {
            showDeathScreen();
            return;
        }

        if (shiftCorrect >= getShiftGoal(currentShift)) {
            if (currentShift >= maxShifts) {
                showWinScreen();
            } else {
                currentShift++;
                shiftCorrect = 0;
                updateScore();
                showShiftScreen();
            }
        } else {
            startRound();
        }
    }

    function showShiftScreen() {
        gameButtons.style.display = "none";
        orderBubble.style.display = "none";
        foodImage.style.display = "none";

        gameScreen.innerHTML = `
            <button id="exitBtn">Exit</button>

            <div style="
                min-height:100vh;
                display:flex;
                flex-direction:column;
                justify-content:center;
                align-items:center;
                text-align:center;
                padding:30px;
                box-sizing:border-box;
                color:white;
            ">
                <h1 style="
                    font-size:80px;
                    color:gold;
                    text-shadow:4px 4px 10px black;
                    margin-bottom:20px;
                ">
                    SHIFT ${currentShift}
                </h1>

                <div style="
                    background:rgba(0,0,0,.7);
                    padding:30px 40px;
                    border-radius:14px;
                    max-width:700px;
                ">
                    <p style="
                        font-size:34px;
                        margin:10px 0;
                        text-shadow:2px 2px 6px black;
                    ">
                        New goal: ${getShiftGoal(currentShift)} correct orders
                    </p>
                </div>

                <button id="nextShiftBtn" style="
                    margin-top:30px;
                    font-size:30px;
                    padding:15px 40px;
                    background:gold;
                    border:none;
                    border-radius:10px;
                    cursor:pointer;
                ">
                    Start Shift
                </button>
            </div>
        `;

        document.getElementById("exitBtn").onclick = function () {
            showTitleScreen();
        };

        document.getElementById("nextShiftBtn").onclick = function () {
            restoreGameScreen();
            startRound();
        };
    }

    function restoreGameScreen() {
        gameScreen.innerHTML = `
            <button id="exitBtn">Exit</button>

            <div id="gameArea">
                <img id="customerImage" alt="Customer">
                <img id="foodImage" alt="Food">
            </div>

            <div id="characterName">Customer</div>

            <div id="orderBubble">Order</div>

            <div id="gameButtons">
                <button id="serveBtn">Serve</button>
                <button id="rejectBtn">Reject</button>
            </div>

            <div id="streak"></div>
        `;

        rebindGameElements();
        updateScore();
    }

    function rebindGameElements() {
        const newExitBtn = document.getElementById("exitBtn");
        const newCustomerImage = document.getElementById("customerImage");
        const newFoodImage = document.getElementById("foodImage");
        const newCharacterName = document.getElementById("characterName");
        const newOrderBubble = document.getElementById("orderBubble");
        const newGameButtons = document.getElementById("gameButtons");
        const newServeBtn = document.getElementById("serveBtn");
        const newRejectBtn = document.getElementById("rejectBtn");
        const newStreakText = document.getElementById("streak");

        exitBtnRef = newExitBtn;
        customerImageRef = newCustomerImage;
        foodImageRef = newFoodImage;
        characterNameRef = newCharacterName;
        orderBubbleRef = newOrderBubble;
        gameButtonsRef = newGameButtons;
        serveBtnRef = newServeBtn;
        rejectBtnRef = newRejectBtn;
        streakTextRef = newStreakText;

        exitBtnRef.onclick = function () {
            showTitleScreen();
        };

        serveBtnRef.onclick = function () {
            const wrong = currentCustomerIsImposter || currentOrderIsFake;

            if (wrong) {
                streak = 0;
                mistakes++;
                updateScore();
                serveFoodAnimation();
            } else {
                score++;
                streak++;
                shiftCorrect++;

                if (streak > bestStreak) {
                    bestStreak = streak;
                }

                updateScore();
                serveFoodAnimation();
            }
        };

        rejectBtnRef.onclick = function () {
            const wrong = !(currentCustomerIsImposter || currentOrderIsFake);

            if (wrong) {
                streak = 0;
                mistakes++;
            } else {
                score++;
                streak++;
                shiftCorrect++;

                if (streak > bestStreak) {
                    bestStreak = streak;
                }
            }

            updateScore();
            checkProgressAfterChoice();
        };
    }

    let exitBtnRef = exitBtn;
    let customerImageRef = customerImage;
    let foodImageRef = foodImage;
    let characterNameRef = characterName;
    let orderBubbleRef = orderBubble;
    let gameButtonsRef = gameButtons;
    let serveBtnRef = serveBtn;
    let rejectBtnRef = rejectBtn;
    let streakTextRef = streakText;

    function updateScore() {
        streakTextRef.textContent =
            "Shift: " + currentShift + " (" + shiftCorrect + "/" + getShiftGoal(currentShift) + ")" +
            " | Score: " + score +
            " | Streak: " + streak +
            " | Mistakes: " + mistakes + "/3";
    }

    function startRound() {
        orderBubbleRef.style.display = "none";
        gameButtonsRef.style.display = "none";
        foodImageRef.style.display = "none";
        foodImageRef.classList.remove("serveFood");

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

        currentOrderName = chosenOrder;

        characterNameRef.textContent = chosenCustomer.name;

        customerImageRef.classList.remove("walkIn");
        customerImageRef.src = "images/" + chosenCustomer.image;

        void customerImageRef.offsetWidth;

        customerImageRef.classList.add("walkIn");

        setTimeout(function () {
            orderBubbleRef.textContent = "I'd like " + chosenOrder + ".";
            orderBubbleRef.style.display = "block";
            gameButtonsRef.style.display = "block";
        }, 1600);
    }

    function serveFoodAnimation() {
        const imageFile = orderImageMap[currentOrderName];

        if (!imageFile) {
            checkProgressAfterChoice();
            return;
        }

        foodImageRef.src = "images/" + imageFile;
        foodImageRef.style.display = "block";

        foodImageRef.classList.remove("serveFood");
        void foodImageRef.offsetWidth;
        foodImageRef.classList.add("serveFood");

        setTimeout(function () {
            foodImageRef.style.display = "none";
            checkProgressAfterChoice();
        }, 900);
    }

    function showDeathScreen() {
        menuContainer.style.display = "none";
        collapsibleMenu.classList.add("hidden");

        gameScreen.innerHTML = `
            <div style="
                min-height:100vh;
                display:flex;
                flex-direction:column;
                justify-content:center;
                align-items:center;
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

    function showWinScreen() {
        menuContainer.style.display = "none";
        collapsibleMenu.classList.add("hidden");

        gameScreen.innerHTML = `
            <div style="
                min-height:100vh;
                display:flex;
                flex-direction:column;
                justify-content:center;
                align-items:center;
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
                    YOU SURVIVED ALL 5 SHIFTS
                </h1>

                <div style="
                    background:rgba(0,0,0,.7);
                    padding:30px 40px;
                    border-radius:14px;
                    max-width:700px;
                ">
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

                <button id="playAgainBtn" style="
                    margin-top:30px;
                    font-size:30px;
                    padding:15px 40px;
                    background:gold;
                    border:none;
                    border-radius:10px;
                    cursor:pointer;
                ">
                    Play Again
                </button>
            </div>
        `;

        document.getElementById("playAgainBtn").onclick = function () {
            location.reload();
        };
    }

    showTitleScreen();
};
