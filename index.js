const express = require('express');
const pt = require('puppeteer');
const app = express();
const port = 3000;

app.get('/ss', async (req, res) => {
    const browser = await pt.launch();
    const page = await browser.newPage();
    await page.setViewport({ width: 1000, height: 500 });
    await page.goto('https://www.tutorialspoint.com/index.html');
    const screenshot = await page.screenshot();
    await browser.close();
    res.contentType('image/png');
    res.send(screenshot);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
