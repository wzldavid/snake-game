// snake/index.js
Page({
  data: {
    // 游戏区域大小
    canvasWidth: 300,
    canvasHeight: 400,
    // 蛇的属性
    snake: [],
    // 食物的位置
    food: {},
    // 游戏状态
    gameState: 'ready', // ready, playing, over
    // 分数
    score: 0,
    // 游戏速度
    speed: 150,
    // 方向
    direction: 'right',
    // 定时器
    timer: null
  },

  onLoad() {
    // 初始化游戏
    this.initGame();
  },

  onUnload() {
    // 清除定时器
    if (this.data.timer) {
      clearInterval(this.data.timer);
    }
  },

  // 初始化游戏
  initGame() {
    // 初始化蛇的位置
    const initialSnake = [
      { x: 5, y: 5 },
      { x: 4, y: 5 },
      { x: 3, y: 5 }
    ];

    // 生成初始食物
    const initialFood = this.generateFood();

    this.setData({
      snake: initialSnake,
      food: initialFood,
      gameState: 'ready',
      score: 0,
      direction: 'right'
    });

    // 绘制游戏
    this.drawGame();
  },

  // 开始游戏
  startGame() {
    if (this.data.gameState === 'playing') return;

    this.setData({
      gameState: 'playing'
    });

    // 清除之前的定时器
    if (this.data.timer) {
      clearInterval(this.data.timer);
    }

    // 设置新的定时器
    const timer = setInterval(() => {
      this.moveSnake();
    }, this.data.speed);

    this.setData({
      timer: timer
    });
  },

  // 暂停游戏
  pauseGame() {
    if (this.data.gameState !== 'playing') return;

    this.setData({
      gameState: 'ready'
    });

    // 清除定时器
    if (this.data.timer) {
      clearInterval(this.data.timer);
      this.setData({
        timer: null
      });
    }
  },

  // 重新开始游戏
  restartGame() {
    // 清除定时器
    if (this.data.timer) {
      clearInterval(this.data.timer);
    }

    // 重新初始化游戏
    this.initGame();
  },

  // 移动蛇
  moveSnake() {
    const { snake, food, direction, canvasWidth, canvasHeight } = this.data;
    
    // 复制蛇的头部
    const head = { ...snake[0] };

    // 根据方向移动头部
    switch (direction) {
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

    // 检查是否撞墙
    if (head.x < 0 || head.x >= canvasWidth / 10 || head.y < 0 || head.y >= canvasHeight / 10) {
      this.gameOver();
      return;
    }

    // 检查是否撞到自己
    for (let i = 1; i < snake.length; i++) {
      if (head.x === snake[i].x && head.y === snake[i].y) {
        this.gameOver();
        return;
      }
    }

    // 检查是否吃到食物
    if (head.x === food.x && head.y === food.y) {
      // 增加分数
      const newScore = this.data.score + 10;
      
      // 生成新的食物
      const newFood = this.generateFood();
      
      // 更新数据
      this.setData({
        score: newScore,
        food: newFood
      });
      
      // 蛇的长度增加
      snake.unshift(head);
    } else {
      // 蛇的长度不变，移动身体
      snake.unshift(head);
      snake.pop();
    }

    // 更新蛇的位置
    this.setData({
      snake: snake
    });

    // 绘制游戏
    this.drawGame();
  },

  // 生成食物
  generateFood() {
    const { snake, canvasWidth, canvasHeight } = this.data;
    
    let foodX, foodY;
    let isFoodOnSnake;

    do {
      isFoodOnSnake = false;
      // 随机生成食物位置
      foodX = Math.floor(Math.random() * (canvasWidth / 10));
      foodY = Math.floor(Math.random() * (canvasHeight / 10));

      // 检查食物是否在蛇身上
      for (let i = 0; i < snake.length; i++) {
        if (foodX === snake[i].x && foodY === snake[i].y) {
          isFoodOnSnake = true;
          break;
        }
      }
    } while (isFoodOnSnake);

    return { x: foodX, y: foodY };
  },

  // 游戏结束
  gameOver() {
    this.setData({
      gameState: 'over'
    });

    // 清除定时器
    if (this.data.timer) {
      clearInterval(this.data.timer);
      this.setData({
        timer: null
      });
    }
  },

  // 绘制游戏
  drawGame() {
    const { snake, food, canvasWidth, canvasHeight } = this.data;
    
    // 获取画布上下文
    const ctx = wx.createCanvasContext('snakeCanvas', this);
    
    // 清空画布
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    
    // 绘制背景
    ctx.setFillStyle('#f0f0f0');
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    
    // 绘制蛇
    for (let i = 0; i < snake.length; i++) {
      if (i === 0) {
        // 蛇头
        ctx.setFillStyle('#333333');
      } else {
        // 蛇身
        ctx.setFillStyle('#666666');
      }
      ctx.fillRect(snake[i].x * 10, snake[i].y * 10, 10, 10);
    }
    
    // 绘制食物
    ctx.setFillStyle('#ff0000');
    ctx.fillRect(food.x * 10, food.y * 10, 10, 10);
    
    // 绘制分数
    ctx.setFillStyle('#333333');
    ctx.setFontSize(16);
    ctx.fillText(`分数: ${this.data.score}`, 10, 20);
    
    // 绘制游戏状态
    if (this.data.gameState === 'ready') {
      ctx.setFillStyle('#333333');
      ctx.setFontSize(16);
      ctx.fillText('点击开始游戏', 100, 200);
    } else if (this.data.gameState === 'over') {
      ctx.setFillStyle('#ff0000');
      ctx.setFontSize(20);
      ctx.fillText('游戏结束', 100, 200);
      ctx.setFontSize(16);
      ctx.fillText('点击重新开始', 90, 230);
    }
    
    // 绘制方向提示
    ctx.setFillStyle('#999999');
    ctx.setFontSize(14);
    ctx.fillText('使用方向键控制', 10, 380);
    
    // 执行绘制
    ctx.draw();
  },

  // 处理触摸事件
  handleTouchStart(e) {
    this.touchStartX = e.touches[0].clientX;
    this.touchStartY = e.touches[0].clientY;
  },

  handleTouchEnd(e) {
    if (this.data.gameState !== 'playing') return;

    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    
    const deltaX = touchEndX - this.touchStartX;
    const deltaY = touchEndY - this.touchStartY;
    
    // 确定移动方向
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // 水平移动
      if (deltaX > 0 && this.data.direction !== 'left') {
        this.setData({ direction: 'right' });
      } else if (deltaX < 0 && this.data.direction !== 'right') {
        this.setData({ direction: 'left' });
      }
    } else {
      // 垂直移动
      if (deltaY > 0 && this.data.direction !== 'up') {
        this.setData({ direction: 'down' });
      } else if (deltaY < 0 && this.data.direction !== 'down') {
        this.setData({ direction: 'up' });
      }
    }
  },

  // 处理按钮点击事件
  handleButtonClick() {
    const { gameState } = this.data;
    
    if (gameState === 'ready') {
      this.startGame();
    } else if (gameState === 'over') {
      this.restartGame();
    }
  }
});