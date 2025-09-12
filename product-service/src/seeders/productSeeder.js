import { Logger } from '../config/logger';
import { Product } from '../models/product';

const sampleProducts = [
  {
    productId: 'PROD-001',
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
  },
  {
    productId: 'PROD-002',
    name: 'Samsung Galaxy S24',
    description: 'High-performance Android smartphone with AI features',
    price: 849.99,
    category: 'Electronics',
    brand: 'Samsung',
    stock: 75,
    sku: 'SAM-GS24-256',
    images: [
      { url: 'https://example.com/galaxys24.jpg', alt: 'Galaxy S24' }
    ],
    specifications: {
      weight: '168g',
      dimensions: '158.5 x 75.9 x 7.7 mm',
      color: 'Phantom Black',
      material: 'Aluminum'
    },
    tags: ['smartphone', 'android', 'ai']
  },
  {
    productId: 'PROD-003',
    name: 'MacBook Pro 14"',
    description: 'Professional laptop with M3 Pro chip for demanding tasks',
    price: 1999.99,
    category: 'Computers',
    brand: 'Apple',
    stock: 25,
    sku: 'APL-MBP14-512',
    images: [
      { url: 'https://example.com/macbookpro14.jpg', alt: 'MacBook Pro 14' }
    ],
    specifications: {
      weight: '1.6kg',
      dimensions: '312.6 x 221.2 x 15.5 mm',
      color: 'Space Gray',
      material: 'Aluminum'
    },
    tags: ['laptop', 'professional', 'macos']
  },
  {
    productId: 'PROD-004',
    name: 'Sony WH-1000XM5',
    description: 'Premium wireless noise-canceling headphones',
    price: 399.99,
    category: 'Audio',
    brand: 'Sony',
    stock: 100,
    sku: 'SNY-WH1000XM5-BLK',
    images: [
      { url: 'https://example.com/sonywh1000xm5.jpg', alt: 'Sony WH-1000XM5' }
    ],
    specifications: {
      weight: '250g',
      dimensions: '254 x 220 mm',
      color: 'Black',
      material: 'Plastic/Metal'
    },
    tags: ['headphones', 'wireless', 'noise-canceling']
  },
  {
    productId: 'PROD-005',
    name: 'Nintendo Switch OLED',
    description: 'Hybrid gaming console with vibrant OLED display',
    price: 349.99,
    category: 'Gaming',
    brand: 'Nintendo',
    stock: 40,
    sku: 'NIN-SW-OLED-WHT',
    images: [
      { url: 'https://example.com/switch-oled.jpg', alt: 'Nintendo Switch OLED' }
    ],
    specifications: {
      weight: '421g',
      dimensions: '242 x 103.5 x 13.9 mm',
      color: 'White',
      material: 'Plastic'
    },
    tags: ['gaming', 'console', 'portable']
  }
];

const seedProducts = async () => {
  try {
    const existingCount = await Product.countDocuments();
    
    if (existingCount === 0) {
      await Product.insertMany(sampleProducts);
      Logger.log({ level: "error", message: 'Sample products seeded successfully' });
    } else {
      Logger.info({ level: "error", message: 'Products already exist, skipping seeding' });
    }
  } catch (err) {
    Logger.log({ level: "error", message: `Error seeding products: ${err.message}`});
  }
};

exports = { seedProducts };