// 串成一卷时，每一幕跟外面的壳子（roll.html）说话：演完了、放音乐、重来
// 单独打开某一幕的时候 in=false，这些都不做，onGo 立刻执行
window.ROLL = {
  in: window.top !== window,
  done(fx) { if (this.in) top.postMessage({roll:'done', fx}, '*'); },
  prep() { if (this.in) top.postMessage({roll:'prep'}, '*'); },
  ready() { if (this.in) top.postMessage({roll:'ready'}, '*'); },
  music(cmd) { if (this.in) top.postMessage({roll:'music', cmd}, '*'); },
  pola() { if (this.in) top.postMessage({roll:'pola'}, '*'); },
  restart() { if (this.in) top.postMessage({roll:'restart'}, '*'); else location.href = 'opening.html'; },
  // 清晰度：smooth 1 倍、standard 1.5 倍、sharp 2 倍
  pr() { let q = 'standard'; try { q = localStorage.getItem('aroll.q') || q; } catch (e) {} return {smooth:1, standard:1.5, sharp:2}[q] || 1.5; },
  onQuality(fn) { addEventListener('message', e => { if (e.data && e.data.roll === 'quality') fn(); }); },
  // 「再试一次」重装的这一幕地址带 rgo：壳子的 go 只发一次，重装以后就当已经收到
  went: new URLSearchParams(location.search).has('rgo'),
  onGo(fn) {
    if (!this.in || this.went) { fn(); return; }
    let ran = false;
    addEventListener('message', e => { if (!ran && e.data && e.data.roll === 'go') { ran = true; fn(); } });
  },
  zhReady() { return Promise.resolve(); },
  // 拿一张图：丢了就再拿，最多四次；十秒都拿不到就给一块暗色空画布顶上，整幕接着演
  img(src) {
    return new Promise(r => {
      let n = 0; const WAIT = [1500, 3000, 5000]; const i = new Image();
      i.onload = () => r(i);
      i.onerror = () => {
        if (src && n < WAIT.length) { setTimeout(() => { i.src = src + (src.includes('?') ? '&' : '?') + 'r=' + (n + 1); }, WAIT[n++]); return; }
        console.warn('[roll] missing', src);
        const c = document.createElement('canvas'); c.width = 480; c.height = 360;
        const x = c.getContext('2d'); x.fillStyle = '#2a211b'; x.fillRect(0, 0, 480, 360); c.missing = true; r(c);
      };
      if (src) i.src = src; else i.onerror();
    });
  }
};

// ---- 把 1600×1000 的舞台按窗口缩放（整卷每一幕都这么干）----
window.fitStage = el => {
  const fit = () => { const k = Math.min(innerWidth / 1600, innerHeight / 1000); el.style.transform = `translate(-50%,-50%) scale(${k})`; };
  fit(); addEventListener('resize', fit); return fit;
};

// ---- 音效：每一幕自己 new AudioContext 放声音，这里统一过一道总音量 ----
(() => {
  const A = window.AudioContext || window.webkitAudioContext; if (!A) return;
  const lvl = () => { try { const v = localStorage.getItem('aroll.sfx'); return v === null ? 1 : +v; } catch (e) { return 1; } };
  const all = [];
  class SfxContext extends A {
    constructor(...a) {
      super(...a);
      const g = A.prototype.createGain.call(this); g.gain.value = lvl(); g.connect(super.destination);
      this.__sfx = g; all.push(this);
    }
    get destination() { return this.__sfx || super.destination; }
  }
  window.AudioContext = SfxContext; if (window.webkitAudioContext) window.webkitAudioContext = SfxContext;
  addEventListener('storage', e => {
    if (e.key === 'aroll.sfx') { const v = lvl(); all.forEach(c => { try { c.__sfx.gain.setTargetAtTime(v, c.currentTime, .05); } catch (_) {} }); }
  });
})();

