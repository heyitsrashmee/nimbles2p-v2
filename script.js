// ---- FOOTER KEYWORD ANIMATOR ----
(function initKwAnimator() {
  const words = ['Results','Compliance','Scale','Security','Diligence'];
  const el     = document.getElementById('kwWord');
  const cursor = document.querySelector('.footer-kw-cursor');
  if (!el) return;

  let idx = 0;
  let timer = null;

  function typeWord(word, cb) {
    el.textContent = '';
    el.classList.add('kw-visible');
    let i = 0;
    function typeNext() {
      if (i < word.length) {
        el.textContent += word[i++];
        timer = setTimeout(typeNext, 72);
      } else {
        // Hold fully typed word
        timer = setTimeout(cb, 1600);
      }
    }
    typeNext();
  }

  function eraseWord(cb) {
    const word = el.textContent;
    let i = word.length;
    function eraseNext() {
      if (i > 0) {
        el.textContent = word.slice(0, --i);
        timer = setTimeout(eraseNext, 45);
      } else {
        timer = setTimeout(cb, 150);
      }
    }
    eraseNext();
  }

  function cycle() {
    eraseWord(() => {
      idx = (idx + 1) % words.length;
      typeWord(words[idx], cycle);
    });
  }

  // Type the first word on load, then loop
  typeWord(words[0], cycle);
})();

// ---- NAV SCROLL ----
window.addEventListener('scroll', () => {
  const nav = document.getElementById('nav');
  const scrolled = window.scrollY > 60;
  nav.classList.toggle('scrolled', scrolled);
  nav.classList.toggle('light-bar', scrolled);
});

// ---- MARQUEE LOGOS ----
const logoData = [
  {n:'Tata Group',c:'#0077B6',l:'T'},
  {n:'Mahindra',c:'#C0392B',l:'M'},
  {n:'Infosys',c:'#007CC3',l:'I'},
  {n:'Reliance',c:'#1A1A6C',l:'R'},
  {n:'HUL',c:'#00A9E0',l:'H'},
  {n:'Adani',c:'#003087',l:'A'},
  {n:'Wipro',c:'#5D2E8C',l:'W'},
  {n:'Bajaj',c:'#1B3FA0',l:'B'},
  {n:'L&T',c:'#E64B37',l:'L'},
  {n:'Godrej',c:'#006747',l:'G'},
  {n:'ITC',c:'#87189D',l:'I'},
  {n:'Vedanta',c:'#C8102E',l:'V'},
];
function buildLogos(id) {
  const el = document.getElementById(id);
  logoData.forEach(d => {
    el.innerHTML += `<div class="logo-chip"><div class="logo-ic" style="background:${d.c}22;color:${d.c}">${d.l}</div><span class="logo-n">${d.n}</span></div>`;
  });
}
buildLogos('logos1');
buildLogos('logos2');

// ---- SUPPLIER ANALYTICS ANIMATION ----
(function initAnalyticsAnim() {
  const VIEWS = ['saV1','saV2','saV3','saV4'];
  const TABS  = ['saV1','saV2','saV3','saV4'];
  const VIEW_DURATION = 4000; // ms per view
  let viewIdx = 0;
  let running = false;
  let timeouts = [];

  function ct(fn, d) { const id = setTimeout(fn,d); timeouts.push(id); return id; }
  function clearAll() { timeouts.forEach(t=>clearTimeout(t)); timeouts=[]; }

  function activateView(idx) {
    viewIdx = idx;
    VIEWS.forEach((id,i) => {
      const v = document.getElementById(id);
      if (v) v.classList.toggle('sa-active', i===idx);
    });
    // Update nav tabs
    document.querySelectorAll('#saAnim .sa-nav-tab').forEach((tab,i) => {
      tab.classList.toggle('sa-active', i===idx);
    });
    // Run view-specific animations
    if (idx===0) animateV1();
    if (idx===1) animateV2();
    if (idx===2) animateV3();
    if (idx===3) animateV4();
  }

  function animateV1() {
    // Animate bars
    document.querySelectorAll('#saV1 .sa-bar-fill').forEach((bar,i) => {
      bar.style.height = '0';
      ct(() => { bar.style.height = bar.dataset.h; }, 100 + i*120);
    });
  }

  function animateV2() {
    // Animate gauges
    document.querySelectorAll('#saV2 .sa-gauge-fill').forEach((fill,i) => {
      fill.style.width = '0';
      ct(() => { fill.style.width = fill.dataset.w + '%'; }, 200 + i*150);
    });
  }

  function animateV3() {
    // Animate ring fills — reset then draw
    document.querySelectorAll('#saV3 .sa-ring-fill').forEach(ring => {
      const val = parseFloat(ring.dataset.val) || 0;
      ring.style.strokeDasharray = '0 88';
      ct(() => { ring.style.strokeDasharray = val + ' 88'; ring.style.transition = 'stroke-dasharray 1s ease'; }, 200);
    });
  }

  function animateV4() {
    // Slide in vendor cards staggered
    ['saVC1','saVC2','saVC3','saVC4'].forEach((id,i) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.classList.remove('sa-show');
      ct(() => {
        el.classList.add('sa-show');
        // Animate score bar
        const bar = el.querySelector('.sa-vc-score-bar');
        if (bar) { bar.style.width='0'; ct(()=>{ bar.style.width=bar.dataset.w; }, 50); }
      }, 150 + i*200);
    });
  }

  function resetAll() {
    // Reset bars
    document.querySelectorAll('#saV1 .sa-bar-fill').forEach(b => b.style.height='0');
    // Reset gauges
    document.querySelectorAll('#saV2 .sa-gauge-fill').forEach(f => f.style.width='0');
    // Reset rings
    document.querySelectorAll('#saV3 .sa-ring-fill').forEach(r => { r.style.transition='none'; r.style.strokeDasharray='0 88'; });
    // Reset vendor cards
    ['saVC1','saVC2','saVC3','saVC4'].forEach(id => {
      const el = document.getElementById(id);
      if (el) { el.classList.remove('sa-show'); const b=el.querySelector('.sa-vc-score-bar'); if(b) b.style.width='0'; }
    });
  }

  function runCycle() {
    if (running) return;
    running = true;
    resetAll();
    viewIdx = 0;
    activateView(0);

    // Cycle through views
    VIEWS.forEach((_, i) => {
      if (i === 0) return;
      ct(() => activateView(i), i * VIEW_DURATION);
    });

    // Reset after full cycle
    ct(() => { running = false; window.signalModAnimDone && window.signalModAnimDone(); }, VIEWS.length * VIEW_DURATION + 500);
  }

  ct(runCycle, 600);

  const panel5 = document.querySelector('.mod-body[data-panel="5"]');
  if (panel5) {
    new MutationObserver(() => {
      if (panel5.classList.contains('active')) {
        clearAll(); running = false;
        ct(runCycle, 400);
      }
    }).observe(panel5, { attributes: true, attributeFilter: ['class'] });
  }
})();

