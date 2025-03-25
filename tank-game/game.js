// 游戏常量
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const TANK_SIZE = 40;
const BULLET_SIZE = 8;
const PLAYER_SPEED = 5;
const ENEMY_SPEED = 2;
const GAME_AREA_PADDING = 50;
const WALL_SIZE = 40;

// 墙体定义 - 联通式布局
const walls = [
    // 外围墙
    {x: GAME_AREA_PADDING, y: GAME_AREA_PADDING, width: CANVAS_WIDTH - 2*GAME_AREA_PADDING, height: WALL_SIZE},
    {x: GAME_AREA_PADDING, y: CANVAS_HEIGHT - GAME_AREA_PADDING - WALL_SIZE, width: CANVAS_WIDTH - 2*GAME_AREA_PADDING, height: WALL_SIZE},
    {x: GAME_AREA_PADDING, y: GAME_AREA_PADDING, width: WALL_SIZE, height: CANVAS_HEIGHT - 2*GAME_AREA_PADDING},
    {x: CANVAS_WIDTH - GAME_AREA_PADDING - WALL_SIZE, y: GAME_AREA_PADDING, width: WALL_SIZE, height: CANVAS_HEIGHT - 2*GAME_AREA_PADDING},
    
    // 内部联通墙
    {x: 200, y: 200, width: 400, height: WALL_SIZE},
    {x: 200, y: 400, width: 400, height: WALL_SIZE},
    {x: 300, y: 200, width: WALL_SIZE, height: 200},
    {x: 500, y: 200, width: WALL_SIZE, height: 200}
];

// 游戏变量
let canvas, ctx;
// 获取安全的初始位置
function getSafePlayerPosition() {
    // 尝试底部中间位置
    let x = CANVAS_WIDTH / 2 - TANK_SIZE / 2;
    let y = CANVAS_HEIGHT - TANK_SIZE - 20;
    
    // 检查是否与墙体碰撞
    const tempTank = {x, y, width: TANK_SIZE, height: TANK_SIZE};
    if (!checkWallCollision(tempTank)) {
        return {x, y};
    }
    
    // 如果碰撞，尝试附近位置
    for (let offset = 1; offset <= 5; offset++) {
        // 尝试左右偏移
        for (let dir of [-1, 1]) {
            const newX = x + (offset * TANK_SIZE * dir);
            const newY = y;
            const tempTank = {x: newX, y: newY, width: TANK_SIZE, height: TANK_SIZE};
            if (!checkWallCollision(tempTank)) {
                return {x: newX, y: newY};
            }
        }
    }
    
    // 如果还是找不到，返回默认位置(可能部分重叠)
    return {x, y};
}

const safePos = getSafePlayerPosition();
let playerTank = {
    x: safePos.x,
    y: safePos.y,
    width: TANK_SIZE,
    height: TANK_SIZE,
    angle: Math.PI, // 180度(朝上)
    moving: false
};
let bullets = [];
let enemies = [];
let score = 0;
let lives = 3;
let gameRunning = false;
let gamePaused = false;
let currentRound = 1;
let enemiesInRound = 3;
let enemiesRemaining = 0;

// 键盘状态
const keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
    ' ': false
};

// 初始化游戏
function init() {
    canvas = document.getElementById('game-canvas');
    ctx = canvas.getContext('2d');
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;

    // 事件监听
    document.getElementById('start-btn').addEventListener('click', startGame);
    document.getElementById('pause-btn').addEventListener('click', togglePause);
    document.getElementById('restart-btn').addEventListener('click', restartGame);
    document.addEventListener('keydown', keyDownHandler);
    document.addEventListener('keyup', keyUpHandler);

    draw();
}

// 开始游戏
function startGame() {
    if (gameRunning) return;
    gameRunning = true;
    gamePaused = false;
    score = 0;
    lives = 3;
    currentRound = 1;
    enemies = [];
    bullets = [];
    spawnEnemies();
    updateScore();
    updateLives();
    gameLoop();
}

