const express = require('express');
const pt = require('puppeteer');
const { exec } = require('child_process');
const app = express();
const port = 3000;

exec('npx puppeteer install', (error, stdout, stderr) => {
    if (error) {
        console.error(`Error during Puppeteer installation: ${error.message}`);
        return;
    }
    if (stderr) {
        console.error(`stderr: ${stderr}`);
        return;
    }
    console.log(`stdout: ${stdout}`);
    
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
});
