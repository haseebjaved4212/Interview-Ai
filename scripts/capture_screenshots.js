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

async function waitForServer(url, timeoutMs = 30000) {
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

        // 1. Register Page
        console.log('Capturing Register Page...');
        await page.goto('http://localhost:5173/register', { waitUntil: 'networkidle0' });
        await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '01_register_page.png') });

        // 2. Login Page
        console.log('Capturing Login Page...');
        await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle0' });
        await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '02_login_page.png') });

        // Perform Login or Registration
        const testEmail = `dev_${Date.now()}@example.com`;
        const testUser = `HaseebDev`;
        const testPass = `Pass1234!`;

        console.log('Registering test user...');
        await page.goto('http://localhost:5173/register', { waitUntil: 'networkidle0' });
        await page.type('#username', testUser);
        await page.type('#email', testEmail);
        await page.type('#password', testPass);
        await Promise.all([
            page.waitForNavigation({ waitUntil: 'networkidle0' }),
            page.click('button.primary-button')
        ]);

        console.log('User registered & logged in! Current URL:', page.url());

        // 3. Home Dashboard (Empty)
        console.log('Capturing Home Dashboard...');
        await page.waitForSelector('.home-page');
        await wait(1000);
        await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '03_home_dashboard.png') });

        // 4. Fill in Target Job Description & Quick Self-Description
        console.log('Filling form...');
        const jobDesc = `We are hiring a Senior AI Engineer in Karachi.
Role: Design and build production-grade AI applications using modern AI frameworks, multi-agent orchestration, RAG architectures, and scalable full-stack pipelines with React and Node.js.`;
        const selfDesc = `Senior Full Stack & AI Engineer with 4 years experience building autonomous AI systems, vector search pipelines, React frontends, and cloud microservices.`;

        await page.type('.panel--left textarea', jobDesc);
        await page.type('.panel--right textarea', selfDesc);
        await wait(500);

        console.log('Capturing Filled Home Form...');
        await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '04_home_form_filled.png') });

        // 5. Submit Strategy Generation
        console.log('Clicking Generate My Interview Strategy...');
        await page.click('.generate-btn');

        // Wait for loading screen or navigation
        console.log('Waiting for AI generation to complete (approx 15-30s)...');
        await page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 90000 });
        console.log('Navigated to Report Page! URL:', page.url());

        await page.waitForSelector('.interview-page');
        await wait(1500);

        // 6. Full Interview Report (Overview)
        console.log('Capturing Full Interview Report Overview...');
        await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '05_interview_strategy_report.png') });

        // 7. Technical Questions Section (Expanded question)
        console.log('Expanding technical question...');
        const firstQ = await page.$('.q-card__header');
        if (firstQ) {
            await firstQ.click();
            await wait(600);
        }
        await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '06_technical_questions_section.png') });

        // 8. Behavioral Questions Section
        console.log('Navigating to Behavioral Questions...');
        const navBtns = await page.$$('.interview-nav__item');
        if (navBtns.length >= 2) {
            await navBtns[1].click(); // Behavioral
            await wait(800);
            const firstB = await page.$('.q-card__header');
            if (firstB) {
                await firstB.click();
                await wait(600);
            }
            await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '07_behavioral_questions_section.png') });
        }

        // 9. Preparation Road Map Section
        console.log('Navigating to Road Map...');
        if (navBtns.length >= 3) {
            await navBtns[2].click(); // Roadmap
            await wait(800);
            await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '08_preparation_roadmap_section.png') });
        }

        // 10. Sidebar Close-up (Match Score & Skill Gaps)
        console.log('Capturing Sidebar (Match Score & Skill Gaps)...');
        const sidebar = await page.$('.interview-sidebar');
        if (sidebar) {
            await sidebar.screenshot({ path: path.join(SCREENSHOTS_DIR, '09_sidebar_match_score_skill_gaps.png') });
        }

        // 11. Return to Home Dashboard to show recent reports list
        console.log('Navigating back to Dashboard to capture Recent Reports...');
        await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });
        await wait(1000);
        await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '10_home_with_recent_reports.png') });

        console.log('ALL SCREENSHOTS CAPTURED SUCCESSFULLY!');
        await browser.close();

    } finally {
        console.log('Cleaning up servers...');
        backendProcess.kill();
        frontendProcess.kill();
    }
}

run().then(() => {
    console.log('Screenshot generation complete.');
    process.exit(0);
}).catch(err => {
    console.error('Screenshot script failed:', err);
    process.exit(1);
});