// ---- INVOICE PROCESSING ANIMATION ----
(function initInvoiceAnim() {
  let running = false;
  let timeouts = [];

  function clearAll() { timeouts.forEach(t => clearTimeout(t)); timeouts = []; }

  function t(fn, delay) { const id = setTimeout(fn, delay); timeouts.push(id); return id; }

  function showScreen(id) {
    ['invS1','invS2','invS3','invS4'].forEach(s => {
      const el = document.getElementById(s);
      if (el) el.classList.remove('inv-active');
    });
    const el = document.getElementById(id);
    if (el) el.classList.add('inv-active');
  }

  function setTask(id, state, statusText, icon) {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.remove('inv-running','inv-done');
    if (state) el.classList.add(state);
    el.querySelector('.inv-task-status').textContent = statusText;
    if (icon) el.querySelector('.inv-task-icon').textContent = icon;
  }

  function animateBar(onDone) {
    const bar = document.getElementById('invUploadBar');
    const pct = document.getElementById('invUploadPct');
    if (!bar || !pct) { onDone(); return; }
    let val = 0;
    const iv = setInterval(() => {
      val += Math.random() * 8 + 4;
      if (val >= 100) { val = 100; clearInterval(iv); setTimeout(onDone, 300); }
      bar.style.width = val + '%';
      pct.textContent = Math.floor(val) + '%';
    }, 80);
    timeouts.push(iv);
  }

  function runInvoiceAnim() {
    if (running) return;
    running = true;

    // Reset all
    showScreen('invS1');
    const pdfCard = document.getElementById('invPdfCard');
    if (pdfCard) pdfCard.classList.remove('inv-drop');
    const bar = document.getElementById('invUploadBar');
    if (bar) bar.style.width = '0%';
    const pct = document.getElementById('invUploadPct');
    if (pct) pct.textContent = '0%';
    ['invT1','invT2','invT3','invT4'].forEach(id => setTask(id, null, 'Waiting', null));
    ['invM1','invM2','invM3'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.classList.remove('inv-show');
    });

    // Step 1: button click (1.2s)
    t(() => {
      const btn = document.getElementById('invUploadBtn');
      if (btn) { btn.style.transform='scale(.95)'; setTimeout(()=>btn.style.transform='', 200); }

      t(() => {
        showScreen('invS2');
        // PDF card drops in
        t(() => {
          const card = document.getElementById('invPdfCard');
          if (card) card.classList.add('inv-drop');
          t(() => animateBar(() => {
            // Step 3: extraction tasks
            showScreen('invS3');
            const tasks = [
              { id:'invT1', label:'🔍', done:'✅', doneText:'Complete', runText:'Extracting…', delay:0 },
              { id:'invT2', label:'📷', done:'✅', doneText:'Verified', runText:'Checking QR…', delay:900 },
              { id:'invT3', label:'🔄', done:'✅', doneText:'No Duplicate', runText:'Validating…', delay:1800 },
              { id:'invT4', label:'🏷', done:'✅', doneText:'Classified', runText:'Classifying…', delay:2700 },
            ];
            tasks.forEach(task => {
              t(() => setTask(task.id, 'inv-running', task.runText, task.label), task.delay);
              t(() => setTask(task.id, 'inv-done', task.doneText, task.done), task.delay + 700);
            });

            // Step 4: matching results (after all tasks ~4.2s)
            t(() => {
              showScreen('invS4');
              t(() => { const el = document.getElementById('invM1'); if(el) el.classList.add('inv-show'); }, 300);
              t(() => { const el = document.getElementById('invM2'); if(el) el.classList.add('inv-show'); }, 1000);
              t(() => { const el = document.getElementById('invM3'); if(el) el.classList.add('inv-show'); }, 1900);
              // Reset cycle
              t(() => { running = false; window.signalModAnimDone && window.signalModAnimDone(); }, 5000);
            }, 4200);
          }), 300);
        }, 400);
      }, 400);
    }, 1200);
  }

  setTimeout(runInvoiceAnim, 700);

  const panel4 = document.querySelector('.mod-body[data-panel="4"]');
  if (panel4) {
    new MutationObserver(() => {
      if (panel4.classList.contains('active')) {
        clearAll(); running = false;
        setTimeout(runInvoiceAnim, 400);
      }
    }).observe(panel4, { attributes: true, attributeFilter: ['class'] });
  }
})();

