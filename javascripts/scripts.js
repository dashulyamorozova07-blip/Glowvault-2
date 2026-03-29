document.addEventListener('DOMContentLoaded', () => {
  const isMobile = window.matchMedia('(max-width: 402px)').matches
  const is1440 = window.matchMedia('(max-width: 1440px)').matches

  // интерактивные буквы
  document.querySelectorAll('.glow-text').forEach((el) => {
    const letters = el.textContent.trim().split('')
    el.innerHTML = letters
      .map((l) => (l === ' ' ? ' ' : `<span>${l}</span>`))
      .join('')

    el.querySelectorAll('span').forEach((span) => {
      span.addEventListener('mouseenter', () => span.classList.add('dim'))
      span.addEventListener('mouseleave', () => span.classList.remove('dim'))
    })
  })

  // медленная прокрутка
  function smoothScrollTo(targetY, duration = 2200) {
    const startY = window.scrollY
    const diff = targetY - startY
    let start

    function step(timestamp) {
      if (!start) start = timestamp
      const time = timestamp - start
      const progress = Math.min(time / duration, 1)
      const ease = 0.5 - Math.cos(progress * Math.PI) / 2
      window.scrollTo(0, startY + diff * ease)
      if (progress < 1) requestAnimationFrame(step)
    }

    requestAnimationFrame(step)
  }

  // смена текста по кнопке + исчезновение облака + прыжок
  const textEl = document.getElementById('speechText')
  const btn = document.getElementById('speechBtn')
  const speech = document.querySelector('.speech')
  const mimi = document.querySelector('.mimi')

  const texts = [
    'ПРИВЕТ! МЕНЯ ЗОВУТ МИМИ',
    'Я ПОТЕРЯЛА КАМНИ. ПОМОГИ ИХ НАЙТИ!'
  ]

  let index = 0
  let clickCount = 0

  btn.addEventListener('click', () => {
    index = (index + 1) % texts.length
    textEl.textContent = texts[index]

    clickCount += 1
    if (clickCount === 2) {
      speech.classList.add('no-text')

      setTimeout(() => {
        speech.classList.add('is-hidden')

        mimi.classList.add('bounce')
        setTimeout(() => {
          mimi.classList.remove('bounce')

          const targetY = is1440 ? 1000 : 1100
          if (!isMobile) smoothScrollTo(targetY, 2500)
        }, 800)
      }, 150)
    }
  })

  // клик по Мими → подпрыг + звук
  const mimiSound = new Audio('./sounds/mimi-click.mp3')

  mimi.addEventListener('click', () => {
    mimiSound.currentTime = 0
    mimiSound.play()

    mimi.classList.add('bounce')
    setTimeout(() => mimi.classList.remove('bounce'), 800)
  })

  const starSfx = document.getElementById('star-sfx')

  // звёзды
  document.querySelectorAll('.star').forEach((star) => {
    star.addEventListener('click', () => {
      if (starSfx) {
        starSfx.currentTime = 0
        starSfx.play()
      }

      star.classList.add('glow')
      setTimeout(() => {
        star.classList.remove('glow')
      }, 2000)
    })
  })

  const stoneSfx = document.getElementById('stone-found-sfx')
  const stoneCompleteSfx = document.getElementById('stone-complete-sfx')
  const finalSfx = document.getElementById('final-sfx')

  const finalOverlay = document.getElementById('finalOverlay')

  finalOverlay.addEventListener('click', (e) => {
    if (e.target === finalOverlay) {
      finalOverlay.classList.remove('active')
    }
  })

  let stones2Done = false
  let stones3Done = false
  let puzzleDone = false
  let stone8Correct = false
  let stone10Correct = false

  function checkFinal() {
    if (
      stones2Done &&
      stones3Done &&
      puzzleDone &&
      stone8Correct &&
      stone10Correct
    ) {
      finalOverlay.classList.add('active')
      if (finalSfx) {
        finalSfx.currentTime = 0
        finalSfx.play()
      }
    }
  }

  // камни (экран 2)
  const stones = document.querySelectorAll('.stone')

  stones.forEach((stone) => {
    stone.addEventListener('click', () => {
      const group = stone.dataset.group

      if (stoneSfx) {
        stoneSfx.currentTime = 0
        stoneSfx.play()
      }

      stone.classList.add('found')
      document
        .querySelectorAll(`.stone-star[data-group="${group}"]`)
        .forEach((star) => star.classList.add('found'))

      const foundCount = document.querySelectorAll('.stone.found').length
      if (foundCount === stones.length) {
        stones2Done = true
        checkFinal()

        const targetY = is1440 ? 2200 : 2450
        if (!isMobile) smoothScrollTo(targetY, 3500)
      }
    })
  })

  // камни на 3 экране
  const stones3 = document.querySelectorAll('.stone-5, .stone-6')

  stones3.forEach((stone) => {
    stone.addEventListener('click', () => {
      if (stoneSfx) {
        stoneSfx.currentTime = 0
        stoneSfx.play()
      }

      stone.classList.add('found-slow')

      const foundCount = document.querySelectorAll(
        '.stone-5.found-slow, .stone-6.found-slow'
      ).length
      if (foundCount === stones3.length) {
        stones3Done = true
        checkFinal()

        const section4 = document.getElementById('section-4')
        let targetY = section4.getBoundingClientRect().top + window.scrollY
        if (is1440) targetY -= 100
        if (!isMobile) smoothScrollTo(targetY, 2500)
      }
    })
  })

  const orb = document.querySelector('.item-3')

  orb.addEventListener('click', () => {
    orb.classList.add('swing')
    setTimeout(() => {
      orb.classList.remove('swing')
    }, 600)
  })

  const hat = document.querySelector('.item-4')
  const section3 = document.querySelector('.section-3')

  hat.addEventListener('click', () => {
    hat.classList.add('swing')
    setTimeout(() => hat.classList.remove('swing'), 600)

    const hatRect = hat.getBoundingClientRect()
    const secRect = section3.getBoundingClientRect()

    const offsets = [
      { x: 0.1, y: 0.7, dx: -1, dy: -1 },
      { x: 0.5, y: 0.2, dx: -2, dy: -1 },
      { x: 0.8, y: 0.7, dx: -3, dy: -2.5 }
    ]

    offsets.forEach((o) => {
      const star = document.createElement('div')
      star.className = 'sparkle'

      star.style.left = `${hatRect.left - secRect.left + hatRect.width * o.x}px`
      star.style.top = `${hatRect.top - secRect.top + hatRect.height * o.y}px`
      star.style.setProperty('--dx', `${o.dx}vw`)
      star.style.setProperty('--dy', `${o.dy}vw`)

      section3.appendChild(star)

      star.addEventListener('animationend', () => star.remove())
    })
  })

  const music = document.getElementById('bg-music')

  function startMusic() {
    if (music) music.play()
    document.removeEventListener('click', startMusic)
  }

  document.addEventListener('click', startMusic)

  document
    .querySelectorAll('.item-1, .item-2, .item-3, .item-5')
    .forEach((el) => {
      el.addEventListener('click', () => {
        el.classList.add('swing')
        setTimeout(() => el.classList.remove('swing'), 600)
      })
    })

  const item1 = document.querySelector('.item-1')
  const spider1 = document.querySelector('.spider-1')
  const spiderSfx = document.getElementById('spider-sfx')

  item1.addEventListener('click', () => {
    item1.classList.add('swing')

    setTimeout(() => {
      item1.classList.add('hidden')
      spider1.classList.add('show')

      setTimeout(() => {
        spiderSfx.currentTime = 0
        spiderSfx.play()

        spider1.classList.add('escape')
        setTimeout(() => spider1.classList.remove('escape'), 600)
      }, 1300)

      setTimeout(() => {
        spider1.classList.remove('show')
      }, 3000)
    }, 600)
  })

  const hintOverlay = document.getElementById('hintOverlay')
  const hintText = document.getElementById('hintText')

  document.querySelectorAll('.help-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      hintText.textContent = btn.dataset.hint || ''
      hintOverlay.classList.add('active')
    })
  })

  hintOverlay.addEventListener('click', (e) => {
    if (e.target === hintOverlay) {
      hintOverlay.classList.remove('active')
    }
  })

  const puzzle = document.querySelector('.puzzle')
  const pieces = document.querySelectorAll('.piece')
  const fullStone = document.querySelector('.stone-full')

  const SNAP_PX = 80
  let puzzleRect = puzzle.getBoundingClientRect()
  const state = new Map()

  function percentToPx(xPercent, yPercent) {
    return {
      x: (xPercent / 100) * puzzleRect.width,
      y: (yPercent / 100) * puzzleRect.height
    }
  }

  function getDataValue(piece, base, use1440, use402) {
    const baseKebab = base.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)
    if (use402) {
      const v402 = piece.getAttribute(`data-${baseKebab}-402`)
      if (v402 !== null && v402 !== '') return v402
    }
    if (use1440) {
      const v1440 = piece.getAttribute(`data-${baseKebab}-1440`)
      if (v1440 !== null && v1440 !== '') return v1440
    }
    return piece.getAttribute(`data-${baseKebab}`)
  }

  function setPositions() {
    puzzleRect = puzzle.getBoundingClientRect()
    const use402 = window.matchMedia('(max-width: 402px)').matches
    const use1440 = window.matchMedia('(max-width: 1440px)').matches

    pieces.forEach((piece) => {
      const startX = parseFloat(getDataValue(piece, 'startX', use1440, use402))
      const startY = parseFloat(getDataValue(piece, 'startY', use1440, use402))

      const pos = percentToPx(startX, startY)
      state.set(piece, { x: pos.x, y: pos.y })

      piece.style.left = '0px'
      piece.style.top = '0px'
      piece.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`
    })
  }

  setPositions()
  window.addEventListener('resize', setPositions)

  pieces.forEach((piece) => {
    let dragging = false
    let offsetX = 0
    let offsetY = 0

    const onPointerDown = (e) => {
      if (piece.classList.contains('locked')) return
      dragging = true
      piece.setPointerCapture(e.pointerId)
      piece.style.cursor = 'grabbing'

      const current = state.get(piece)
      offsetX = e.clientX - (puzzleRect.left + current.x)
      offsetY = e.clientY - (puzzleRect.top + current.y)
    }

    const onPointerMove = (e) => {
      if (!dragging) return

      const x = e.clientX - puzzleRect.left - offsetX
      const y = e.clientY - puzzleRect.top - offsetY

      state.set(piece, { x, y })
      piece.style.transform = `translate3d(${x}px, ${y}px, 0)`
    }

    const onPointerUp = (e) => {
      if (!dragging) return
      dragging = false
      piece.releasePointerCapture(e.pointerId)
      piece.style.cursor = 'grab'

      const use402 = window.matchMedia('(max-width: 402px)').matches
      const use1440 = window.matchMedia('(max-width: 1440px)').matches
      const targetX = parseFloat(
        getDataValue(piece, 'targetX', use1440, use402)
      )
      const targetY = parseFloat(
        getDataValue(piece, 'targetY', use1440, use402)
      )
      const targetPos = percentToPx(targetX, targetY)

      const current = state.get(piece)
      const dx = current.x - targetPos.x
      const dy = current.y - targetPos.y
      const dist = Math.hypot(dx, dy)

      const percentX = ((current.x / puzzleRect.width) * 100).toFixed(1)
      const percentY = ((current.y / puzzleRect.height) * 100).toFixed(1)
      console.log(piece.className, 'x=', percentX, 'y=', percentY)

      if (dist <= SNAP_PX) {
        state.set(piece, { x: targetPos.x, y: targetPos.y })
        piece.style.transform = `translate3d(${targetPos.x}px, ${targetPos.y}px, 0)`
        piece.classList.add('locked')
        checkComplete()
      }
    }

    piece.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)
    window.addEventListener('pointercancel', onPointerUp)
  })

  function checkComplete() {
    const allLocked = [...pieces].every((p) => p.classList.contains('locked'))
    if (allLocked) {
      fullStone.classList.add('visible')
      pieces.forEach((p) => (p.style.opacity = 0))

      puzzleDone = true
      checkFinal()

      if (stoneCompleteSfx) {
        stoneCompleteSfx.currentTime = 0
        stoneCompleteSfx.play()
      }

      const section5 = document.getElementById('section-5')
      let targetY = section5.getBoundingClientRect().top + window.scrollY
      if (is1440) targetY -= 100
      if (!isMobile) smoothScrollTo(targetY, 4100)
    }
  }

  document.querySelectorAll('.box-card').forEach((card) => {
    const stone = card.querySelector('.box-stone')
    let angle = 0

    const targetAngle = {
      'stone-8': 30,
      'stone-10': -45
    }

    const tolerance = 5

    function normalize(a) {
      let x = a % 360
      if (x > 180) x -= 360
      if (x < -180) x += 360
      return x
    }

    card.querySelectorAll('.arrow-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const delta = parseFloat(btn.dataset.rotate || '0')
        angle += delta
        stone.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`

        stone.classList.remove('glow-8', 'glow-10')

        if (stone.classList.contains('stone-8')) {
          const a = normalize(angle)
          if (Math.abs(a - targetAngle['stone-8']) <= tolerance) {
            stone.classList.add('glow-8')
            stone8Correct = true
          } else {
            stone8Correct = false
          }
        }

        if (stone.classList.contains('stone-10')) {
          const a = normalize(angle)
          if (Math.abs(a - targetAngle['stone-10']) <= tolerance) {
            stone.classList.add('glow-10')
            stone10Correct = true
          } else {
            stone10Correct = false
          }
        }

        checkFinal()
      })
    })
  })
})
