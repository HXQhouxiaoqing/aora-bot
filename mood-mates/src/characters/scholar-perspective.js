/* Scholar 书生 · 伪 3D 头部透视层
 *
 * 目标：保持原 SVG 造型不被重画，只在注视 / 转头时让不同层产生轻微视差，
 * 参考角色稿中的正面、左右 3/4 视角：
 * - 白脸相对头发横向滑动，露出不同侧的鬓发面积；
 * - 发髻跟随头部但位移更小；
 * - 眼睛沿球面投影移动并在远侧轻微压缩；
 * - 整体仅做很小的横向透视压缩，不做夸张 3D。
 */
(function () {
  'use strict';

  var MM = window.MoodMates;
  if (!MM || !MM.createBall || MM.__scholarPerspectiveInstalled) return;

  var createBallBase = MM.createBall;
  var BASE_TF = 'translate(16.5 10.5) scale(3)';

  function clamp(v, a, b) { return v < a ? a : (v > b ? b : v); }
  function r2(v) { return Math.round(v * 100) / 100; }

  function findArtwork(ball) {
    var art = { face: null, hair: null, bun: null };
    if (!ball || !ball.svg) return art;
    Array.prototype.forEach.call(ball.svg.querySelectorAll('path'), function (node) {
      var d = node.getAttribute('d') || '';
      if (d.indexOf('M47.4357 28.5469') === 0) art.face = node;
      else if (d.indexOf('M17.2985 8.35034') === 0) art.hair = node;
      else if (d.indexOf('M34.3826 0.0624672') === 0) art.bun = node;
    });
    return art;
  }

  function around(px, py, sx, sy, rot, tx, ty) {
    return 'translate(' + px + ' ' + py + ')' +
      (rot ? ' rotate(' + r2(rot) + ')' : '') +
      ' scale(' + r2(sx) + ' ' + r2(sy) + ')' +
      ' translate(' + (-px) + ' ' + (-py) + ')' +
      ' translate(' + r2(tx) + ' ' + r2(ty) + ') ' + BASE_TF;
  }

  function applyPerspective(art, yaw, pitch) {
    /* yaw 约 ±0.56rad 对应参考稿里的左右 3/4 视角。 */
    var n = clamp(yaw / 0.56, -1, 1);
    var a = Math.abs(n);
    var p = clamp(pitch / 15, -1, 1);

    /* 头发主体基本稳定，只给少量压缩 / 位移，避免像一张贴纸横移。 */
    if (art.hair) {
      art.hair.setAttribute('transform', around(
        120, 128,
        1 - a * 0.025, 1,
        n * 0.45,
        n * 1.8, p * 0.8
      ));
    }

    /* 白脸是透视变化的核心：向视线方向移动，远侧会被头发遮得更多。 */
    if (art.face) {
      art.face.setAttribute('transform', around(
        120, 142,
        1 - a * 0.045, 1 - a * 0.008,
        n * 0.15,
        n * 7.5, p * 1.1
      ));
    }

    /* 发髻跟头部方向走，但幅度低于脸，形成前后层视差。 */
    if (art.bun) {
      art.bun.setAttribute('transform', around(
        120, 54,
        1 - a * 0.03, 1,
        n * 0.2,
        n * 4.2, p * 0.55
      ));
    }
  }

  MM.createBall = function (container, opts) {
    var ball = createBallBase(container, opts);
    var ch = opts && opts.character;
    if (!ch || ch.id !== 'scholar') return ball;

    var art = findArtwork(ball);
    var applyPoseBase = ball.applyPose;
    var smoothedYaw = 0;

    ball.applyPose = function (pose) {
      var spinYaw = (pose.body && pose.body.yaw) || 0;
      var lookX = ((pose.left && pose.left.lookX) || 0) * 0.5 +
                  ((pose.right && pose.right.lookX) || 0) * 0.5;
      var lookY = ((pose.left && pose.left.lookY) || 0) * 0.5 +
                  ((pose.right && pose.right.lookY) || 0) * 0.5;

      /* 非点击自旋时，让头跟随眼神转。眼睛先走、头后跟，观感更聪明。 */
      var targetYaw = Math.abs(spinYaw) > 0.02
        ? spinYaw
        : clamp(lookX / 24, -1, 1) * 0.56;
      smoothedYaw += (targetYaw - smoothedYaw) * 0.13;

      /* 给原 renderer 一份临时 pose：用同一个 yaw 驱动眼睛球面投影和整体微压缩。 */
      var p = {
        body: Object.assign({}, pose.body, { yaw: smoothedYaw }),
        left: Object.assign({}, pose.left),
        right: Object.assign({}, pose.right),
        face: Object.assign({}, pose.face)
      };

      /* 头已经承担一部分视线方向，眼球保留约 55% 的相对移动，避免冲出脸部。 */
      if (Math.abs(spinYaw) <= 0.02) {
        p.left.lookX *= 0.55;
        p.right.lookX *= 0.55;
      }

      applyPoseBase(p);
      applyPerspective(art, smoothedYaw, lookY);
    };

    return ball;
  };

  MM.__scholarPerspectiveInstalled = true;
})();
