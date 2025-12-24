(async () => {
  const chromeLauncher = await import("chrome-launcher").then((m) => m);
  const { default: CDP } = await import("chrome-remote-interface");
  const fs = await import("fs");
  const path = await import("path");

  // Chrome路径
  const chromePath =
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

  // 要拦截的远程资源URL
  const remoteUrl = "https://client.px-cloud.net/PXO1GDTa7Q/main.min.js";

  // 本地替换文件路径
  const localFilePath = "D:/ifood_github/main.min.js";

  // 检查本地文件是否存在
  if (!fs.existsSync(localFilePath)) {
    console.error(`本地文件不存在: ${localFilePath}`);
    process.exit(1);
  }

  console.log(`使用本地文件: ${localFilePath}`);

  async function launchChrome() {
    const userDataDir = "D:/ifood_github/userdata_ifood";
    const fsSync = (await import("fs")).default || (await import("fs"));
    if (!fsSync.existsSync(userDataDir)) {
      fsSync.mkdirSync(userDataDir, { recursive: true });
      console.log(`[INFO] 已创建用户数据目录: ${userDataDir}`);
    }

    return await chromeLauncher.launch({
      chromePath: chromePath,
      userDataDir: userDataDir,
      chromeFlags: [
        "--no-first-run",
        "--no-default-browser-check",
        "--disable-web-security",
        "--disable-extensions",
        "--start-maximized",
      ],
      logLevel: "info",
      output: "ignore",
    });
  }

  async function interceptRequest() {
    let chrome;
    let protocol;

    try {
      console.log("正在启动Chrome...");
      chrome = await launchChrome();
      console.log(`Chrome已启动，调试端口: ${chrome.port}`);

      protocol = await CDP({ port: chrome.port });
      console.log("已连接到Chrome调试协议");

      const { Network, Page, Runtime, Security } = protocol;

      // 启用所需域
      await Network.enable();
      await Page.enable();
      await Runtime.enable();
      await Security.enable();

      // 忽略证书错误
      Security.setOverrideCertificateErrors({ override: true });
      Security.certificateError(({ eventId }) => {
        Security.handleCertificateError({ eventId, action: "continue" });
      });

      // 禁用缓存
      await Network.setCacheDisabled({ cacheDisabled: true });

      // 读取本地文件内容
      const localFileContent = fs.readFileSync(localFilePath, "utf8");
      console.log(`已读取本地文件，大小: ${localFileContent.length} 字符`);

      // 拦截网络请求（增强兼容性，确保在导航前设置）
      await Network.setRequestInterception({
        patterns: [
          {
            urlPattern: "*",
            interceptionStage: "HeadersReceived",
          },
        ],
      });

      // 处理拦截到的请求
      Network.requestIntercepted(
        async ({ interceptionId, request, responseHeaders, resourceType }) => {
          const url = request.url;
          if (url.includes("px-cloud.net/PXO1GDTa7Q/main.min.js")) {
            console.log(`[INFO] 拦截到目标请求: ${url}`);
            const rawResponse = Buffer.from(
              "HTTP/1.1 200 OK\r\n" +
                "Content-Type: application/javascript; charset=utf-8\r\n" +
                "Access-Control-Allow-Origin: *\r\n" +
                "Cache-Control: no-cache\r\n" +
                `Content-Length: ${Buffer.byteLength(
                  localFileContent,
                  "utf8"
                )}\r\n` +
                "\r\n" +
                localFileContent,
              "utf8"
            ).toString("base64");

            await Network.continueInterceptedRequest({
              interceptionId,
              rawResponse,
            });

            console.log(
              "[INFO] 已成功替换为本地文件内容（使用 rawResponse 模式）"
            );
          } else {
            await Network.continueInterceptedRequest({ interceptionId });
          }
        }
      );

      console.log("[INFO] 拦截规则已设置，准备导航到目标网站...");
      await Page.navigate({ url: "https://www.ifood.com.br/restaurantes" });
      await Page.loadEventFired();
      console.log("[INFO] 页面加载完成，拦截逻辑已生效。");
      console.log("[INFO] 保持浏览器开启，按 Ctrl+C 退出。");

      process.on("SIGINT", async () => {
        console.log("\n正在关闭浏览器...");
        try {
          await protocol.close();
          chrome.kill();
        } catch (err) {
          console.error("关闭浏览器时出错:", err);
        }
        process.exit(0);
      });
    } catch (err) {
      console.error("发生错误:", err);
      if (protocol) {
        try {
          await protocol.close();
        } catch (closeErr) {
          console.error("关闭协议时出错:", closeErr);
        }
      }
      if (chrome) {
        try {
          chrome.kill();
        } catch (killErr) {
          console.error("终止Chrome进程时出错:", killErr);
        }
      }
      process.exit(1);
    }
  }

  interceptRequest();
})();
