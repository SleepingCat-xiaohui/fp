import 'pixi'
import 'p2'
import Phaser from 'phaser'

import BootState from './states/Boot'
import PreloadState from './states/Preload'
import MenuState from './states/Menu'
import PlayState from './states/Play'

class Game extends Phaser.Game {
  constructor () {
    super(288, 505, Phaser.CANVAS, 'game')

    this.state.add('BootState', BootState, true)
    this.state.add('PreloadState', PreloadState)
    this.state.add('MenuState', MenuState)
    this.state.add('PlayState', PlayState)
  }
}

window.game = new Game() // eslint-disable-line