// ---- 一小包合成音效：撕纸、打字机、快门、滴水、轻响 ----
(() => {
  let ctx, noiseBuf;
  const get = () => {
    if (!ctx) {
      const A = window.AudioContext || window.webkitAudioContext; if (!A) return null;
      ctx = new A();
      noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 1.2, ctx.sampleRate);
      const d = noiseBuf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  };
  const env = (node, t0, a, d, peak) => {
    const g = ctx.createGain(); g.gain.setValueAtTime(0, t0);
    g.gain.linearRampToValueAtTime(peak, t0 + a);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + a + d);
    node.connect(g); return g;
  };
  window.ROLL.sfx = (name, vol = 1) => {
    const c = get(); if (!c) return;
    const t = c.currentTime;
    if (name === 'type') {
      const s = c.createBufferSource(); s.buffer = noiseBuf; s.playbackRate.value = 1.8;
      const f = c.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = 1800; s.connect(f);
      env(f, t, .002, .05, .18 * vol).connect(c.destination);
      s.start(t); s.stop(t + .07);
    } else if (name === 'tear' || name === 'paper') {
      const s = c.createBufferSource(); s.buffer = noiseBuf; s.loop = true;
      const f = c.createBiquadFilter(); f.type = 'bandpass'; f.Q.value = .9;
      f.frequency.setValueAtTime(name === 'tear' ? 700 : 1600, t);
      f.frequency.exponentialRampToValueAtTime(name === 'tear' ? 2600 : 900, t + (name === 'tear' ? .4 : .16));
      s.connect(f);
      env(f, t, .01, name === 'tear' ? .4 : .15, .22 * vol).connect(c.destination);
      s.start(t); s.stop(t + .55);
    } else if (name === 'click') {
      const o = c.createOscillator(); o.type = 'square'; o.frequency.value = 900;
      env(o, t, .001, .03, .1 * vol).connect(c.destination);
      o.start(t); o.stop(t + .05);
    } else if (name === 'shutter') {
      [0, .09].forEach(dt => {
        const s = c.createBufferSource(); s.buffer = noiseBuf; s.playbackRate.value = 2.2;
        const f = c.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = 1200; s.connect(f);
        env(f, t + dt, .001, .06, .2 * vol).connect(c.destination);
        s.start(t + dt); s.stop(t + dt + .08);
      });
    } else if (name === 'thud') {
      const o = c.createOscillator(); o.type = 'sine'; o.frequency.setValueAtTime(140, t);
      o.frequency.exponentialRampToValueAtTime(70, t + .2);
      env(o, t, .004, .22, .3 * vol).connect(c.destination);
      o.start(t); o.stop(t + .3);
    } else if (name === 'chime') {
      [523.25, 659.25, 784].forEach((fq, i) => {
        const o = c.createOscillator(); o.type = 'sine'; o.frequency.value = fq;
        env(o, t + i * .06, .01, .9, .07 * vol).connect(c.destination);
        o.start(t + i * .06); o.stop(t + i * .06 + 1);
      });
    }
  };
})();

// 这一幕出错卡住了：三秒后底下亮一行「再试一次 / 跳到下一幕」，不让客人对着黑框干等
if (window.top !== window && (location.pathname.split('/').pop() || 'roll.html') !== 'roll.html') (() => {
  let shown = false;
  const QUIET = /NotAllowedError|AbortError|ResizeObserver/;
  const bad = m => {
    if (shown || QUIET.test(String(m))) return;
    shown = true; console.warn('[roll] scene error', m);
    setTimeout(() => {
      const zh = window.ROLL_LANG === 'zh', a = document.createElement('div');
      a.style.cssText = `position:fixed;left:50%;bottom:5%;transform:translateX(-50%);z-index:99;white-space:nowrap;color:#f3e6d2;font:400 ${zh ? 14 : 11}px ${zh ? '"PingFang SC","Microsoft YaHei",sans-serif' : 'ui-monospace,monospace'};letter-spacing:.15em`;
      const opt = (t, fn) => {
        const b = document.createElement('span'); b.textContent = t;
        b.style.cssText = 'cursor:pointer;opacity:.7;margin:0 14px';
        b.onmouseenter = () => b.style.opacity = 1; b.onmouseleave = () => b.style.opacity = .7;
        b.onclick = e => { e.stopPropagation(); a.remove(); fn(); };
        a.appendChild(b);
      };
      a.append(zh ? '这一幕没装好 ·' : 'this reel got stuck ·');
      opt(zh ? '再试一次' : 'try again', () => location.replace(location.href.replace(/[?&]rgo=1/, '') + (location.search ? '&' : '?') + 'rgo=1'));
      opt(zh ? '跳到下一幕 →' : 'skip to the next scene →', () => window.ROLL.done('black'));
      document.body.appendChild(a);
    }, 3000);
  };
  addEventListener('error', e => {
    const t = e.target;
    if (t && t !== window && t.tagName !== 'SCRIPT' && t.tagName !== 'IMG') return;
    bad(e.message || (t && t.src));
  }, true);
  addEventListener('unhandledrejection', e => { const r = e.reason; bad(r && (r.name + ' ' + r.message) || r); });
})();

// 字体先装好再亮：网速慢时字会先用系统字顶着，装好再跳回来
(() => {
  if ((location.pathname.split('/').pop() || 'roll.html') === 'roll.html') return;
  const h = document.documentElement; h.style.opacity = 0;
  requestAnimationFrame(() => Promise.race([
    document.fonts ? document.fonts.ready : Promise.resolve(),
    new Promise(r => setTimeout(r, 900))
  ]).then(() => h.style.opacity = ''));
})();

