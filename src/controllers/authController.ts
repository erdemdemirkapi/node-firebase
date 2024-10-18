import { Request, Response } from 'express';
import { admin } from '../config/firebaseConfig';
import jwt from 'jsonwebtoken';

export const signup = async (req: Request, res: Response): Promise<void> => {
    const { email, password, firstName, lastName } = req.body;

    try {
        const userRecord = await admin.auth().createUser({
            email,
            password,
            displayName: `${firstName} ${lastName}`,
        });

        await admin.firestore().collection('users').doc(userRecord.uid).set({
            uid: userRecord.uid,
            firstName,
            lastName,
            email,
            createdAt: new Date(),
        });

        res.status(201).json({ message: 'User created successfully', userId: userRecord.uid });
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'An unknown error occurred' });
        }
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    try {
        const userRecord = await admin.auth().getUserByEmail(email);
        const token = jwt.sign({ uid: userRecord.uid }, process.env.JWT_SECRET || 'defaultsecret', {
            expiresIn: '1h',
        });

        res.status(200).json({ message: 'Login successful', token });
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'An unknown error occurred' });
        }
    }
};