// 生成敌人(确保不生成在墙内)
function spawnEnemies() {
    enemiesRemaining = enemiesInRound;
    for (let i = 0; i < enemiesInRound; i++) {
        let x, y;
        let validPosition = false;
        
        // 尝试最多100次找到有效位置
        for (let j = 0; j < 100 && !validPosition; j++) {
            x = GAME_AREA_PADDING + Math.random() * (CANVAS_WIDTH - 2 * GAME_AREA_PADDING - TANK_SIZE);
            y = GAME_AREA_PADDING + Math.random() * (CANVAS_HEIGHT / 3 - TANK_SIZE);
            
            // 检查是否与墙体碰撞
            const tempTank = {x, y, width: TANK_SIZE, height: TANK_SIZE};
            validPosition = !checkWallCollision(tempTank);
        }
        
        if (validPosition) {
            enemies.push({
                x: x,
                y: y,
                width: TANK_SIZE,
                height: TANK_SIZE,
                angle: Math.random() * Math.PI * 2, // 随机角度
                moving: true
            });
        }
    }
}

// 游戏主循环
function gameLoop() {
    if (gamePaused || !gameRunning) return;

    update();
    draw();

    requestAnimationFrame(gameLoop);
}

// 更新游戏状态
function update() {
    // 更新玩家坦克
    if (playerTank.moving) {
        const oldX = playerTank.x;
        const oldY = playerTank.y;
        moveTank(playerTank);
        
        // 检测与墙体碰撞
        if (checkWallCollision(playerTank)) {
            playerTank.x = oldX;
            playerTank.y = oldY;
        }
    }

    // 更新敌人坦克
    enemies.forEach(enemy => {
        if (enemy.moving) {
            const oldX = enemy.x;
            const oldY = enemy.y;
            moveTank(enemy);
            
            // 检测与墙体碰撞
            if (checkWallCollision(enemy)) {
                enemy.x = oldX;
                enemy.y = oldY;
                enemy.angle = Math.random() * Math.PI * 2; // 随机新角度
            }
            
            // 随机改变方向
            if (Math.random() < 0.01) {
                enemy.angle = Math.random() * Math.PI * 2;
            }
        }
    });

    // 更新子弹
    bullets.forEach((bullet, index) => {
        moveBullet(bullet);
        
        // 检测子弹是否击中敌人
        enemies.forEach((enemy, enemyIndex) => {
            if (checkCollision(bullet, enemy)) {
                // 击中敌人
                enemies.splice(enemyIndex, 1);
                bullets.splice(index, 1);
                score++;
                enemiesRemaining--;
                updateScore();
                
                // 检查是否开始新的一轮
                if (enemiesRemaining <= 0) {
                    currentRound++;
                    setTimeout(spawnEnemies, 1000);
                }
                return;
            }
        });
        
        // 检测子弹是否击中墙体
        if (checkWallCollision(bullet)) {
            const hitWall = getCollidedWall(bullet);
            if (hitWall) {
                // 水平墙反弹
                if (hitWall.height === WALL_SIZE) {
                    bullet.angle = -bullet.angle; // 反转角度
                } 
                // 垂直墙反弹
                else {
                    bullet.angle = Math.PI - bullet.angle; // 反射角度
                }
            }
        }
    });
}

// 获取碰撞的墙体
function getCollidedWall(obj) {
    for (const wall of walls) {
        if (checkCollision(obj, wall)) {
            return wall;
        }
    }
    return null;
}

// 移动坦克
function moveTank(tank) {
    const speed = tank === playerTank ? PLAYER_SPEED : ENEMY_SPEED;
    
    tank.x += Math.cos(tank.angle) * speed;
    tank.y += Math.sin(tank.angle) * speed;
    
    // 边界检查
    if (tank.x < GAME_AREA_PADDING) tank.x = GAME_AREA_PADDING;
    if (tank.x > CANVAS_WIDTH - GAME_AREA_PADDING - TANK_SIZE) tank.x = CANVAS_WIDTH - GAME_AREA_PADDING - TANK_SIZE;
    if (tank.y < GAME_AREA_PADDING) tank.y = GAME_AREA_PADDING;
    if (tank.y > CANVAS_HEIGHT - GAME_AREA_PADDING - TANK_SIZE) tank.y = CANVAS_HEIGHT - GAME_AREA_PADDING - TANK_SIZE;
}

