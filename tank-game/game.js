// 游戏常量
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const TANK_SIZE = 40;
const BULLET_SIZE = 8;
const PLAYER_ACCEL = 0.2;
const ROTATION_SPEED = 0.05;
const FRICTION = 0.93;
const MAX_SPEED = 5;
const ENEMY_SPEED = 2;
const GAME_AREA_PADDING = 50;
const WALL_SIZE = 40;
const FIRE_COOLDOWN = 300;

// 新增视觉特效常量
const PARTICLE_COLORS = ['#FF0000', '#FFA500', '#FFFF00', '#00FF00', '#0000FF'];
const LIGHT_COLORS = {
  tank: '#FFD700',
  bullet: '#FF4500', 
  explosion: '#FF8C00'
};
const MAX_PARTICLES = 100;

// 墙体定义
const walls = [
    {x: GAME_AREA_PADDING, y: GAME_AREA_PADDING, width: CANVAS_WIDTH - 2*GAME_AREA_PADDING, height: WALL_SIZE},
    {x: GAME_AREA_PADDING, y: CANVAS_HEIGHT - GAME_AREA_PADDING - WALL_SIZE, width: CANVAS_WIDTH - 2*GAME_AREA_PADDING, height: WALL_SIZE},
    {x: GAME_AREA_PADDING, y: GAME_AREA_PADDING, width: WALL_SIZE, height: CANVAS_HEIGHT - 2*GAME_AREA_PADDING},
    {x: CANVAS_WIDTH - GAME_AREA_PADDING - WALL_SIZE, y: GAME_AREA_PADDING, width: WALL_SIZE, height: CANVAS_HEIGHT - 2*GAME_AREA_PADDING},
    {x: 200, y: 200, width: 400, height: WALL_SIZE},
    {x: 200, y: 400, width: 400, height: WALL_SIZE},
    {x: 300, y: 200, width: WALL_SIZE, height: 200},
    {x: 500, y: 200, width: WALL_SIZE, height: 200}
];

// 游戏变量
let canvas, ctx;
let playerTank = {
    x: 0,
    y: 0,
    width: TANK_SIZE,
    height: TANK_SIZE,
    angle: Math.PI,
    velocity: 0,
    rotate: 0
};
let bullets = [];
let enemies = [];
let particles = []; // 新增粒子系统
let score = 0;
let lives = 3;
let gameRunning = false;
let gamePaused = false;
let currentRound = 1;
let enemiesInRound = 3;
let enemiesRemaining = 0;
let lastFire = 0;

// 新增粒子类
class Particle {
  constructor(x, y, color, size, velocity, life) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.size = size;
    this.velocity = velocity;
    this.life = life;
    this.alpha = 1.0;
  }

  update() {
    this.x += this.velocity.x;
    this.y += this.velocity.y;
    this.life--;
    this.alpha = this.life / 100;
    this.size *= 0.98;
  }

  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

// 新增特效函数
function createExplosion(x, y, color, count=30) {
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 3 + 1;
    particles.push(
      new Particle(
        x, y,
        color,
        Math.random() * 5 + 2,
        {
          x: Math.cos(angle) * speed,
          y: Math.sin(angle) * speed
        },
        Math.random() * 60 + 40
      )
    );
  }
}

function drawLightEffect(x, y, color, radius) {
  const gradient = ctx.createRadialGradient(
    x, y, 0,
    x, y, radius
  );
  gradient.addColorStop(0, color);
  gradient.addColorStop(1, 'rgba(0,0,0,0)');
  
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

// 修改后的draw函数
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // 绘制背景
  ctx.fillStyle = '#333';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 绘制墙体
  ctx.fillStyle = '#888';
  walls.forEach(wall => {
    ctx.fillRect(wall.x, wall.y, wall.width, wall.height);
  });

  // 更新并绘制粒子
  particles = particles.filter(p => p.life > 0);
  particles.forEach(p => {
    p.update();
    p.draw(ctx);
  });

  // 绘制坦克光照效果
  drawLightEffect(
    playerTank.x + TANK_SIZE/2,
    playerTank.y + TANK_SIZE/2,
    LIGHT_COLORS.tank,
    60
  );

  // 绘制坦克
  ctx.save();
  ctx.translate(playerTank.x + TANK_SIZE/2, playerTank.y + TANK_SIZE/2);
  ctx.rotate(playerTank.angle);
  ctx.fillStyle = '#4CAF50';
  ctx.fillRect(-TANK_SIZE/2, -TANK_SIZE/2, TANK_SIZE, TANK_SIZE);
  ctx.fillStyle = '#8BC34A';
  ctx.fillRect(0, -5, TANK_SIZE/2, 10);
  ctx.restore();

  // 绘制子弹
  bullets.forEach(bullet => {
    drawLightEffect(bullet.x, bullet.y, LIGHT_COLORS.bullet, 20);
    ctx.fillStyle = '#FF5722';
    ctx.beginPath();
    ctx.arc(bullet.x, bullet.y, BULLET_SIZE, 0, Math.PI * 2);
    ctx.fill();
  });

  // 绘制敌人
  enemies.forEach(enemy => {
    ctx.save();
    ctx.translate(enemy.x + TANK_SIZE/2, enemy.y + TANK_SIZE/2);
    ctx.rotate(enemy.angle);
    ctx.fillStyle = '#F44336';
    ctx.fillRect(-TANK_SIZE/2, -TANK_SIZE/2, TANK_SIZE, TANK_SIZE);
    ctx.fillStyle = '#E91E63';
    ctx.fillRect(0, -5, TANK_SIZE/2, 10);
    ctx.restore();
  });

  if (!gameRunning) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#FFF';
    ctx.font = '48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('TANK GAME', canvas.width/2, canvas.height/2 - 50);
    ctx.font = '24px Arial';
    ctx.fillText('点击开始游戏', canvas.width/2, canvas.height/2 + 50);
  }

  if (gamePaused) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#FFF';
    ctx.font = '36px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('游戏暂停', canvas.width/2, canvas.height/2);
  }

  requestAnimationFrame(draw);
}

// 修改fireBullet函数添加特效
function fireBullet() {
  const now = Date.now();
  if (now - lastFire > FIRE_COOLDOWN) {
    const bullet = {
      x: playerTank.x + TANK_SIZE/2 + Math.cos(playerTank.angle) * TANK_SIZE/2,
      y: playerTank.y + TANK_SIZE/2 + Math.sin(playerTank.angle) * TANK_SIZE/2,
      angle: playerTank.angle,
      speed: 10
    };
    bullets.push(bullet);
    lastFire = now;
    
    // 添加射击特效
    createExplosion(bullet.x, bullet.y, LIGHT_COLORS.bullet, 10);
  }
}

// 其他原有函数保持不变...
window.onload = init;