// 提前在后台装着的下一幕：没收到 go 之前，动画一秒只走五帧，把显卡让给正在放的那一幕
if (window.top !== window && window.parent === window.top) {
  let live = window.ROLL.went;
  addEventListener('message', e => { if (e.data && e.data.roll === 'go') live = true; });
  const raf = window.requestAnimationFrame.bind(window);
  window.requestAnimationFrame = cb => live ? raf(cb) : setTimeout(() => raf(cb), 200);
}

// ---- 中文版：网页上的字、画布上 fillText 的字，整句对上字典的就换成中文 ----
(() => {
  const ZHON = !!window.ZH, Z = window.ZH || (window.ZH_FONT && {...window.ZH_FONT});
  if (!Z) return;
  const file = location.pathname.split('/').pop() || 'roll.html', D = Z.page[file] || {}, RX = Z.rx[file] || [];
  const tr = s => {
    if (!ZHON || typeof s !== 'string' || !s) return s;
    const k = s.replace(/\s+/g, ' ').trim(); if (!k) return s;
    let z = Object.prototype.hasOwnProperty.call(D, k) ? D[k] : null;
    if (z == null) for (const [re, f] of RX) if (re.test(k)) { z = k.replace(re, f); break; }
    return z == null ? s : s.match(/^\s*/)[0] + z + s.match(/\s*$/)[0];
  };
  const fams = Z.fonts || [];
  const addFam = v => {
    const hit = fams.find(([re]) => re.test(v || ''));
    if (!hit) return v;
    return v + ', "PingFang SC", "Microsoft YaHei", "Noto Sans SC"';
  };
  const fixText = n => {
    if (n.parentNode && /^(SCRIPT|STYLE)$/.test(n.parentNode.nodeName)) return;
    const t = tr(n.data); if (t !== n.data) n.data = t;
  };
  const walk = root => {
    if (root.nodeType === 3) return fixText(root);
    if (root.nodeType !== 1 && root.nodeType !== 9) return;
    if (root.nodeType === 1) { if (root.style && root.style.fontFamily) root.style.fontFamily = addFam(root.style.fontFamily); }
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT); let n; while ((n = w.nextNode())) fixText(n);
  };
  const fixSheets = () => {
    for (const s of document.styleSheets) {
      let rules; try { rules = s.cssRules; } catch (e) { continue; }
      for (const r of rules) if (r instanceof CSSStyleRule && r.style.fontFamily) r.style.fontFamily = addFam(r.style.fontFamily);
    }
  };
  new MutationObserver(ms => { for (const m of ms) { if (m.type === 'characterData') fixText(m.target); else m.addedNodes.forEach(walk); } })
    .observe(document.documentElement, {childList:true, subtree:true, characterData:true});
  const all = () => { fixSheets(); walk(document); };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', all); else all();
  addEventListener('load', fixSheets);
  const P = CanvasRenderingContext2D.prototype;
  for (const m of ['fillText', 'strokeText']) { const o = P[m]; P[m] = function (t, ...a) { return o.call(this, tr(String(t)), ...a); }; }
  const mt = P.measureText; P.measureText = function (t) { return mt.call(this, tr(String(t))); };
  const fd = Object.getOwnPropertyDescriptor(P, 'font');
  Object.defineProperty(P, 'font', {configurable:true, get() { return fd.get.call(this); }, set(v) { fd.set.call(this, addFam(v)); }});
  window.ROLL.tr = tr;
})();

// 每点一下都同步喊壳子 unlock：苹果只认点下去那一刻开始的声音
if (window.top !== window) ['pointerup', 'touchend', 'click', 'keydown'].forEach(t =>
  addEventListener(t, () => { try { top.unlockMusic && top.unlockMusic(); } catch (e) {} }, {capture:true, passive:true}));
if (window.top !== window) addEventListener('pointerdown', () => top.postMessage({roll:'music', cmd:'kick'}, '*'), {once:true, capture:true});

// 不吃右键、不选中，点来点去不会误选中东西；输入框照常能打字
(() => {
  const st = document.createElement('style');
  st.textContent = '*{-webkit-user-select:none;user-select:none;-webkit-user-drag:none}input,textarea{-webkit-user-select:text;user-select:text}';
  document.head.appendChild(st);
  const typing = e => e.target && e.target.closest && e.target.closest('input,textarea');
  ['selectstart', 'copy', 'cut', 'contextmenu', 'dragstart'].forEach(t => addEventListener(t, e => { if (!typing(e)) e.preventDefault(); }, true));
})();
