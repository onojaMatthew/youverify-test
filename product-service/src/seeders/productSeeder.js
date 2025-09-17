import { Logger } from '../config/logger';
import { Product } from '../models/product';

const sampleProducts = [
  {
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
  },
  {
    name: 'Dell XPS 13',
    description: 'Sleek and powerful ultrabook with InfinityEdge display',
    price: 1299.99,
    category: 'Computers',
    brand: 'Dell',
    stock: 35,
    sku: 'DEL-XPS13-9320',
    images: [
      { url: 'https://example.com/dellxps13.jpg', alt: 'Dell XPS 13' }
    ],
    specifications: {
      weight: '1.27kg',
      dimensions: '295.7 x 199.1 x 15.3 mm',
      color: 'Platinum Silver',
      material: 'Aluminum/Carbon Fiber'
    },
    tags: ['ultrabook', 'windows', 'slim']
  },
  {
    name: 'Canon EOS R6 Mark II',
    description: 'Versatile full-frame mirrorless camera for photo and video',
    price: 2499.99,
    category: 'Photography',
    brand: 'Canon',
    stock: 18,
    sku: 'CAN-EOSR6M2-BDY',
    images: [
      { url: 'https://example.com/canonr6ii.jpg', alt: 'Canon EOS R6 Mark II' }
    ],
    specifications: {
      weight: '670g',
      dimensions: '138.4 x 98.4 x 88.4 mm',
      color: 'Black',
      material: 'Magnesium Alloy'
    },
    tags: ['camera', 'mirrorless', 'full-frame']
  },
  {
    name: 'Kindle Paperwhite',
    description: 'Waterproof e-reader with a high-resolution glare-free display',
    price: 149.99,
    category: 'Books & Readers',
    brand: 'Amazon',
    stock: 200,
    sku: 'AMZ-KPW11-BLK-8GB',
    images: [
      { url: 'https://example.com/kindlepw.jpg', alt: 'Kindle Paperwhite' }
    ],
    specifications: {
      weight: '205g',
      dimensions: '174 x 125 x 8.1 mm',
      color: 'Black',
      material: 'Plastic'
    },
    tags: ['ereader', 'ebooks', 'amazon']
  },
  {
    name: 'PlayStation 5',
    description: 'Next-generation gaming console with ultra-high speed SSD',
    price: 499.99,
    category: 'Gaming',
    brand: 'Sony',
    stock: 15,
    sku: 'SNY-PS5-DISC',
    images: [
      { url: 'https://example.com/ps5.jpg', alt: 'PlayStation 5' }
    ],
    specifications: {
      weight: '4.5kg',
      dimensions: '390 x 260 x 104 mm',
      color: 'White & Black',
      material: 'Plastic'
    },
    tags: ['gaming', 'console', '4k']
  },
  {
    name: 'Apple Watch Series 9',
    description: 'Advanced smartwatch with new S9 SiP and Double Tap gesture',
    price: 429.99,
    category: 'Wearables',
    brand: 'Apple',
    stock: 80,
    sku: 'APL-AW9-45MM-AL',
    images: [
      { url: 'https://example.com/applewatch9.jpg', alt: 'Apple Watch Series 9' }
    ],
    specifications: {
      weight: '51.5g',
      dimensions: '45 x 38 x 10.7 mm',
      color: 'Aluminum Midnight',
      material: 'Aluminum'
    },
    tags: ['smartwatch', 'fitness', 'health']
  }
];

export const seedProducts = async () => {
  try {
    const existingCount = await Product.countDocuments();
    
    if (existingCount === 0) {
      await Product.insertMany(sampleProducts);
      Logger.log({ level: "info", message: "Sample products seeded successfully" });
    } else {
      Logger.log({ level: "info", message: 'Products already exist, skipping seeding'});
    }
  } catch (err) {
    Logger.log({ level: "error", message: `Error seeding products. Error: ${err.message}` });
  }
};