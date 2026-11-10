// 复刻版 content.js —— 这一卷里客人能换的东西全在这一个文件（与原作同一套形状）
// photo 是压过的（墙、书、拼贴都用它），full 是原图（只给看片器放大镜用），crop 是构图中心
const P = n => ({photo:`img/${n}.svg`, thumb:`img/${n}.svg`, full:`img/${n}.svg`});

const BACK = [
  'The first photo I ever took of you. You were laughing, and I forgot to focus.',
  'Rain all afternoon. You fell asleep halfway through the film.',
  'You said this was your worst angle. I disagree, for the record.',
  'We missed the last bus and walked home anyway.'
];
const FAR = [
  'the train took all night.', 'a city where nobody knew our names.',
  'the light here is softer. it was.', 'the longest day of the month.',
  'you came back before the rain did.', 'a wish you would not say out loud.',
  'cold coffee, warm hands.', 'far away, still facing you.'
];

const frames = (defs, lines) => defs.map(([n, date, crop], j) => ({...P(n), date, line:lines ? lines[j] : '', ...(crop ? {crop:{h:crop}} : {})}));

const SAMPLE = {
  // 两个人：to 是收礼物的人，from 是送的人；both 用在冲印单、片头、片尾
  names:{to:'Tong', from:'CCC', both:'Tong & CCC', sign:'C.'},
  // 在一起的第一天：火把字条的天数、片头片尾的 running time 都从这天算
  since:'2026-05-10',
  rolls:[
    {name:'for Two', dates:'2025–2026', place:'where it started',
     frames:frames([['beach','9.19',{x:.5,y:.52,z:1}],['hands','10.7',{x:.5,y:.55,z:1.15}],
       ['window','9.27',{x:.58,y:.5,z:1}],['bed','4.5',{x:.5,y:.5,z:1}],
       ['city','1.20',{x:.5,y:.45,z:1}],['beach','8.27',{x:.42,y:.6,z:1.3}],
       ['window','10.8',{x:.62,y:.4,z:1.25}],['hands','3.19',{x:.55,y:.5,z:1.4}]])},
    {name:'slow days', dates:'2026', place:'for me',
     frames:frames([['window','7.28',{x:.6,y:.45,z:1.1}],['bed','9.25',{x:.45,y:.5,z:1.2}],
       ['window','10.8',{x:.5,y:.5,z:1}],['city','5.2',{x:.5,y:.55,z:1.15}],
       ['hands','6.14',{x:.5,y:.5,z:1}],['beach','8.3',{x:.5,y:.55,z:1.2}],
       ['train','11.1',{x:.5,y:.5,z:1}],['bed','12.24',{x:.55,y:.45,z:1.3}]])},
    {name:'far away', dates:'2026', place:'the distance',
     frames:frames([['train','2.11',{x:.5,y:.5,z:1}],['city','3.02',{x:.5,y:.5,z:1.1}],
       ['train','4.18',{x:.45,y:.4,z:1.2}],['city','6.06',{x:.55,y:.5,z:1}],
       ['train','7.21',{x:.5,y:.55,z:1.15}],['window','8.15',{x:.5,y:.5,z:1}],
       ['city','9.09',{x:.5,y:.5,z:1.25}],['train','10.30',{x:.5,y:.45,z:1}]], FAR)},
    {name:'still us', dates:'2026', place:'still us',
     frames:frames([['beach','1.01',{x:.45,y:.55,z:1.2}],['hands','2.14',{x:.5,y:.5,z:1.1}],
       ['window','3.08',{x:.55,y:.5,z:1}],['bed','4.04',{x:.5,y:.45,z:1.15}],
       ['city','5.20',{x:.5,y:.55,z:1}],['hands','6.30',{x:.45,y:.5,z:1.3}],
       ['beach','8.08',{x:.55,y:.6,z:1.1}],['window','10.01',{x:.5,y:.5,z:1.2}]], [0,1,2,3,0,1,2,3].map(i=>BACK[i]))}
  ],
  picks:{
    opening:['beach','hands','window','city','bed','beach','train','hands'].map(n=>({...P(n)})),
    radio:['city','train','window','beach','hands','bed','train'].map(n=>({...P(n)})),
    credits:['beach','window','hands','city','bed','train','beach','hands'].map(n=>({...P(n)})),
    creditsStills:['beach','window','city','hands'].map(n=>({...P(n)}))
  },
  radio:{dj:'Good evening. This next one is for you, from someone who kept every single frame. Brought to you by Darkroom Seven.', song:'the song we first danced to'},
  letter:`Dear Tong,

I'm bad at saying things out loud,
so I put them on film instead.

Thirty-two frames.
A little too warm,
a little out of focus.

Exactly like us.`,
  note:{mode:'days', date:'05.10', line:''},
  torch:{photo:'img/beach.svg', caption:'last frame on the roll', date:'05.10.2026'},
  ticket:{place:'Darkroom Cinema', admit:'Admit two', seat:'Row G · 7 & 8', date:'05.10', back:['the movie was bad.', 'you were not.']},
  book:{
    cover:P('window'), byline:'a film by you & me', title:'The Summer of Us',
    collage:['beach','hands'].map(n=>P(n)),
    theater:P('beach'), compass:P('city'),
    map:[
      {name:'Shanghai', lat:31.2, lon:121.5, ...P('city')},
      {name:'Kyoto', lat:35.0, lon:135.8, ...P('window')},
      {name:'Lisbon', lat:38.7, lon:-9.1, ...P('beach')},
      {name:'Reykjavík', lat:64.1, lon:-21.9, ...P('train')}
    ],
    endWords:{days:'Our love has no due date.', birthday:'Glad you were born. Gladder you\u2019re mine.'},
    collageTitle:'', collageNotes:['the first one, slightly blurry','our first roll ↓'], cardBack:'you can keep this one.',
    burnt:{title:'CXVI.', lines:['O no! it is an ever-fixed mark','That looks on tempests and is never shaken;','It is the star to every wandering bark,',"Whose worth's unknown, although his height be taken."],
      source:'W. Shakespeare, Sonnet 116, 1609', pencil:['you are my','ever-fixed mark.']}
  },
  creditsBy:{director:'', starring:'you and me', camera:'a film camera', thanks:'every blurry frame', last:'see you on the next roll'},
  credits:[
    ['big','A Roll <em>for Two</em>'],
    ['role','Directed by'],['name','{both}'],
    ['role','Starring'],['name','you <em>and</em> me'],
    ['ph',-3],['ph',4],
    ['role','Shot on'],['name','a film camera'],
    ['role','Developed at'],['name','Darkroom No.7'],
    ['role','Music'],['name','<em>{song}</em>'],
    ['ph',2],['ph',-4],
    ['role','For'],['name','{to}'],
    ['red','see you on the next roll']
  ]
};

