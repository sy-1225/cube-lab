const faces = {
  U: { axis: 1, side: 1, name: '上面', color: '#f8d943' },
  R: { axis: 0, side: 1, name: '右面', color: '#ef534e' },
  F: { axis: 2, side: 1, name: '前面', color: '#35cc91' },
  D: { axis: 1, side: -1, name: '底面', color: '#f6f4ff' },
  L: { axis: 0, side: -1, name: '左面', color: '#ff9b44' },
  B: { axis: 2, side: -1, name: '背面', color: '#5395fb' },
}

const lessons = [
  {
    name: '白色十字', title: '拼出白色十字', moves: 'R2 U F2',
    desc: '白色中心朝下，黄色中心朝上。先找只有两种颜色、其中一面是白色的棱块。',
    how: '示例中，白红棱已在红色中心正上方，用 R2 把它送到底面。用 U 让白绿棱对齐绿色中心，再转 F2 把它送下去。其他白棱也可以先送到顶层，再对齐侧面中心后翻到底面。',
    tip: '切到「看底面」确认白色十字。四个白棱的侧面颜色都要与相邻中心对齐。',
  },
  {
    name: '白色四角', title: '补齐白色四角', moves: "R U R'",
    desc: '找到带白色的三色角块。它的另外两种颜色决定它属于哪个角。',
    how: '观察前面和右面的中心。示例里的白绿红角在顶层，先打开右侧，再转上层把角块送入，最后把右侧转回。实物的角块朝向不同时，插入手法也会变。',
    tip: '底面九格都是白色，四个侧面的最底一排分别与各自中心同色。',
  },
  {
    name: '中层棱块', title: '放回中层棱块', moves: "U R U' R' U' F' U F",
    desc: '第一层做好后，在顶层找不带黄色的棱块。它属于两个同色中心之间。',
    how: '把目标棱块的侧色对准前面中心。示例中，绿红棱要进入前面和右面之间的槽位，跟着动画向右插入。棱块要向左插入时，可使用左右镜像的手法。',
    tip: '四个侧面的下面两排都与中心同色，白色底面依然完整。',
  },
  {
    name: '黄色十字', title: '拼出黄色十字', moves: "F R U R' U' F'",
    desc: '接下来处理顶层。先观察顶面的四个棱块，暂时略过四个角。',
    how: '本例的黄色棱在顶面横成一条线。绿面朝前，按下方动作转一次。实物若呈点形或 L 形，需先做出下一种形状，再按其朝向继续。',
    tip: '黄色中心与四个黄色棱在顶面组成十字。此时侧面的颜色可以暂时错位。',
  },
  {
    name: '翻正黄角', title: '把黄角翻到顶面', moves: "R U R' U R U2 R'",
    desc: '保留黄色十字，把四个角块的黄色贴片翻到顶面。',
    how: '本例只有一个黄色角朝上，把它放在左前上角，然后跟着动作转。若你手上的黄角分布不同，先根据顶面图案调整起手方向。',
    tip: '顶面九格都是黄色。侧面的最上排仍可能没有对齐。',
  },
  {
    name: '对齐顶层角', title: '把顶层角块归位', moves: "R' F R' B2 R F' R' B2 R2",
    desc: '黄色面已经朝上。现在看角块的另外两种颜色，检查它是否夹在对应中心之间。',
    how: '本例有三个顶层角要轮换位置。保持绿面朝前、红面朝右，跟着动画看三个角怎样归位。做 B2 时可拖动视角看清背面。',
    tip: '每个顶层角的两个侧色都与相邻中心一致。接下来只剩顶层棱块。',
  },
  {
    name: '对齐顶层棱', title: '把最后的棱块归位', moves: "R U' R U R U R U' R' U' R2",
    desc: '角块都对齐了，只剩三个棱块需要换位。观察哪一侧的最上排已经同色。',
    how: '本例已对齐的一侧在背面。保持这个方向，逐个跟做下方动作，让另外三条顶棱回到自己的中心旁。',
    tip: '检查六个面。每一面九格都和中心同色，就复原成功了。',
  },
].map(lesson => ({ ...lesson, moves: lesson.moves.split(' ') }))

function rotate(v, axis, angle) {
  const out = [...v]
  const a = (axis + 1) % 3
  const b = (axis + 2) % 3
  const c = Math.cos(angle)
  const s = Math.sin(angle)
  out[a] = v[a] * c - v[b] * s
  out[b] = v[a] * s + v[b] * c
  return out
}