// ---- RFQ FOLLOW UP AGENT ANIMATION ----
(function initRfqAnim() {
  const MESSAGES = [
    { delay: 600,  type: 'bot', html: 'Scanning RFQ <strong>#4421</strong> — analyzing response status for all 3 vendors…' },
    { delay: 2000, type: 'bot', html: '<span class="rfq-em-a">⚠ MetalWorks Ltd</span> has not opened the email. Risk of no-bid. Initiating SMS + email nudge every 2 days.', vendor: 'A' },
    { delay: 3800, type: 'system', html: '📱 <strong>SMS sent to MetalWorks Ltd:</strong> "Hi, RFQ #4421 for Steel Components is awaiting your bid. Deadline in 3 days. Tap to open →"' },
    { delay: 5200, type: 'bot', html: '<span class="rfq-em-b">✓ Steel Co. Pvt Ltd</span> is actively working on the bid. Sending appreciation and deadline motivation.', vendor: 'B' },
    { delay: 6800, type: 'system', html: '🎯 <strong>Message to Steel Co.:</strong> "Great work starting on time! You\'re ahead of the curve — stay focused to submit before the deadline and win this."' },
    { delay: 8400, type: 'bot', html: '<span class="rfq-em-c">⏸ AlloyTech Industries</span> opened the RFQ but hasn\'t begun. Sending onboarding guide + bid tips.', vendor: 'C' },
    { delay: 10000, type: 'system', html: '📘 <strong>Resources sent to AlloyTech:</strong> Bid submission guide, RFQ template, FAQs and step-by-step video walkthrough.' },
    { delay: 11800, type: 'bot', html: 'All 3 vendors addressed. Monitoring continues. Next follow-up for <span class="rfq-em-a">MetalWorks</span> in <strong>2 days</strong> if no action.' },
  ];

  let running = false;
  let timeouts = [];

  function clearAll() {
    timeouts.forEach(t => clearTimeout(t));
    timeouts = [];
  }

  function addMsg(type, html) {
    const msgs = document.getElementById('rfqMsgs');
    if (!msgs) return;
    const row = document.createElement('div');
    row.className = 'rfq-msg rfq-msg-' + type;
    if (type === 'bot') {
      row.innerHTML = `<div class="rfq-msg-avatar">🤖</div><div class="rfq-msg-bubble">${html}</div>`;
    } else {
      row.innerHTML = `<div class="rfq-msg-bubble">${html}</div>`;
    }
    msgs.appendChild(row);
    // Animate in
    requestAnimationFrame(() => requestAnimationFrame(() => row.classList.add('rfq-show')));
    msgs.scrollTop = msgs.scrollHeight;
  }

  function highlightVendor(id) {
    ['rfqVA','rfqVB','rfqVC'].forEach(v => {
      const el = document.getElementById(v);
      if (el) el.classList.remove('rfq-active');
    });
    const map = { A:'rfqVA', B:'rfqVB', C:'rfqVC' };
    const el = document.getElementById(map[id]);
    if (el) el.classList.add('rfq-active');
  }

  function showAction(vendor) {
    const map = { A:'rfqActA', B:'rfqActB', C:'rfqActC' };
    const el = document.getElementById(map[vendor]);
    if (el) el.classList.add('rfq-show');
  }

  function runRfqAnim() {
    if (running) return;
    running = true;

    // Reset
    const msgs = document.getElementById('rfqMsgs');
    if (msgs) msgs.innerHTML = '';
    ['rfqVA','rfqVB','rfqVC'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.classList.remove('rfq-active');
    });
    ['rfqActA','rfqActB','rfqActC'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.classList.remove('rfq-show');
    });

    MESSAGES.forEach(msg => {
      const t = setTimeout(() => {
        addMsg(msg.type, msg.html);
        if (msg.vendor) {
          highlightVendor(msg.vendor);
          showAction(msg.vendor);
        }
      }, msg.delay);
      timeouts.push(t);
    });

    // Reset after full cycle
    const reset = setTimeout(() => { running = false; window.signalModAnimDone && window.signalModAnimDone(); }, 15000);
    timeouts.push(reset);
  }

  // Boot after short delay
  setTimeout(runRfqAnim, 600);

  // Re-run on tab switch
  const panel3 = document.querySelector('.mod-body[data-panel="3"]');
  if (panel3) {
    new MutationObserver(() => {
      if (panel3.classList.contains('active')) {
        clearAll();
        running = false;
        setTimeout(runRfqAnim, 400);
      }
    }).observe(panel3, { attributes: true, attributeFilter: ['class'] });
  }
})();

