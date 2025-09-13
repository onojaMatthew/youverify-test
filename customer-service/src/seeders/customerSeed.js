import { Customer } from '../models/customer';
import { Logger } from '../config/logger';

const sampleCustomers = [
  {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1234567890',
    address: {
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA'
    }
  },
  {
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    phone: '+1234567891',
    address: {
      street: '456 Oak Ave',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90001',
      country: 'USA'
    }
  },
  {
    firstName: 'Mike',
    lastName: 'Johnson',
    email: 'mike.johnson@example.com',
    phone: '+1234567892',
    address: {
      street: '789 Pine Rd',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60601',
      country: 'USA'
    }
  }
];

export const seedCustomers = async () => {
  try {
    const existingCount = await Customer.countDocuments();
    
    if (existingCount === 0) {
      await Customer.insertMany(sampleCustomers);
      Logger.log({ level: "info", message: "Sample customers seeded successfully" });
    } else {
      Logger.log({ level: "info", message: 'Customers already exist, skipping seeding'});
    }
  } catch (err) {
    Logger.log({ level: "error", message: `Error seeding customer. Error: ${err.message}` });
  }
};
