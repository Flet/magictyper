var KEYS = [
  // Normal keys

  ['~', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '+', null],
  ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', null],
  [null, 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '[', ']', '\\'],
  [null, 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';', '\'', null],
  [null, null, 'Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '/', null, null],

  // Numpad keys
  [null, null, null, null, null, null, null, null, null, null, null, 'num-/', 'num-*', 'num--'],
  [null, null, null, null, null, null, null, null, null, null, 'num-7', 'num-8', 'num-9', 'num-+'],
  [null, null, null, null, null, null, null, null, null, null, 'num-4', 'num-5', 'num-6', null],
  [null, null, null, null, null, null, null, null, null, null, 'num-1', 'num-2', 'num-3', null],
  [null, null, null, null, null, null, null, null, null, null, null, 'num-0', null, 'num-.', null]
]

var KEYS_X = {}

function calculateKeysX () {
  var WIDTH = Math.max(document.documentElement.clientWidth, window.innerWidth || 0)

  KEYS_X = {}
  KEYS.forEach(function (row) {
    row.forEach(function (letter, i) {
      if (!letter) return // ignore meta keys
      KEYS_X[letter] = ((i / row.length) + (0.5 / row.length)) * WIDTH
    })
  })
}

calculateKeysX()

export {KEYS_X, calculateKeysX}
