// 游戏状态
let gameState = {
    running: false,
    paused: false,
    score: 0,
    level: 1,
    stage: 1,
    snake: [],
    food: {},
    obstacles: [],
    direction: 'right',
    nextDirection: 'right',
    gridSize: 20,
    tileSize: 20,
    speed: 250, // 降低初始速度
    foodEaten: 0,
    foodGoal: 5
};

// 获取DOM元素
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const levelElement = document.getElementById('level');
const stageElement = document.getElementById('stage');
const currentStageElement = document.getElementById('currentStage');
const foodGoalElement = document.getElementById('foodGoal');
const difficultyElement = document.getElementById('difficulty');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');

// 初始化游戏
function initGame() {
    // 初始化蛇
    gameState.snake = [
        { x: 10, y: 10 },
        { x: 9, y: 10 },
        { x: 8, y: 10 }
    ];
    
    // 生成食物
    generateFood();
    
    // 生成障碍物
    generateObstacles();
    
    // 重置游戏状态
    gameState.score = 0;
    gameState.level = 1;
    gameState.stage = 1;
    gameState.foodEaten = 0;
    gameState.foodGoal = 5;
    gameState.direction = 'right';
    gameState.nextDirection = 'right';
    gameState.speed = 150;
    
    // 更新UI
    updateUI();
    
    // 绘制初始状态
    draw();
}

// 生成食物
function generateFood() {
    let validPosition = false;
    let newFood;
    
    while (!validPosition) {
        newFood = {
            x: Math.floor(Math.random() * gameState.gridSize),
            y: Math.floor(Math.random() * gameState.gridSize)
        };
        
        // 检查食物是否生成在蛇身上或障碍物上
        validPosition = !gameState.snake.some(segment => 
            segment.x === newFood.x && segment.y === newFood.y
        ) && !gameState.obstacles.some(obstacle => 
            obstacle.x === newFood.x && obstacle.y === newFood.y
        );
    }
    
    gameState.food = newFood;
}

// 生成障碍物
function generateObstacles() {
    gameState.obstacles = [];
    const obstacleCount = Math.min(5 + gameState.stage * 2, 20);
    
    for (let i = 0; i < obstacleCount; i++) {
        let validPosition = false;
        let newObstacle;
        
        while (!validPosition) {
            newObstacle = {
                x: Math.floor(Math.random() * gameState.gridSize),
                y: Math.floor(Math.random() * gameState.gridSize),
                type: Math.random() > 0.7 ? 'moving' : 'fixed', // 30% 概率生成移动障碍物
                direction: ['up', 'down', 'left', 'right'][Math.floor(Math.random() * 4)],
                moveInterval: 20 // 移动障碍物的移动间隔
            };
            
            // 检查障碍物是否生成在蛇身上或其他障碍物上
            validPosition = !gameState.snake.some(segment => 
                segment.x === newObstacle.x && segment.y === newObstacle.y
            ) && !gameState.obstacles.some(obstacle => 
                obstacle.x === newObstacle.x && obstacle.y === newObstacle.y
            );
        }
        
        gameState.obstacles.push(newObstacle);
    }
}

// 更新移动障碍物
function updateObstacles() {
    gameState.obstacles.forEach(obstacle => {
        if (obstacle.type === 'moving') {
            obstacle.moveInterval--;
            if (obstacle.moveInterval <= 0) {
                // 保存当前位置
                const oldX = obstacle.x;
                const oldY = obstacle.y;
                
                // 移动障碍物
                switch (obstacle.direction) {
                    case 'up':
                        obstacle.y--;
                        break;
                    case 'down':
                        obstacle.y++;
                        break;
                    case 'left':
                        obstacle.x--;
                        break;
                    case 'right':
                        obstacle.x++;
                        break;
                }
                
                // 检查是否撞墙或其他障碍物
                if (obstacle.x < 0 || obstacle.x >= gameState.gridSize || 
                    obstacle.y < 0 || obstacle.y >= gameState.gridSize ||
                    gameState.obstacles.some(otherObstacle => 
                        otherObstacle !== obstacle && 
                        otherObstacle.x === obstacle.x && 
                        otherObstacle.y === obstacle.y
                    )) {
                    // 恢复原位置并改变方向
                    obstacle.x = oldX;
                    obstacle.y = oldY;
                    obstacle.direction = ['up', 'down', 'left', 'right'][Math.floor(Math.random() * 4)];
                }
                
                // 重置移动间隔
                obstacle.moveInterval = 20;
            }
        }
    });
}

// 更新游戏状态
function update() {
    if (!gameState.running || gameState.paused) return;
    
    // 更新方向
    gameState.direction = gameState.nextDirection;
    
    // 更新障碍物
    updateObstacles();
    
    // 计算新的蛇头位置
    const head = { ...gameState.snake[0] };
    
    switch (gameState.direction) {
        case 'up':
            head.y--;
            break;
        case 'down':
            head.y++;
            break;
        case 'left':
            head.x--;
            break;
        case 'right':
            head.x++;
            break;
    }
    
    // 检查碰撞
    if (checkCollision(head)) {
        gameOver();
        return;
    }
    
    // 将新头部添加到蛇的前面
    gameState.snake.unshift(head);
    
    // 检查是否吃到食物
    if (head.x === gameState.food.x && head.y === gameState.food.y) {
        gameState.score += 10;
        gameState.foodEaten++;
        generateFood();
        
        // 检查是否升级
        if (gameState.score % 50 === 0) {
            gameState.level++;
            // 增加游戏速度
            gameState.speed = Math.max(50, gameState.speed - 10);
        }
        
        // 检查是否完成关卡目标
        if (gameState.foodEaten >= gameState.foodGoal) {
            nextStage();
        }
        
        updateUI();
    } else {
        // 移除蛇尾
        gameState.snake.pop();
    }
    
    // 绘制游戏
    draw();
    
    // 设置下一次更新
    setTimeout(update, gameState.speed);
}

