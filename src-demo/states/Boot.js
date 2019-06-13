import Phaser from 'phaser'

export default class Boot extends Phaser.State {
  preload () {
    if (!this.game.device.desktop) {
      this.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT
    }

    this.load.image('preloader', '../assets/preloader.gif')
  }

  create () {
    this.game.state.start('PreloadState')
  }
}
