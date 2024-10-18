import { Request, Response } from 'express';
import { admin } from '../config/firebaseConfig';

export const getUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const usersSnapshot = await admin.firestore().collection('users').get();
        const users = usersSnapshot.docs.map(doc => doc.data());

        res.status(200).json(users);
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'An unknown error occurred' });
        }
    }
};

export const getUserDetails = async (req: Request, res: Response): Promise<void> => {
    const userId = req.params.id;

    try {
        const userDoc = await admin.firestore().collection('users').doc(userId).get();
        if (!userDoc.exists) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        res.status(200).json(userDoc.data());
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'An unknown error occurred' });
        }
    }
};
