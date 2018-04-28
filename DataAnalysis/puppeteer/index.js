const puppeteer = require('puppeteer');
const options = require('../config');
const username_selector = '#manage-login > div:nth-child(1) > span > input.textbox-text.validatebox-text.textbox-prompt';
const password_selector = '#manage-login > div:nth-child(2) > span > input.textbox-text.validatebox-text.textbox-prompt';
const login_selector = 'body > div.panel > div.easyui-panel.panel-body > div > a:nth-child(1)';



async function run() {
    //启动GUI界面,进行可视化调试
    const browser = await puppeteer.launch({
        headless: false,
        slowMo:100, // 减慢puppeteer的动作250ms
    });
    const page = await browser.newPage();
    // 捕获console的输出
    page.on('console', msg => console.log('PAGE LOG:', ...msg.args));
    // page.evaluate()注入console.log
    await page.evaluate(() => console.log(`url is ${location.href}`));
    //跳转到登录页
    await page.goto('https://auth.myhug.cn/user/login');  
    //输入用户名
    await page.type(username_selector,options.user.name,{delay:100});
    //输入密码
    await page.type(password_selector,options.user.password,{delay:100});
    //点击登录按钮
    //await page.click(login_selector)
    await page.press('Enter');
    //await page.waitForNavigation();

    //browser.close();
}

async function example(){
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto("https://segmentfault.com/a/1190000012924029");
    await page.screenshot({path:'/assests/example.png'}); // 截图
    await page.pdf({path:'/assests/example.pdf',format:'A4'}); // 生成Pdf
    await browser.close();
}

async function evaluate() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('http://rennaiqian.com');
  
    // Get the "viewport" of the page, as reported by the page.
    // page.evaluate()函数，可以向页面注入我们的函数
    // 无法直接使用外部的变量，需要作为参数传入
    // 获得的执行结果需要return 出来
    // https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md 查看api
    const dimensions = await page.evaluate(() => {
      return {
        width: document.documentElement.clientWidth,
        height: document.documentElement.clientHeight,
        deviceScaleFactor: window.devicePixelRatio
      };
    });
  
    console.log('Dimensions:', dimensions);
    await browser.close();
  }

  async function AutoSearch(){
    //百度搜索 Puppeteer的入门和实践
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    await page.goto('https://baidu.com');
    await page.type('#kw', 'puppeteer', {delay: 100});
    page.click('#su')
    await page.waitFor(1000);
    const targetLink = await page.evaluate(() => {
      return [...document.querySelectorAll('.result a')].filter(item => {
        return item.innerText && item.innerText.includes('Puppeteer的入门和实践')
      }).toString()
    });
    await page.goto(targetLink);
    await page.waitFor(1000);
    browser.close();
  }





run();