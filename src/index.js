/* global Phaser */
import 'phaser'
import bloom from './shaders/bloom.glsl'
import * as keys from './keys'

var WIDTH = window.innerWidth
var HEIGHT = window.innerHeight

var config = {
  type: Phaser.WEBGL,
  parent: 'phaser-example',
  width: WIDTH,
  height: HEIGHT,
  backgroundColor: '#2d2d2d',
  scene: {
    preload: preload,
    create: create,
    update: update
  },
  physics: {
    default: 'matter',
    matter: {
      debug: false
    }
  }
}

var state = {
  tint: 0x77ff77,
  rainbow: 0
}

var tints = [
  0x77ff77,
  0xff7777,
  0x7777ff,
  0x77ffff,
  0xffff77,
  0xff77ff,
  0xffffff,
  0x777777
]

function onResize () {
  window.location.reload() // HACK: waiting for ScaleManager :)
}
window.addEventListener('resize', onResize)

window.game = new Phaser.Game(config)
var letterGroup
var fxLayer

function preload () {
  this.load.image('logo', 'assets/logo.png')
  this.load.atlas('letters', 'assets/letters.png', 'assets/letters.json')
}

function create () {
  state.txt = this.add.text(10, 10, 'Letters: 0')

  var bumper = this.physics.add.sprite(WIDTH / 2, HEIGHT + 64, 'orange')

  bumper.setBody({
    type: 'trapezoid',
    width: WIDTH,
    height: 64,
    slope: 1
  })
  bumper.setFriction(0.001, 0, 0)
  bumper.setStatic(true)

  letterGroup = this.add.group()

  this.input.keyboard.on('keydown', function (event) {

    var vector = {
      x: (Math.floor((Date.now() / 200) % 10) / 200) - 0.025,
      y: -1 * (HEIGHT / 3200)
    }

    letter.setTexture('letters', event.data.key.charCodeAt() + '.png')
    letter.setSizeToFrame()
    letter.setOrigin()
    letter.setBody(letter.x, letter.y, letter.width, letter.height)

    letter.applyForce(vector)
    letter.setFriction(0.001, 0, 0)
    letter.setBounce(0.9)
    letterGroup.add(letter)
    letter.setTint(tints[state.rainbow])
    letter.setMass(3.5)
    state.rainbow = (state.rainbow + 1) % tints.length
    fxLayer.add(letter)
  }.bind(this))

  fxLayer = this.add.effectLayer(0, 0, WIDTH, HEIGHT, 'bloom', bloom)

    //  Here we'll create a simple key combo
    //  When you type in ABCD the event will be triggered on the entry of the final character (D)
    //  An incorrect key press will reset the combo back to the start again

  var combo = this.input.keyboard.createCombo('ABCD')

  this.input.keyboard.events.on('KEY_COMBO_MATCH_EVENT', function (event) {
    console.log('Key Combo matched!')
    console.log('event.data:', event.data)
    console.log('event.target:', event.target)
  })
}

function update () {
  state.txt.setText('Letters: ' + letterGroup.children.size)

  letterGroup.getChildren().forEach(function (c) {
    if (c.y > HEIGHT + 150) {
      letterGroup.remove(c)
      c.destroy()
    }
  })
}
