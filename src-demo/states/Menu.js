import Phaser from 'phaser'

export default class Menu extends Phaser.State {
  create () {
    this.add.tileSprite(0, 0, this.game.width, this.game.height, 'background')
      .autoScroll(-20, 0)
    this.add.tileSprite(0, this.game.height - 112, this.game.width, 112, 'ground')
      .autoScroll(-100, 0)

    const titleGroup = this.add.group()
    this.add.image(0, 0, 'title', 0, titleGroup)
    this.add.sprite(190, 10, 'bird', 0, titleGroup)
      .animations.add('fly').play(12, true)
    titleGroup.x = 35
    titleGroup.y = 100

    this.add.tween(titleGroup).to({
      y: 120,
    }, 1000, null, true, 0, -1, true)

    this.add.button(this.game.width / 2, this.game.height / 2, 'btn', () => {
      this.game.state.start('PlayState')
    }).anchor.setTo(0.5)
  }
}
