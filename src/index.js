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
  tint: 0x55ff55,
  rainbow: false,
  rainbowIndex: 0,
  spin: false
}

var tints = [
  0xff70ff, // pink
  0xff5555, // red
  0xff8844, // orange
  0xffff55, // yellow
  0x55ff55, // green
  0x00ffff, // blue
  0x775599, // purple
  0x555555, // grey
  0xffffff // white
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
    // if (event.key.length === 1) console.log('event', event.key, event.key.charCodeAt())
    var letter = this.physics.add.sprite(keys.KEYS_X[event.key.toUpperCase()], HEIGHT - 30)

    var vector = {
      x: (Math.floor((Date.now() / 200) % 10) / 200) - 0.025,
      y: -1 * (HEIGHT / 3200)
    }

    letter.setTexture('letters', event.key.charCodeAt() + '.png')
    letter.setSizeToFrame()
    letter.setOrigin()
    letter.setBody(letter.x, letter.y, letter.width, letter.height)

    letter.applyForce(vector)
    letter.setFriction(0.001, 0, 0)
    letter.setBounce(0.9)
    if (state.spin) {
      letter.setAngularVelocity((Math.random() / 2) * (Math.random() < 0.5 ? -1 : 1))
    }
    letterGroup.add(letter)
    letter.setDensity(letter.body.density * 1.8)
    if (letter.body.mass < 2.5) letter.setMass(2.5)

    if (state.rainbow) {
      letter.setTint(tints[state.rainbowIndex])
      state.rainbowIndex = (state.rainbowIndex + 1) % tints.length
    } else {
      letter.setTint(state.tint)
    }

    fxLayer.add(letter)
  }.bind(this))

  fxLayer = this.add.effectLayer(0, 0, WIDTH, HEIGHT, 'bloom', bloom)

  var combos = {
    pink: function (state) {
      state.tint = tints[0]
    },
    red: function (state) {
      state.tint = tints[1]
    },
    orange: function (state) {
      state.tint = tints[2]
    },
    yellow: function (state) {
      state.tint = tints[3]
    },
    green: function (state) {
      state.tint = tints[4]
    },
    blue: function (state) {
      state.tint = tints[5]
    },
    purple: function (state) {
      state.tint = tints[6]
    },
    grey: function (state) {
      state.tint = tints[7]
    },
    white: function (state) {
      state.tint = tints[8]
    },
    rainbow: function (state) {
      state.rainbow = !state.rainbow
    },
    spin: function (state) {
      state.spin = !state.spin
    },
    fall: function (state) {
      state.fall = !state.fall
    }
  }
  combos.feross = combos.spin
  combos.gray = combos.grey
  combos.violet = combos.purple

  var self = this
  Object.keys(combos).forEach(function (combo) {
    self.input.keyboard.createCombo(combo, {resetOnMatch: true}).label = combo
  })

  this.input.keyboard.on('keycombomatch', function (event) {
    if (combos[event.label]) combos[event.label](state)
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
