const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 600;

// Load the character image
const characterImg = new Image();
characterImg.src = 'character.png'; // Ensure this filename matches your character image file

// Load the money image
const moneyImg = new Image();
moneyImg.src = 'money.png'; // Ensure this filename matches your money image file

const character = {
    x: canvas.width / 2 - 50,  // Adjusted for new image size
    y: canvas.height - 100,    // Adjusted for new image size
    width: 100,                // Width of the character image
    height: 100,               // Height of the character image
    dx: 5
};

const money = {
    img: moneyImg,
    x: Math.random() * (canvas.width - 50),
    y: 0,
    width: 50,
    height: 25,
    dy: 3, // Initial drop speed
};

let score = 0;
let highScore = 0;
let rightPressed = false;
let leftPressed = false;

document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);

function keyDownHandler(e) {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
        rightPressed = true;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
        rightPressed = false;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
        leftPressed = false;
    }
}

function drawCharacter() {
    ctx.drawImage(characterImg, character.x, character.y, character.width, character.height);
}

function drawMoney() {
    ctx.drawImage(money.img, money.x, money.y, money.width, money.height);
}

function moveCharacter() {
    if (rightPressed && character.x < canvas.width - character.width) {
        character.x += character.dx;
    } else if (leftPressed && character.x > 0) {
        character.x -= character.dx;
    }
}

function moveMoney() {
    money.y += money.dy;
    if (money.y > canvas.height - 10) { // Adjust for the floor
        // If money hits the floor without being collected, reset the score
        resetScore();
        resetMoney();
    }
}

function detectCollision() {
    if (character.x < money.x + money.width &&
        character.x + character.width > money.x &&
        character.y < money.y + money.height &&
        character.height + character.y > money.y) {
        score++;
        // Increase the drop speed slightly every 5 points
        if (score % 5 === 0) {
            money.dy += 0.5;
        }
        // Update the high score if the current score is higher
        if (score > highScore) {
            highScore = score;
        }
        resetMoney();
    }
}

function resetMoney() {
    money.x = Math.random() * (canvas.width - money.width);
    money.y = 0;
}

function resetScore() {
    score = 0;
    money.dy = 3; // Reset the drop speed
}

function drawScore() {
    ctx.font = '16px Arial';
    ctx.fillStyle = '#000'; // Set the text color to black
    ctx.fillText('Score: ' + score, 8, 20);
    ctx.fillText('High Score: ' + highScore, 8, 40);
}

function drawWallsAndFloor() {
    ctx.fillStyle = '#000'; // Set the line color to black
    ctx.fillRect(0, canvas.height - 10, canvas.width, 10); // Floor
    ctx.fillRect(0, 0, 10, canvas.height); // Left wall
    ctx.fillRect(canvas.width - 10, 0, 10, canvas.height); // Right wall
}

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawWallsAndFloor();
    drawCharacter();
    drawMoney();
    moveCharacter();
    moveMoney();
    detectCollision();
    drawScore();
    requestAnimationFrame(update);
}

update();
