function determineWinner ({hero, enemy, timerId}) {
    clearInterval(timerId);
    let winner = document.querySelector('#winner');
    winner.style.display = 'flex';
    if (hero.health == enemy.health) {
        winner.innerHTML = 'Tie';
    } else if (hero.health < enemy.health) {
        winner.innerHTML = 'Player 2 wins';
    } else if (hero.health > enemy.health) {
        winner.innerHTML = 'Player 1 wins';
    }
}

function detectForCollision({rectangle1, rectangle2}) {
    return (
        rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x && 
        rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width &&
        rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y &&
        rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
    );
}

let timer = document.querySelector('#timer');
    let timeLeft = 60;
    timer.innerHTML = `${timeLeft}`;
    let timerId = setInterval( function () {
        timeLeft = timeLeft - 1;
        timer.innerHTML = `${timeLeft}`;

        if (timeLeft === 0) {
            determineWinner({hero, enemy, timerId});
        }
    }, 1000);