// ---- SUPPLIER PORTAL ANIMATION ----
(function initSupplierAnim() {
  function showScreen(id) {
    document.querySelectorAll('.sp-screen').forEach(s => s.classList.remove('sp-active'));
    const el = document.getElementById(id);
    if (el) el.classList.add('sp-active');
  }

  function typeInto(elId, text, delay, cb) {
    const el = document.getElementById(elId);
    if (!el) { cb && cb(); return; }
    el.classList.add('sp-typing');
    el.textContent = '';
    let i = 0;
    const iv = setInterval(() => {
      el.textContent += text[i++];
      if (i >= text.length) {
        clearInterval(iv);
        el.classList.remove('sp-typing');
        el.classList.add('sp-filled');
        setTimeout(() => cb && cb(), 200);
      }
    }, delay);
  }

  function fillField(elId, text, cb) {
    const el = document.getElementById(elId);
    if (!el) { cb && cb(); return; }
    el.classList.add('sp-filled');
    el.textContent = text;
    setTimeout(() => cb && cb(), 300);
  }

  let animRunning = false;

  function runSupplierAnim() {
    if (animRunning) return;
    animRunning = true;

    // Reset
    showScreen('spS1');
    ['spF1','spF2','spF3','spF4','spF5'].forEach(id => {
      const el = document.getElementById(id);
      if (el) { el.classList.remove('sp-filled','sp-typing'); el.textContent = ''; }
    });
    const submitBtn = document.getElementById('spSubmitBtn');
    if (submitBtn) submitBtn.classList.remove('sp-show');
    ['spAct1','spAct2','spAct3'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.classList.remove('sp-chosen');
    });

    // Step 1: click button → show form (1.5s)
    setTimeout(() => {
      const btn = document.getElementById('spRaiseBtn');
      if (btn) { btn.style.transform='scale(.95)'; setTimeout(()=>btn.style.transform='',200); }
      setTimeout(() => showScreen('spS2'), 400);

      // Fill form fields sequentially
      setTimeout(() => fillField('spF1','Invoice Issue', () =>
        fillField('spF2','PO / Budget', () =>
          fillField('spF3','INV-0083', () =>
            fillField('spF4','PO-4401', () =>
              typeInto('spF5', "Invoice partially blocked 'PO consumption exceeded'", 35, () => {
                if (submitBtn) submitBtn.classList.add('sp-show');
              })
            )
          )
        )
      ), 600);
    }, 1500);

    // Step 2: submit form → bot analyzing (7.5s)
    setTimeout(() => {
      const sb = document.getElementById('spSubmitBtn');
      if (sb) { sb.style.transform='scale(.97)'; setTimeout(()=>sb.style.transform='',200); }
      setTimeout(() => showScreen('spS3'), 400);
    }, 7500);

    // Step 3: analyzing → root cause (10s)
    setTimeout(() => showScreen('spS4'), 10000);

    // Step 4: choose action 1 (13s)
    setTimeout(() => {
      const act = document.getElementById('spAct1');
      if (act) act.classList.add('sp-chosen');
      setTimeout(() => showScreen('spS5'), 800);
    }, 13000);

    // Reset cycle (17s)
    setTimeout(() => { animRunning = false; }, 17000);
    setTimeout(() => { window.signalModAnimDone && window.signalModAnimDone(); }, 14500);
  }

  // Run on first load
  setTimeout(runSupplierAnim, 500);

  // Re-run when panel 2 becomes active
  const panel2 = document.querySelector('.mod-body[data-panel="2"]');
  if (panel2) {
    new MutationObserver(() => {
      if (panel2.classList.contains('active')) {
        animRunning = false;
        setTimeout(runSupplierAnim, 300);
      }
    }).observe(panel2, { attributes: true, attributeFilter: ['class'] });
  }
})();

// ---- COMPLIANCE PORTAL ANIMATION ----
(function initComplianceAnim() {
  const PANEL_DURATION = 6000; // ms total for animation cycle

  function runComplianceAnim() {
    const checks = ['pan','cin','gst','msme','itr'];
    const stepNodes = [1,2,3,4].map(n => document.getElementById('cStep'+n));
    const lines = [1,2,3].map(n => document.getElementById('cLine'+n));
    const countryBadge = document.getElementById('cCountryBadge');
    const popup = document.getElementById('cPopup');
    if (!stepNodes[0]) return;

    // Reset state
    stepNodes.forEach((n,i) => {
      n.classList.remove('done','active');
      if (i===0) n.classList.add('active');
    });
    lines.forEach(l => { if(l) { l.classList.remove('done'); l.style.width='0%'; }});
    checks.forEach(id => {
      const el = document.getElementById('cCheck-'+id);
      if (el) { el.classList.remove('checking','done'); el.querySelector('.comp-ci-icon').textContent='·'; }
    });
    if (countryBadge) countryBadge.classList.remove('show');
    if (popup) popup.classList.remove('show');

    // Step 1: Country selected (0ms)
    setTimeout(() => {
      if (countryBadge) countryBadge.classList.add('show');
    }, 600);

    // Step 1 → Step 2 (1200ms)
    setTimeout(() => {
      stepNodes[0].classList.remove('active'); stepNodes[0].classList.add('done');
      stepNodes[0].textContent = '✓';
      if (lines[0]) { lines[0].style.transition='width .6s ease'; lines[0].classList.add('done'); lines[0].style.width='100%'; }
      stepNodes[1].classList.add('active');
    }, 1200);

    // Start checks one by one (1500ms–3500ms)
    checks.forEach((id, i) => {
      setTimeout(() => {
        const el = document.getElementById('cCheck-'+id);
        if (!el) return;
        el.classList.add('checking');
        el.querySelector('.comp-ci-icon').textContent = '⟳';
        setTimeout(() => {
          el.classList.remove('checking');
          el.classList.add('done');
          el.querySelector('.comp-ci-icon').textContent = '✓';
        }, 500);
      }, 1500 + i * 340);
    });

    // Step 2 → Step 3 (3800ms)
    setTimeout(() => {
      stepNodes[1].classList.remove('active'); stepNodes[1].classList.add('done');
      stepNodes[1].textContent = '✓';
      if (lines[1]) { lines[1].style.transition='width .6s ease'; lines[1].classList.add('done'); lines[1].style.width='100%'; }
      stepNodes[2].classList.add('active');
    }, 3800);

    // Step 3 → Step 4 + popup (4600ms)
    setTimeout(() => {
      stepNodes[2].classList.remove('active'); stepNodes[2].classList.add('done');
      stepNodes[2].textContent = '✓';
      if (lines[2]) { lines[2].style.transition='width .6s ease'; lines[2].classList.add('done'); lines[2].style.width='100%'; }
      stepNodes[3].classList.add('active');
    }, 4600);

    setTimeout(() => {
      if (popup) popup.classList.add('show');
      // Signal tab manager — compliance animation complete
      setTimeout(() => { window.signalModAnimDone && window.signalModAnimDone(); }, 800);
    }, 5000);
  }

  // Run on first load
  setTimeout(runComplianceAnim, 400);

  // Re-run whenever Compliance tab becomes active
  const observer = new MutationObserver(() => {
    const panel = document.querySelector('.mod-body[data-panel="0"]');
    if (panel && panel.classList.contains('active')) {
      setTimeout(runComplianceAnim, 300);
    }
  });
  const panel0 = document.querySelector('.mod-body[data-panel="0"]');
  if (panel0) observer.observe(panel0, { attributes: true, attributeFilter: ['class'] });
})();