function solvedCube() {
  const pieces = []
  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      for (let z = -1; z <= 1; z++) {
        const pos = [x, y, z]
        if (!pos.some(Boolean)) continue
        const stickers = Object.entries(faces)
          .filter(([, face]) => pos[face.axis] === face.side)
          .map(([letter, face]) => {
            const normal = [0, 0, 0]
            normal[face.axis] = face.side
            return { letter, normal }
          })
        pieces.push({ pos, stickers })
      }
    }
  }
  return pieces
}

function turn(move) {
  const face = faces[move[0]]
  const quarterTurns = move.endsWith('2') ? 2 : move.endsWith("'") ? -1 : 1
  return { ...face, letter: move[0], angle: -face.side * quarterTurns * Math.PI / 2 }
}

function applyMove(pieces, move) {
  const { axis, side, angle } = turn(move)
  const spin = v => rotate(v, axis, angle).map(Math.round)
  return pieces.map(piece => piece.pos[axis] !== side ? piece : {
    pos: spin(piece.pos),
    stickers: piece.stickers.map(sticker => ({ ...sticker, normal: spin(sticker.normal) })),
  })
}

function inverse(move) {
  if (move.endsWith('2')) return move
  return move.endsWith("'") ? move[0] : move + "'"
}

const states = [solvedCube()]
for (const lesson of [...lessons].reverse()) {
  states.unshift([...lesson.moves].reverse().map(inverse).reduce(applyMove, states[0]))
}

const byId = id => document.getElementById(id)
const canvas = byId('cube')
const ctx = canvas.getContext('2d')
const defaultView = { yaw: -0.56, pitch: 0.51 }
const completed = new Set()
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)')
let lessonIndex = 0
let cursor = 0
let pieces = states[0]
let view = { ...defaultView }
let animation = null
let playing = false
let frame = 0
let generation = 0
let width = 0
let height = 0
let drag = null

function polygon(points, color, edge, thickness = 1) {
  ctx.beginPath()
  points.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))
  ctx.closePath()
  ctx.fillStyle = color
  ctx.fill()
  if (edge) {
    ctx.strokeStyle = edge
    ctx.lineWidth = thickness
    ctx.lineJoin = 'round'
    ctx.stroke()
  }
}

function draw() {
  ctx.clearRect(0, 0, width, height)
  const scale = Math.min(width, height) * 0.155
  const shadowY = height / 2 + scale * 1.7
  ctx.save()
  ctx.translate(width / 2, shadowY)
  ctx.scale(1, 0.24)
  const shadow = ctx.createRadialGradient(0, 0, 0, 0, 0, scale * 1.75)
  shadow.addColorStop(0, '#43347751')
  shadow.addColorStop(1, '#43347700')
  ctx.fillStyle = shadow
  ctx.fillRect(-scale * 2, -scale * 2, scale * 4, scale * 4)
  ctx.restore()

  const camera = v => rotate(rotate(v, 1, view.yaw), 0, view.pitch)
  const project = ([x, y, z]) => {
    const k = 8 / (8 - z) * scale
    return [width / 2 + x * k, height * 0.485 - y * k]
  }
  const now = lessons[lessonIndex].moves[cursor]
  const active = animation?.letter || now?.[0]
  const surfaces = []
  for (const piece of pieces) {
    const spinning = animation && piece.pos[animation.axis] === animation.side
    const spin = v => spinning ? rotate(v, animation.axis, animation.radians) : v
    for (let axis = 0; axis < 3; axis++) {
      const a = (axis + 1) % 3
      const b = (axis + 2) % 3
      for (const side of [-1, 1]) {
        const n = [0, 0, 0]
        n[axis] = side
        const normal = camera(spin(n))
        const center = [...piece.pos]
        center[axis] += side * .477
        const c = camera(spin(center))
        const facing = normal[0] * -c[0] + normal[1] * -c[1] + normal[2] * (8 - c[2])
        if (facing <= 0) continue

        const corners = size => [[-1,-1],[1,-1],[1,1],[-1,1]].map(([u,v]) => {
          const corner = [...center]
          corner[a] += u * size
          corner[b] += v * size
          return project(camera(spin(corner)))
        })
        const sticker = piece.stickers.find(s => s.normal[axis] === side)
        const centerLetter = piece.stickers.length === 1 && sticker?.letter
        surfaces.push({
          depth: c[2], shell: corners(.477), tile: sticker && corners(.415),
          color: sticker && faces[sticker.letter].color,
          shade: Math.max(0, .12 - normal[1] * .12 - normal[2] * .04),
          highlighted: active && faces[active].axis === axis && faces[active].side === side &&
            piece.pos[axis] === side && sticker,
          label: centerLetter,
          labelPos: project(c),
        })
      }
    }
  }
  surfaces.sort((a,b) => a.depth - b.depth)
  for (const surface of surfaces) {
    polygon(surface.shell, '#262139', '#201a30')
    if (!surface.tile) continue
    const stroke = surface.highlighted ? '#fff9' : '#ffffff22'
    polygon(surface.tile, surface.color, stroke, surface.highlighted ? 1.7 : 1)
    polygon(surface.tile, 'rgba(30,18,52,' + surface.shade + ')')
    if (surface.label) {
      ctx.fillStyle = '#251931bd'
      ctx.font = 'bold ' + Math.max(10, scale * .215) + 'px system-ui'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(surface.label, ...surface.labelPos)
    }
  }
}