// 客人那份（服务端在这个文件前面先写一句 window.CONTENT={...}）：缺的项用样片的补上
(() => {
  const G = window.CONTENT, C = SAMPLE;
  const fill = (g, d) => { for (const k in d) { if (g[k] === undefined) g[k] = d[k]; else if (d[k] && typeof d[k] === 'object' && !Array.isArray(d[k]) && typeof g[k] === 'object') fill(g[k], d[k]); } };
  if (G) fill(G, C); else window.CONTENT = C;
  const X = window.CONTENT;
  X.days = () => { const [y, m, d] = X.since.split('-').map(Number), t0 = new Date(y, m - 1, d), n = new Date(), t1 = new Date(n.getFullYear(), n.getMonth(), n.getDate()); return Math.round((t1 - t0) / 864e5) + 1; };
  X.small = f => f && (f.thumb || f.photo);
  X.ratio = f => f && f.ratio || 3 / 2;

  // 构图：以 crop 的中心点和缩放，算出要取源图哪一块（按目标宽高比）
  X.cropRect = (f, iw, ih, a) => {
    const cr = (f && (f.crop.h || f.crop)) || {}, cx = (cr.x ?? .5) * iw, cy = (cr.y ?? .5) * ih, z = cr.z || 1;
    let sw = iw / z, sh = ih / z;
    if (sw / sh > a) sw = sh * a; else sh = sw / a;
    sw = Math.min(sw, iw); sh = Math.min(sh, ih);
    const sx = Math.min(Math.max(cx - sw / 2, 0), iw - sw), sy = Math.min(Math.max(cy - sh / 2, 0), ih - sh);
    return {sx, sy, sw, sh};
  };
  // 背景用（background:cover 的地方）：图装好以后按元素自己的宽高算
  X.cropBg = (el, f, src) => {
    src = src || (f && f.photo); if (!src) return;
    el.style.backgroundImage = `url(${src})`; el.style.backgroundSize = 'cover'; el.style.backgroundPosition = 'center';
    if (!f || !f.crop) return;
    const im = new Image(); let n = 0;
    im.onload = function fit() {
      const w = el.clientWidth, h = el.clientHeight;
      if (!w || !h) { if (n++ < 20) setTimeout(fit, 250); return; }
      const r = X.cropRect(f, im.width, im.height, w / h), k = w / r.sw;
      el.style.backgroundSize = `${im.width * k}px ${im.height * k}px`;
      el.style.backgroundPosition = `${-r.sx * k}px ${-r.sy * k}px`;
    };
    im.src = src;
  };
  // 要一张已经裁好的图（SVG 里的 image、canvas 贴图这类不好算位置的地方）：返回画布
  X.cropCanvas = (img, f, a, long = 1600) => {
    const r = X.cropRect(f, img.width, img.height, a), k = Math.min(1, long / Math.max(r.sw, r.sh));
    const c = document.createElement('canvas'); c.width = Math.round(r.sw * k); c.height = Math.round(r.sh * k);
    c.getContext('2d').drawImage(img, r.sx, r.sy, r.sw, r.sh, 0, 0, c.width, c.height); return c;
  };
  // 画到 canvas 指定矩形里（信纸、拍立得、看片台）
  X.drawCrop = (x, img, f, dx, dy, dw, dh) => {
    const r = X.cropRect(f, img.width, img.height, dw / dh);
    x.drawImage(img, r.sx, r.sy, r.sw, r.sh, dx, dy, dw, dh);
  };
  // 中文版：片尾字幕整份换成中文
  if (window.ROLL_LANG === 'zh' && window.ZH && window.ZH.credits) window.CONTENT.credits = window.ZH.credits;
  // 客人改过的那几行盖上去（按前面那行 role 找）
  {
    const B = X.creditsBy || {}, D = C.creditsBy, cr = X.credits = X.credits.map(r => [...r]);
    const own = k => { const v = String(B[k] || '').trim(); return v && v !== D[k] ? v.replace(/[&<>]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;'}[c])) : ''; };
    const ROLE = {director:/^(Directed by|导演)$/, starring:/^(Starring|主演)$/, camera:/^(Shot on|拍摄器材)$/, thanks:/^(Special thanks to|特别感谢)$/};
    for (const k in ROLE) { const i = cr.findIndex(([t, v]) => t === 'role' && ROLE[k].test(v)); if (i >= 0 && cr[i + 1] && own(k)) cr[i + 1][1] = own(k); }
    const r = cr.findIndex(([t]) => t === 'red'); if (r >= 0 && own('last')) cr[r][1] = own('last');
  }
})();
