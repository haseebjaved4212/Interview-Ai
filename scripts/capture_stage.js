const { spawn } = require('child_process');
const puppeteer = require('../Backend/node_modules/puppeteer');
const path = require('path');
const fs = require('fs');

const SCREENSHOTS_DIR = path.join(__dirname, '..', 'docs', 'screenshots');
if (!fs.existsSync(SCREENSHOTS_DIR)) {
    fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

const stageName = process.argv[2] || 'stage';

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function waitForServer(url, timeoutMs = 30000) {
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
        try {
            const res = await fetch(url);
            if (res.status < 500) return true;
        } catch (e) {
            console.log('Fetch error:', e.cause || e.message);
        }
        await wait(800);
    }
    throw new Error(`Timeout waiting for server at ${url}`);
}

async function run() {
    console.log('--- Starting Frontend Server ---');
    const frontendProcess = spawn('npm', ['run', 'dev', '--', '--host', '127.0.0.1', '--port', '5173'], {
        cwd: path.join(__dirname, '..', 'Frontend'),
        stdio: 'pipe',
        shell: true,
        env: { ...process.env }
    });

    frontendProcess.stdout.on('data', d => console.log('[Vite]', d.toString().trim()));
    frontendProcess.stderr.on('data', d => console.error('[Vite ERR]', d.toString().trim()));

    try {
        console.log('Waiting for Vite server on :5173...');
        await waitForServer('http://127.0.0.1:5173');
        console.log('Vite is UP!');

        const browser = await puppeteer.launch({
            executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
            headless: true,
            pipe: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        const page = await browser.newPage();

        // 1. Desktop 1440x900
        await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
        await page.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle0' });
        await wait(600);
        const desktopPath = path.join(SCREENSHOTS_DIR, `${stageName}_desktop.png`);
        await page.screenshot({ path: desktopPath });
        console.log(`Saved: ${desktopPath}`);

        // Desktop full page or workflow scroll
        const workflowEl = await page.$('#how-it-works');
        if (workflowEl) {
            await workflowEl.scrollIntoView();
            await wait(600);
            const desktopWorkflowPath = path.join(SCREENSHOTS_DIR, `${stageName}_desktop_workflow.png`);
            await page.screenshot({ path: desktopWorkflowPath });
            console.log(`Saved: ${desktopWorkflowPath}`);
        }

        // 2. Mobile 390x844
        await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
        await page.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle0' });
        await wait(600);
        const mobilePath = path.join(SCREENSHOTS_DIR, `${stageName}_mobile.png`);
        await page.screenshot({ path: mobilePath });
        console.log(`Saved: ${mobilePath}`);

        const mobileWorkflowEl = await page.$('#how-it-works');
        if (mobileWorkflowEl) {
            await mobileWorkflowEl.scrollIntoView();
            await wait(600);
            const mobileWorkflowPath = path.join(SCREENSHOTS_DIR, `${stageName}_mobile_workflow.png`);
            await page.screenshot({ path: mobileWorkflowPath });
            console.log(`Saved: ${mobileWorkflowPath}`);
        }

        // 3. Mobile Menu opened (if toggle exists)
        const toggle = await page.$('.public-nav__toggle');
        if (toggle) {
            await toggle.click();
            await wait(400);
            const mobileMenuPath = path.join(SCREENSHOTS_DIR, `${stageName}_mobile_menu.png`);
            await page.screenshot({ path: mobileMenuPath });
            console.log(`Saved: ${mobileMenuPath}`);
        }

        await browser.close();
    } finally {
        console.log('Killing Vite server...');
        frontendProcess.kill();
    }
}

run().catch(err => {
    console.error(err);
    process.exit(1);
});
