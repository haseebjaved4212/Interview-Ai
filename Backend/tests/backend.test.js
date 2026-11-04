const { test, describe, beforeEach } = require('node:test');
const assert = require('node:assert');
const jwt = require('jsonwebtoken');

// Set test environment
process.env.JWT_SECRET = 'test_secret_key_1234567890_abcdef';

const { authUser } = require('../src/middlewares/auth.middleware');
const tokenBlacklistModel = require('../src/models/blacklist.model');
const userModel = require('../src/models/user.model');
const interviewReportModel = require('../src/models/interviewReport.model');
const upload = require('../src/middlewares/file.middleware');
const {
    registerUserController,
    loginUserController,
    logoutUserController
} = require('../src/controllers/auth.controller');
const {
    generateInterViewReportController,
    getInterviewReportByIdController
} = require('../src/controllers/interview.controller');

// Mock response helper
function createMockResponse() {
    return {
        statusCode: null,
        jsonData: null,
        cookies: {},
        clearedCookies: [],
        status(code) {
            this.statusCode = code;
            return this;
        },
        json(data) {
            this.jsonData = data;
            return this;
        },
        cookie(name, val, opts) {
            this.cookies[name] = { val, opts };
            return this;
        },
        clearCookie(name) {
            this.clearedCookies.push(name);
            return this;
        }
    };
}

