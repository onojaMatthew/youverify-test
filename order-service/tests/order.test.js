import request from 'supertest';
import { appServer } from '../src/server';
import { Order } from '../src/models/order';

let order;
describe('POST /', () => {
  it('it should successfully create a new order', async () => {
    const orderObj = {
      "customerId": "68cb49024ccd38077527b54d", 
      "productId": "68c7e0ac08bbfeb20a9e310a", 
      "quantity": 1, 
      "orderNotes": "Please I cannot take delivery today. Send my item to my address tomorrow"
    }
    const response = await request(appServer)
      .post('/')
      .send(orderObj)
      .expect(201);

    const resp = response.body;
    order = resp.data;
    expect(resp.success).toBe(true);
    expect(resp.message).toContain("Order created successfully");
  });


  it('it should fail with incomplete data', async () => {
    
    const orderObj = {
      "customerId": "68c7d975c54ab3f888058a4e",  
      "quantity": 1, 
      "orderNotes": "Please I cannot take delivery today. Send my item to my address tomorrow"
    }
    const response = await request(appServer)
      .post('/')
      .send(orderObj)
      .expect(400);

    const resp = response.body;
    expect(resp.success).toBe(false);
    expect(resp).toHaveProperty("error");
    expect(resp.error).toContain("Validation Error");
  });
});

describe("GET /", () => {
  it ("should fetch the list of orders", async () => {
    const response = await request(appServer)
      .get(`/?orderStatus=pending&paymentStatus=processing&sortBy=createdAt&sortOrder=desc&page=1&limit=10`)
      .expect(200)

      expect(response.body.success).toBe(true);
  });

  it("should fetch a single order by the provided ID", async () => {
    const response = await request(appServer)
      .get(`/${order._id}`)
      .expect(200)

      expect(response.body.message).toContain("Order fetched successfully");
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty("productId")
  })
})

describe("PATCH /:orderId", () => {
  it("should cancel an order successfull", async () => {
    const response = await request(appServer)
      .patch(`/${order._id}/cancel`)
      .expect(200)

      expect(response.body.success).toBe(true)
  })
})

describe("PUT /:orderId/status", () => {
  it ("should update order status", async () => {
    const body = {
      "orderStatus": "confirmed",
      "paymentStatus": "completed"
    }
    const response = await request(appServer)
      .put(`/${order._id}/status`)
      .send(body)
      .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.message).toContain("Order status updated successfully");
  })
})

afterAll(async () => {
  await Order.deleteMany().exec()
});