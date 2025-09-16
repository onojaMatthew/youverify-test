import request from "supertest";
import { app } from "../src/server";


describe('POST /api/v1/products', () => {
  // Test successful product creation
  it('should create a new product with valid data', async () => {
    const product = {
      "name": "iPhone 15 Pro",
      "description": "Latest Apple iPhone with A17 Pro chip and titanium design",
      "price": 999.99,
      "category": "Electronics",
      "brand": "Apple",
      "stock": 50,
      "sku": "APL-IP15P-139",
      "images": [
        { "url": "https://example.com/iphone15pro.jpg" }
      ],
      "specifications": {
        "weight": "187g",
        "dimensions": "159.9 x 76.7 x 8.25 mm",
        "color": "Space Black",
        "material": "Titanium"
      },
      "tags": ["smartphone", "ios", "premium"]
    }

    const response = await request(app)
      .post('/api/v1/products')
      .send(product)

    console.log(response, " the response from product creation")
    
  });

  it('should fetch the list of products', async () => {
    // Try to create user with same email
    const response = await request(app)
      .get('/api/v1/products/search?searchTerm=apple&category=electronics&brand=apple&minPrice=100&maxPrice=1000page=1&limit=10')
      .expect(200);

    console.log(response.body)
    expect(response.body).toHaveProperty('data');
    expect(response.body.message).toContain('Request processed successfully');
  });

  it('should respond to base URL', async () => {
    const response = await request(app)
      .get('/health')
      .expect(200); // This is expected since we don't have a root route
    
    console.log('Base URL response:', response.status);
  });

  it("should fetch a single product", async () => {
    const response = await request(app)
      .get(`/api/v1/products/68c7e0ac08bbfeb20a9e310a`)
      .expect(200)
  })

  it("should fetch check available product", async () => {
    const response = await request(app)
      .get("/api/v1/products/68c7e0ac08bbfeb20a9e310a/available")
      .expect(200)

      expect(response.body.data).toHaveProperty("name");
      expect(response.body.data).toEqual(expect.objectContaining({
        stock: expect.any(Number)
      }));
  })
});

// Optional: Cleanup after tests



 // Verify response structure and data
    // expect(response.body).toHaveProperty('id');
    // expect(response.body).toHaveProperty('createdAt');
    // expect(response.body.name).toBe(userData.name);
    // expect(response.body.email).toBe(userData.email);
    // expect(response.body.age).toBe(userData.age);

    
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