// 检查碰撞
function checkCollision(head) {
    // 检查边界碰撞
    if (head.x < 0 || head.x >= gameState.gridSize || 
        head.y < 0 || head.y >= gameState.gridSize) {
        return true;
    }
    
    // 检查自身碰撞
    for (let i = 1; i < gameState.snake.length; i++) {
        if (head.x === gameState.snake[i].x && head.y === gameState.snake[i].y) {
            return true;
        }
    }
    
    // 检查障碍物碰撞
    for (let i = 0; i < gameState.obstacles.length; i++) {
        if (head.x === gameState.obstacles[i].x && head.y === gameState.obstacles[i].y) {
            return true;
        }
    }
    
    return false;
}

// 绘制游戏
function draw() {
    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 绘制障碍物
    gameState.obstacles.forEach(obstacle => {
        ctx.fillStyle = obstacle.type === 'moving' ? '#ff5252' : '#f44336';
        ctx.fillRect(
            obstacle.x * gameState.tileSize,
            obstacle.y * gameState.tileSize,
            gameState.tileSize - 2,
            gameState.tileSize - 2
        );
    });
    
    // 绘制蛇
    ctx.fillStyle = '#4CAF50';
    gameState.snake.forEach(segment => {
        ctx.fillRect(
            segment.x * gameState.tileSize,
            segment.y * gameState.tileSize,
            gameState.tileSize - 2,
            gameState.tileSize - 2
        );
    });
    
    // 绘制食物
    ctx.fillStyle = '#2196f3';
    ctx.fillRect(
        gameState.food.x * gameState.tileSize,
        gameState.food.y * gameState.tileSize,
        gameState.tileSize - 2,
        gameState.tileSize - 2
    );
}

// 游戏结束
function gameOver() {
    gameState.running = false;
    alert(`You are loser.`);
}

// 进入下一关
function nextStage() {
    gameState.stage++;
    
    // 检查是否通关所有关卡
    if (gameState.stage > 10) {
        gameState.running = false;
        alert(`恭喜通关！\n总分数: ${gameState.score}\n总等级: ${gameState.level}`);
        initGame();
        return;
    }
    
    // 初始化新关卡
    gameState.snake = [
        { x: 10, y: 10 },
        { x: 9, y: 10 },
        { x: 8, y: 10 }
    ];
    
    gameState.foodEaten = 0;
    gameState.foodGoal = Math.min(5 + gameState.stage, 15);
    gameState.speed = Math.max(80, 250 - (gameState.stage - 1) * 20);
    
    generateFood();
    generateObstacles();
    
    updateUI();
    draw();
    
    // 显示关卡切换信息
    alert(`你成功了`);
}

// 更新UI
function updateUI() {
    scoreElement.textContent = gameState.score;
    levelElement.textContent = gameState.level;
    stageElement.textContent = gameState.stage;
    currentStageElement.textContent = gameState.stage;
    foodGoalElement.textContent = gameState.foodGoal;
    
    // 更新难度显示
    let difficultyText;
    if (gameState.stage <= 3) {
        difficultyText = '简单';
    } else if (gameState.stage <= 6) {
        difficultyText = '中等';
    } else {
        difficultyText = '困难';
    }
    difficultyElement.textContent = difficultyText;
}

// 键盘事件处理
function handleKeyPress(e) {
    switch (e.key) {
        case 'ArrowUp':
            if (gameState.direction !== 'down') {
                gameState.nextDirection = 'up';
            }
            break;
        case 'ArrowDown':
            if (gameState.direction !== 'up') {
                gameState.nextDirection = 'down';
            }
            break;
        case 'ArrowLeft':
            if (gameState.direction !== 'right') {
                gameState.nextDirection = 'left';
            }
            break;
        case 'ArrowRight':
            if (gameState.direction !== 'left') {
                gameState.nextDirection = 'right';
            }
            break;
        case ' ': // 空格键暂停/继续
            togglePause();
            break;
    }
}

// 切换暂停状态
function togglePause() {
    if (!gameState.running) return;
    
    gameState.paused = !gameState.paused;
    
    if (!gameState.paused) {
        update();
    }
}

// 事件监听器
startBtn.addEventListener('click', () => {
    if (!gameState.running) {
        gameState.running = true;
        gameState.paused = false;
        update();
    }
});

pauseBtn.addEventListener('click', togglePause);

resetBtn.addEventListener('click', () => {
    gameState.running = false;
    gameState.paused = false;
    initGame();
});

// 键盘事件监听
document.addEventListener('keydown', handleKeyPress);

// 初始化游戏
initGame();