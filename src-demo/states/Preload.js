import Phaser from 'phaser'

export default class Preload extends Phaser.State {
  preload () {
    const preloader = this.add.sprite(this.game.width / 2, this.game.height / 2, 'preloader')
    preloader.anchor.setTo(0.5)
    this.load.setPreloadSprite(preloader)

    this.load.spritesheet('bird', '../assets/bird.png', 34, 24, 3)
    this.load.spritesheet('pipe', '../assets/pipes.png', 54, 320, 2)
    this.load.bitmapFont('flappy_font', '../assets/fonts/font.png', '../assets/fonts/font.fnt')
    this.load.image('background', '../assets/background.png')
    this.load.image('ground', '../assets/ground.png')
    this.load.image('title', '../assets/title.png')
    this.load.image('btn', '../assets/start-button.png')
    this.load.image('ready_text', '../assets/get-ready.png')
    this.load.image('play_tip', '../assets/instructions.png')
    this.load.image('game_over', '../assets/gameover.png')
    this.load.image('score_board', '../assets/scoreboard.png')
    this.load.audio('fly_sound', '../assets/flap.wav')
    this.load.audio('score_sound', '../assets/score.wav')
    this.load.audio('hit_pipe_sound', '../assets/pipe-hit.wav')
    this.load.audio('hit_ground_sound', '../assets/ouch.wav')
  }

  create () {
    this.game.state.start('MenuState')
  }
}