function resize() {
  const box = canvas.getBoundingClientRect()
  width = box.width
  height = box.height
  const density = Math.min(devicePixelRatio || 1, 2)
  canvas.width = Math.round(width * density)
  canvas.height = Math.round(height * density)
  ctx.setTransform(density, 0, 0, density, 0, 0)
  draw()
}


const pretty = move => move.replace("'", '′')
const digits = number => String(number).padStart(2, '0')

function renderProgress() {
  byId('count').textContent = completed.size + ' / ' + lessons.length + ' 已完成'
  byId('progress').value = completed.size
  for (const [i, button] of [...byId('lessons').children].entries()) {
    button.classList.toggle('done', completed.has(i))
    button.firstElementChild.textContent = completed.has(i) ? '✓' : digits(i + 1)
    if (i === lessonIndex) button.setAttribute('aria-current', 'step')
    else button.removeAttribute('aria-current')
  }
}

function renderPlayback() {
  const moves = lessons[lessonIndex].moves
  const move = animation?.shownMove || moves[cursor]
  byId('timeline').textContent = move
    ? cursor + ' / ' + moves.length + ' 步 · ' + pretty(move) + ' ' + faces[move[0]].name +
      (move.endsWith('2') ? '转 180°' : move.endsWith("'") ? '逆时针 90°' : '顺时针 90°')
    : moves.length + ' / ' + moves.length + ' 步 · ' + (lessonIndex === lessons.length - 1 ? '六面复原成功！' : '本课完成')
  byId('play').textContent = playing ? '❚❚  暂停' : cursor === moves.length ? '↺  重播演示' : '▶  播放演示'
  byId('play').disabled = Boolean(animation && !playing)
  byId('back').disabled = cursor === 0 || Boolean(animation) || playing
  byId('forward').disabled = cursor === moves.length || Boolean(animation) || playing
  for (const [i, button] of [...byId('formula').children].entries()) {
    button.classList.toggle('current', i === (animation?.target === cursor - 1 ? cursor - 1 : cursor))
    button.classList.toggle('past', i < cursor && i !== animation?.target)
  }
  renderProgress()
}

function halt() {
  generation++
  cancelAnimationFrame(frame)
  animation = null
  playing = false
}

function seek(target) {
  halt()
  cursor = target
  pieces = lessons[lessonIndex].moves.slice(0, target).reduce(applyMove, states[lessonIndex])
  renderPlayback()
  draw()
}

function animate(target) {
  const moves = lessons[lessonIndex].moves
  const move = target > cursor ? moves[cursor] : inverse(moves[target])
  animation = { ...turn(move), radians: 0, shownMove: move, target }
  const start = performance.now()
  const duration = reducedMotion.matches ? 0 : (move.endsWith('2') ? 610 : 470) / Number(byId('speed').value)
  const ticket = ++generation
  renderPlayback()

  function tick(time) {
    if (ticket !== generation) return
    const fraction = duration ? Math.min(1, (time - start) / duration) : 1
    animation.radians = animation.angle * (fraction * fraction * (3 - 2 * fraction))
    if (fraction < 1) {
      draw()
      frame = requestAnimationFrame(tick)
      return
    }
    pieces = applyMove(pieces, move)
    cursor = target
    animation = null
    if (cursor === moves.length) {
      completed.add(lessonIndex)
      playing = false
    }
    renderPlayback()
    draw()
    if (playing) {
      setTimeout(() => {
        if (ticket === generation && playing && !animation) animate(cursor + 1)
      }, 200 / Number(byId('speed').value))
    }
  }
  frame = requestAnimationFrame(tick)
}

