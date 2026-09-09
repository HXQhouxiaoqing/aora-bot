/* ============================================================
 * Scholar 书生（AI 助手）—— 极简蓝白中国书生
 *
 * 视觉来源：用户提供的书生 IP 草图。
 * 设计原则：
 *   - 保留发髻 / 束带 / 大块发型 / 双耳 / 竖向豆眼几个识别锚点；
 *   - 无嘴、无腮红、无卡通高光，主要靠眼型、视线和头部倾斜传达情绪；
 *   - 深蓝 + 白色，尽量接近 Logo 的几何简洁度，而不是儿童卡通角色；
 *   - 直接复用 Mood Mates 的 32 状态协议，AI 仍只需要输出 emotionId。
 * ============================================================ */
window.MoodMates.characters.register({
  id: 'scholar',
  name: '书生',
  en: {
    name: 'Scholar',
    desc: 'A poised blue-and-white scholar whose expressions live mostly in his eyes'
  },
  industry: 'general',
  desc: '儒雅、聪慧、克制的蓝白 AI 书生，以眼神和轻微姿态表达情绪',

  /* 白色脸部本体：轻微横向鼓起，避免标准圆球感。 */
  body: {
    type: 'puff',
    r: 0.79,
    waves: [
      { k: 2, amp: 0.045, phase: 1.5708 },
      { k: 3, amp: 0.012, phase: -0.35 }
    ]
  },

  face: { x: 0, y: 4, sx: 1, sy: 1, eye: 1 },

  palette: {
    body: '#FFFFFF',
    eye: '#173F91',
    eyeHighlight: '#FFFFFF',
    blush: '#D9E4FA',
    mouth: '#173F91',
    zzz: '#7893C9',
    gloss: 0,
    states: {
      base: '#FFFFFF',
      dim: '#F1F4FA',
      soft: '#FFFFFF',
      blush: '#F5F7FC',
      angry: '#EEF2F9',
      alert: '#F0F3F9',
      off: '#E9EDF5'
    }
  },

  /* 竖向圆角豆眼：去掉高光，保持原 IP 的 Logo 感。 */
  eyeStyle: {
    dx: 29,
    cy: 116,
    w: 16,
    h: 28,
    taper: 0.28,
    tilt: 0,
    bend: 0,
    highlight: null
  },

  /* 关键状态用专属眼型，控制得比通用卡通表情更克制、更聪明。 */
  eyeShapes: {
    scholarCalm: { w: 16, h: 28, bend: 0, taper: 0.28, tilt: 0 },
    scholarSoft: { w: 18, h: 10, bend: 0.58, taper: 1.12, tilt: 0 },
    scholarThink: { w: 20, h: 12, bend: 0.10, slope: 0.16, taper: 0.68, tilt: -1 },
    scholarPuzzled: { w: 19, h: 13, bend: -0.02, slope: 0.34, taper: 0.68, tilt: 1 },
    scholarWide: { w: 18, h: 36, bend: 0, taper: 0.30, tilt: 0 }
  },

  features: {
    mouth: false,
    blush: false,
    brows: false,

    accessories: [
      /* 左右双耳放在脸后面，只露出外侧轮廓。 */
      {
        kind: 'path', layer: 'back', anchor: 'abs',
        fill: '#FFFFFF', stroke: '#173F91', strokeWidth: 6,
        d: 'M47 112 C34 104 25 112 27 126 C29 141 41 148 54 139 C60 135 62 129 61 123 C59 117 54 113 47 112 Z'
      },
      {
        kind: 'path', layer: 'back', anchor: 'abs',
        fill: '#FFFFFF', stroke: '#173F91', strokeWidth: 6,
        d: 'M193 110 C206 103 215 112 213 126 C211 141 199 148 186 140 C180 136 178 130 179 123 C181 117 186 112 193 110 Z'
      },

      /* 发髻：与头发主体分离，形成原稿中的白色间隙。 */
      {
        kind: 'path', layer: 'back', anchor: 'abs', fill: '#173F91',
        d: 'M91 42 C91 24 104 13 121 13 C139 13 152 24 152 42 C152 46 151 49 150 52 C132 47 110 47 92 52 C91 49 91 46 91 42 Z'
      },

      /* 左侧束带 / 飘带，两块简单几何切片。 */
      {
        kind: 'path', layer: 'back', anchor: 'abs', fill: '#173F91',
        d: 'M79 58 L61 42 L51 57 L71 70 Z M67 69 L38 62 L33 80 L64 75 Z'
      },

      /* 头发主体 + 标志性的弯曲发际线。只压到眼睛上方，不遮挡表情。 */
      {
        kind: 'path', layer: 'front', anchor: 'abs', fill: '#173F91',
        d: 'M42 60 C55 42 81 34 112 34 C150 34 181 47 195 73 C202 85 205 98 204 111 C197 101 190 94 181 88 C171 81 163 78 155 79 C144 80 138 89 130 95 C121 102 113 104 103 99 C94 94 88 85 78 84 C65 83 55 92 49 105 C45 114 44 122 43 128 C37 113 35 94 37 80 C38 72 40 65 42 60 Z'
      },

      /* 下半脸蓝色描边。耳朵与头发已经承担上半圈，所以这里故意不闭合。 */
      {
        kind: 'path', layer: 'front', anchor: 'abs',
        fill: 'none', stroke: '#173F91', strokeWidth: 5.5,
        d: 'M45 120 C44 148 56 171 78 184 C99 197 128 200 153 191 C177 182 192 162 196 133'
      }
    ]
  },

  /* 思考状态沿用项目已有星尘皮肤，和 AI 语义更匹配。 */
  fxSkin: 'stardust',

  /*
   * 只覆盖最常见、最影响人格的状态；其余状态继续继承共享 32 状态基座。
   * 02 待机 / 10 开心 / 11 疑惑 / 13 惊讶 / 30 思考 是第一版重点。
   */
  emotions: {
    '02': {
      pool: ['scholarCalm', 'calm2'],
      poolMs: [7000, 11500],
      blinkMs: [5200, 9800],
      antics: false,
      body: { breathe: 0.007 },
      anims: [
        { target: 'eyes', prop: 'lookX', type: 'glance', amp: 7, period: 5400 },
        { target: 'eyes', prop: 'lookY', type: 'sine', amp: 1.4, period: 4800, phase: 0.8 }
      ]
    },

    '10': {
      pool: ['scholarSoft', 'happy'],
      poolMs: [3000, 4700],
      blinkMs: [3000, 5200],
      antics: false,
      body: { y: -2, rotate: 1, breathe: 0.009 },
      eyes: { both: { y: -2 } },
      anims: [
        { target: 'body', prop: 'y', type: 'sine', amp: 1.2, period: 1900 }
      ]
    },

    '11': {
      pool: ['scholarPuzzled', 'squint'],
      poolMs: [2500, 3900],
      blinkMs: [3400, 6000],
      antics: false,
      body: { rotate: -7, breathe: 0.006 },
      eyes: {
        left:  { y: -3, scaleX: 1.08, scaleY: 1.08 },
        right: { y: 3, scaleX: 0.88, scaleY: 0.88, lookX: 3 }
      },
      anims: [
        { target: 'body', prop: 'rotate', type: 'sine', amp: 1.0, period: 3400 }
      ]
    },

    '13': {
      pool: ['scholarWide', 'wide'],
      poolMs: [2600, 4200],
      blinkMs: [2200, 4200],
      antics: false,
      body: { y: -3, scale: 1.015, breathe: 0.004 },
      eyes: { both: { y: -2, scaleX: 1.10, scaleY: 1.12, lookY: -2 } }
    },

    '30': {
      pool: ['scholarThink', 'scan', 'listen', 'scholarCalm'],
      poolMs: [1500, 2600],
      blinkMs: [3600, 6500],
      antics: false,
      body: { rotate: 3, breathe: 0.006, orbit: 1 },
      eyes: { both: { y: -2, lookY: -5 } },
      anims: [
        { target: 'eyes', prop: 'lookX', type: 'sine', amp: 6, period: 2500 },
        { target: 'body', prop: 'rotate', type: 'sine', amp: 1.2, period: 4600 }
      ]
    }
  }
});
