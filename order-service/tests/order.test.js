import request from 'supertest';
import app from '../src/app';

describe('POST /api/v1/auth/business/register', () => {
  const userObj = {
    "customerId": "68c7d975c54ab3f888058a4e", 
    "productId": "68c7e0ac08bbfeb20a9e310a", 
    "quantity": 1, 
    "orderNotes": "Please I cannot take delivery today. Send my item to my address tomorrow"
  }

  it('it should successfully create a new order', async () => {
    const response = await request(app)
      .post('/')
      .send(userObj)
      .expect(201);

    const resp = response.body;
    expect(resp.success).toBe(true);

  
  });

  
});