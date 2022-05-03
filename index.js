// заведомо говнокод, настоятельно рекомендую игнорить, по фану делаю :D 

const state = {
  isMenu: true,
  isEnd: false,
  x: 450,
  count: 0,
}

const bgMusic = document.querySelector("#bgMusic");
bgMusic.volume = 0.1
bgMusic.loop = true

const nom1 = new Audio('assets/nomnom1.mp3');
const nom2 = new Audio('assets/nomnom2.mp3');
const nom3 = new Audio('assets/nomnom3.mp3');

let pineapples = [];

const startMenu = document.querySelector('#startButtons')
const endMenu = document.querySelector('#endButtons')
const startBtn = document.querySelector('#start')
const retryBtn = document.querySelector('#retry')
const overBtn = document.querySelector('#over')
startMenu.style.display = 'block'

const container = document.querySelector('#game')
const we = document.querySelector('#we')
we.style.left = `${450}px`

const pineapplesContainer = document.querySelector('#pineapples')
const counter = document.querySelector('#count')

let changeInterval;

overBtn.addEventListener('click', () => {
  state.isMenu = true
  state.isEnd = false
  state.count = 0
  startMenu.style.display = 'block'
  endMenu.style.display = 'none'
})

retryBtn.addEventListener('click', () => {
  state.isMenu = false
  state.isEnd = false
  state.count = 0
  endMenu.style.display = 'none'
  startMenu.style.display = 'none'
  bgMusic.play()
})

startBtn.addEventListener('click', () => {
  state.isMenu = false
  state.isEnd = false
  startMenu.style.display = 'none'
  endMenu.style.display = 'none'
  bgMusic.play()
})

const renderPineapples = () => {
  if (state.isEnd || state.isMenu) return
  let html = ''

  pineapples = pineapples.map((item) => {
    if (item.y >= 385) {
      state.isEnd = true
      return null
    }
    const newY = item.y + 2.5
    html = html + `<span class="pineapple" style="top: ${newY}px; left: ${item.x}px;"></span>`
    return {
      ...item,
      y: newY
    }
  }).filter(Boolean)

  if (state.isEnd) {
    endMenu.style.display = 'block'
    pineapples = []
    state.x = 450
    bgMusic.pause()
  }
  pineapplesContainer.innerHTML = html
}

const addPineapple = () => {
  if (state.isEnd || state.isMenu) return
  const pineapplePos = Math.floor(Math.random() * (Math.floor(19) - Math.ceil(1) + 1));

  pineapples.push({
    x: pineapplePos * 50,
    y: -100,
    id: Date.now()
  })
}

window.addEventListener('keydown', (e) => {
  clearInterval(changeInterval)
  if (state.isEnd || state.isMenu) return

  if (e.key === 'ArrowRight') {
    we.style.transform = 'scaleX(-1)'

    changeInterval = setInterval(() => {
      requestAnimationFrame(() => {
        if (state.x <= 930) {
          state.x = state.x + 4
        }
      })
    }, 10)
  }

  if (e.key === 'ArrowLeft') {
    we.style.transform = 'scaleX(1)'

    changeInterval = setInterval(() => {
      requestAnimationFrame(() => {
        if (state.x >= 0) {
          state.x = state.x - 4
        }
      })
    }, 10)
  }
  if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
    we.style.animationName = 'run'
  }
})

window.addEventListener('keyup', (e) => {
  clearInterval(changeInterval)
  we.style.animationName = ''
})

setInterval(() => {
  requestAnimationFrame(() => {
    if (state.isEnd || state.isMenu) return
    const activePineapple = pineapples.find((item) => {
      const isActiveHeight = item.y < 385 && item.y > 250
      if (isActiveHeight) return true
      return false
    })

    if (activePineapple) {
      const min = activePineapple.x - 50
      const max = activePineapple.x + 50

      if (state.x > min && state.x < max) {
        const soundChance =  Math.floor(Math.random() * (Math.floor(99) - Math.ceil(1) + 1))

        if (soundChance < 33 && soundChance > 0) {
          nom1.play();
        } else if (soundChance < 66 && soundChance > 33) {
          nom2.play()
        } else {
          nom3.play()
        }

        state.count = state.count + 1
        counter.innerHTML = state.count

        pineapples = pineapples.filter((item) => item.id !== activePineapple.id)
        renderPineapples()
      }
    }

    we.style.left = `${state.x}px`
  })
}, 25)

setInterval(renderPineapples, 25)

addPineapple()
setInterval(addPineapple, 2500)