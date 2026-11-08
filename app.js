"use strict";

// ---------- storage (on the client's phone only) ----------
const STORE_KEY = "trainanywhere.v1";
function load() {
  try {
    const s = JSON.parse(localStorage.getItem(STORE_KEY));
    if (s && typeof s === "object") return { programId: null, log: [], sets: {}, ...s };
  } catch (e) {}
  return { programId: null, log: [], sets: {} };
}
let state = load();
function save() {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) {}
}

// ---------- helpers ----------
const $app = document.getElementById("app");
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const program = (id) => PROGRAMS.find((p) => p.id === id);
const fmtTime = (sec) => `${Math.floor(sec / 60)}:${String(Math.max(0, sec) % 60).padStart(2, "0")}`;
const fmtRest = (sec) => {
  const m = Math.floor(sec / 60), s = sec % 60;
  if (!m) return `${s} sec`;
  return s ? `${m} min ${s} sec` : `${m} min`;
};
const todayKey = () => new Date().toISOString().slice(0, 10);

function intervalSeconds(b) {
  const n = b.exercises.length;
  const one = b.work + b.rest;
  if (b.order === "station") return n * b.rounds * one + (n - 1) * b.restBetweenRounds;
  return b.rounds * n * one + (b.rounds - 1) * b.restBetweenRounds;
}
function estimateMinutes(day) {
  let sec = WARMUP_MINUTES * 60;
  for (const b of day.blocks) {
    if (b.type === "interval") sec += intervalSeconds(b) + 60;
    else sec += b.sets * ((b.setTime || 45) + b.rest) + 60;
  }
  return Math.round(sec / 60);
}
function exerciseCount(day) {
  return day.blocks.reduce((n, b) => n + (b.type === "interval" ? b.exercises.length : 1), 0);
}
function timesDone(pid, d) {
  return state.log.filter((l) => l.programId === pid && l.dayIdx === d).length;
}
function nextDayIdx(p) {
  const last = [...state.log].reverse().find((l) => l.programId === p.id);
  return last ? (last.dayIdx + 1) % p.days.length : 0;
}

// ---------- router ----------
function go(hash) { location.hash = hash; }
window.addEventListener("hashchange", render);

