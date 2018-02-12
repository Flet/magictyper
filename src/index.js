/* global Phaser */
import 'phaser'
import glitch from './shaders/glitch.glsl'
import pixelate from './shaders/pixelate.glsl'
import bloom from './shaders/bloom.glsl'

import * as keys from './keys'

var WIDTH = window.innerWidth
var HEIGHT = window.innerHeight

var config = {
  type: Phaser.WEBGL,
  parent: 'magictyper',
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
  color: 'green',
  mods: {
    rainbow: false,
    spin: false,
    glitch: false,
    pixel: false
  },
  rainbowIndex: 0,
  combomatch: false
}

var colors = {
  pink: 0xff70ff,
  red: 0xff5555,
  orange: 0xff8844,
  yellow: 0xffff55,
  green: 0x55ff55,
  blue: 0x00ffff,
  purple: 0x775599,
  grey: 0x555555,
  white: 0xffffff
}

var rainbowPattern = Object.values(colors)

function onResize () {
  window.location.reload() // HACK: waiting for ScaleManager :)
}
window.addEventListener('resize', onResize)

window.game = new Phaser.Game(config)
var letterGroup
var glowLayer, glitchLayer, pixelateLayer
var particles
var type
var allCombos = []

function preload () {
  this.load.image('logo', 'assets/logo.png')
  this.load.atlas('letters', 'assets/letters.png', 'assets/letters.json')
  this.load.audio('type', 'assets/type.mp3')
}

function create () {
  type = this.sound.add('type')

  state.txt = this.add.text(10, 10, '')
  var bumper = this.matter.add.sprite(WIDTH / 2, HEIGHT + 64)

  bumper.setBody({
    type: 'trapezoid',
    width: WIDTH,
    height: 64,
    slope: 1
  })
  bumper.setFriction(0.001, 0, 0)
  bumper.setStatic(true)

  letterGroup = this.add.group()

  particles = this.add.particles('letters')
  var comboEmitter = particles.createEmitter({
    frame: '42.png',
    tint: 0x00ffff,
    lifespan: 300,
    scale: { start: 0.5, end: 0.1 },
    speed: { min: 200, max: 400 },
    angle: { min: 200, max: 300 },
    quantity: 10,
    on: false
  })

  this.input.keyboard.on('keydown', function (event) {
    var isPartOfCombo = allCombos.some(function (c) { return c.progress > 0 })

    // if (event.key.length === 1) console.log('event', event.key, event.key.charCodeAt())

    var letter = this.matter.add.sprite(keys.KEYS_X[event.key.toUpperCase()], HEIGHT - 30)

    var vector = {
      x: (Math.floor((Date.now() / 200) % 10) / 200) - 0.025,
      y: -1 * (HEIGHT / 3200)
    }
    var textureName = event.key.charCodeAt() + '.png'
    letter.setTexture('letters', textureName)
    letter.setSizeToFrame()
    letter.setOrigin()
    letter.setBody(letter.x, letter.y, letter.width, letter.height)

    letter.applyForce(vector)
    letter.setFriction(0.001, 0, 0)
    letter.setBounce(0.9)
    if (state.mods.spin) {
      letter.setAngularVelocity((Math.random() / 2) * (Math.random() < 0.5 ? -1 : 1))
    }
    letterGroup.add(letter)
    letter.setDensity(letter.body.density * 1.8)
    if (letter.body.mass < 2.7) letter.setMass(2.7)

    if (state.mods.rainbow) {
      letter.setTint(rainbowPattern[state.mods.rainbowIndex])
      state.mods.rainbowIndex = (state.mods.rainbowIndex + 1) % rainbowPattern.length
    } else {
      letter.setTint(colors[state.color])
    }

    glowLayer.add(letter)

    if (state.mods.glitch) {
      glitchLayer.add(letter)
    }

    if (state.mods.pixel) {
      pixelateLayer.add(letter)
    }

    if (isPartOfCombo) {
      comboEmitter.emitParticleAt(letter.x, letter.y + 40)
    }

    if (state.combomatch) {
      // triggered when a combo has been matched
      state.combomatch = false
      comboEmitter.emitParticleAt(letter.x, letter.y + 40)
    }
    type.play()

    // update text display
    var text = !state.mods.rainbow ? state.color !== 'green' ? state.color : '' : ''
    text = Object.keys(state.mods).reduce(showMods, text)
    state.txt.setText(text)
  }.bind(this))

  glowLayer = this.add.effectLayer(0, 0, WIDTH, HEIGHT, 'bloom', bloom)
  glitchLayer = this.add.effectLayer(0, 0, WIDTH, HEIGHT, 'glitch', glitch)
  pixelateLayer = this.add.effectLayer(0, 0, WIDTH, HEIGHT, 'pixelate', pixelate)

  var combos = {
    pink: function (state) {
      state.color = 'pink'
      state.mods.rainbow = false
    },
    red: function (state) {
      state.color = 'red'
      state.mods.rainbow = false
    },
    orange: function (state) {
      state.color = 'orange'
      state.mods.rainbow = false
    },
    yellow: function (state) {
      state.color = 'yellow'
      state.mods.rainbow = false
    },
    green: function (state) {
      state.color = 'green'
      state.mods.rainbow = false
    },
    blue: function (state) {
      state.color = 'blue'
      state.mods.rainbow = false
    },
    purple: function (state) {
      state.color = 'purple'
      state.mods.rainbow = false
    },
    grey: function (state) {
      state.color = 'grey'
      state.mods.rainbow = false
    },
    white: function (state) {
      state.color = 'white'
      state.mods.rainbow = false
    },
    rainbow: function (state) {
      state.mods.rainbow = !state.mods.rainbow
    },
    spin: function (state) {
      state.mods.spin = !state.mods.spin
    },
    glitch: function (state) {
      state.mods.glitch = !state.mods.glitch
    },
    pixel: function (state) {
      state.mods.pixel = !state.mods.pixel
    }
  }
  combos.feross = combos.spin
  combos.gray = combos.grey
  combos.violet = combos.purple

  var self = this
  Object.keys(combos).forEach(function (combo) {
    var comboInstance = self.input.keyboard.createCombo(combo, {resetOnMatch: true})
    comboInstance.label = combo
    allCombos.push(comboInstance)
  })

  this.input.keyboard.on('keycombomatch', function (event) {
    console.log('combo: ', event.label)
    if (combos[event.label]) combos[event.label](state)
    state.combomatch = true
  })
}

function update () {
  letterGroup.getChildren().forEach(proc.bind(this))
}

function proc (c) {
  if (c.y > HEIGHT + 100) {
    letterGroup.remove(c)
  }
}

function showMods (txt, key) {
  if (state.mods[key]) {
    txt = txt + ' ' + key
  }
  return txt
}
