// window.screen.z(window.screen.u(), "https://tzm.px-cloud.net");
// window.screen.z(window.screen.u(), "https://tzm.px-cloud.net");
window.screen.t += 1;
var a = 4;
var b = 4;
const pxvid = document.cookie.match(/_pxvid=([^;]+)/)?.[1] || "";
console.log(pxvid);
const pxcts = document.cookie.match(/pxcts=([^;]+)/)?.[1] || "";
console.log(pxcts);
const pxsid = sessionStorage.getItem("pxsid") || "";
console.log(pxsid);
window.screen.aa = [
  {
    t: "Ahs3WER/PGs=",
    d: {
      "BXhwO0MTdw0=":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36 Edg/128.0.0.0",
      "CF09Hk4yOC0=": window.screen.s(pxsid, navigator.userAgent),
      "CF09Hk41Nio=": window.screen.u(),
      "ChM/UE96O2c=": window.screen.x, // 数值不同：666.0999999940395 vs 882.7000000029802
      "DFE5Ekk8Pik=": window.screen.t, // 数值不同：2 vs 1
      "FCkhKlFBJx0=": 0,
      "HUBoQ1gub3c=": 0,
      "HUBoQ1spbHE=": Math.round(window.performance.now()), // 数值不同：1517080 vs 243926
      "HwZqBVpoYDc=": new Date()["getTime"](), // 时间戳不同
      "JDlROmJSVw4=": window.screen.s(pxvid, navigator.userAgent),
      "JVgQW2AyE2w=": undefined,
      "KnNfcG8YXUE=":
        document.cookie.match(/(?:^|; )_px3=([^;]*)/)?.[1] || null, // 第二组存在，第一组无
      "M2oGKXYABhs=": undefined,
      "R34yPQERNwY=": false,
      "TTA4cwtUOkU=": window.screen.s(window.screen.u(), navigator.userAgent),
      "TTA4cwtVOkM=": window.screen.v++, // 数值不同：8 vs 7
      "U0omSRYjIn8=": window.screen.y, // 加密字符串不同
      "XidrJBhCaBU=": true,
      "ajMfMCxZGQc=": "https://www.ifood.com.br/restaurantes",
      "bjcbNChSGQY=": 240000,
    },
  },
];

// [window.screen.u(), "Y1pWHi0oXXVx", "379"].join(":")
window.screen.cc = window.screen.q(
  window.screen.r(window.screen.aa),
  [window.screen.u(), "Y1pWHi0oXXVx", "379"].join(":")
);

// window.screen.p()

window.screen.bb = {
  vid: pxvid,
  tag: "Y1pWHi0oXXVx",
  appID: "PXO1GDTa7Q",
  cu: window.screen.u(),
  cs: window.screen.y,
  pc: window.screen.cc,
};

window.screen.dd = window.screen.p(window.screen.aa, window.screen.bb);

/**
 * 通用请求链模板
 * 固定参数已固定，服务器校验参数使用占位符
 * 可用于构造任意阶段请求（第一次、第二次、第三次）
 */

fetch("https://collector-pxo1gdta7q.px-cloud.net/api/v2/collector", {
  method: "POST",
  mode: "cors",
  credentials: "omit",
  headers: {
    accept: "*/*",
    "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
    "cache-control": "no-cache",
    "content-type": "application/x-www-form-urlencoded",
    pragma: "no-cache",
    priority: "u=1, i",
    "sec-ch-ua":
      '"Chromium";v="128", "Not;A=Brand";v="24", "Microsoft Edge";v="128"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"Windows"',
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "cross-site",
  },
  referrer: "https://www.ifood.com.br/",
  referrerPolicy: "strict-origin-when-cross-origin",
  body: new URLSearchParams({
    // 固定参数（不会变化）
    appId: "PXO1GDTa7Q",
    tag: "Y1pWHi0oXXVx",
    ft: "379",
    en: "NTA",
    bi: "eE0NRC1zSmU+EG1hYRgxZ3ltHwNqQUNmdFkdCUIJQU95a0x/PAdLfhYffz95agYde35HelBMTicRHAoKaSAJPmFZXTk9TD5pb28ZHD0KRGx0XB47RgxNGS5lR38mFgQ=",
    sid: pxsid,
    vid: pxvid,
    cts: pxcts,

    // 动态参数（服务器校验相关，占位符）
    uuid: window.screen.u(), // 每条请求链唯一
    seq: a++, // 阶段序号（0, 2, 3...）
    rsc: b++, // 阶段计数（1, 2, 3...）
    pc: window.screen.cc, // 随机数或时间戳
    payload: window.screen.dd, // 加密数据体
    cs: window.screen.y, // 校验码（从第二阶段开始出现）
  }),
})
  .then((res) => {
    // window.screen.zz = res;
    // window.Screen.ee = window.screen.n(window.screen.o(res));
    // window.Screen.ff = window.screen
    //   .m(window.screen.ee, parseInt("504", 10) % 128)
    //   ["split"]("~~~");
    // console.log(window.screen.ff);
    return res.text();
  })
  .then((text) => {
    const rawString = (window.screen.zz = JSON.stringify(JSON.parse(text)));
    console.log(rawString);
    console.log("服务器原始响应字符串：", text);
    // window.screen.o(text)
    // window.Screen.ee = window.screen.n(window.screen.o(rawString))
    // window.Screen.ff = window.screen.m(window.screen.ee, parseInt("504", 10) % 128)["split"]("~~~")
    // console.log(window.screen.ff)
    window.screen.px3 = window.screen
      .m(
        window.screen.n(window.screen.o(window.screen.zz)),
        parseInt("504", 10) % 128
      )
      ["split"]("~~~");
    console.log(window.screen.px3);

    // 提取 _px3 值并写入 cookie
    try {
      // 每次都重新创建 _px3 cookie，不管是否存在
      const target = window.screen.px3.find((item) => item.includes("_px3"));
      let px3Value = "";
      if (target) {
        const match = target.match(/\|\d+\|(.+?)\|true/);
        if (match && match[1]) {
          px3Value = match[1];
          console.log("_px3 值：", px3Value);
        } else {
          console.warn("未找到 _px3 值（正则未匹配）");
        }
      } else {
        console.warn("未找到包含 _px3 的项，使用空值");
      }
      // 无论是否找到都重新创建 cookie
      document.cookie = `_px3=${px3Value}; path=/; domain=.ifood.com.br; Secure; SameSite=None`;
      console.log("已重新创建 cookie _px3");
      try {
        // 获取 cookie 中的 _px3 和 _pxvid
        const px3 = document.cookie.match(/(?:^|; )_px3=([^;]*)/)?.[1] || "";
        const pxvid =
          document.cookie.match(/(?:^|; )_pxvid=([^;]*)/)?.[1] || "";
        // 按照给定格式拼接
        const combined = `_px3=${px3};_pxvid=${pxvid}`;
        // 无论存在与否都重写 localStorage
        localStorage.setItem("x-px-cookies", combined);
        console.log("已写入 localStorage.x-px-cookies:", combined);
      } catch (e) {
        console.error("写入 localStorage 出错：", e);
      }
    } catch (err) {
      console.error("写入 cookie 出错：", err);
    }
  })
  .catch((err) => {
    console.error("请求出错：", err);
  });

// window.screen.px3 = window.screen.m(window.screen.n(window.screen.o(window.screen.zz)), parseInt("504", 10) % 128)["split"]("~~~")
// console.log(window.screen.px3)
