const covidGame = {
  title: 'Covid Game',
  author: 'Alex & Manu',
  license: undefined,
  version: '1.0.0',
  desciption: 'Kill the CO-VID',
  canvasDOM: undefined,
  ctx: undefined,
  intervalId: undefined,
  canvasSize: { width: undefined, height: undefined },
  background: undefined,
  player: undefined,
  framesCounter: 0,
  frames: 60,
  extraLife: [],
  obstacles: [],
  pressedLeft: false,
  pressedRight: false,
  directionChanged: false,
  keys: {
  player: {
      SPACE: " ",
      ARROW_LEFT: "ArrowLeft",
      ARROW_RIGHT: "ArrowRight"
      },
  },
  showImg: false,

  init() {
    this.setContext()
    this.setDimensions()
    this.createAll()
    this.setListeners()
    this.start()
  },

  start() {
    this.intervalId = setInterval(() => {

      this.framesCounter++
      if (this.framesCounter % 40 === 0) {
        this.createObstacles()
      }
      if (this.framesCounter % 1200 === 0) {
        this.createExtralife()
      }
      this.clearScreen()
      this.drawAll()
      this.moveAll()
      this.detectAllCollisions()
      sounds.game.play();
      sounds.game.volume = 0.5;

    }, 1000 / this.frames);
  },

  clearScreen() {
    this.ctx.clearRect(0, 0, this.canvasSize.width, this.canvasSize.height)
    this.drawPlayer
  },

  setContext() {
    this.canvasDOM = document.querySelector("#myCanvas")
    this.ctx = this.canvasDOM.getContext("2d")
  },

  setDimensions() {
    this.canvasDOM.setAttribute("width", 1000)
    this.canvasDOM.setAttribute("height", 800)
    this.canvasSize.width = 1000
    this.canvasSize.height = 800
  },

  setListeners() {

    document.onkeydown = (e) => {
      e.key === 'ArrowLeft' && (this.pressedLeft = true)
      e.key === 'ArrowRight' && (this.pressedRight = true)
      e.key === this.keys.player.SPACE ? this.player.shoot() : null
    }
    document.onkeyup = (e) => {  
      e.key === 'ArrowLeft' && (this.pressedLeft = false)
      e.key === 'ArrowRight' && (this.pressedRight = false)
    }

  },

  // Create

  createAll() {
    this.createPlayer()
    this.createScoreBoard()
    this.createObstacles()
    this.createLivesBoard()
    this.createBackground()
    this.createGameover()
    this.createDirectionChangedImg()
  },

  createPlayer() {
    this.player = new Player(this.ctx, this.canvasSize, this.canvasSize.width / 2 - 25, this.canvasSize.height - 170, 50, 165, "jeringa.png")
  },

  createLivesBoard() {
    this.lives = new Lives(this.ctx)
  },

  createBackground() {
    this.background = new Background(this.ctx, 0, 0, this.canvasSize.width, this.canvasSize.height, "backnone.png")
  },
  
  createScoreBoard() {
    this.scoreBoard = new Score(this.ctx)
  },
  
  createDirectionChangedImg() {
    this.directionChangedImg = new ChangeDirection(this.ctx, this.canvasSize.width / 2 - 150, this.canvasSize.height / 2 - 150, 400, 400, "direction.png")
  },

  createObstacles() { 
    let randomX = 0
    let randomSpeed = 0

    if (this.scoreBoard.points <= 10) {
      randomX = Math.floor(Math.random() * 950 + 10);
      randomSpeed = Math.floor(Math.random() * 1.2 + 1.5);
    }
    else if (this.scoreBoard.points > 10 && this.scoreBoard.points <= 15) {
      randomX = Math.floor(Math.random() * 950 + 10)
      randomSpeed = Math.floor(Math.random() * 1.2 + 1.9) 
    }
    else if (this.scoreBoard.points > 15 && this.scoreBoard.points <= 30) {
      randomX = Math.floor(Math.random() * 950 + 10)
      randomSpeed = Math.floor(Math.random() * 1.9 + 3.4) 
    }  
    else if (this.scoreBoard.points > 30 && this.scoreBoard.points <= 40) {
      randomX = Math.floor(Math.random() * 950 + 10)
      randomSpeed = Math.floor(Math.random() * 2 + 4) 
    }  
    else if (this.scoreBoard.points > 40) {
      randomX = Math.floor(Math.random() * 950 + 10)
      randomSpeed = Math.floor(Math.random() * 2 + 5) 
    }  

    this.obstacles.push(new Obstacle(this.ctx, randomX, 50, 70, 70, randomSpeed, "bacteria.png"))

  },

  createExtralife() {
    randomX = Math.floor(Math.random() * 950 + 10);
    randomSpeed = Math.floor(Math.random() * 1 + 2);
    this.extraLife.push(new ExtraLife(this.ctx, randomX, 50, 120, 70, randomSpeed, "mask.png"))
  },

  // Draw

  drawAll() {
    this.drawBackground()
    this.drawLivesBoard()
    this.drawScoreBoard()
    this.drawBullets()
    this.drawPlayer()
    this.drawExtraLife()
    this.drawObstacles()
    this.drawDirectionChangedImg()
  },

  drawPlayer() {
    this.player.draw()
  },

  drawLivesBoard() {
    this.lives.draw()
  },
  
  drawScoreBoard() {
    this.scoreBoard.draw()
  },

  drawBackground() {
    this.background.draw()
  },

  drawDirectionChangedImg() {
    this.directionChanged && this.directionChangedImg.draw()
  },

  drawBullets() {
    this.player.bullets.forEach(bullet => bullet.draw())
  },
  
  drawObstacles() {
    this.obstacles.forEach(obstacle => obstacle.draw())
  },

  drawExtraLife() {
    this.extraLife.forEach(exLife => exLife.draw())
  },


  // Move
  
  moveAll() {
    this.moveObstacles()
    this.moveExtraLife()
    this.movePlayer()
  },

  movePlayer() {
    if (this.scoreBoard.points < 15) {
      this.pressedLeft && this.player.moveLeft()
      this.pressedRight && this.player.moveRight()
    }
    else if (this.scoreBoard.points >= 15 && this.scoreBoard.points < 25) {
      this.pressedLeft && this.player.moveRight()
      this.pressedRight && this.player.moveLeft()
      if(this.directionChanged === false) this.showDirectionChange(null)
    }
    else if (this.scoreBoard.points >= 25){
      this.pressedLeft && this.player.moveLeft()
      this.pressedRight && this.player.moveRight()
      if (this.directionChanged === null) this.showDirectionChange(false)
    }
  },

  moveObstacles() {
    this.obstacles.forEach(obs => obs.move())
  },

  moveExtraLife() {
    this.extraLife.forEach(exLife => exLife.move())
  },

  
  // Collisions

  detectAllCollisions() {
    this.detectFloorCollision()
    this.detectExtraLife()
    this.detectCollision()
  },

  detectCollision() { 
    return this.player.bullets.some((bullet, bulletIndex) => {
      return this.obstacles.some((obstacle, obstacleIndex) => {
        if (bullet.pos.x < obstacle.posX + obstacle.width 
          && bullet.pos.x + bullet.width > obstacle.posX 
          && bullet.pos.y < obstacle.posY + obstacle.height
          && bullet.pos.y + bullet.height > obstacle.posY) {

            this.removeObstacle(obstacleIndex)
            this.removeBullet(bulletIndex)
            this.addPoints()
            return true
        } else {
          return false
        }
      })
    })
  },

  detectExtraLife() { 
    return this.player.bullets.some((bullet, bulletIndex) => {
      return this.extraLife.some((exLife, exLifeIndex) => {
        if (bullet.pos.x < exLife.posX + exLife.width 
        && bullet.pos.x + bullet.width > exLife.posX 
        && bullet.pos.y < exLife.posY + exLife.height
        && bullet.pos.y + bullet.height > exLife.posY) {

          this.removeExtraLife(exLifeIndex)
          this.removeBullet(bulletIndex)
          this.addLife()
          this.updateLivesMarker()
          return true
        } else {
          return false
        }
      })
    })
  },

  detectFloorCollision() {
    this.obstacles = this.obstacles.filter(obs => {
      if (obs.posY > this.canvasSize.height) {
        this.quitLives()
      } else {
        return true
      }
    })
  },



  // Add, update, remove, others

  addLife() {
    this.player.lives++
  },

  addPoints() {
    this.scoreBoard.points++
  },

  updateLivesMarker() {
    this.lives.playerLives = this.player.lives
  },

  removeExtraLife(index) {
    this.extraLife.splice(index, 1)
  },

  removeObstacle(index) {
    this.obstacles.splice(index, 1)
  },

  removeBullet(index) {
    this.player.bullets.splice(index, 1)
  },

  quitLives() {
    this.player.lives--
    this.updateLivesMarker()
    if (this.player.lives === 0) {
      sounds.game.pause();
      this.initGameover();
      
    }
  },

  showDirectionChange(endValue) {
    this.directionChanged = true
    setTimeout(() => this.directionChanged = endValue, 2000)
  },



  // Gameover

  initGameover() {
    clearInterval(this.intervalId)
    sounds.gameOver.play();
    sounds.gameOver.volume = 0.6;
    setTimeout(function(){ window.location.replace("./index.html");}, 2500);
    this.drawGameover() 
    
  },

  createGameover() {
    this.gameover = new Gameover(this.ctx, 0, 0, this.canvasSize.width, this.canvasSize.height, "gameover.png")
  },
  
  drawGameover() {
    this.gameover.draw()
  }

}