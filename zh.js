// 中文版：设置里选了「中文」（localStorage 的 aroll.lang = 'zh'）才生效，英文版这里只提供中文字体兜底。
// 换字是整句对整句（roll-link.js 在网页文字、画布 fillText 上换），没列出来的就保持英文。
(() => {
  let lang = 'en';
  try { lang = localStorage.getItem('aroll.lang') || 'en'; } catch (e) {}
  window.ROLL_LANG = lang;
  window.ZH_FONT = {
    fonts: [[/Georgia|Times/i, '"Songti SC","Noto Serif SC",serif'], [/mono|Menlo|Consolas/i, '"PingFang SC",monospace']],
    page: {}, rx: {}
  };
  if (lang !== 'zh') return;

  window.ZH = {
    page: {
      // 壳子（roll.html）自己的词条：设置栏、左下角正在播放、等片提示
      'roll.html': {
        'settings': '设置', 'music': '音乐', 'on': '开', 'off': '关', 'volume': '音乐音量', 'sound': '音效音量', 'clarity': '清晰度',
        // 场景切换那一行：现在演的是哪一幕
        'scene': '场景', 'the projector': '放映机', 'the darkroom': '暗房', 'the envelope': '冲印袋', 'four rolls': '四卷',
        'smooth': '流畅', 'standard': '标准', 'sharp': '清晰', 'light': '光影', 'full': '完整', 'simple': '简单', 'polaroids': '拍立得', 'take them home': '带它们回家', 'language': '语言',
        'loading the next reel': '下一卷正在装片',
        'Gymnopédie No.1 · Erik Satie': '《吉诺佩蒂》第一号 · 萨蒂', 'Liebestraum No.3 · Franz Liszt': '《爱之梦》第三号 · 李斯特',
        'Let Me Call You Sweetheart · Lewis James, 1924': '《让我叫你甜心》· 刘易斯·詹姆斯，1924', 'Comfort · imaboo': '《Comfort》· imaboo'},
      'opening.html': {
        'a love story in thirty-two frames': '一个用三十二格讲完的故事',
        'roll it, darling': '放吧',
        'Since': '从',
        'Running time': '已经跑了',
        'days & counting': '天，还在跑',
        'threading film': '穿片',
        'warming the lamp': '预热灯泡',
        'frames found': '找到的格子',
        // 设置面板
        'settings': '设置',
        'music': '音乐',
        'volume': '音乐音量',
        'sound': '音效音量',
        'clarity': '清晰度',
        'light': '光影',
        'language': '语言',
        'on': '开',
        'off': '关',
        'smooth': '流畅',
        'standard': '标准',
        'sharp': '清晰',
        'full': '完整',
        'simple': '简单'
      },
      'frame-c.html': {
        'Scene 02 — The darkroom': '第二幕 · 暗房',
        'pull me': '拉我',
        'On air · request line': '正在播出 · 点歌热线',
        'Now playing · Side A ·': '正在播放 · A 面 ·',
        'pick a song ▴': '点一首 ▴',
        'scroll down': '往下滚',
        'KODAK GOLD 200': '柯达金胶卷 200'
      },
      'frame-e.html': {
        'develop before': '冲洗日期',
        'tear here': '从这里撕开',
        'the envelope': '冲印袋'
      },
      'rolls.html': {
        'pick one': '挑一卷', '← back to the table': '← 放回桌上', 'to the darkroom →': '去暗房 →', 'press me': '按我', 'winding back': '倒片中',
        'how to play': '怎么玩', 'How to play ·': '怎么玩 ·',
        'drag to pull it out, tap one to develop': '拖出来，点一格显影',
        'Tap a frame to develop it.': '点一格，让它显影。',
        'These are just for looking. Prints only come from roll 04.': '这几卷只是看的，洗照片只洗第 04 卷。',
        'take your time': '慢慢来',
        'pull one out, hold it up to the light': '拉出一格，举到灯下看',
        'Pull the film out.': '把胶片拉出来。', 'Press and hold a frame. It lifts up to the light.': '按住一格，它会举到灯下。',
        'Keep holding until the picture shows through.': '一直按着，直到画面透出来。', 'like we used to': '像我们以前那样',
        'press the lever, one frame at a time': '按一下拉杆，一次看一格',
        'Press the red lever. One frame at a time.': '按红色的拉杆，一次一格。', 'Every frame keeps a day and a line.': '每一格都存着一天，和一句话。',
        'At the end, the lever winds it back.': '看到最后，拉杆会把它倒回去。', 'no skipping ahead': '不许跳着看',
        'circle the ones to print. a heart just means you love it.': '想洗的画个圈。画爱心只是喜欢，不洗。',
        'Pick a pen from the right.': '从右边挑一支笔。', 'Circle the ones you want printed. They go to the darkroom.': '想洗的画个圈，它们会被送进暗房。',
        'A heart means you love it. It develops, but stays off the print list.': '画爱心是喜欢它。它会显影，但不送去洗。',
        'Mark it again to let it go. The pencil is just for doodling.': '再画一次就是不要了。铅笔只是拿来乱画的。',
        'Drag the film out of the can, one frame at a time.': '把胶片从罐子里慢慢拖出来，每过一格会轻轻咔哒一声。',
        'Tap any frame and it will develop.': '点一下胶片上的照片，它就会显影。',
        'This roll is just for looking. Prints come from roll 04.': '这一卷只用来看，洗照片在第 04 卷。',
        'Drag the film out of the can.': '先把胶片从罐子里拖出来。',
        'Press and hold a frame. It rises to the light.': '长按住一格，它会举到灯前。',
        'Keep holding until the picture appears.': '一直按着，等照片慢慢显出来。',
        'Tap the red lever to see the next frame.': '点一下红色拉杆，就能看下一格。',
        'Each frame keeps its date and a line.': '每一格都留着它的日期和一句话。',
        'After the last frame, the film winds back.': '看完最后一格，胶片会自己倒回去。',
        'Tap a pen on the right to switch.': '点一下右边的笔，就能换着用。',
        'Red pen: circle the ones you want printed.': '红笔：圈出想洗出来的照片，它们会被送进暗房。',
        'Heart: the ones you love. They develop, but stay off the print list.': '爱心：特别喜欢的那几张，会显影，但不会洗出来。',
        'Pencil: draw anywhere. Mark a frame again to undo.': '铅笔：哪里都可以画。同一格再画一次就是取消。',
        'keep the good ones': '留下好的那些'
      },
      'tray.html': {
        'the darkroom': '暗房',
        'circle the ones you want': '圈出你想要的',
        'pick four prints': '挑四张出来',
        'developing': '显影中',
        'hang them up': '挂起来'
      },
      'torch-comic.html': {
        'keep the light on': '别把灯关掉',
        'read it by torchlight': '用火把读',
        'day': '第',
        'days': '天'
      },
      'book-cover.html': {
        'open the book': '打开这本书',
        'turn the page': '翻页',
        'the map': '地图',
        'the compass': '指南针'
      },
      'credits.html': {
        'roll again': '再看一遍'
      }
    },
    rx: {
      'opening.html': [[/^(\d+) days & counting$/, (m, n) => `${n} 天，还在跑`]]
    },
    credits: [
      ['big', '一卷<em>给两个人</em>'],
      ['role', '导演'], ['name', '{both}'],
      ['role', '主演'], ['name', '你<em>和</em>我'],
      ['ph', -3], ['ph', 4],
      ['role', '拍摄器材'], ['name', '一台胶片机'],
      ['role', '冲印'], ['name', '七号暗房'],
      ['role', '音乐'], ['name', '<em>{song}</em>'],
      ['ph', 2], ['ph', -4],
      ['role', '给'], ['name', '{to}'],
      ['red', '下一卷见']
    ]
  };
})();
