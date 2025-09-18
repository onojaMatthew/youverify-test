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
    images: [{ url: 'https://example.com/iphone15pro.jpg', alt: 'iPhone 15 Pro' }],
    specifications: { weight: '187g', dimensions: '159.9 x 76.7 x 8.25 mm', color: 'Space Black', material: 'Titanium' },
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
    images: [{ url: 'https://example.com/galaxys24.jpg', alt: 'Galaxy S24' }],
    specifications: { weight: '168g', dimensions: '158.5 x 75.9 x 7.7 mm', color: 'Phantom Black', material: 'Aluminum' },
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
    images: [{ url: 'https://example.com/macbookpro14.jpg', alt: 'MacBook Pro 14' }],
    specifications: { weight: '1.6kg', dimensions: '312.6 x 221.2 x 15.5 mm', color: 'Space Gray', material: 'Aluminum' },
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
    images: [{ url: 'https://example.com/sonywh1000xm5.jpg', alt: 'Sony WH-1000XM5' }],
    specifications: { weight: '250g', dimensions: '254 x 220 mm', color: 'Black', material: 'Plastic/Metal' },
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
    images: [{ url: 'https://example.com/switch-oled.jpg', alt: 'Nintendo Switch OLED' }],
    specifications: { weight: '421g', dimensions: '242 x 103.5 x 13.9 mm', color: 'White', material: 'Plastic' },
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
    images: [{ url: 'https://example.com/dellxps13.jpg', alt: 'Dell XPS 13' }],
    specifications: { weight: '1.27kg', dimensions: '295.7 x 199.1 x 15.3 mm', color: 'Platinum Silver', material: 'Aluminum/Carbon Fiber' },
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
    images: [{ url: 'https://example.com/canonr6ii.jpg', alt: 'Canon EOS R6 Mark II' }],
    specifications: { weight: '670g', dimensions: '138.4 x 98.4 x 88.4 mm', color: 'Black', material: 'Magnesium Alloy' },
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
    images: [{ url: 'https://example.com/kindlepw.jpg', alt: 'Kindle Paperwhite' }],
    specifications: { weight: '205g', dimensions: '174 x 125 x 8.1 mm', color: 'Black', material: 'Plastic' },
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
    images: [{ url: 'https://example.com/ps5.jpg', alt: 'PlayStation 5' }],
    specifications: { weight: '4.5kg', dimensions: '390 x 260 x 104 mm', color: 'White & Black', material: 'Plastic' },
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
    images: [{ url: 'https://example.com/applewatch9.jpg', alt: 'Apple Watch Series 9' }],
    specifications: { weight: '51.5g', dimensions: '45 x 38 x 10.7 mm', color: 'Aluminum Midnight', material: 'Aluminum' },
    tags: ['smartwatch', 'fitness', 'health']
  },
  {
    name: 'Google Pixel 8 Pro',
    description: 'Google flagship Android with Tensor G3 AI-powered chip',
    price: 899.99,
    category: 'Electronics',
    brand: 'Google',
    stock: 60,
    sku: 'GOO-PXL8P-128',
    images: [{ url: 'https://example.com/pixel8pro.jpg', alt: 'Google Pixel 8 Pro' }],
    specifications: { weight: '213g', dimensions: '162.6 x 76.5 x 8.9 mm', color: 'Obsidian', material: 'Aluminum/Glass' },
    tags: ['smartphone', 'android', 'ai']
  },
  {
    name: 'Asus ROG Zephyrus G14',
    description: 'High-performance gaming laptop with Ryzen 9 CPU and RTX GPU',
    price: 1799.99,
    category: 'Computers',
    brand: 'Asus',
    stock: 20,
    sku: 'ASU-ROGZ14-RTX',
    images: [{ url: 'https://example.com/rogzephyrus.jpg', alt: 'Asus ROG Zephyrus G14' }],
    specifications: { weight: '1.7kg', dimensions: '324 x 222 x 19.9 mm', color: 'Eclipse Gray', material: 'Aluminum' },
    tags: ['gaming', 'laptop', 'windows']
  },
  {
    name: 'Bose QuietComfort 45',
    description: 'Wireless over-ear headphones with noise cancellation',
    price: 329.99,
    category: 'Audio',
    brand: 'Bose',
    stock: 120,
    sku: 'BOS-QC45-BLK',
    images: [{ url: 'https://example.com/boseqc45.jpg', alt: 'Bose QC45' }],
    specifications: { weight: '240g', dimensions: '180 x 170 x 81 mm', color: 'Black', material: 'Plastic/Metal' },
    tags: ['headphones', 'wireless', 'noise-canceling']
  },
  {
    name: 'Fitbit Charge 6',
    description: 'Advanced fitness tracker with Google AI integration',
    price: 179.99,
    category: 'Wearables',
    brand: 'Fitbit',
    stock: 150,
    sku: 'FIT-CHG6-BLK',
    images: [{ url: 'https://example.com/fitbitcharge6.jpg', alt: 'Fitbit Charge 6' }],
    specifications: { weight: '29g', dimensions: '36 x 18 x 11 mm', color: 'Graphite', material: 'Silicone/Aluminum' },
    tags: ['fitness', 'tracker', 'wearable']
  },
  {
    name: 'Microsoft Surface Pro 9',
    description: '2-in-1 laptop and tablet with powerful Intel processor',
    price: 1599.99,
    category: 'Computers',
    brand: 'Microsoft',
    stock: 28,
    sku: 'MSF-SP9-I7-512',
    images: [{ url: 'https://example.com/surfacepro9.jpg', alt: 'Surface Pro 9' }],
    specifications: { weight: '879g', dimensions: '287 x 209 x 9.3 mm', color: 'Platinum', material: 'Magnesium' },
    tags: ['tablet', 'laptop', 'windows']
  },
  {
    name: 'DJI Mini 4 Pro',
    description: 'Lightweight drone with 4K HDR video and omnidirectional sensors',
    price: 759.99,
    category: 'Drones',
    brand: 'DJI',
    stock: 45,
    sku: 'DJI-MINI4PRO',
    images: [{ url: 'https://example.com/djimini4pro.jpg', alt: 'DJI Mini 4 Pro' }],
    specifications: { weight: '249g', dimensions: '148 x 94 x 64 mm (folded)', color: 'Gray', material: 'Plastic/Metal' },
    tags: ['drone', 'camera', 'aerial']
  },
  {
    name: 'Logitech MX Master 3S',
    description: 'Ergonomic wireless mouse with MagSpeed scrolling',
    price: 99.99,
    category: 'Accessories',
    brand: 'Logitech',
    stock: 200,
    sku: 'LOG-MXM3S-GRY',
    images: [{ url: 'https://example.com/mxmaster3s.jpg', alt: 'Logitech MX Master 3S' }],
    specifications: { weight: '141g', dimensions: '124.9 x 84.3 x 51 mm', color: 'Graphite', material: 'Plastic' },
    tags: ['mouse', 'wireless', 'ergonomic']
  },
  {
    name: 'Razer Huntsman V2',
    description: 'Optical gaming keyboard with ultra-low latency',
    price: 199.99,
    category: 'Gaming',
    brand: 'Razer',
    stock: 90,
    sku: 'RAZ-HNTV2-BLK',
    images: [{ url: 'https://example.com/razerhuntsmanv2.jpg', alt: 'Razer Huntsman V2' }],
    specifications: { weight: '900g', dimensions: '444 x 140 x 37 mm', color: 'Black', material: 'Plastic/Metal' },
    tags: ['keyboard', 'gaming', 'rgb']
  },
  {
    name: 'HP Envy 16',
    description: 'Creative performance laptop with NVIDIA RTX graphics',
    price: 1699.99,
    category: 'Computers',
    brand: 'HP',
    stock: 22,
    sku: 'HP-ENVY16-RTX',
    images: [{ url: 'https://example.com/hpenvy16.jpg', alt: 'HP Envy 16' }],
    specifications: { weight: '2.1kg', dimensions: '357 x 252 x 19.9 mm', color: 'Silver', material: 'Aluminum' },
    tags: ['laptop', 'creative', 'windows']
  },
  {
    name: 'Logitech MX Master 3S',
    description: 'Advanced ergonomic wireless mouse with MagSpeed scroll wheel',
    price: 99.99,
    category: 'Accessories',
    brand: 'Logitech',
    stock: 150,
    sku: 'LOG-MX3S-GRY',
    images: [
      { url: 'https://example.com/mxmaster3s.jpg', alt: 'Logitech MX Master 3S' }
    ],
    specifications: {
      weight: '141g',
      dimensions: '124.9 x 84.3 x 51 mm',
      color: 'Graphite',
      material: 'Plastic'
    },
    tags: ['mouse', 'wireless', 'ergonomic']
  },
  {
    name: 'GoPro HERO12 Black',
    description: 'Action camera with 5.3K video, waterproof, and HyperSmooth stabilization',
    price: 449.99,
    category: 'Photography',
    brand: 'GoPro',
    stock: 60,
    sku: 'GPR-H12-BLK',
    images: [
      { url: 'https://example.com/goprohero12.jpg', alt: 'GoPro HERO12 Black' }
    ],
    specifications: {
      weight: '154g',
      dimensions: '71.8 x 50.8 x 33.6 mm',
      color: 'Black',
      material: 'Plastic'
    },
    tags: ['action-camera', 'video', 'outdoor']
  },
  {
    name: 'Bose QuietComfort Ultra',
    description: 'Premium wireless headphones with adaptive noise cancellation',
    price: 429.99,
    category: 'Audio',
    brand: 'Bose',
    stock: 90,
    sku: 'BSE-QCULTRA-BLK',
    images: [
      { url: 'https://example.com/boseqc-ultra.jpg', alt: 'Bose QuietComfort Ultra' }
    ],
    specifications: {
      weight: '254g',
      dimensions: '180 x 170 x 81 mm',
      color: 'Black',
      material: 'Plastic/Metal'
    },
    tags: ['headphones', 'wireless', 'noise-canceling']
  },
  {
    name: 'Surface Pro 9',
    description: '2-in-1 tablet and laptop powered by Intel Core i7',
    price: 1599.99,
    category: 'Computers',
    brand: 'Microsoft',
    stock: 40,
    sku: 'MS-SFPRO9-I7',
    images: [
      { url: 'https://example.com/surfacepro9.jpg', alt: 'Surface Pro 9' }
    ],
    specifications: {
      weight: '879g',
      dimensions: '287 x 209 x 9.3 mm',
      color: 'Platinum',
      material: 'Magnesium'
    },
    tags: ['tablet', '2-in-1', 'windows']
  },
  {
    name: 'Fitbit Charge 6',
    description: 'Health & fitness tracker with heart rate and Google Maps integration',
    price: 159.99,
    category: 'Wearables',
    brand: 'Fitbit',
    stock: 130,
    sku: 'FB-CHG6-BLK',
    images: [
      { url: 'https://example.com/fitbitcharge6.jpg', alt: 'Fitbit Charge 6' }
    ],
    specifications: {
      weight: '36g',
      dimensions: '38.7 x 18.5 x 11.8 mm',
      color: 'Black',
      material: 'Silicone/Aluminum'
    },
    tags: ['fitness', 'health', 'tracker']
  },
  {
    name: 'Razer Blade 16',
    description: 'High-performance gaming laptop with RTX 4080 GPU',
    price: 2999.99,
    category: 'Computers',
    brand: 'Razer',
    stock: 20,
    sku: 'RAZ-BLD16-4080',
    images: [
      { url: 'https://example.com/razerblade16.jpg', alt: 'Razer Blade 16' }
    ],
    specifications: {
      weight: '2.45kg',
      dimensions: '355 x 244 x 22 mm',
      color: 'Black',
      material: 'Aluminum'
    },
    tags: ['gaming', 'laptop', 'windows']
  },
  {
    name: 'DJI Mini 4 Pro',
    description: 'Compact drone with 4K HDR video and omnidirectional obstacle sensing',
    price: 999.99,
    category: 'Drones',
    brand: 'DJI',
    stock: 45,
    sku: 'DJI-MINI4PRO',
    images: [
      { url: 'https://example.com/djimini4pro.jpg', alt: 'DJI Mini 4 Pro' }
    ],
    specifications: {
      weight: '249g',
      dimensions: '148 x 94 x 64 mm (folded)',
      color: 'Gray',
      material: 'Plastic'
    },
    tags: ['drone', '4k-video', 'portable']
  },
  {
    name: 'Apple AirPods Pro 2',
    description: 'Wireless earbuds with active noise cancellation and MagSafe charging',
    price: 249.99,
    category: 'Audio',
    brand: 'Apple',
    stock: 200,
    sku: 'APL-APPRO2',
    images: [
      { url: 'https://example.com/airpodspro2.jpg', alt: 'AirPods Pro 2' }
    ],
    specifications: {
      weight: '5.3g (earbud)',
      dimensions: '30.9 x 21.8 x 24 mm',
      color: 'White',
      material: 'Plastic'
    },
    tags: ['earbuds', 'wireless', 'noise-canceling']
  },
  {
    name: 'Samsung Galaxy Tab S9 Ultra',
    description: 'Premium Android tablet with 14.6-inch AMOLED display',
    price: 1199.99,
    category: 'Tablets',
    brand: 'Samsung',
    stock: 55,
    sku: 'SAM-TABS9U-512',
    images: [
      { url: 'https://example.com/galaxytabs9ultra.jpg', alt: 'Galaxy Tab S9 Ultra' }
    ],
    specifications: {
      weight: '737g',
      dimensions: '326.4 x 208.6 x 5.5 mm',
      color: 'Graphite',
      material: 'Aluminum'
    },
    tags: ['tablet', 'android', 'premium']
  },
  {
    name: 'Nikon Z8',
    description: 'Professional mirrorless camera with 45.7MP sensor and 8K video',
    price: 3999.99,
    category: 'Photography',
    brand: 'Nikon',
    stock: 12,
    sku: 'NIK-Z8-BODY',
    images: [
      { url: 'https://example.com/nikonz8.jpg', alt: 'Nikon Z8' }
    ],
    specifications: {
      weight: '910g',
      dimensions: '144 x 118.5 x 83 mm',
      color: 'Black',
      material: 'Magnesium Alloy'
    },
    tags: ['camera', 'mirrorless', 'professional']
  },
  {
    name: 'Oculus Quest 3',
    description: 'Standalone VR headset with next-gen graphics and comfort',
    price: 499.99,
    category: 'Gaming',
    brand: 'Meta',
    stock: 70,
    sku: 'META-QUEST3-128',
    images: [
      { url: 'https://example.com/oculusquest3.jpg', alt: 'Oculus Quest 3' }
    ],
    specifications: {
      weight: '510g',
      dimensions: '184 x 160 x 98 mm',
      color: 'White',
      material: 'Plastic/Fabric'
    },
    tags: ['vr', 'gaming', 'meta']
  },
  {
    name: 'ASUS ROG Ally',
    description: 'Handheld gaming PC with Ryzen Z1 Extreme processor',
    price: 699.99,
    category: 'Gaming',
    brand: 'ASUS',
    stock: 35,
    sku: 'ASUS-ROG-ALLY',
    images: [
      { url: 'https://example.com/rogally.jpg', alt: 'ASUS ROG Ally' }
    ],
    specifications: {
      weight: '608g',
      dimensions: '280 x 111 x 21 mm',
      color: 'White',
      material: 'Plastic'
    },
    tags: ['handheld', 'gaming', 'windows']
  },
  {
    name: 'HP Spectre x360 14',
    description: 'Convertible laptop with OLED display and long battery life',
    price: 1599.99,
    category: 'Computers',
    brand: 'HP',
    stock: 40,
    sku: 'HP-SPX360-14',
    images: [
      { url: 'https://example.com/hpspectrex360.jpg', alt: 'HP Spectre x360 14' }
    ],
    specifications: {
      weight: '1.34kg',
      dimensions: '298 x 220 x 16.9 mm',
      color: 'Nightfall Black',
      material: 'Aluminum'
    },
    tags: ['laptop', 'convertible', 'windows']
  },
  {
    name: 'Sony A80L OLED TV',
    description: '4K HDR OLED TV with Google TV and Dolby Vision',
    price: 1799.99,
    category: 'Home Entertainment',
    brand: 'Sony',
    stock: 25,
    sku: 'SNY-A80L-55',
    images: [
      { url: 'https://example.com/sonya80l.jpg', alt: 'Sony A80L OLED TV' }
    ],
    specifications: {
      weight: '18.6kg',
      dimensions: '1227 x 710 x 53 mm',
      color: 'Black',
      material: 'Aluminum/Glass'
    },
    tags: ['tv', 'oled', 'home']
  },
  {
    name: 'JBL Charge 5',
    description: 'Portable waterproof Bluetooth speaker with deep bass',
    price: 179.99,
    category: 'Audio',
    brand: 'JBL',
    stock: 140,
    sku: 'JBL-CHG5-BLK',
    images: [
      { url: 'https://example.com/jblcharge5.jpg', alt: 'JBL Charge 5' }
    ],
    specifications: {
      weight: '960g',
      dimensions: '223 x 96.5 x 94 mm',
      color: 'Black',
      material: 'Plastic/Fabric'
    },
    tags: ['speaker', 'portable', 'bluetooth']
  },
  {
    name: 'Garmin Fenix 7',
    description: 'Rugged GPS smartwatch with solar charging and health tracking',
    price: 699.99,
    category: 'Wearables',
    brand: 'Garmin',
    stock: 50,
    sku: 'GAR-FNX7-SOLAR',
    images: [
      { url: 'https://example.com/garminfenix7.jpg', alt: 'Garmin Fenix 7' }
    ],
    specifications: {
      weight: '79g',
      dimensions: '47 x 47 x 14.5 mm',
      color: 'Slate Gray',
      material: 'Fiber-reinforced polymer'
    },
    tags: ['watch', 'gps', 'fitness']
  },
  {
    name: 'Anker PowerCore 20000',
    description: 'High-capacity portable charger with fast charging support',
    price: 59.99,
    category: 'Accessories',
    brand: 'Anker',
    stock: 300,
    sku: 'ANK-PWR20000-BLK',
    images: [
      { url: 'https://example.com/ankerpowercore.jpg', alt: 'Anker PowerCore 20000' }
    ],
    specifications: {
      weight: '343g',
      dimensions: '166 x 60 x 22 mm',
      color: 'Black',
      material: 'Plastic'
    },
    tags: ['powerbank', 'charging', 'portable']
  },
  {
    name: 'Philips Hue Starter Kit',
    description: 'Smart lighting system with 3 bulbs and a Hue Bridge',
    price: 199.99,
    category: 'Smart Home',
    brand: 'Philips',
    stock: 100,
    sku: 'PHL-HUEKIT-3PK',
    images: [
      { url: 'https://example.com/philipshue.jpg', alt: 'Philips Hue Starter Kit' }
    ],
    specifications: {
      weight: '120g (per bulb)',
      dimensions: '60 x 110 mm (bulb)',
      color: 'White & Color Ambiance',
      material: 'Glass/Plastic'
    },
    tags: ['smart-light', 'iot', 'home']
  },
  {
    name: 'Ecovacs Deebot X1 Omni',
    description: 'Robot vacuum and mop with self-emptying and AI-powered navigation',
    price: 1499.99,
    category: 'Home Appliances',
    brand: 'Ecovacs',
    stock: 20,
    sku: 'ECO-DEEBX1',
    images: [
      { url: 'https://example.com/deebotx1.jpg', alt: 'Ecovacs Deebot X1 Omni' }
    ],
    specifications: {
      weight: '4.4kg',
      dimensions: '362 x 362 x 103.5 mm',
      color: 'Black',
      material: 'Plastic'
    },
    tags: ['robot-vacuum', 'smart-home', 'cleaning']
  },
  {
    name: 'Instant Pot Duo Evo Plus',
    description: '10-in-1 multi-use pressure cooker with 48 presets',
    price: 149.99,
    category: 'Kitchen',
    brand: 'Instant Brands',
    stock: 90,
    sku: 'IP-DUOEVOPLUS-60',
    images: [
      { url: 'https://example.com/instantpot.jpg', alt: 'Instant Pot Duo Evo Plus' }
    ],
    specifications: {
      weight: '5.4kg',
      dimensions: '330 x 315 x 365 mm',
      color: 'Stainless Steel',
      material: 'Steel/Plastic'
    },
    tags: ['kitchen', 'cooker', 'multi-use']
  },
  {
    name: 'Dyson V15 Detect',
    description: 'Cordless vacuum cleaner with laser dust detection',
    price: 749.99,
    category: 'Home Appliances',
    brand: 'Dyson',
    stock: 35,
    sku: 'DYS-V15-LSR',
    images: [
      { url: 'https://example.com/dysonv15.jpg', alt: 'Dyson V15 Detect' }
    ],
    specifications: {
      weight: '3.1kg',
      dimensions: '250 x 260 x 1260 mm',
      color: 'Yellow/Nickel',
      material: 'Plastic/Metal'
    },
    tags: ['vacuum', 'cordless', 'cleaning']
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