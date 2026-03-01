document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.glow-text').forEach((el) => {
    const letters = el.textContent.split('')
    el.innerHTML = letters.map((l) => `<span>${l}</span>`).join('')

    const spans = el.querySelectorAll('span')
    spans.forEach((span) => {
      span.addEventListener('mouseenter', () => span.classList.add('dim'))
      span.addEventListener('mouseleave', () => span.classList.remove('dim'))
    })
  })
})
