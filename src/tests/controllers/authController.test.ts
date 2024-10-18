import * as admin from 'firebase-admin';
import { initializeApp, applicationDefault } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import request from 'supertest';
import app from '../../app';

let db: FirebaseFirestore.Firestore;

if (!admin.apps.length) {
  initializeApp({
    credential: applicationDefault(),
  });
}

db = getFirestore();

describe('User API', () => {
  let testUserId: string;

  const testData = {
    email: 'test@test.com',
    password: 'qwerty',
    firstName: 'Test',
    lastName: 'User',
    test: true,
  };

  async function cleanupTestData() {
    if (testUserId) {
      await admin.auth().deleteUser(testUserId);
      await db.collection('users').doc(testUserId).delete();
    }
  }

  afterAll(async () => {
    await cleanupTestData();
  });

  it('should sign up a user', async () => {
    const response = await request(app)
      .post('/api/auth/signup')
      .send(testData);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('userId');
    testUserId = response.body.userId;
  });

  it('should log in a user', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: testData.email, password: testData.password });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  });
});
