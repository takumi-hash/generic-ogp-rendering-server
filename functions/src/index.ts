import * as functions from "firebase-functions";
import core from "puppeteer-core";
import chrome from "chrome-aws-lambda";

export const onRequest = functions
  .runWith({
    timeoutSeconds: 300,
    memory: "8GB",
  })
  .https.onRequest(async (req, res) => {
    try {
      const title = decodeURI(req.path.slice(1));
      const img = await createOgpImage(title);
      res.type("png").status(200).send(img);
    } catch (error) {
      res.sendStatus(500);
    }
  });

const createOgpImage = async (title: string) => {
  const html = getHTML(title);
  const file = await genImage(html);
  return file;
};

const getHTML = (text: string) => {
  return `<!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <title>Generated Image</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
      body {
        background-image: url('https://placehold.jp/ff4013/ffffff/1200x630.png');
      }
      .container {
          position: relative;
      }
      .center {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 30px;
      }
      #bg-img {
          width: 1200px;
          height: 630px;
      }
    </style>
  <head>
  <body>
      <div class="container">
          <div class="center">${text}!!!!</div>
      </div>
  </body>
  </html>
  `;
};

const genImage = async (html: string) => {
  const options = await getOptions();
  const browser = await core.launch(options);
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 630 });
  page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36 WAIT_UNTIL=load"
  );
  await page.setContent(html);
  const file = await page.screenshot();
  return file;
};

const isLocal = (): boolean => {
  return process.env.FUNCTIONS_EMULATOR === "true";
};

const localExePath =
  process.platform === "win32"
    ? "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe"
    : process.platform === "linux"
    ? "/usr/bin/google-chrome"
    : "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

interface Options {
  args: string[];
  executablePath: string;
  headless: boolean;
}

const getOptions = async () => {
  let options: Options;
  if (isLocal()) {
    options = {
      args: [],
      executablePath: localExePath,
      headless: true,
    };
  } else {
    options = {
      args: chrome.args,
      executablePath: await chrome.executablePath,
      headless: chrome.headless,
    };
  }
  return options;
};
