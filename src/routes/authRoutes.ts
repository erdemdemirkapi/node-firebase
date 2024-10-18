import express from 'express';
import { signup, login } from '../controllers/authController';

const router = express.Router();


/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication routes
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     SignupRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *         - firstName
 *         - lastName
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: The user's email.
 *           example: 'test@gmail.com'
 *         password:
 *           type: string
 *           description: The user's password.
 *           example: 'qwerty'
 *         firstName:
 *           type: string
 *           description: The user's first name.
 *           example: 'Erdem'
 *         lastName:
 *           type: string
 *           description: The user's last name.
 *           example: 'Demirkapi'
 *     SignupResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: 'User created successfully'
 *         userId:
 *           type: string
 *           description: The user's unique ID.
 *           example: 'abc123'
 *     LoginRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: The user's email.
 *           example: 'demirkaperdem@gmail2.com'
 *         password:
 *           type: string
 *           description: The user's password.
 *           example: 'qwerty'
 *     LoginResponse:
 *       type: object
 *       properties:
 *         token:
 *           type: string
 *           description: The JWT token.
 *           example: 'jwt-token-here'
 */

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: Sign up a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SignupRequest'
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SignupResponse'
 *       400:
 *         description: Bad request (e.g., validation error)
 *       500:
 *         description: Internal server error
 */
router.post('/signup', signup);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Log in a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       400:
 *         description: Invalid credentials or missing data
 *       500:
 *         description: Internal server error
 */
router.post('/login', login);

export default router;