// ---- MODULE TABBAR ----
const MOD_SEQUENCE = [0, 2, 3, 4, 5];

// Exact ms from animation start to when signalModAnimDone() fires
const MOD_DURATIONS = { 0: 6040, 2: 14940, 3: 15540, 4: 14800, 5: 17040 };

let modSeqIdx  = 0;
let modPlaying = true;
let advTimer   = null;
let currentBar = null; // the active timer bar element
let barStart   = null; // performance.now() when bar started
let barDur     = 0;    // total duration of current bar
let barElapsed = 0;    // ms consumed when paused
let barRaf     = null; // RAF id

// ── RAF-driven bar fill ──
function barTick(now) {
  if (!currentBar || !barStart) return;
  const elapsed = Math.min(now - barStart, barDur);
  currentBar.style.width = (elapsed / barDur * 100).toFixed(2) + '%';
  if (elapsed < barDur) {
    barRaf = requestAnimationFrame(barTick);
  }
}

function startBar(dur, from) {
  stopBar();
  currentBar = document.getElementById('timer-' + MOD_SEQUENCE[modSeqIdx]);
  if (!currentBar) return;
  barDur     = dur;
  barElapsed = from;
  currentBar.style.width = (from / dur * 100).toFixed(2) + '%';
  barStart = performance.now() - from;
  barRaf = requestAnimationFrame(barTick);
}

function stopBar() {
  if (barRaf) { cancelAnimationFrame(barRaf); barRaf = null; }
}

function pauseBar() {
  stopBar();
  if (!currentBar || !barStart) return;
  const elapsed = Math.min(performance.now() - barStart, barDur);
  barElapsed = elapsed;
  currentBar.style.width = (elapsed / barDur * 100).toFixed(2) + '%';
}

function resetBars() {
  stopBar();
  currentBar = null;
  document.querySelectorAll('.mod-timer-bar').forEach(b => {
    b.style.width = '0%';
  });
}

// ── Switch to a panel ──
function switchMod(panelId) {
  if (advTimer) { clearTimeout(advTimer); advTimer = null; }
  resetBars();
  barElapsed = 0;

  // Crossfade panels
  const prev = document.querySelector('.mod-body.active');
  if (prev) {
    prev.classList.remove('active');
    prev.classList.add('exit');
    setTimeout(() => prev.classList.remove('exit'), 350);
  }
  setTimeout(() => {
    const next = document.querySelector('.mod-body[data-panel="' + panelId + '"]');
    if (next) next.classList.add('active');
  }, 20);

  // Update tab highlight
  document.querySelectorAll('.mod-tab').forEach(t => t.classList.remove('active'));
  const tab = document.querySelector('.mod-tab[data-mod="' + panelId + '"]');
  if (tab) tab.classList.add('active');

  // Start bar running at this panel's actual animation duration
  if (modPlaying) {
    const dur = MOD_DURATIONS[panelId] || 8000;
    setTimeout(() => startBar(dur, 0), 60);
  }
}

// ── Called by each animation when it truly finishes ──
window.signalModAnimDone = function() {
  if (!modPlaying) return;
  // Snap bar to 100%
  stopBar();
  if (currentBar) currentBar.style.width = '100%';
  // Wait 3 seconds after animation completes, then advance
  advTimer = setTimeout(() => {
    modSeqIdx = (modSeqIdx + 1) % MOD_SEQUENCE.length;
    switchMod(MOD_SEQUENCE[modSeqIdx]);
  }, 3000);
};

// ── Tab click ──
document.getElementById('modTabbar').addEventListener('click', e => {
  const tab = e.target.closest('.mod-tab[data-mod]');
  if (!tab) return;
  const panelId = parseInt(tab.dataset.mod);
  const seqPos  = MOD_SEQUENCE.indexOf(panelId);
  if (seqPos < 0) return;
  modSeqIdx = seqPos;
  switchMod(panelId);
});

