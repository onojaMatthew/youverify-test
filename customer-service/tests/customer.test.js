import request from 'supertest';
import { appServer } from '../src/server';

let customer;
describe('POST /api/v1/customers', () => {
  const customerObj = {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe1@example.com",
    "phone": "+2349043556329",
    "address": {
      "street": "123 Main St",
      "city": "New York",
      "state": "NY",
      "zipCode": "10001",
      "country": "USA"
    }
  }

  it('should register a new user', async () => {
    const response = await request(appServer)
      .post('/api/v1/customers')
      .send(customerObj)

      const resp = response.body;
      console.log(resp)
      customer = resp.data
      expect(response.body.success).toBe(true)
    
    // expect(resp.success).toBe(true);
  });

  
});