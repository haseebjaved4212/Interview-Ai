const { spawn, execSync } = require('child_process');
const puppeteer = require('../Backend/node_modules/puppeteer');
const path = require('path');
const fs = require('fs');

const SCREENSHOTS_DIR = path.join(__dirname, '..', 'docs', 'screenshots');
if (!fs.existsSync(SCREENSHOTS_DIR)) {
    fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

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
            // Wait
        }
        await wait(400);
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
    backendProcess.stdout.on('data', d => console.log('[Backend]', d.toString().trim()));
    backendProcess.stderr.on('data', d => console.error('[Backend ERR]', d.toString().trim()));

    console.log('--- Starting Vite Frontend Server ---');
    const viteBin = path.join(__dirname, '..', 'Frontend', 'node_modules', 'vite', 'bin', 'vite.js');
    const frontendProcess = spawn('node', [viteBin, '--host', '127.0.0.1', '--port', '5173'], {
        cwd: path.join(__dirname, '..', 'Frontend'),
        stdio: 'pipe'
    });
    frontendProcess.stdout.on('data', d => console.log('[Vite]', d.toString().trim()));
    frontendProcess.stderr.on('data', d => console.error('[Vite ERR]', d.toString().trim()));

    try {
        console.log('Waiting for Backend and Vite...');
        await waitForServer('http://127.0.0.1:3000/api/auth/get-me');
        await waitForServer('http://127.0.0.1:5173');
        console.log('Both servers are UP!');

        const browser = await puppeteer.launch({
            executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
            headless: true,
            pipe: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        const page = await browser.newPage();
        page.on('console', msg => console.log('[Browser Console]', msg.text()));
        page.on('pageerror', err => console.error('[Browser PageError]', err.message));

        // 1. Landing Page (Desktop & Mobile)
        console.log('Capturing Landing Page...');
        await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });
        await captureViewport(page, 'final_landing_desktop.png', 1440, 900, false);
        await captureViewport(page, 'final_landing_mobile.png', 390, 844, true);

        // 2. Register & Auth
        console.log('Registering test user...');
        const uniqueId = Date.now();
        const testEmail = `candidate_${uniqueId}@example.com`;
        const testUser = `Candidate_${uniqueId}`;
        const testPass = `CraftPass2026!`;

        await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
        await page.goto('http://localhost:5173/register', { waitUntil: 'networkidle0' });
        await page.waitForSelector('#username');
        await page.type('#username', testUser);
        await page.type('#email', testEmail);
        await page.type('#password', testPass);
        await wait(400);
        await page.click('form button.primary-button');

        await page.waitForSelector('.home-page', { timeout: 15000 });
        console.log('Logged in to dashboard successfully! URL:', page.url());

        // 3. Verify Bug 1: Mobile Dashboard textarea min-height & char-counter below
        console.log('Capturing Bug 1 Fix: Mobile Home Dashboard...');
        await captureViewport(page, 'bugfix1_mobile_dashboard_textarea.png', 390, 844, true);

        // 4. Submit Strategy Generation & Capture Bug 4: Loading Screen
        console.log('Filling in job description & self description...');
        await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
        const jobDesc = `Staff Software Engineer, Platform Infrastructure.
Requires mastery of high-concurrency systems, distributed streaming pipelines, React architecture, and multi-region failover. Experience leading incident post-mortems and cross-functional engineering teams.`;
        const selfDesc = `Senior Systems Engineer with 8 years building distributed data ingestion pipelines, cloud-native services, and real-time dashboard interfaces. Deep knowledge of microservices and state management.`;

        await page.type('#jobDescription', jobDesc);
        await page.type('#selfDescription', selfDesc);
        await wait(400);

        console.log('Submitting strategy generation...');
        await page.click('.generate-btn');

        // Capture Loading Screen for Bug 4 (mobile view)
        try {
            await page.waitForSelector('.loading-screen', { timeout: 4000 });
            await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
            await wait(500);
            const loadPath = path.join(SCREENSHOTS_DIR, 'bugfix4_mobile_loading_screen.png');
            await page.screenshot({ path: loadPath });
            console.log(`Saved screenshot: bugfix4_mobile_loading_screen.png`);
        } catch (e) {
            console.log('Loading state passed rapidly.');
        }

        // Wait for report generation
        console.log('Waiting for report to generate (approx 15-40s)...');
        await page.waitForSelector('.interview-page', { timeout: 90000 });
        console.log('Report generated successfully!');

        // 5. Verify Bug 3: Desktop Behavioral Questions active pill
        console.log('Navigating to Behavioral Questions tab...');
        await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
        const allTabs = await page.$$('.interview-nav__item');
        if (allTabs.length >= 2) {
            await allTabs[1].click(); // Click Behavioral Questions
            await wait(600);
            const firstB = await page.$('.q-card__header');
            if (firstB) await firstB.click();
            await wait(400);
            await captureViewport(page, 'bugfix3_desktop_report_behavioral.png', 1440, 900, false);
        }

        // 6. Verify Bug 2: Mobile report view content under chips & score/gaps block visible
        console.log('Capturing Bug 2 Fix: Mobile Report View...');
        await captureViewport(page, 'bugfix2_mobile_report_view.png', 390, 844, true);

        await browser.close();
        console.log('All verification captures completed!');
    } finally {
        console.log('Cleaning up servers...');
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