// ── Pause / Play ──
document.getElementById('modPauseBtn').addEventListener('click', () => {
  modPlaying = !modPlaying;
  const pauseIcon = document.getElementById('modPauseIcon');
  const playIcon  = document.getElementById('modPlayIcon');
  if (pauseIcon) pauseIcon.style.display = modPlaying ? '' : 'none';
  if (playIcon)  playIcon.style.display  = modPlaying ? 'none' : '';
  document.getElementById('modPauseBtn').title = modPlaying ? 'Pause autoplay' : 'Resume autoplay';

  if (!modPlaying) {
    if (advTimer) { clearTimeout(advTimer); advTimer = null; }
    pauseBar();
  } else {
    // Resume bar from where it paused
    if (currentBar) {
      startBar(barDur, barElapsed);
    } else {
      // No bar running — start fresh for current panel
      const panelId = MOD_SEQUENCE[modSeqIdx];
      startBar(MOD_DURATIONS[panelId] || 8000, 0);
    }
  }
});

// ── Boot ──
(function init() {
  const first = document.querySelector('.mod-body[data-panel="0"]');
  if (first) {
    first.style.transition = 'none';
    first.classList.add('active');
    setTimeout(() => { first.style.transition = ''; }, 50);
  }
  document.querySelector('.mod-tab[data-mod="0"]')?.classList.add('active');
  // Small delay so compliance animation starts first, then bar begins
  setTimeout(() => startBar(MOD_DURATIONS[0], 0), 400);
})();

// ---- SCROLL REVEAL ----
const sr = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if(e.isIntersecting) { e.target.classList.add('vis'); sr.unobserve(e.target); }
  });
}, {threshold:0.12});
document.querySelectorAll('.sr').forEach(el => sr.observe(el));

// ---- TEXT CENTER ----
document.querySelectorAll('.text-center').forEach(el => el.style.textAlign = 'center');

// ---- WORD REVEAL ----
function setupWordReveal() {
  const el = document.getElementById('revealText');
  if(!el) return;
  const text = el.innerText;
  el.innerHTML = text.split(' ').map((w,i) =>
    `<span class="word" style="transition-delay:${i*0.04}s">${w}</span>`
  ).join(' ');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if(e.isIntersecting) {
        el.querySelectorAll('.word').forEach(w => w.classList.add('vis'));
        observer.unobserve(e.target);
      }
    });
  }, {threshold:0.3});
  observer.observe(el);
}
setupWordReveal();

// ---- COUNTER ANIMATION ----
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if(target) { e.preventDefault(); target.scrollIntoView({behavior:'smooth'}); }
  });
});

// ---- CASES CAROUSEL ----
// ---- OUTCOMES TAB + CARD ----
(function initCases() {
  const tabs  = document.querySelectorAll('#casesTabsRow .cases-tab-btn');
  const cards = document.querySelectorAll('#casesCardArea .cases-card-item');
  if (!tabs.length || !cards.length) return;

  let current = 0;

  function goTo(idx) {
    if (idx === current) return;
    tabs[current].classList.remove('ctb-active');
    cards[current].classList.remove('cci-active');
    current = idx;
    tabs[current].classList.add('ctb-active');
    cards[current].classList.add('cci-active');
  }

  tabs.forEach((tab, i) => tab.addEventListener('click', () => goTo(i)));
})();

-e 


// ---- WORD REVEAL — YELLOW SECTION ----
(function initYbWordReveal() {
  const topEl    = document.getElementById('ybTop');
  const bottomEl = document.getElementById('ybBottom');
  const wrap     = document.getElementById('ybWrap');
  const arrow    = document.getElementById('ybArrow');
  const arrowAnim = document.getElementById('arrowAnim');
  if (!topEl || !bottomEl) return;

  // Top segments
  const topSegs = [
    {t:"We've baked years of domain expertise into workflows that are ",h:false},
    {t:"ready-to-use",h:true},
    {t:", AI that handles the ",h:false},
    {t:"heavy lifting",h:true},
    {t:", and compliance that keeps you ",h:false},
    {t:"audit-proof",h:true},
    {t:".",h:false},
  ];

  // Bottom segments
  const botSegs = [
    {t:"Because when it comes to ",h:false},
    {t:"Vendors",h:false,bold:true},
    {t:", we speak the language better than anyone.",h:false},
  ];

  function buildWords(segs, container) {
    const allWords = [];
    segs.forEach(seg => {
      const tokens = seg.t.split(/(?<= )/);
      tokens.forEach(token => {
        if (!token) return;
        const outer = document.createElement('span');
        outer.className = 'yb-word' + (seg.h ? ' yb-hl-word' : '');
        const inner = document.createElement('span');
        inner.className = 'yb-word-inner';
        if (seg.bold) inner.style.fontWeight = '700';
        if (seg.h) inner.style.color = '#3B2490';
        inner.textContent = token;
        outer.appendChild(inner);
        container.appendChild(outer);
        allWords.push(outer);
      });
    });
    return allWords;
  }

  const topWords = buildWords(topSegs, topEl);
  const botWords = buildWords(botSegs, bottomEl);

  function revealWords(words, startDelay, perWord) {
    words.forEach((w, i) => {
      setTimeout(() => w.classList.add('revealed'), startDelay + i * perWord);
    });
  }

  function runAnimation() {
    // 1. Top text reveals
    revealWords(topWords, 0, 42);
    const topDur = topWords.length * 42;

    // 2. Arrow draws in after top text
    setTimeout(() => {
      if (arrow) arrow.style.opacity = '1';
      if (arrow) arrow.style.transform = 'scaleY(1)';
      const arrowImg = document.getElementById('ybArrow');
      if (arrowImg) { arrowImg.style.opacity='1'; arrowImg.style.transform='scaleY(1)'; }
    }, topDur + 100);

    // 3. Bottom text reveals after arrow
    revealWords(botWords, topDur + 900, 55);
  }

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { runAnimation(); obs.disconnect(); }
    });
  }, { threshold: 0.2 });

  const sec = document.getElementById('why-matters');
  if (sec) obs.observe(sec);
})();

