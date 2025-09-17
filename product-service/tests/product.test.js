import request from "supertest";
import { app } from "../src/server";
import { Product } from "../src/models/product";

let productObj;

describe('POST /', () => {
  // Test successful product creation
  it('should create a new product with valid data', async () => {
    const product = {
      "name": "iPhone 15 Pro",
      "description": "Latest Apple iPhone with A17 Pro chip and titanium design",
      "price": 999.99,
      "category": "Electronics",
      "brand": "Apple",
      "stock": 50,
      "sku": "APL-IP15P-149",
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
      .post('/')
      .send(product)
      .expect(201)
      const result = response.body;
      productObj = result.data;
  });

  it ("should fail with inadiquate data", async () => {
    const product = {
      "name": "iPhone 15 Pro",
      "description": "Latest Apple iPhone with A17 Pro chip and titanium design",
      "stock": 50,
      "sku": "APL-IP15P-150",
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
      .post("/")
      .send(product)
      .expect(400)

      expect(response.body.success).toBe(false)

  })
});

describe("GET /", () => {
  it('should fetch the list of products', async () => {
    // Try to create user with same email
    const response = await request(app)
      .get(`/search?searchTerm=${productObj.brand}&category=${productObj.category}&brand=${productObj.brand}&minPrice=100&maxPrice=1000page=1&limit=10`)
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
      .get(`/${productObj._id}`)
      .expect(200)

      expect(response.body.data).toHaveProperty("name")
  })

  it("should check available product", async () => {
    const response = await request(app)
      .get(`/${productObj._id}/available`)
      .expect(200)

      expect(response.body.data).toHaveProperty("name");
      expect(response.body.data).toEqual(expect.objectContaining({
        stock: expect.any(Number)
      }));
  })
})

describe("PUT /:productId/update", () => {
  it ("should update product data", async () => {
    const product = {
      "name": "iPhone 15 Pro",
      "description": "Latest Apple iPhone with A15 Pro chip and titanium design",
      "images": [
        { "url": "https://example.com/iphone15pro.jpg" }
      ],
      
    }
    const response = await request(app)
      .put(`/${productObj._id}/update`)
      .send(product)
      .expect(200);

      expect(response.body.message).toContain("Product updated")
      expect(response.body.success).toBe(true)
  })
})

afterAll(async () => {
  await Product.deleteMany({}).exec();
});