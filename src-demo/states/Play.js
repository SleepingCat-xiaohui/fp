import Phaser from 'phaser'

export default class PlayState extends Phaser.State {
  create () {
    this.background = this.add.tileSprite(0, 0, this.game.width, this.game.height, 'background')
    this.pipeGroup = this.add.physicsGroup()
    this.ground = this.add.tileSprite(0, this.game.height - 112, this.game.width, 112, 'ground')
    this.game.physics.enable(this.ground)
    this.ground.body.immovable = true

    this.scroeText = this.add.bitmapText(this.game.width / 2, 50, 'flappy_font', '0', 30)
    this.scroeText.anchor.setTo(0.5)
    this.readyText = this.add.image(this.game.width / 2, 60, 'ready_text')
    this.readyText.anchor.setTo(0.5)
    this.playTip = this.add.image(this.game.width / 2, 350, 'play_tip')
    this.playTip.anchor.setTo(0.5)

    this.bird = this.add.sprite(50, 150, 'bird')
    this.game.physics.enable(this.bird)
    this.bird.anchor.setTo(0.5)
    this.bird.animations.add('fly').play(12, true)

    this.flySound = this.add.sound('fly_sound')
    this.hitPipeSound = this.add.sound('hit_pipe_sound')
    this.hitGroundSound = this.add.sound('hit_ground_sound')
    this.scoreSound = this.add.sound('score_sound')

    this.input.onDown.addOnce(this.startGame, this)
  }

  update () {
    if (!this.started) return
    if (!this.hasHitGround) {
      this.game.physics.arcade.collide(this.bird, this.ground, this.hitGround, null, this)
    }
    if (!this.hasHitPipe) {
      this.game.physics.arcade.overlap(this.bird, this.pipeGroup, this.hitPipe, null, this)
    }

    if (!this.bird.inWorld) this.hitPipe()

    if (this.bird.angle < 90) this.bird.angle += 2.5

    this.pipeGroup.forEachExists((pipe) => {
      if (!pipe.score && pipe.y <= 0 && pipe.x <= this.bird.x - 54) {
        pipe.score = true
        this.scroeText.text = ++this.score
        this.scoreSound.play()
      }
    })
  }

  startGame () {
    this.gameSpeed = 200
    this.score = 0
    this.started = true
    this.hasHitGround = false
    this.hasHitPipe = false
    this.bird.body.gravity.y = 1150
    this.readyText.destroy()
    this.playTip.destroy()
    this.background.autoScroll(-this.gameSpeed / 10, 0)
    this.ground.autoScroll(-this.gameSpeed, 0)

    this.input.onDown.add(this.fly, this)
    this.time.events.loop(900, this.generatePipe, this)
    this.time.events.start()
  }

  generatePipe () {
    const gap = 150
    const pipeMinHeight = 100
    const topPipeY = 50 + Math.floor((505 - 112 - gap - pipeMinHeight) * Math.random()) - 320
    const btmPipeY = topPipeY + 320 + gap

    let resetTopPipe = null
    let resetBtmPipe = null
    this.pipeGroup.forEachDead(pipe => {
      if (pipe.y <= 0) resetTopPipe = pipe
      else resetBtmPipe = pipe
    })
    if (resetTopPipe && resetBtmPipe) {
      resetTopPipe.score = false
      resetTopPipe.reset(this.game.width, topPipeY)
      resetBtmPipe.reset(this.game.width, btmPipeY)
      resetTopPipe.body.velocity.x = -this.gameSpeed
      resetBtmPipe.body.velocity.x = -this.gameSpeed
      return
    }

    this.pipeGroup.create(this.game.width, topPipeY, 'pipe', 0)
    this.pipeGroup.create(this.game.width, btmPipeY, 'pipe', 1)

    this.pipeGroup.setAll('checkWorldBounds', true)
    this.pipeGroup.setAll('outOfBoundsKill', true)
    this.pipeGroup.setAll('body.velocity.x', -this.gameSpeed)
  }

  fly () {
    this.flySound.play()
    this.bird.body.velocity.y = -350
    this.bird.angle = -30
  }

  hitGround () {
    this.hitGroundSound.play()
    this.hasHitGround = true
    this.gameOver()
  }

  hitPipe () {
    this.hitPipeSound.play()
    this.hasHitPipe = true
    this.gameOver()
  }

  gameOver () {
    this.bird.animations.stop('fly')
    this.scroeText.destroy()
    this.background.stopScroll()
    this.ground.stopScroll()
    this.input.onDown.remove(this.fly, this)

    this.pipeGroup.setAll('body.velocity.x', 0)
    this.time.events.stop(true)

    if (this.hasHitGround) {
      this.started = false
      this.bird.body.gravity.y = 0

      this.gameOverGroup = this.add.group()
      this.gameOverGroup.create(this.game.width / 2, 60, 'game_over').anchor.setTo(0.5)
      this.gameOverGroup.create(this.game.width / 2, 160, 'score_board').anchor.setTo(0.5)
      this.game.bestScore = Math.max((this.game.bestScore || 0), this.score)
      this.add.bitmapText(210, 150, 'flappy_font', this.score + '', 20, this.gameOverGroup)
        .anchor.setTo(0.5)
      this.add.bitmapText(210, 200, 'flappy_font', this.game.bestScore + '', 20, this.gameOverGroup)
        .anchor.setTo(0.5)
      this.add.button(this.game.width / 2, 260, 'btn', () => {
        this.game.state.start('PlayState')
      }, this, null, null, null, null, this.gameOverGroup).anchor.setTo(0.5)
      this.add.tween(this.gameOverGroup).from({
        y: -300,
      }, 500, Phaser.Easing.Back.Out, true)
    }
  }
}