(function initTypewriter() {
  const el = document.getElementById('whyTypewriter');
  if (!el) return;

  const fullText =
    "No patchwork agents. No legacy workflows. No disconnected automations.\n\nJust intelligent orchestration — engineered to help enterprises comply, automate, and maximize at scale.";

  let charIdx = 0;
  let started = false;

  // Cache cursor element once
  const cursor = el.querySelector('.why-tw-cursor');

  function typeNext() {
    if (charIdx >= fullText.length) return;

    const ch = fullText[charIdx++];

    if (ch === '\n') {
      const br = document.createElement('br');
      if (cursor && cursor.parentNode) {
        cursor.parentNode.insertBefore(br, cursor);
      } else {
        el.appendChild(br);
      }
      setTimeout(typeNext, 260);
      return;
    }

    const txt = document.createTextNode(ch);
    if (cursor && cursor.parentNode) {
      cursor.parentNode.insertBefore(txt, cursor);
    } else {
      el.appendChild(txt);
    }

    let delay = 20;
    if ('.!?'.includes(ch))  delay = 320;
    else if (',;:'.includes(ch)) delay = 110;
    else if (ch === ' ')     delay = 12;

    setTimeout(typeNext, delay);
  }

  function start() {
    if (started) return;
    started = true;
    typeNext();
  }

  // Start as soon as the section enters the viewport at all
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { start(); obs.disconnect(); } });
  }, { threshold: 0, rootMargin: '0px 0px -10% 0px' });

  const whySec = document.getElementById('why');
  if (whySec) obs.observe(whySec);

  // Fallback: if already in view or observer never fires, start after 800ms
  setTimeout(start, 800);
})();

