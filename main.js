const cols = 45
const rows = 45
const WIDTH = 450
const HEIGHT = 450
const CELL_SIZE = 10
const TICK_SPEED = 500
let generationEl = document.getElementById('generations')
let totalDeathsEl = document.getElementById('total-deaths')
let totalBirthsEl = document.getElementById('total-births')
let generation = 0
let canvas = document.getElementById('grid')
let ctx = canvas.getContext('2d')
canvas.width = WIDTH
canvas.height = HEIGHT
let grid = []
let loop = null
let totalDeaths = 0
let totalBirths = 0

function makeGrid () {
  let arr = new Array(cols * rows)

  for (let i = 0; i < arr.length; i+=1) {
    arr[i] = Math.round(Math.random())
  }

  return arr
}

function init () {
  grid = makeGrid()
  draw()

  clearInterval(loop)
  loop = setInterval(tick, TICK_SPEED)
}

function getPosition (n) {
  let y = Math.floor(n / cols)

  return {
    x: n - (y * rows),
    y: y
  }
}

function addNeightbour (i, arr) {
  if (i < 0) {
    return
  }

  if (i > grid.length - 1) {
    return
  }

  if (grid[i] !== 1) {
    return
  }

  arr.push(grid[i])
}


function getNeighbours (n) {
  let neighbours = []
  let i = 0;
  let leftEdge = (n % cols === 0) 
  let rightEdge = (getPosition(n).y < getPosition(n + 1).y)

  // TL
  if (!leftEdge) {
    addNeightbour(n - (cols + 1), neighbours)
  }

  // T
  addNeightbour(n - cols, neighbours)

  // TR
  if (!rightEdge) {
    addNeightbour( (n - (cols - 1)), neighbours)
  }

  // L
  if (!leftEdge) {
    addNeightbour(n - 1, neighbours)
  }

  // R
  if (!rightEdge) {
    addNeightbour(n + 1, neighbours)
  }

  // BL
  if (!leftEdge) {
    addNeightbour(n + (cols - 1), neighbours)
  }

  // B
  addNeightbour(n + cols, neighbours)

  // BR
  if (!rightEdge) {
    addNeightbour((n + cols + 1), neighbours)
  }

  return neighbours
}

function draw () {
  ctx.clearRect(0, 0, WIDTH, HEIGHT)

  grid.forEach((cell, i) => {
    if (cell === 1) {
      let pos = getPosition(i)
      ctx.fillRect(pos.x * CELL_SIZE, pos.y * CELL_SIZE, CELL_SIZE, CELL_SIZE)
    }

    generationEl.innerHTML = `Gen: ${generation}`
    totalDeathsEl.innerHTML = `Deaths: ${totalDeaths}`
    totalBirthsEl.innerHTML = `Births: ${totalBirths}`
  })
}

function hasPopulationStablised (arr1, arr2) {
  if (arr1.length !== arr2.length) {
    console.error('An error has occured, new grid !== old grid length')
    return true
  }

  let stabile = true

  arr1.forEach((cell, i) => {
    if (arr1[i] !== arr2[i]) {
      stabile = false
    }
  })

  return stabile
}

function stop () {
  clearInterval(loop)
}

function tick () {
  const newGen = generation + 1
  const newGrid = grid.slice(0)
  let deaths = 0
  let births = 0

  grid.forEach((cell, i) => {
    const neighbours = getNeighbours(i)

    if (cell === 0 && neighbours.length === 3) {
      newGrid[i] = 1
      births += 1
    }

    if (cell === 1 && (neighbours.length < 2 || neighbours.length > 3)) {
      newGrid[i] = 0
      deaths += 1
    }
  })

  if (hasPopulationStablised(grid, newGrid)) {
    stop()
    return
  }

  grid = newGrid
  generation = newGen
  totalDeaths += deaths
  totalBirths += births
  draw()
}

init ()