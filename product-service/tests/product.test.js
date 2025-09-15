import request from "supertest";
import { appServer } from "../src/server";

let products;

beforeEach(() => {

});

describe('POST /api/v1/products', () => {
  // Test successful user creation
  it('should create a new user with valid data', async () => {
    const product = {
      name: 'iPhone 15 Pro',
      description: 'Latest Apple iPhone with A17 Pro chip and titanium design',
      price: 999.99,
      category: 'Electronics',
      brand: 'Apple',
      stock: 50,
      sku: 'APL-IP15P-128',
      images: [
        { url: 'https://example.com/iphone15pro.jpg', alt: 'iPhone 15 Pro' }
      ],
      specifications: {
        weight: '187g',
        dimensions: '159.9 x 76.7 x 8.25 mm',
        color: 'Space Black',
        material: 'Titanium'
      },
      tags: ['smartphone', 'ios', 'premium']
    }

    const response = await request(appServer)
      .post('/api/v1/products/')
      .send(product)
      .expect(201);

    console.log(response.body)
    // Verify response structure and data
    // expect(response.body).toHaveProperty('id');
    // expect(response.body).toHaveProperty('createdAt');
    // expect(response.body.name).toBe(userData.name);
    // expect(response.body.email).toBe(userData.email);
    // expect(response.body.age).toBe(userData.age);
  });

  it('should fetch the list of products', async () => {
  

    // Try to create user with same email
    const response = await request(appServer)
      .get('/api/users')
      .expect(200);

    console.log(response.body)
    // expect(response.body).toHaveProperty('error');
    // expect(response.body.error).toContain('already exists');
  });

  // // Test missing required fields
  // it('should return 400 when required fields are missing', async () => {
  //   const invalidData = {
  //     age: 25
  //     // Missing name and email
  //   };

  //   const response = await request(app)
  //     .post('/api/users')
  //     .send(invalidData)
  //     .expect(400);

  //   expect(response.body).toHaveProperty('error');
  //   expect(response.body.error).toContain('required');
  // });

  // // Test duplicate email
  // it('should return 409 when email already exists', async () => {
  //   const userData = {
  //     name: 'Jane Smith',
  //     email: 'jane.smith@example.com',
  //     age: 28
  //   };

  //   // Create first user
  //   await request(app).post('/api/users').send(userData);

  //   // Try to create user with same email
  //   const response = await request(app)
  //     .post('/api/users')
  //     .send(userData)
  //     .expect(409);

  //   expect(response.body).toHaveProperty('error');
  //   expect(response.body.error).toContain('already exists');
  // });

  // // Test with optional field missing
  // it('should create user without optional age field', async () => {
  //   const userData = {
  //     name: 'Bob Wilson',
  //     email: 'bob.wilson@example.com'
  //     // No age provided
  //   };

  //   const response = await request(app)
  //     .post('/api/users')
  //     .send(userData)
  //     .expect(201);

  //   expect(response.body.name).toBe(userData.name);
  //   expect(response.body.email).toBe(userData.email);
  //   expect(response.body.age).toBeNull();
  // });

  // // Test with invalid data types
  // it('should handle invalid data types gracefully', async () => {
  //   const invalidData = {
  //     name: 12345, // Number instead of string
  //     email: 'test@example.com',
  //     age: 'thirty' // String instead of number
  //   };

  //   const response = await request(app)
  //     .post('/api/users')
  //     .send(invalidData)
  //     .expect(201); // Your API might handle this differently

  //   // The behavior depends on your API implementation
  //   // You might want to add validation to return 400 for invalid types
  // });
});

// Optional: Cleanup after tests
afterAll(async () => {
  // Close any open connections or cleanup
});