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
  let token: string;

  const testData = {
    email: 'testuser@test.com',
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

  beforeAll(async () => {
    const user = await admin.auth().createUser({
      email: testData.email,
      password: testData.password,
      displayName: `${testData.firstName} ${testData.lastName}`,
    });
    testUserId = user.uid;

    await db.collection('users').doc(testUserId).set({
      firstName: testData.firstName,
      lastName: testData.lastName,
      email: testData.email,
      test: true,
    });

    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: testData.email, password: testData.password });

    token = response.body.token;
    expect(response.status).toBe(200);
    expect(token).toBeDefined();
  });

  afterAll(async () => {
    await cleanupTestData();
  });

  it('should get all users', async () => {
    const response = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('should get user details', async () => {
    const response = await request(app)
      .get(`/api/users/${testUserId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('firstName', testData.firstName);
    expect(response.body).toHaveProperty('lastName', testData.lastName);
  });
});
