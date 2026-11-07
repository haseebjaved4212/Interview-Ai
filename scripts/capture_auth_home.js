const { spawn } = require('child_process');
const puppeteer = require('../Backend/node_modules/puppeteer');
const path = require('path');
const fs = require('fs');

const prefix = process.argv[2] || 'before'; // 'before' or 'after'
const SCREENSHOTS_DIR = path.join(__dirname, '..', 'docs', 'screenshots');
if (!fs.existsSync(SCREENSHOTS_DIR)) {
    fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function waitForServer(url, timeoutMs = 25000) {
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

async function capture(page, name, width, height, isMobile = false) {
    await page.setViewport({
        width,
        height,
        deviceScaleFactor: 2,
        isMobile,
        hasTouch: isMobile
    });
    await wait(700);
    const filename = `${prefix}_${name}.png`;
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

    console.log('--- Starting Vite Server ---');
    const viteBin = path.join(__dirname, '..', 'Frontend', 'node_modules', 'vite', 'bin', 'vite.js');
    const frontendProcess = spawn('node', [viteBin, '--host', '127.0.0.1', '--port', '5173'], {
        cwd: path.join(__dirname, '..', 'Frontend'),
        stdio: 'pipe'
    });
    frontendProcess.stdout.on('data', d => console.log('[Vite]', d.toString().trim()));
    frontendProcess.stderr.on('data', d => console.error('[Vite ERR]', d.toString().trim()));

    try {
        await waitForServer('http://127.0.0.1:3000/api/auth/get-me');
        await waitForServer('http://127.0.0.1:5173');
        console.log('Both servers up and running!');

        const browser = await puppeteer.launch({
            executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
            headless: true,
            pipe: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        const page = await browser.newPage();

        // 1. Auth: Login Desktop (1440px)
        await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle0' });
        await page.waitForSelector('#email');
        await capture(page, 'auth_login_desktop', 1440, 900, false);

        // 2. Auth: Login Mobile (390px)
        await capture(page, 'auth_login_mobile', 390, 844, true);

        // 3. Auth: Register Desktop (1440px)
        await page.goto('http://localhost:5173/register', { waitUntil: 'networkidle0' });
        await page.waitForSelector('#username');
        await capture(page, 'auth_register_desktop', 1440, 900, false);

        // 4. Auth: Register Mobile (390px)
        await capture(page, 'auth_register_mobile', 390, 844, true);

        // 5. Home: Login & Dashboard Desktop (1440px)
        await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle0' });
        await page.waitForSelector('#email');
        await page.type('#email', 'studio_1793893026580@example.com');
        await page.type('#password', 'Studio2026!');
        await wait(200);
        await page.click('form button.primary-button');
        await page.waitForSelector('.home-page', { timeout: 15000 });
        await wait(600);
        await capture(page, 'home_dashboard_desktop', 1440, 900, false);

        // 6. Home: Dashboard Mobile (390px)
        await capture(page, 'home_dashboard_mobile', 390, 844, true);

        await browser.close();
        console.log(`All ${prefix} screenshots captured successfully!`);
    } finally {
        if (frontendProcess.pid) {
            try { execSync(`taskkill /pid ${frontendProcess.pid} /T /F`); } catch (e) {}
        }
        if (backendProcess.pid) {
            try { execSync(`taskkill /pid ${backendProcess.pid} /T /F`); } catch (e) {}
        }
    }
}

run().catch(err => {
    console.error('Capture error:', err);
    process.exit(1);
});