describe('Interview AI Backend Test Suite', () => {

    describe('Auth Middleware', () => {
        test('Should return 401 when no token is provided', async () => {
            const req = { cookies: {}, headers: {} };
            const res = createMockResponse();
            let nextCalled = false;

            await authUser(req, res, () => { nextCalled = true; });

            assert.strictEqual(res.statusCode, 401);
            assert.strictEqual(res.jsonData.message, 'Token not provided.');
            assert.strictEqual(nextCalled, false);
        });

        test('Should return 401 when token is invalid or expired', async () => {
            const req = {
                cookies: { token: 'invalid.jwt.token' },
                headers: {}
            };
            const res = createMockResponse();
            let nextCalled = false;

            // Mock blacklist check to return null
            const origFindOne = tokenBlacklistModel.findOne;
            tokenBlacklistModel.findOne = async () => null;

            await authUser(req, res, () => { nextCalled = true; });

            tokenBlacklistModel.findOne = origFindOne;

            assert.strictEqual(res.statusCode, 401);
            assert.strictEqual(res.jsonData.message, 'Invalid token.');
            assert.strictEqual(nextCalled, false);
        });

        test('Should return 401 when token is blacklisted', async () => {
            const validToken = jwt.sign({ _id: '123' }, process.env.JWT_SECRET);
            const req = {
                cookies: {},
                headers: { authorization: `Bearer ${validToken}` }
            };
            const res = createMockResponse();
            let nextCalled = false;

            const origFindOne = tokenBlacklistModel.findOne;
            tokenBlacklistModel.findOne = async () => ({ token: validToken });

            await authUser(req, res, () => { nextCalled = true; });

            tokenBlacklistModel.findOne = origFindOne;

            assert.strictEqual(res.statusCode, 401);
            assert.strictEqual(res.jsonData.message, 'token is invalid');
            assert.strictEqual(nextCalled, false);
        });

        test('Should pass and normalize req.user.id and req.user._id when token is valid', async () => {
            const validToken = jwt.sign(
                { _id: 'user_mongodb_id_123', username: 'alex' },
                process.env.JWT_SECRET
            );
            const req = {
                cookies: { token: validToken },
                headers: {}
            };
            const res = createMockResponse();
            let nextCalled = false;

            const origFindOne = tokenBlacklistModel.findOne;
            tokenBlacklistModel.findOne = async () => null;

            await authUser(req, res, () => { nextCalled = true; });

            tokenBlacklistModel.findOne = origFindOne;

            assert.strictEqual(nextCalled, true);
            assert.ok(req.user);
            assert.strictEqual(req.user.id, 'user_mongodb_id_123');
            assert.strictEqual(req.user._id, 'user_mongodb_id_123');
            assert.strictEqual(req.user.username, 'alex');
        });
    });

    describe('Auth Controller Validation', () => {
        test('registerUserController should reject missing fields with 400', async () => {
            const req = { body: { username: 'alex', email: '' } };
            const res = createMockResponse();

            await registerUserController(req, res);

            assert.strictEqual(res.statusCode, 400);
            assert.strictEqual(res.jsonData.message, 'Please fill all the fields');
        });

        test('loginUserController should reject missing password with 400', async () => {
            const req = { body: { email: 'alex@test.com' } };
            const res = createMockResponse();

            await loginUserController(req, res);

            assert.strictEqual(res.statusCode, 400);
            assert.strictEqual(res.jsonData.message, 'Please fill all the fields');
        });

        test('logoutUserController should reject when no token is present with 400', async () => {
            const req = { cookies: {}, headers: {}, body: {} };
            const res = createMockResponse();

            await logoutUserController(req, res);

            assert.strictEqual(res.statusCode, 400);
            assert.ok(res.jsonData.message.includes('No token provided'));
        });
    });

    describe('Interview Controller Validation', () => {
        test('generateInterViewReportController should return 400 if jobDescription is missing', async () => {
            const req = {
                body: { jobDescription: '', selfDescription: 'Experienced engineer' },
                user: { id: 'user_123' }
            };
            const res = createMockResponse();

            await generateInterViewReportController(req, res);

            assert.strictEqual(res.statusCode, 400);
            assert.strictEqual(res.jsonData.message, 'Target job description is required.');
        });

        test('generateInterViewReportController should return 400 if neither resume nor selfDescription is provided', async () => {
            const req = {
                body: { jobDescription: 'Senior Backend Engineer', selfDescription: '' },
                file: undefined,
                user: { id: 'user_123' }
            };
            const res = createMockResponse();

            await generateInterViewReportController(req, res);

            assert.strictEqual(res.statusCode, 400);
            assert.ok(res.jsonData.message.includes('Either a resume file or a self-description is required'));
        });

        test('getInterviewReportByIdController should return 404 when report does not exist', async () => {
            const req = {
                params: { interviewId: '507f1f77bcf86cd799439011' },
                user: { id: 'user_123' }
            };
            const res = createMockResponse();

            const origFindOne = interviewReportModel.findOne;
            interviewReportModel.findOne = async () => null;

            await getInterviewReportByIdController(req, res);

            interviewReportModel.findOne = origFindOne;

            assert.strictEqual(res.statusCode, 404);
            assert.strictEqual(res.jsonData.message, 'Interview report not found.');
        });
    });

    describe('Multer File Middleware Configuration', () => {
        test('Should be configured with 3MB file size limit', () => {
            assert.ok(upload);
            assert.strictEqual(upload.limits.fileSize, 3 * 1024 * 1024);
        });
    });

    describe('Mongoose Models Schema Validation', () => {
        test('User model requires username, email, and password', () => {
            const user = new userModel({});
            const err = user.validateSync();
            assert.ok(err.errors['username']);
            assert.ok(err.errors['email']);
            assert.ok(err.errors['password']);
        });

        test('InterviewReport model validates matchScore boundaries (0 - 100)', () => {
            const invalidReport = new interviewReportModel({
                title: 'Frontend Engineer',
                jobDescription: 'React dev',
                matchScore: 150
            });
            const err = invalidReport.validateSync();
            assert.ok(err.errors['matchScore']);
        });

        test('Blacklist model contains TTL expires index of 86400 seconds (24h)', () => {
            const createdAtPath = tokenBlacklistModel.schema.path('createdAt');
            assert.ok(createdAtPath);
            assert.strictEqual(createdAtPath.options.expires, 86400);
        });
    });
});
