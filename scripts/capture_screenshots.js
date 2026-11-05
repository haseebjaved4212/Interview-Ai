const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const puppeteer = require('../Backend/node_modules/puppeteer');

const SCREENSHOTS_DIR = path.join(__dirname, '..', 'docs', 'screenshots');
if (!fs.existsSync(SCREENSHOTS_DIR)) {
    fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function waitForServer(url, timeoutMs = 45000) {
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
        try {
            const res = await fetch(url);
            if (res.status < 500) return true;
        } catch (e) {
            // Server not ready yet
        }
        await wait(500);
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
    await wait(400);
    const dest = path.join(SCREENSHOTS_DIR, filename);
    await page.screenshot({ path: dest, fullPage: false });
    console.log(`Saved screenshot: ${filename} (${width}x${height})`);
}

async function run() {
    console.log('--- Starting Backend Server ---');
    const backendProcess = spawn('node', ['server.js'], {
        cwd: path.join(__dirname, '..', 'Backend'),
        stdio: 'pipe',
        shell: true,
        env: { ...process.env }
    });

    backendProcess.stdout.on('data', d => console.log('[Backend]', d.toString().trim()));
    backendProcess.stderr.on('data', d => console.error('[Backend ERR]', d.toString().trim()));

    console.log('--- Starting Frontend Server ---');
    const frontendProcess = spawn('npm', ['run', 'dev'], {
        cwd: path.join(__dirname, '..', 'Frontend'),
        stdio: 'pipe',
        shell: true,
        env: { ...process.env }
    });

    frontendProcess.stdout.on('data', d => console.log('[Frontend]', d.toString().trim()));
    frontendProcess.stderr.on('data', d => console.error('[Frontend ERR]', d.toString().trim()));

    try {
        console.log('Waiting for Backend (:3000) and Frontend (:5173)...');
        await waitForServer('http://localhost:3000/api/auth/get-me');
        await waitForServer('http://localhost:5173');
        console.log('Both servers are UP!');

        const browser = await puppeteer.launch({
            executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
            headless: true,
            pipe: true,
            defaultViewport: { width: 1440, height: 900 },
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-gpu'
            ]
        });

        const page = await browser.newPage();
        page.on('console', msg => console.log('[Browser Console]', msg.text()));
        page.on('pageerror', err => console.error('[Browser PageError]', err.message));

        // 1. Register Page (Desktop & Mobile)
        console.log('Capturing Register Page (Desktop & Mobile)...');
        await page.goto('http://localhost:5173/register', { waitUntil: 'networkidle0' });
        await captureViewport(page, '01_desktop_register.png', 1440, 900, false);
        await captureViewport(page, '01_mobile_register.png', 390, 844, true);

        // 2. Login Page (Desktop & Mobile)
        console.log('Capturing Login Page (Desktop & Mobile)...');
        await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle0' });
        await captureViewport(page, '02_desktop_login.png', 1440, 900, false);
        await captureViewport(page, '02_mobile_login.png', 390, 844, true);

        // Perform Registration / Auth
        const uniqueId = Date.now();
        const testEmail = `studio_${uniqueId}@example.com`;
        const testUser = `Studio_${uniqueId}`;
        const testPass = `Studio2026!`;

        console.log('Registering test user...');
        await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2, isMobile: false, hasTouch: false });
        await page.goto('http://localhost:5173/register', { waitUntil: 'networkidle0' });
        await page.waitForSelector('#username');
        await page.type('#username', testUser);
        await page.type('#email', testEmail);
        await page.type('#password', testPass);
        await wait(400);
        await page.click('form button.primary-button');

        try {
            await page.waitForSelector('.home-page', { timeout: 15000 });
        } catch (e) {
            const currentUrl = page.url();
            const errAlert = await page.$eval('.form-error-alert', el => el.textContent).catch(() => null);
            console.error(`Failed to reach .home-page. URL: ${currentUrl}, Error on page: ${errAlert}`);
            throw e;
        }

        console.log('User registered & logged in! Current URL:', page.url());

        // 3. Home Dashboard (Desktop & Mobile)
        console.log('Capturing Home Dashboard (Desktop & Mobile)...');
        await page.waitForSelector('.home-page');
        await wait(600);
        await captureViewport(page, '03_desktop_home.png', 1440, 900, false);
        await captureViewport(page, '03_mobile_home.png', 390, 844, true);

        // Reset to desktop for interaction
        await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2, isMobile: false, hasTouch: false });
        await wait(500);

        // 4. Fill in Workspace inputs
        console.log('Filling form inputs...');
        const jobDesc = `We are seeking a Senior AI Systems Engineer in Karachi.
Role & Responsibilities:
- Architect enterprise-grade agentic AI pipelines with autonomous reasoning, tool execution, and memory.
- Design retrieval-augmented generation (RAG) using dense vector embeddings and semantic search.
- Build resilient microservices with Node.js, TypeScript, and modern React interfaces.`;

        const selfDesc = `Senior AI Engineer with 4 years of experience delivering full-stack machine learning platforms, LangChain/LangGraph agent frameworks, distributed vector indexing, and React web apps.`;

        await page.waitForSelector('#jobDescription');
        await page.type('#jobDescription', jobDesc);
        await page.waitForSelector('#selfDescription');
        await page.type('#selfDescription', selfDesc);
        await wait(500);

        console.log('Capturing Filled Home Workspace...');
        await captureViewport(page, '04_desktop_home_filled.png', 1440, 900, false);

        // 5. Submit Strategy Generation
        console.log('Clicking Generate My Interview Strategy...');
        await page.click('.generate-btn');

        // Wait brief moment to capture custom loading state without resizing during in-flight fetch
        try {
            await page.waitForSelector('.loading-screen', { timeout: 4000 });
            console.log('Capturing Custom Multi-Stage Loading Screen...');
            await wait(400);
            await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '05_desktop_loading_stage.png') });
            console.log('Saved screenshot: 05_desktop_loading_stage.png');
        } catch (e) {
            console.log('Loading screen passed quickly or was not caught.');
        }

        // Wait for AI generation to complete (approx 15-40s)
        console.log('Waiting for AI generation to complete (approx 15-40s)...');
        await page.waitForSelector('.interview-page', { timeout: 90000 });
        console.log('Navigated to Report Page! URL:', page.url());
        await wait(2000);

        // 6. Report View - Technical Questions (Desktop & Mobile)
        console.log('Capturing Technical Questions (Desktop & Mobile)...');
        // Expand first question card
        const firstQ = await page.$('.q-card__header');
        if (firstQ) {
            await firstQ.click();
            await wait(600);
        }
        await captureViewport(page, '06_desktop_report_technical.png', 1440, 900, false);
        await captureViewport(page, '06_mobile_report_technical.png', 390, 844, true);

        // Reset to desktop for further tabs
        await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2, isMobile: false, hasTouch: false });
        await wait(500);

        // 7. Report View - Behavioral Questions
        console.log('Navigating to Behavioral Questions...');
        const allTabs = await page.$$('.interview-nav__item');
        if (allTabs.length >= 2) {
            await allTabs[1].click(); // Behavioral
            await wait(800);
            const firstB = await page.$('.q-card__header');
            if (firstB) {
                await firstB.click();
                await wait(500);
            }
            await captureViewport(page, '07_desktop_report_behavioral.png', 1440, 900, false);
        }

        // 8. Report View - Preparation Roadmap (Desktop & Mobile)
        console.log('Navigating to Road Map...');
        const freshTabs = await page.$$('.interview-nav__item');
        if (freshTabs.length >= 3) {
            await freshTabs[2].click(); // Roadmap
            await wait(800);
            await captureViewport(page, '08_desktop_report_roadmap.png', 1440, 900, false);
            await captureViewport(page, '08_mobile_report_roadmap.png', 390, 844, true);
        }

        // 9. Match Score & Skill Gaps Close-up
        await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2, isMobile: false, hasTouch: false });
        await wait(500);
        const sidebar = await page.$('.interview-sidebar');
        if (sidebar) {
            await sidebar.screenshot({ path: path.join(SCREENSHOTS_DIR, '09_sidebar_score_gaps.png') });
            console.log('Saved sidebar close-up: 09_sidebar_score_gaps.png');
        }

        // 10. Return to Home Dashboard to capture Recent Reports List
        console.log('Navigating back to Dashboard to capture Recent Reports...');
        await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });
        await page.waitForSelector('.home-page');
        await wait(1000);
        const recentEl = await page.$('.recent-reports');
        if (recentEl) {
            await recentEl.scrollIntoView();
            await wait(500);
        }
        await captureViewport(page, '10_desktop_home_recent_reports.png', 1440, 900, false);
        if (recentEl) {
            await recentEl.scrollIntoView();
            await wait(500);
        }
        await captureViewport(page, '10_mobile_home_recent_reports.png', 390, 844, true);

        console.log('ALL EDITORIAL STUDIO SCREENSHOTS CAPTURED SUCCESSFULLY!');
        await browser.close();

    } finally {
        console.log('Cleaning up servers...');
        backendProcess.kill();
        frontendProcess.kill();
    }
}

run().then(() => {
    console.log('Screenshot execution complete.');
    process.exit(0);
}).catch(err => {
    console.error('Screenshot script failed:', err);
    process.exit(1);
});
