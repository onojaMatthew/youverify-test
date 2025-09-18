import request from 'supertest';
import { appServer } from '../src/server';
import { Customer } from '../src/models/customer';

let customer;
describe('POST /api/v1/customers', () => {
  it('should register a new user account', async () => {
    const customerObj = {
      "firstName": "Modhi",
      "lastName": "Ajang",
      "email": "modhi.ajang@example.com",
      "phone": "+2349043556329",
      "address": {
        "street": "123 Main St",
        "city": "New York",
        "state": "NY",
        "zipCode": "10001",
        "country": "USA"
      }
    }
    const response = await request(appServer)
      .post('/')
      .send(customerObj)
      .expect(201);

      const resp = response.body;
      customer = resp.data
      console.log(customer, " the customer value")
      expect(resp.success).toBe(true)
      expect(resp.message).toContain("Customer created successfully")
      expect(resp.data).toHaveProperty("email")
    
  });

  it('should failed for an existing user account', async () => {
    const customerObj = {
      "firstName": "Modhi",
      "lastName": "Ajang",
      "email": "modhi.ajang@example.com",
      "phone": "+2349043556329",
      "address": {
        "street": "123 Main St",
        "city": "New York",
        "state": "NY",
        "zipCode": "10001",
        "country": "USA"
      }
    }
    const response = await request(appServer)
      .post('/')
      .send(customerObj)
      .expect(400)
      const resp = response.body;
      expect(resp.success).toBe(false)
      expect(resp.message).toContain("Customer already exists")
      
  });

  it('should failed for incomplete request payload', async () => {
    const customerObj = {
      "firstName": "Modhi",
      "lastName": "Ajang",
      "address": {
        "street": "123 Main St",
        "city": "New York",
        "state": "NY",
        "zipCode": "10001",
        "country": "USA"
      }
    }
    const response = await request(appServer)
      .post('/')
      .send(customerObj)
      .expect(400)
      const resp = response.body;
      expect(resp.success).toBe(false)
      expect(resp.error).toContain("Validation Error");
      
  });
});

describe("GET /", () => {
  it("should search and return user list by first name", async () => {
    const response = await request(appServer)
      .get("/search?firstName=modhisearch?page=1&limit=10")
      .expect(200)

    const resp = response.body;
    expect(resp.success).toBe(true)
    expect(resp.message).toContain("Customers fetched successfully")
    
  });

  it("should fetch user list", async () => {
    const response = await request(appServer)
      .get("/?page=1&limit=10")
      .expect(200)

    const resp = response.body;
    expect(resp.success).toBe(true)
    expect(resp.message).toContain("Customer list fetched successfully")
    
  });

  it("should fetch a single user data", async () => {
    const response = await request(appServer)
      .get(`/${customer._id}`)
      .expect(200)

    const resp = response.body;
    expect(resp.success).toBe(true)
    expect(resp.message).toContain("Customer fetched successfully")
    
  })
});

describe("PUT /customerId", () => {
  it("should update a customer detail", async () => {
    const data = {
      "address": {
        "street": "3030 Sunset Blvd",
        "city": "Miami",
        "state": "FL",
        "zipCode": "33101",
        "country": "USA"
      }
    }

    const response = await request(appServer)
      .put(`/${customer._id}`)
      .send(data)
      .expect(200)

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty("address")
      expect(response.body.message).toContain("Account updated successfully");
  })
})

afterAll(async () => {
  await Customer.deleteMany().exec()
});