function selectLesson(index) {
  lessonIndex = index
  view = { ...defaultView }
  const lesson = lessons[index]
  byId('stepLabel').textContent = 'STEP ' + digits(index + 1) + ' / ' + digits(lessons.length)
  for (const key of ['title','desc','how','tip']) byId(key).textContent = lesson[key]
  byId('flip').textContent = '看底面'
  byId('nextLesson').firstChild.textContent = index === lessons.length - 1 ? '回到第一课 ' : '下一课 '
  byId('formula').replaceChildren(...lesson.moves.map((move, i) => {
    const button = document.createElement('button')
    button.type = 'button'
    button.textContent = pretty(move)
    button.setAttribute('aria-label', '演示第 ' + (i + 1) + ' 个动作 ' + pretty(move))
    button.addEventListener('click', () => { seek(i); animate(i + 1) })
    return button
  }))
  seek(0)
}

for (const [index, lesson] of lessons.entries()) {
  const button = document.createElement('button')
  button.className = 'lesson'
  button.type = 'button'
  button.innerHTML = '<span class="num"></span><span>' + lesson.name + '</span>'
  button.addEventListener('click', () => selectLesson(index))
  byId('lessons').append(button)
}
for (const [letter, face] of Object.entries(faces)) {
  const item = document.createElement('div')
  item.className = 'face'
  item.style.setProperty('--swatch', face.color)
  item.innerHTML = '<kbd>' + letter + '</kbd> ' + face.name
  byId('faces').append(item)
}

byId('play').addEventListener('click', () => {
  if (playing) {
    playing = false
    renderPlayback()
    return
  }
  if (cursor === lessons[lessonIndex].moves.length) seek(0)
  playing = true
  animate(cursor + 1)
})
byId('back').addEventListener('click', () => animate(cursor - 1))
byId('forward').addEventListener('click', () => animate(cursor + 1))
byId('restart').addEventListener('click', () => seek(0))
byId('nextLesson').addEventListener('click', () => {
  selectLesson((lessonIndex + 1) % lessons.length)
  if (matchMedia('(max-width: 590px)').matches) canvas.scrollIntoView({ block: 'center' })
})
byId('flip').addEventListener('click', () => {
  view.pitch = view.pitch < 0 ? defaultView.pitch : -0.64
  byId('flip').textContent = view.pitch < 0 ? '看顶面' : '看底面'
  draw()
})
byId('resetView').addEventListener('click', () => {
  view = { ...defaultView }
  byId('flip').textContent = '看底面'
  draw()
})
function orbit(dx, dy) {
  view.yaw += dx
  view.pitch = Math.max(-1.52, Math.min(1.52, view.pitch + dy))
  byId('flip').textContent = view.pitch < 0 ? '看顶面' : '看底面'
  draw()
}
canvas.addEventListener('pointerdown', event => {
  if (drag || event.button !== 0) return
  drag = { x: event.clientX, y: event.clientY, id: event.pointerId }
  canvas.setPointerCapture(event.pointerId)
})
canvas.addEventListener('pointermove', event => {
  if (drag?.id !== event.pointerId) return
  orbit((event.clientX - drag.x) * .009, (event.clientY - drag.y) * .009)
  drag.x = event.clientX
  drag.y = event.clientY
})
canvas.addEventListener('lostpointercapture', event => {
  if (drag?.id === event.pointerId) drag = null
})
canvas.addEventListener('keydown', event => {
  const direction = { ArrowLeft:[-.17,0], ArrowRight:[.17,0], ArrowUp:[0,.17], ArrowDown:[0,-.17] }[event.key]
  if (!direction) return
  event.preventDefault()
  orbit(...direction)
})
selectLesson(0)
resize()
new ResizeObserver(() => requestAnimationFrame(resize)).observe(canvas)