function render() {
  stopTimer();
  const parts = location.hash.replace(/^#\/?/, "").split("/");
  window.scrollTo(0, 0);
  if (parts[0] === "w" && program(parts[1]) && program(parts[1]).days[+parts[2]]) return renderWorkout(program(parts[1]), +parts[2]);
  if (parts[0] === "progress") return renderProgress();
  if (parts[0] === "choose") return renderChoose();
  if (state.programId && program(state.programId)) return renderProgram(program(state.programId));
  return renderChoose();
}

// ---------- screens ----------
function header(title, back) {
  return `<header class="bar">
    ${back ? `<a class="back" href="${back}" aria-label="Back">‹</a>` : `<a class="brand" href="#/choose">Kari's Fitness App</a>`}
    ${title ? `<h1>${esc(title)}</h1>` : ""}
    ${title === "Progress" ? "" : `<a class="bar-link" href="#/progress">Progress</a>`}
  </header>`;
}

function renderChoose() {
  $app.innerHTML = `${header("", null)}
  <main>
    <section class="hero">
      <h2>Your training plans</h2>
      <p class="muted">Pick the program that fits where you are. You can switch anytime.</p>
    </section>
    ${PROGRAMS.map((p) => `
      <button class="card program-card" data-pick="${p.id}">
        <span class="card-title">${esc(p.title)}</span>
        <span class="muted">${esc(p.tagline)}</span>
      </button>`).join("")}
  </main>`;
  $app.querySelectorAll("[data-pick]").forEach((el) =>
    el.addEventListener("click", () => { state.programId = el.dataset.pick; save(); go("#/"); render(); }));
}

function renderProgram(p) {
  const next = nextDayIdx(p);
  $app.innerHTML = `${header("", null)}
  <main>
    <section class="hero">
      <p class="eyebrow">Your program</p>
      <h2>${esc(p.title)}</h2>
      <p class="muted">${esc(p.tagline)}</p>
      <a class="text-link" href="#/choose">Switch program</a>
    </section>
    ${p.days.map((d, i) => `
      <a class="card day-card ${i === next ? "is-next" : ""}" href="#/w/${p.id}/${i}">
        <span class="row"><span class="card-title">${esc(d.title)}</span>${i === next ? `<span class="chip accent">Up next</span>` : ""}</span>
        <span class="muted">${p.minutes} min · ${exerciseCount(d)} exercises</span>
        <span class="muted small">Done ${timesDone(p.id, i)} ${timesDone(p.id, i) === 1 ? "time" : "times"}</span>
      </a>`).join("")}
    ${checkinButton()}
  </main>`;
}

function checkinButton() {
  if (!COACH.checkinUrl) return "";
  return `<a class="btn secondary block" href="${esc(COACH.checkinUrl)}" target="_blank" rel="noopener">Check in with ${esc(COACH.name)}</a>`;
}

function setsKey(pid, d) { return `${todayKey()}|${pid}|${d}`; }

function renderWorkout(p, d) {
  const day = p.days[d];
  const key = setsKey(p.id, d);
  // keep only today's progress
  for (const k of Object.keys(state.sets)) if (!k.startsWith(todayKey())) delete state.sets[k];
  const done = state.sets[key] || (state.sets[key] = {});

  $app.innerHTML = `${header(day.title, "#/")}
  <main>
    <p class="muted center">${p.minutes} min</p>
    ${warmupCard(p)}
    ${p.note ? `<p class="tip">${esc(p.note)}</p>` : ""}
    ${day.blocks.map((b, bi) => b.type === "interval" ? intervalCard(b, bi) : b.type === "superset" ? supersetCard(b, bi, done[bi] || 0) : strengthCard(b, bi, done[bi] || 0)).join("")}
    <button class="btn primary block" id="finish">Finish workout</button>
  </main>`;

  $app.querySelectorAll("[data-set]").forEach((el) => el.addEventListener("click", () => {
    const [bi, si] = el.dataset.set.split(":").map(Number);
    const b = day.blocks[bi];
    const cur = done[bi] || 0;
    if (si < cur) { done[bi] = si; save(); return renderWorkout(p, d); }
    done[bi] = si + 1; save();
    renderWorkout(p, d);
    const label = b.type === "superset" ? b.items.map((it) => it.name).join(" + ") : b.name;
    startRest(b.rest, `${label}: set ${si + 1} of ${b.sets} done`);
  }));
  $app.querySelectorAll("[data-hold]").forEach((el) => el.addEventListener("click", () => {
    const [bi, ii] = el.dataset.hold.split(":").map(Number);
    const it = day.blocks[bi].items[ii];
    const phases = it.sides
      ? [{ label: it.name, sub: "Left side", secs: it.timer, kind: "work", next: "Right side" },
         { label: "Switch sides", sub: "Get set on the right side", secs: 5, kind: "rest", next: "Right side" },
         { label: it.name, sub: "Right side", secs: it.timer, kind: "work" }]
      : [{ label: it.name, sub: it.cue, secs: it.timer, kind: "work" }];
    runPhases(phases, it.name);
  }));
  $app.querySelectorAll("[data-interval]").forEach((el) => el.addEventListener("click", () => startInterval(day.blocks[+el.dataset.interval])));
  $app.querySelectorAll("[data-toggle]").forEach((el) => el.addEventListener("click", () => {
    el.nextElementSibling.hidden = !el.nextElementSibling.hidden;
  }));
  document.getElementById("finish").addEventListener("click", () => finishDialog(p, d));
}

function warmupCard(p) {
  if (p.warmup) {
    const w = p.warmup;
    return `<details class="card warmup" open>
      <summary><span class="card-title">Warm-up</span> <span class="muted">${w.minutes} min</span></summary>
      <p class="target">${esc(w.title)}</p>
      <p class="rest">${esc(w.detail)}</p>
      ${w.steps ? `<ul>${w.steps.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>` : ""}
    </details>`;
  }
  return `<details class="card warmup">
    <summary><span class="card-title">Warm-up</span> <span class="muted">${WARMUP_MINUTES} min, no equipment</span></summary>
    <ul>${WARMUP.map((w) => `<li>${esc(w)}</li>`).join("")}</ul>
  </details>`;
}

function setButtons(b, bi, doneCount) {
  return `<div class="sets">${Array.from({ length: b.sets }, (_, si) =>
    `<button class="set ${si < doneCount ? "on" : ""}" data-set="${bi}:${si}" aria-label="Set ${si + 1}">${si < doneCount ? "✓" : si + 1}</button>`).join("")}</div>`;
}

function supersetCard(b, bi, doneCount) {
  const complete = doneCount >= b.sets;
  return `<section class="card ex superset ${complete ? "complete" : ""}">
    <div class="row"><span class="eyebrow">${b.items.length > 2 ? "Tri-set" : "Superset"} · ${b.sets} sets</span>${complete ? `<span class="chip accent">Done</span>` : ""}</div>
    ${b.items.map((it, i) => `<div class="ss-item">
      <span class="ss-letter">${String.fromCharCode(65 + i)}</span>
      <div><p class="card-title">${esc(it.name)}</p><p class="ss-reps">${esc(it.reps)}</p>${it.cue ? `<p class="cue small">${esc(it.cue)}</p>` : ""}${it.timer ? `<button class="btn secondary ss-timer" data-hold="${bi}:${i}">Start timer</button>` : ""}</div>
    </div>`).join("")}
    <p class="rest">Rest ${b.restLabel || fmtRest(b.rest)} after each set of ${b.items.map((_, i) => String.fromCharCode(65 + i)).join(" + ")}</p>
    ${setButtons(b, bi, doneCount)}
    <p class="muted small">Tap a set after finishing ${b.items.length > 2 ? "all three" : "both"} exercises. The rest timer starts on its own.</p>
  </section>`;
}

function strengthCard(b, bi, doneCount) {
  const complete = doneCount >= b.sets;
  return `<section class="card ex ${complete ? "complete" : ""}">
    <div class="row"><span class="card-title">${esc(b.name)}</span>${complete ? `<span class="chip accent">Done</span>` : ""}</div>
    <p class="target">${b.sets} sets × ${esc(b.reps)}</p>
    <p class="rest">Rest ${fmtRest(b.rest)} between sets</p>
    <p class="cue">${esc(b.cue)}</p>
    ${b.easier ? `<button class="text-link" data-toggle>Make it easier</button><p class="muted small" hidden>${esc(b.easier)}</p>` : ""}
    <div class="sets">${Array.from({ length: b.sets }, (_, si) =>
      `<button class="set ${si < doneCount ? "on" : ""}" data-set="${bi}:${si}" aria-label="Set ${si + 1}">${si < doneCount ? "✓" : si + 1}</button>`).join("")}</div>
    <p class="muted small">Tap a set when you finish it. The rest timer starts on its own.</p>
  </section>`;
}

function intervalCard(b, bi) {
  const mins = Math.round(intervalSeconds(b) / 60);
  const how = b.order === "station"
    ? `Each exercise: ${b.rounds} rounds of ${b.work} sec on, ${b.rest} sec off. Rest ${fmtRest(b.restBetweenRounds)} between exercises.`
    : `${b.work} sec on, ${b.rest} sec off${b.exercises.length > 1 ? ", one exercise after another" : ""}. ${b.rounds} rounds${b.restBetweenRounds ? `, rest ${fmtRest(b.restBetweenRounds)} between rounds` : ""}.`;
  return `<section class="card ex interval">
    <div class="row"><span class="card-title">${esc(b.title)}</span><span class="chip">${mins} min</span></div>
    <p class="rest">${esc(how)}</p>
    <ol class="ex-list">${b.exercises.map((e) => `<li><strong>${esc(e.name)}</strong><span class="muted small"> ${esc(e.cue)}${e.easier ? ` Easier: ${esc(e.easier)}.` : ""}</span></li>`).join("")}</ol>
    <button class="btn primary block" data-interval="${bi}">Start timer</button>
  </section>`;
}

function finishDialog(p, d) {
  const dlg = document.createElement("div");
  dlg.className = "overlay";
  dlg.innerHTML = `<div class="sheet" role="dialog" aria-modal="true" aria-labelledby="fin-h">
    <h2 id="fin-h">Nice work</h2>
    <p class="muted">How hard was it?</p>
    <div class="rating">${[1, 2, 3, 4, 5].map((n) => `<button data-r="${n}">${n}</button>`).join("")}</div>
    <div class="row small muted"><span>Easy</span><span>Very hard</span></div>
    <label class="field">Anything to note? (optional)<textarea id="note" rows="3" placeholder="Weights used, anything that hurt..."></textarea></label>
    <button class="btn primary block" id="save" disabled>Save workout</button>
    <button class="btn ghost block" id="cancel">Not yet</button>
  </div>`;
  document.body.appendChild(dlg);
  let rating = 0;
  dlg.querySelectorAll("[data-r]").forEach((b) => b.addEventListener("click", () => {
    rating = +b.dataset.r;
    dlg.querySelectorAll("[data-r]").forEach((x) => x.classList.toggle("on", x === b));
    dlg.querySelector("#save").disabled = false;
  }));
  dlg.querySelector("#cancel").addEventListener("click", () => dlg.remove());
  dlg.querySelector("#save").addEventListener("click", () => {
    state.log.push({ date: new Date().toISOString(), programId: p.id, dayIdx: d, rating, note: dlg.querySelector("#note").value.trim() });
    delete state.sets[setsKey(p.id, d)];
    save();
    dlg.remove();
    go("#/progress");
  });
}

function renderProgress() {
  const log = [...state.log].reverse();
  const weekAgo = Date.now() - 7 * 864e5;
  const thisWeek = state.log.filter((l) => new Date(l.date).getTime() > weekAgo).length;
  const days = new Set(state.log.map((l) => l.date.slice(0, 10))).size;
  $app.innerHTML = `${header("Progress", "#/")}
  <main>
    <div class="stats">
      <div class="stat"><span class="num">${state.log.length}</span><span class="muted small">workouts</span></div>
      <div class="stat"><span class="num">${thisWeek}</span><span class="muted small">last 7 days</span></div>
      <div class="stat"><span class="num">${days}</span><span class="muted small">days trained</span></div>
    </div>
    ${checkinButton()}
    ${log.length ? log.map((l) => {
      const p = program(l.programId);
      const day = p && p.days[l.dayIdx];
      return `<div class="card log">
        <div class="row"><span class="card-title">${esc(day ? day.title : "Workout")}</span><span class="muted small">${new Date(l.date).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })}</span></div>
        <span class="muted small">${esc(p ? p.title : "")} · effort ${l.rating}/5</span>
        ${l.note ? `<p class="small">${esc(l.note)}</p>` : ""}
      </div>`;
    }).join("") : `<p class="muted center">No workouts yet. Finish one and it shows up here.</p>`}
    <p class="muted small center">Saved on this phone only.</p>
  </main>`;
}

// ---------- timers ----------
let timer = null; // { raf, el, wake }
let audioCtx = null;
function beep(freq = 880, len = 0.15) {
  try {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    const o = audioCtx.createOscillator(), g = audioCtx.createGain();
    o.frequency.value = freq; o.connect(g); g.connect(audioCtx.destination);
    g.gain.setValueAtTime(0.2, audioCtx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + len);
    o.start(); o.stop(audioCtx.currentTime + len);
  } catch (e) {}
  try { navigator.vibrate && navigator.vibrate(200); } catch (e) {}
}
async function keepAwake() {
  try { return await navigator.wakeLock.request("screen"); } catch (e) { return null; }
}
function stopTimer() {
  if (!timer) return;
  clearInterval(timer.tick);
  if (timer.wake) timer.wake.release().catch(() => {});
  timer.el.remove();
  timer = null;
}

// Runs a list of phases: { label, sub, next, secs, kind: "work" | "rest" }
async function runPhases(phases, title) {
  stopTimer();
  beep(660, 0.05); // unlocks audio on iOS from the tap
  const el = document.createElement("div");
  el.className = "overlay timer";
  document.body.appendChild(el);
  timer = { el, wake: await keepAwake(), tick: null };
  let i = 0, endAt = 0, paused = false, left = 0;

  const draw = (secs) => {
    const ph = phases[i];
    el.className = `overlay timer ${ph.kind}`;
    el.innerHTML = `<div class="timer-inner">
      <p class="eyebrow">${esc(title)}</p>
      <p class="phase">${ph.kind === "work" ? "Go" : "Rest"}</p>
      ${ph.kind === "work" ? `<h2 class="timer-name">${esc(ph.label)}</h2>` : ""}
      ${ph.sub ? `<p class="small">${esc(ph.sub)}</p>` : ""}
      <p class="clock">${fmtTime(secs)}</p>
      ${ph.next ? `<p class="small">Next: ${esc(ph.next)}</p>` : ""}
      <div class="timer-controls">
        <button class="btn ghost" data-a="stop">Stop</button>
        <button class="btn light" data-a="pause">${paused ? "Resume" : "Pause"}</button>
        <button class="btn ghost" data-a="skip">Skip</button>
      </div>
    </div>`;
  };
  const startPhase = () => {
    if (i >= phases.length) { beep(990, 0.4); stopTimer(); return; }
    endAt = Date.now() + phases[i].secs * 1000;
    beep(phases[i].kind === "work" ? 990 : 520, 0.25);
    draw(phases[i].secs);
  };
  el.addEventListener("click", (e) => {
    const a = e.target.closest("[data-a]");
    if (!a) return;
    if (a.dataset.a === "stop") return stopTimer();
    if (a.dataset.a === "skip") { i++; paused = false; return startPhase(); }
    if (a.dataset.a === "pause") {
      if (paused) { endAt = Date.now() + left * 1000; paused = false; }
      else { left = Math.max(0, Math.ceil((endAt - Date.now()) / 1000)); paused = true; }
      draw(paused ? left : Math.ceil((endAt - Date.now()) / 1000));
    }
  });
  let lastShown = -1;
  timer.tick = setInterval(() => {
    if (paused || i >= phases.length) return;
    const secs = Math.ceil((endAt - Date.now()) / 1000);
    if (secs <= 0) { i++; return startPhase(); }
    if (secs !== lastShown) {
      lastShown = secs;
      const c = el.querySelector(".clock");
      if (c) { c.textContent = fmtTime(secs); c.classList.toggle("final", secs <= 3); }
      if (secs <= 3) beep(440, 0.08);
    }
  }, 200);
  startPhase();
}

function startRest(secs, sub) {
  runPhases([{ label: "Rest", sub, secs, kind: "rest" }], "Rest timer");
}

function startInterval(b) {
  const phases = [];
  const ex = b.exercises;
  const push = (e, nextName, restSecs, roundLabel) => {
    phases.push({ label: e.name, sub: `${roundLabel}. ${e.cue}`, secs: b.work, kind: "work", next: nextName });
    if (restSecs > 0) phases.push({ label: "Rest", sub: roundLabel, secs: restSecs, kind: "rest", next: nextName });
  };
  if (b.order === "station") {
    ex.forEach((e, ei) => {
      for (let r = 0; r < b.rounds; r++) {
        const lastRound = r === b.rounds - 1, lastEx = ei === ex.length - 1;
        const nextName = lastRound ? (lastEx ? "" : ex[ei + 1].name) : e.name;
        const rest = lastRound ? (lastEx ? 0 : b.restBetweenRounds) : b.rest;
        push(e, nextName, rest, `${e.name}: round ${r + 1} of ${b.rounds}`);
      }
    });
  } else {
    for (let r = 0; r < b.rounds; r++) {
      ex.forEach((e, ei) => {
        const lastEx = ei === ex.length - 1, lastRound = r === b.rounds - 1;
        const nextName = lastEx ? (lastRound ? "" : ex[0].name) : ex[ei + 1].name;
        const rest = lastEx ? (lastRound ? 0 : (b.restBetweenRounds || b.rest)) : b.rest;
        push(e, nextName, rest, `Round ${r + 1} of ${b.rounds}`);
      });
    }
  }
  runPhases(phases, b.title);
}

// ---------- boot ----------
render();
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {}));
}