// 移动子弹
function moveBullet(bullet) {
    bullet.x += Math.cos(bullet.angle) * 10;
    bullet.y += Math.sin(bullet.angle) * 10;
    
    // 移除超出边界的子弹
    if (bullet.x < 0 || bullet.x > CANVAS_WIDTH || 
        bullet.y < 0 || bullet.y > CANVAS_HEIGHT) {
        const index = bullets.indexOf(bullet);
        if (index !== -1) bullets.splice(index, 1);
    }
}

// 碰撞检测
function checkCollision(obj1, obj2) {
    return obj1.x < obj2.x + obj2.width &&
           obj1.x + obj1.width > obj2.x &&
           obj1.y < obj2.y + obj2.height &&
           obj1.y + obj1.height > obj2.y;
}

// 检测与墙体碰撞
function checkWallCollision(obj) {
    for (const wall of walls) {
        if (checkCollision(obj, wall)) {
            return true;
        }
    }
    return false;
}

// 绘制游戏
function draw() {
    // 清空画布
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    // 绘制游戏区域边界
    ctx.strokeStyle = '#555';
    ctx.lineWidth = 2;
    ctx.strokeRect(GAME_AREA_PADDING, GAME_AREA_PADDING, 
                  CANVAS_WIDTH - 2 * GAME_AREA_PADDING, 
                  CANVAS_HEIGHT - 2 * GAME_AREA_PADDING);
    
    // 绘制墙体
    ctx.fillStyle = '#888';
    walls.forEach(wall => {
        ctx.fillRect(wall.x, wall.y, wall.width, wall.height);
    });
    
    // 绘制玩家坦克
    drawTank(playerTank, 'green');
    
    // 绘制敌人坦克
    enemies.forEach(enemy => drawTank(enemy, 'red'));
    
    // 绘制子弹
    bullets.forEach(bullet => {
        ctx.fillStyle = 'yellow';
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    });
}

// 绘制坦克
function drawTank(tank, color) {
    ctx.save();
    ctx.translate(tank.x + tank.width/2, tank.y + tank.height/2);
    ctx.rotate(tank.angle);
    
    // 坦克主体
    ctx.fillStyle = color;
    ctx.fillRect(-tank.width/2, -tank.height/2, tank.width, tank.height);
    
    // 炮管
    ctx.fillStyle = 'black';
    ctx.fillRect(0, -3, tank.width/2 + 10, 6);
    
    ctx.restore();
}

// 键盘事件处理
function keyDownHandler(e) {
    if (e.key in keys) {
        keys[e.key] = true;
        
        if (e.key === ' ') {
            // 发射子弹
            if (gameRunning && !gamePaused) {
                fireBullet();
            }
        } else {
            // 设置坦克移动状态
            playerTank.moving = true;
            
            // 根据按键调整角度
            if (e.key === 'ArrowLeft') playerTank.angle -= 0.1;
            if (e.key === 'ArrowRight') playerTank.angle += 0.1;
        }
    }
}

function keyUpHandler(e) {
    if (e.key in keys) {
        keys[e.key] = false;
        
        // 如果没有方向键按下，停止移动
        if (!keys.ArrowUp && !keys.ArrowDown && 
            !keys.ArrowLeft && !keys.ArrowRight) {
            playerTank.moving = false;
        }
    }
}

// 发射子弹
function fireBullet() {
    const bullet = {
        x: playerTank.x + playerTank.width/2 - BULLET_SIZE/2,
        y: playerTank.y + playerTank.height/2 - BULLET_SIZE/2,
        width: BULLET_SIZE,
        height: BULLET_SIZE,
        angle: playerTank.angle
    };
    
    bullets.push(bullet);
}

// 暂停/继续游戏
function togglePause() {
    if (!gameRunning) return;
    
    gamePaused = !gamePaused;
    document.getElementById('pause-btn').textContent = gamePaused ? '继续' : '暂停';
    
    if (!gamePaused) {
        gameLoop();
    }
}

// 重新开始游戏
function restartGame() {
    gameRunning = false;
    startGame();
}

// 更新分数显示
function updateScore() {
    document.getElementById('score').textContent = score;
}

// 更新生命显示
function updateLives() {
    document.getElementById('lives').textContent = lives;
}

// 启动游戏
window.onload = init;
