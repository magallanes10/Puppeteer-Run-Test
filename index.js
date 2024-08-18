const express = require('express');
const pt = require('puppeteer-core');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);
const app = express();
const port = 3000;

const installDependencies = async () => {
    try {
        // Install Puppeteer and the required Chromium version
        const { stdout, stderr } = await execPromise('npx @puppeteer/browsers install chrome@stable');
        if (stderr) {
            console.error(`stderr: ${stderr}`);
        }
        console.log(`stdout: ${stdout}`);
    } catch (error) {
        console.error(`Error during installation: ${error.message}`);
        throw error;
    }
};

const startServer = async () => {
    app.get('/ss', async (req, res) => {
        try {
            const browser = await pt.launch({
                executablePath: './chrome/linux-127.0.6533.119/chrome-linux64', // Specify the path to Chromium if needed
            });
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
