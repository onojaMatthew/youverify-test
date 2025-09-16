import request from 'supertest';
import {app} from '../src/app';

describe('POST /api/v1/auth/business/register', () => {
  const customerObj = {
    name: "Moses Agbo", 
    email: "moses@gmail.com", 
    password: "igochemat7@@", 
    businessName: "enyawuson",
    role: "content_manager"
  };

  it('should register a new user', async () => {
    const response = await request(app)
      .post('/api/v1/customers')
      .send(customerObj)
      .expect(201);

    const resp = response.body;
    expect(resp.success).toBe(true);

  
  });

  
});