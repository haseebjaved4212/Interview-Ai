const { spawn, execSync } = require('child_process');
const puppeteer = require('../Backend/node_modules/puppeteer');
const path = require('path');
const fs = require('fs');

const SCREENSHOTS_DIR = path.join(__dirname, '..', 'docs', 'screenshots');

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function waitForServer(url, timeoutMs = 20000) {
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
        try {
            const res = await fetch(url);
            if (res.status < 500) return true;
        } catch (e) {}
        await wait(300);
    }
    throw new Error(`Timeout waiting for server at ${url}`);
}

async function captureViewport(page, filename, width, height, isMobile = false) {
    await page.setViewport({
        width,
        height,
        deviceScaleFactor: 2,
        isMobile,
        hasTouch: isMobile
    });
    await wait(600);
    const dest = path.join(SCREENSHOTS_DIR, filename);
    await page.screenshot({ path: dest, fullPage: false });
    console.log(`Saved screenshot: ${filename} (${width}x${height})`);
}

async function run() {
    console.log('--- Starting Backend Server ---');
    const backendProcess = spawn('node', ['server.js'], {
        cwd: path.join(__dirname, '..', 'Backend'),
        stdio: 'pipe',
        env: { ...process.env }
    });

    console.log('--- Starting Vite Server ---');
    const viteBin = path.join(__dirname, '..', 'Frontend', 'node_modules', 'vite', 'bin', 'vite.js');
    const frontendProcess = spawn('node', [viteBin, '--host', '127.0.0.1', '--port', '5173'], {
        cwd: path.join(__dirname, '..', 'Frontend'),
        stdio: 'pipe'
    });

    try {
        await waitForServer('http://127.0.0.1:3000/api/auth/get-me');
        await waitForServer('http://127.0.0.1:5173');
        console.log('Servers ready!');

        const browser = await puppeteer.launch({
            executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
            headless: true,
            pipe: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        const page = await browser.newPage();

        // 1. Log in
        console.log('Logging in as existing user...');
        await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
        await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle0' });
        await page.waitForSelector('#email');
        await page.type('#email', 'studio_1793893026580@example.com');
        await page.type('#password', 'Studio2026!');
        await wait(300);
        await page.click('form button.primary-button');

        await page.waitForSelector('.home-page', { timeout: 15000 });
        console.log('Logged in! Navigating directly to report...');

        // 2. Go to existing report
        await page.goto('http://localhost:5173/interview/6aeca2c096efa79286b86003', { waitUntil: 'networkidle0' });
        await page.waitForSelector('.interview-page', { timeout: 15000 });
        await wait(800);

        // 3. Desktop Report: Behavioral Questions active tab (Bug 3)
        console.log('Capturing Bug 3 Fix: Desktop Report Behavioral Questions...');
        const allTabs = await page.$$('.interview-nav__item');
        if (allTabs.length >= 2) {
            await allTabs[1].click(); // Click Behavioral Questions
            await wait(600);
            const firstHeader = await page.$('.q-card__header');
            if (firstHeader) await firstHeader.click();
            await wait(400);
            await captureViewport(page, 'bugfix3_desktop_report_behavioral.png', 1440, 900, false);
        }

        // 4. Mobile Report View (Bug 2)
        console.log('Capturing Bug 2 Fix: Mobile Report View...');
        await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
        await page.waitForSelector('.q-card', { timeout: 15000 });
        await wait(800);
        await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'bugfix2_mobile_report_view.png') });
        console.log('Saved screenshot: bugfix2_mobile_report_view.png (390x844)');

        // 5. Mobile Report Scrolled slightly to see questions underneath
        await page.evaluate(() => window.scrollBy(0, 300));
        await wait(400);
        const mobileScrolledPath = path.join(SCREENSHOTS_DIR, 'bugfix2_mobile_report_scrolled.png');
        await page.screenshot({ path: mobileScrolledPath });
        console.log('Saved screenshot: bugfix2_mobile_report_scrolled.png');

        await browser.close();
        console.log('Report captures done!');
    } finally {
        try {
            frontendProcess.kill('SIGKILL');
            execSync(`taskkill /pid ${frontendProcess.pid} /T /F`, { stdio: 'ignore' });
        } catch (e) {}
        try {
            backendProcess.kill('SIGKILL');
            execSync(`taskkill /pid ${backendProcess.pid} /T /F`, { stdio: 'ignore' });
        } catch (e) {}
    }
}

run().catch(err => {
    console.error(err);
    process.exit(1);
});
