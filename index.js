const express = require('express');
const pt = require('puppeteer');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);
const app = express();
const port = 3000;

const installDependencies = async () => {
    try {
        // Install Chromium for Puppeteer
        const { stdout, stderr } = await execPromise('npx @puppeteer/browsers install chromedriver@116.0.5793.0');
        if (stderr) {
            console.error(`stderr: ${stderr}`);
        }
        console.log(`stdout: ${stdout}`);
    } catch (error) {
        console.error(`Error during Chromium installation: ${error.message}`);
        throw error;
    }
};

const startServer = async () => {
    app.get('/ss', async (req, res) => {
        try {
            const browser = await pt.launch();
            const page = await browser.newPage();
            await page.setViewport({ width: 1000, height: 500 });
            await page.goto('https://www.tutorialspoint.com/index.html');
            const screenshot = await page.screenshot();
            await browser.close();
            res.contentType('image/png');
            res.send(screenshot);
        } catch (error) {
            console.error(`Error capturing screenshot: ${error.message}`);
            res.status(500).send('Error capturing screenshot');
        }
    });

    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });
};

const init = async () => {
    try {
        await installDependencies();
        startServer();
    } catch (error) {
        console.error('Failed to initialize server:', error);
    }
};

init();
