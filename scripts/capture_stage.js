const { spawn, execSync } = require('child_process');
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

async function waitForServer(url, timeoutMs = 20000) {
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
        try {
            const res = await fetch(url);
            if (res.status < 500) return true;
        } catch (e) {
            // Wait
        }
        await wait(300);
    }
    throw new Error(`Timeout waiting for server at ${url}`);
}

async function run() {
    console.log('--- Starting Vite Server directly ---');
    const viteBin = path.join(__dirname, '..', 'Frontend', 'node_modules', 'vite', 'bin', 'vite.js');
    const frontendProcess = spawn('node', [viteBin, '--host', '127.0.0.1', '--port', '5173'], {
        cwd: path.join(__dirname, '..', 'Frontend'),
        stdio: 'pipe'
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

        // 1. Desktop 1440x900 (Above the fold)
        await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
        await page.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle0' });
        await wait(600);
        const desktopPath = path.join(SCREENSHOTS_DIR, `${stageName}_desktop.png`);
        await page.screenshot({ path: desktopPath });
        console.log(`Saved: ${desktopPath}`);

        // Desktop Workflow Section
        const workflowEl = await page.$('#how-it-works');
        if (workflowEl) {
            await workflowEl.scrollIntoView();
            await wait(600);
            const desktopWorkflowPath = path.join(SCREENSHOTS_DIR, `${stageName}_desktop_workflow.png`);
            await page.screenshot({ path: desktopWorkflowPath });
            console.log(`Saved: ${desktopWorkflowPath}`);
        }

        // Desktop Features Section
        const featuresEl = await page.$('#features');
        if (featuresEl) {
            await featuresEl.scrollIntoView();
            await wait(600);
            const desktopFeaturesPath = path.join(SCREENSHOTS_DIR, `${stageName}_desktop_features.png`);
            await page.screenshot({ path: desktopFeaturesPath });
            console.log(`Saved: ${desktopFeaturesPath}`);
        }

        // Desktop CTA Section
        const ctaEl = await page.$('.cta-section');
        if (ctaEl) {
            await ctaEl.scrollIntoView();
            await wait(600);
            const desktopCtaPath = path.join(SCREENSHOTS_DIR, `${stageName}_desktop_cta.png`);
            await page.screenshot({ path: desktopCtaPath });
            console.log(`Saved: ${desktopCtaPath}`);
        }

        // Desktop Footer
        const footerEl = await page.$('.public-footer');
        if (footerEl) {
            await footerEl.scrollIntoView();
            await wait(600);
            const desktopFooterPath = path.join(SCREENSHOTS_DIR, `${stageName}_desktop_footer.png`);
            await page.screenshot({ path: desktopFooterPath });
            console.log(`Saved: ${desktopFooterPath}`);
        }

        // Desktop Full Page
        const desktopFullPath = path.join(SCREENSHOTS_DIR, `${stageName}_desktop_full.png`);
        await page.screenshot({ path: desktopFullPath, fullPage: true });
        console.log(`Saved: ${desktopFullPath}`);

        // 2. Mobile 390x844 (Above the fold)
        await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
        await page.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle0' });
        await wait(600);
        const mobilePath = path.join(SCREENSHOTS_DIR, `${stageName}_mobile.png`);
        await page.screenshot({ path: mobilePath });
        console.log(`Saved: ${mobilePath}`);

        // Mobile Workflow Section
        const mobileWorkflowEl = await page.$('#how-it-works');
        if (mobileWorkflowEl) {
            await mobileWorkflowEl.scrollIntoView();
            await wait(600);
            const mobileWorkflowPath = path.join(SCREENSHOTS_DIR, `${stageName}_mobile_workflow.png`);
            await page.screenshot({ path: mobileWorkflowPath });
            console.log(`Saved: ${mobileWorkflowPath}`);
        }

        const mobileFeaturesEl = await page.$('#features');
        if (mobileFeaturesEl) {
            await mobileFeaturesEl.scrollIntoView();
            await wait(600);
            const mobileFeaturesPath = path.join(SCREENSHOTS_DIR, `${stageName}_mobile_features.png`);
            await page.screenshot({ path: mobileFeaturesPath });
            console.log(`Saved: ${mobileFeaturesPath}`);
        }

        const mobileCtaEl = await page.$('.cta-section');
        if (mobileCtaEl) {
            await mobileCtaEl.scrollIntoView();
            await wait(600);
            const mobileCtaPath = path.join(SCREENSHOTS_DIR, `${stageName}_mobile_cta.png`);
            await page.screenshot({ path: mobileCtaPath });
            console.log(`Saved: ${mobileCtaPath}`);
        }

        const mobileFooterEl = await page.$('.public-footer');
        if (mobileFooterEl) {
            await mobileFooterEl.scrollIntoView();
            await wait(600);
            const mobileFooterPath = path.join(SCREENSHOTS_DIR, `${stageName}_mobile_footer.png`);
            await page.screenshot({ path: mobileFooterPath });
            console.log(`Saved: ${mobileFooterPath}`);
        }

        const mobileFullPath = path.join(SCREENSHOTS_DIR, `${stageName}_mobile_full.png`);
        await page.screenshot({ path: mobileFullPath, fullPage: true });
        console.log(`Saved: ${mobileFullPath}`);

        await browser.close();
    } finally {
        console.log('Cleaning up Vite server...');
        try {
            frontendProcess.kill('SIGKILL');
            execSync(`taskkill /pid ${frontendProcess.pid} /T /F`, { stdio: 'ignore' });
        } catch (e) {
            // Already killed
        }
    }
}

run().catch(err => {
    console.error(err);
    process.exit(1);
});
