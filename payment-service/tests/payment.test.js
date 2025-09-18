import request from 'supertest';
import { appServer } from '../src/server';
import { Payment } from '../src/models/payment';

describe('POST /initiate', () => {
  it('should register a new user account', async () => {
    const data = {
        "customerId": "68c7d975c54ab3f888058a4e",
        "orderReferenceId": "ORD-MFL72ES3-48KUN",
        "productId": "68c7e0ac08bbfeb20a9e310a",
        "amount": 999.99
    }

    const response = await request(appServer)
      .post('/initiate')
      .send(data)
      .expect(200);

      const resp = response.body;
      expect(resp.success).toBe(true)
      expect(resp.message).toContain("Payment processed successfully")
    
  });

 
});

afterAll(async () => {
  // await Payment.deleteMany().exec()
});