// ---- ORCHESTRATION DIAGRAM ----
(function initOrch() {
  const vis = document.getElementById('orchVis');
  const svg = document.getElementById('orchSVG');
  if (!vis || !svg) return;

  const W = 460, H = 480;
  const cx = W / 2, cy = H / 2 - 10;
  const R = 158; // orbit radius

  // 6 agents at even angles, offset so none is directly top (12 o'clock)
  const agents = [
    { id: 'ag0', angle: -100 },
    { id: 'ag1', angle: -28 },
    { id: 'ag2', angle: 44 },
    { id: 'ag3', angle: 116 },
    { id: 'ag4', angle: 188 },
    { id: 'ag5', angle: 260 },
  ];

  const toRad = d => (d * Math.PI) / 180;
  const agentColors = [
    '#4A47A0','#10B981','#1E1B4B',
    '#F59E0B','#EF4444','#3B82F6'
  ];

  // Position agent DOM nodes
  agents.forEach(({ id, angle }) => {
    const el = document.getElementById(id);
    if (!el) return;
    const ax = cx + R * Math.cos(toRad(angle));
    const ay = cy + R * Math.sin(toRad(angle));
    el.style.left = ax + 'px';
    el.style.top = ay + 'px';
  });

  // SVG namespace
  const NS = 'http://www.w3.org/2000/svg';
  const mk = tag => document.createElementNS(NS, tag);

  // Draw connection lines + gradient defs
  const defs = mk('defs');
  svg.appendChild(defs);

  // Pulse ring circles behind hub
  [80, 116, 152].forEach((r, i) => {
    const ring = mk('circle');
    ring.setAttribute('cx', cx);
    ring.setAttribute('cy', cy);
    ring.setAttribute('r', r);
    ring.setAttribute('fill', 'none');
    ring.setAttribute('stroke', 'rgba(99,32,224,0.12)');
    ring.setAttribute('stroke-width', '1');
    ring.setAttribute('stroke-dasharray', '4 8');
    ring.style.animation = `ringRotate ${18 + i * 6}s linear infinite ${i % 2 === 0 ? '' : 'reverse'}`;
    svg.appendChild(ring);
  });

  // Add ring rotation keyframe via style tag
  const style = document.createElement('style');
  style.textContent = `
    @keyframes ringRotate { from { transform-origin: ${cx}px ${cy}px; transform: rotate(0deg); } to { transform-origin: ${cx}px ${cy}px; transform: rotate(360deg); } }
    @keyframes packetMove { 0% { opacity: 0; } 8% { opacity: 1; } 85% { opacity: 0.9; } 100% { opacity: 0; } }
  `;
  document.head.appendChild(style);

  // Draw lines & animated packets for each agent
  agents.forEach(({ id, angle }, i) => {
    const ax = cx + R * Math.cos(toRad(angle));
    const ay = cy + R * Math.sin(toRad(angle));
    const col = agentColors[i];

    // Gradient def for this line
    const grad = mk('linearGradient');
    const gid = 'lg' + i;
    grad.setAttribute('id', gid);
    grad.setAttribute('gradientUnits', 'userSpaceOnUse');
    grad.setAttribute('x1', cx); grad.setAttribute('y1', cy);
    grad.setAttribute('x2', ax); grad.setAttribute('y2', ay);
    const s1 = mk('stop'); s1.setAttribute('offset', '0%'); s1.setAttribute('stop-color', 'rgba(99,32,224,0.6)');
    const s2 = mk('stop'); s2.setAttribute('offset', '100%'); s2.setAttribute('stop-color', col + '99');
    grad.appendChild(s1); grad.appendChild(s2);
    defs.appendChild(grad);

    // Connection line
    const line = mk('line');
    line.setAttribute('x1', cx); line.setAttribute('y1', cy);
    line.setAttribute('x2', ax); line.setAttribute('y2', ay);
    line.setAttribute('stroke', `url(#${gid})`);
    line.setAttribute('stroke-width', '1.5');
    line.setAttribute('stroke-dasharray', '6 5');
    svg.appendChild(line);

    // Animated packet (circle travelling the line)
    const pkt = mk('circle');
    pkt.setAttribute('r', '4');
    pkt.setAttribute('fill', col);
    pkt.style.filter = `drop-shadow(0 0 5px ${col})`;
    const delay = i * 1.1;
    const dur = 2.2;
    pkt.innerHTML = `
      <animateMotion dur="${dur}s" begin="${delay}s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1">
        <mpath href="#path${i}"/>
      </animateMotion>
      <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.08;0.85;1" dur="${dur}s" begin="${delay}s" repeatCount="indefinite"/>
    `;
    svg.appendChild(pkt);

    // Path def for animateMotion
    const path = mk('path');
    path.setAttribute('id', 'path' + i);
    path.setAttribute('d', `M${cx},${cy} L${ax},${ay}`);
    path.setAttribute('fill', 'none');
    defs.appendChild(path);

    // Reverse packet (agent → hub) with offset timing
    const pkt2 = mk('circle');
    pkt2.setAttribute('r', '3');
    pkt2.setAttribute('fill', col);
    pkt2.style.filter = `drop-shadow(0 0 4px ${col}) opacity(0.6)`;
    const delay2 = delay + dur * 0.5;
    pkt2.innerHTML = `
      <animateMotion dur="${dur}s" begin="${delay2}s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1">
        <mpath href="#rpath${i}"/>
      </animateMotion>
      <animate attributeName="opacity" values="0;0.7;0.7;0" keyTimes="0;0.1;0.82;1" dur="${dur}s" begin="${delay2}s" repeatCount="indefinite"/>
    `;
    svg.appendChild(pkt2);

    const rpath = mk('path');
    rpath.setAttribute('id', 'rpath' + i);
    rpath.setAttribute('d', `M${ax},${ay} L${cx},${cy}`);
    rpath.setAttribute('fill', 'none');
    defs.appendChild(rpath);
  });

  // Hub pulse rings (animating outward)
  function addPulseRing() {
    const ring = mk('circle');
    ring.setAttribute('cx', cx);
    ring.setAttribute('cy', cy);
    ring.setAttribute('r', '36');
    ring.setAttribute('fill', 'none');
    ring.setAttribute('stroke', 'rgba(99,32,224,0.5)');
    ring.setAttribute('stroke-width', '1.5');
    svg.insertBefore(ring, svg.firstChild);
    const dur = 2.4;
    ring.innerHTML = `
      <animate attributeName="r" from="36" to="95" dur="${dur}s" repeatCount="indefinite"/>
      <animate attributeName="stroke-width" from="1.5" to="0" dur="${dur}s" repeatCount="indefinite"/>
      <animate attributeName="opacity" from="0.55" to="0" dur="${dur}s" repeatCount="indefinite"/>
    `;
    setTimeout(addPulseRing, 2400);
  }
  setTimeout(addPulseRing, 200);

  // Active agent highlight — cycles every 1.8s
  let activeIdx = 0;
  function cycleAgent() {
    agents.forEach(({ id }, i) => {
      const box = document.querySelector('#' + id + ' .orch-agent-box');
      if (!box) return;
      if (i === activeIdx) {
        box.style.borderColor = 'rgba(139,92,246,0.7)';
        box.style.boxShadow = `0 0 16px ${agentColors[i]}66`;
        box.style.transform = 'scale(1.08)';
      } else {
        box.style.borderColor = 'rgba(255,255,255,.12)';
        box.style.boxShadow = '';
        box.style.transform = '';
      }
    });
    activeIdx = (activeIdx + 1) % agents.length;
    setTimeout(cycleAgent, 1800);
  }
  cycleAgent();
})();

-e 


function animateCounter(el) {
  const target = parseFloat(el.dataset.target);
  const suffix = el.dataset.suffix || '';
  const prefix = el.dataset.prefix || '';
  const decimals = parseInt(el.dataset.decimal) || 0;
  const duration = 1800;
  const start = performance.now();
  const easeOut = t => 1 - Math.pow(1 - t, 3);
  function tick(now) {
    const p = Math.min((now - start) / duration, 1);
    const val = (target * easeOut(p)).toFixed(decimals);
    el.innerHTML = prefix + val + '<span class="hs-suffix">' + suffix + '</span>';
    if (p < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}
const counterObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.hs-num[data-target]').forEach(animateCounter);
      counterObs.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });
const statsEl = document.querySelector('.hero-stats');
if (statsEl) counterObs.observe(statsEl);

