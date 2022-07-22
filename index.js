const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);

let background = new Sprite ({
    position: {
        x: 0, 
        y: 0
    },
    imageSrc: './img/background.png'
});

let shop = new Sprite({
    position: {
        x: 620,
        y: 129  
    },
    imageSrc: './img/shop.png',
    scale: 2.75,
    framesMax: 6
});

const gravity = 0.7;

let hero = new Fighter ({
    position: {
        x: 0,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    },
    color: 'red',
    // offset: {
    //     x: 0,
    //     y: 0
    // },
    offset: {
        x: 215,
        y: 157
    },
    imageSrc: './img/samuraiMack/Idle.png',
    scale: 2.5,
    sprites: {
        idle: {
            imageSrc: './img/samuraiMack/Idle.png',
            framesMax: 8,
        },
        run: {
            imageSrc: './img/samuraiMack/Run.png',
            framesMax: 8,
        },
        jump: {
            imageSrc: './img/samuraiMack/Jump.png',
            framesMax: 2,
        },
        fall: {
            imageSrc: './img/samuraiMack/Fall.png',
            framesMax: 2,
        },
        attack1: {
            imageSrc: './img/samuraiMack/Attack1.png',
            framesMax: 6,
        },
        takeHit: {
            imageSrc: './img/samuraiMack/Take Hit - white silhouette.png',
            framesMax: 4,
        },
        death: {
            imageSrc: './img/samuraiMack/Death.png',
            framesMax: 6,
        }
    },
    attackBox: {
        offset: {
            x: 100,
            y: 50
        },
        width: 160,
        height: 50
    }

});

let enemy = new Fighter ({
    position: {
        x: 500,
        y: 100
    },
    velocity: {
        x: 0,
        y: 0
    },
    color: 'blue',
    offset: {
        x: 215,
        y: 170
    },
    imageSrc: './img/kenji/Idle.png',
    scale: 2.5,
    sprites: {
        idle: {
            imageSrc: './img/kenji/Idle.png',
            framesMax: 4,
        },
        run: {
            imageSrc: './img/kenji/Run.png',
            framesMax: 8,
        },
        jump: {
            imageSrc: './img/kenji/Jump.png',
            framesMax: 2,
        },
        fall: {
            imageSrc: './img/kenji/Fall.png',
            framesMax: 2,
        },
        attack1: {
            imageSrc: './img/kenji/Attack1.png',
            framesMax: 4,
        },
        takeHit: {
            imageSrc: './img/kenji/Take hit.png',
            framesMax: 3,
        },
        death: {
            imageSrc: './img/kenji/Death.png',
            framesMax: 7,
        }
    },
    attackBox: {
        offset: {
            x: -160,
            y: 50
        },
        width: 170,
        height: 50
    }

});

const key = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    arrowLeft: {
        pressed: false
    },
    arrowRight: {
        pressed: false
    }
};

function animate() {
    window.requestAnimationFrame(animate);
    c.fillStyle='black';
    background.update();
    shop.update();
    c.fillStyle = 'rgba(255, 255, 255, 0.15)';
    c.fillRect(0, 0, canvas.width, canvas.height);
    hero.update();
    enemy.update();

    hero.velocity.x = 0;    
    enemy.velocity.x = 0;

    //hero movement
    if (hero.lastKey === 'd' && key.d.pressed) {
        hero.velocity.x = 5;
        hero.switchSprites('run');
    } else if 
    (hero.lastKey === 'a' && key.a.pressed) {
        hero.velocity.x = -5;
        hero.switchSprites('run');
    } else {
        hero.switchSprites('idle');
    }
    //jumping 
    if (hero.velocity.y < 0) {
        hero.switchSprites('jump');
    } else if (hero.velocity.y > 0) {
        hero.switchSprites('fall');
    }


    //enemy movement
    if (enemy.lastKey === 'ArrowRight' && key.arrowRight.pressed) {
        enemy.velocity.x = 5;
        enemy.switchSprites('run');
    } else if 
    (enemy.lastKey === 'ArrowLeft' && key.arrowLeft.pressed) {
        enemy.velocity.x = -5;
        enemy.switchSprites('run');
    } else {
        enemy.switchSprites('idle');
    }
    //jumping 
    if (enemy.velocity.y < 0) {
        enemy.switchSprites('jump');
    } else if (enemy.velocity.y > 0) {
        enemy.switchSprites('fall');
    }

    // detect if hero hits the enemy and substract health
    if (
        detectForCollision({
        rectangle1: hero, 
        rectangle2: enemy}) && 
        hero.isAttacking && hero.currentFrame == 4)
        {
        enemy.takeHit();
        gsap.to('#enemyHealth', {
            width: enemy.health + '%'
        });
        hero.isAttacking = false;
    }
    //player1 misses
    if (hero.isAttacking && hero.currentFrame === 4) {
        hero.isAttacking = false;
    }
    // detect if enemy hits hero and substract health
    if (
        detectForCollision({
        rectangle1: enemy, 
        rectangle2: hero}) && 
        enemy.isAttacking && enemy.currentFrame == 1)
        {
        hero.takeHit();
        gsap.to('#heroHealth', {
            width: hero.health + '%'
        });
        enemy.isAttacking = false;
    }
    //player2 misses
    if (enemy.isAttacking && enemy.currentFrame === 1) {
        enemy.isAttacking = false;
    }

    //determine winner when health bar = 0
    if (hero.health == 0 || enemy.health == 0) {
        determineWinner({hero, enemy, timerId});
    }
    
}

animate();


window.addEventListener('keydown', function(e) {

    if (!hero.dead) {
        switch (e.key) {
            case 'd': 
                hero.lastKey = 'd';
                key.d.pressed = true;
                break;
            case 'a': 
                hero.lastKey = 'a';
                key.a.pressed = true;
                break;
            case 'w':
                hero.velocity.y = -20;
                break;
            case ' ':
                hero.attack();
                break;
            }
    }
        
    //enemy cases
    if (!enemy.dead) {
        switch (e.key) {
            case 'ArrowRight': 
                enemy.lastKey = 'ArrowRight';
                key.arrowRight.pressed = true;
                break;
            case 'ArrowLeft': 
                enemy.lastKey = 'ArrowLeft';
                key.arrowLeft.pressed = true;
                break;
            case 'ArrowUp':
                enemy.velocity.y = -20;
                break;
            case 'ArrowDown':
                enemy.attack();
                break;
        }
    }
});
window.addEventListener('keyup', function(e) {
    switch(e.key) {
        case 'd': 
        key.d.pressed = false;
        break;
    case 'a': 
        key.a.pressed = false;
        break;
    //enemy cases
    case 'ArrowRight': 
        key.arrowRight.pressed = false;
        break;
    case 'ArrowLeft': 
        key.arrowLeft.pressed = false;
        break;
    }
});

