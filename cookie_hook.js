// ==UserScript==
// @name         Break on _px3 cookie sets (document.cookie & cookieStore)
// @namespace    https://local.tooling
// @version      0.1.0
// @description  当网页代码设置名为 _px3 的 cookie 时在 DevTools 中断住，并输出调用堆栈和来源位置（支持 document.cookie 与 cookieStore.set）
// @match        https://www.ifood.com.br/*
// @match        https://*.ifood.com.br/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(() => {
  'use strict';

  // 将逻辑注入到页面主上下文，确保能真正拦截页面自身对 document.cookie 的调用
  function inject(fn) {
    const s = document.createElement('script');
    s.textContent = `;(${fn.toString()})();`;
    (document.head || document.documentElement).appendChild(s);
    s.remove();
  }

  inject(function () {
    const HOOK_FLAG = '__tm_px3_cookie_hooked__';
    if (window[HOOK_FLAG]) return;
    window[HOOK_FLAG] = true;

    const isPx3Name = (cookieString) => {
      if (typeof cookieString !== 'string') return false;
      // 形如: "name=value; path=/; domain=...; ..."
      // 取第一个 '=' 前的 name，并去掉空白与分号
      const firstEq = cookieString.indexOf('=');
      if (firstEq <= 0) return false;
      const name = cookieString.slice(0, firstEq).split(';', 1)[0].trim();
      return name === '_px3';
    };

    const reportAndBreak = (where, cookieString) => {
      try {
        const err = new Error(`Cookie "_px3" set via ${where}`);
        // 控制台输出详细信息与堆栈
        // 使用 groupCollapsed 避免刷屏
        console.groupCollapsed('[PX3] Intercepted _px3 cookie set:', where);
        console.log('URL:', location.href);
        console.log('Cookie string:', cookieString);
        console.log('Time:', new Date().toISOString());
        console.log('Stack:\n' + (err.stack || 'No stack'));
        console.trace('[PX3] console.trace');
        console.groupEnd();
      } catch (e) {
        // 忽略日志失败
      }
      // 在 DevTools 打开时会在此断住；继续后按原逻辑设置 Cookie
      debugger; // eslint-disable-line no-debugger
    };

    // 1) Hook document.cookie setter
    try {
      const desc =
        Object.getOwnPropertyDescriptor(Document.prototype, 'cookie') ||
        Object.getOwnPropertyDescriptor(HTMLDocument.prototype, 'cookie');

      if (desc && typeof desc.set === 'function' && typeof desc.get === 'function') {
        const originalSet = desc.set;
        const originalGet = desc.get;

        Object.defineProperty(Document.prototype, 'cookie', {
          configurable: true,
          enumerable: desc.enumerable,
          get: function () {
            // 保持原行为
            return originalGet.call(this);
          },
          set: function (v) {
            try {
              if (isPx3Name(v)) {
                reportAndBreak('document.cookie', v);
              }
            } catch (_) {
              // 不中断设置流程
            }
            return originalSet.call(this, v);
          },
        });
      }
    } catch (_) {
      // 忽略：部分环境可能不允许重定义
    }

    // 2) Hook Cookie Store API（若可用）
    // https://developer.mozilla.org/en-US/docs/Web/API/CookieStore
    try {
      const cs = window.cookieStore;
      if (cs && typeof cs.set === 'function') {
        const origSet = cs.set.bind(cs);

        window.cookieStore.set = async function (...args) {
          try {
            let name = null;
            let dbgStr = null;
            if (typeof args[0] === 'string') {
              // cookieStore.set("name=value", options?)
              dbgStr = args[0];
              const eq = args[0].indexOf('=');
              if (eq > 0) name = args[0].slice(0, eq).split(';', 1)[0].trim();
            } else if (args[0] && typeof args[0] === 'object') {
              // cookieStore.set({ name, value, ... })
              name = args[0].name;
              dbgStr = `${args[0].name}=${args[0].value || ''}`;
            }
            if (name === '_px3') {
              reportAndBreak('cookieStore.set', dbgStr);
            }
          } catch (_) {}
          return origSet(...args);
        };
      }
    } catch (_) {
      // 忽略
    }

    // 3) 可选：拦截常见封装写 Cookie 的函数名（轻量尝试，不改变原型链）
    // 若站点使用自定义 setCookie(name,value,...)，此处可捕获常见命名。
    // 仅在首次发现时包裹，避免重复包裹。
    const wrapIfFunction = (obj, key, whereLabel) => {
      try {
        const fn = obj && obj[key];
        if (typeof fn !== 'function' || fn.__px3_wrapped__) return;
        obj[key] = function (...args) {
          try {
            const n = args && args[0];
            if (n === '_px3') {
              reportAndBreak(whereLabel, `_px3=${args[1] ?? ''}`);
            }
          } catch (_) {}
          return fn.apply(this, args);
        };
        obj[key].__px3_wrapped__ = true;
      } catch (_) {}
    };

    // 常见命名尝试；不会报错也不影响不存在的情况
    wrapIfFunction(window, 'setCookie', 'window.setCookie');
    wrapIfFunction(document, 'setCookie', 'document.setCookie');
  });
})();
