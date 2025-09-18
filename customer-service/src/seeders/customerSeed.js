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
  },
  {
    firstName: 'Emily',
    lastName: 'Davis',
    email: 'emily.davis@example.com',
    phone: '+1234567893',
    address: {
      street: '321 Elm St',
      city: 'Houston',
      state: 'TX',
      zipCode: '77001',
      country: 'USA'
    }
  },
  {
    firstName: 'Daniel',
    lastName: 'Wilson',
    email: 'daniel.wilson@example.com',
    phone: '+1234567894',
    address: {
      street: '654 Cedar Ave',
      city: 'Phoenix',
      state: 'AZ',
      zipCode: '85001',
      country: 'USA'
    }
  },
  {
    firstName: 'Olivia',
    lastName: 'Martinez',
    email: 'olivia.martinez@example.com',
    phone: '+1234567895',
    address: {
      street: '987 Maple Rd',
      city: 'Philadelphia',
      state: 'PA',
      zipCode: '19101',
      country: 'USA'
    }
  },
  {
    firstName: 'James',
    lastName: 'Anderson',
    email: 'james.anderson@example.com',
    phone: '+1234567896',
    address: {
      street: '135 Birch St',
      city: 'San Antonio',
      state: 'TX',
      zipCode: '78201',
      country: 'USA'
    }
  },
  {
    firstName: 'Sophia',
    lastName: 'Taylor',
    email: 'sophia.taylor@example.com',
    phone: '+1234567897',
    address: {
      street: '246 Spruce Ave',
      city: 'San Diego',
      state: 'CA',
      zipCode: '92101',
      country: 'USA'
    }
  },
  {
    firstName: 'David',
    lastName: 'Thomas',
    email: 'david.thomas@example.com',
    phone: '+1234567898',
    address: {
      street: '357 Walnut Rd',
      city: 'Dallas',
      state: 'TX',
      zipCode: '75201',
      country: 'USA'
    }
  },
  {
    firstName: 'Isabella',
    lastName: 'Hernandez',
    email: 'isabella.hernandez@example.com',
    phone: '+1234567899',
    address: {
      street: '468 Cherry Ln',
      city: 'San Jose',
      state: 'CA',
      zipCode: '95101',
      country: 'USA'
    }
  },
  {
    firstName: 'Matthew',
    lastName: 'Moore',
    email: 'matthew.moore@example.com',
    phone: '+1234567810',
    address: {
      street: '579 Ash St',
      city: 'Austin',
      state: 'TX',
      zipCode: '73301',
      country: 'USA'
    }
  },
  {
    firstName: 'Ava',
    lastName: 'Jackson',
    email: 'ava.jackson@example.com',
    phone: '+1234567811',
    address: {
      street: '680 Willow Ave',
      city: 'Jacksonville',
      state: 'FL',
      zipCode: '32201',
      country: 'USA'
    }
  },
  {
    firstName: 'Ethan',
    lastName: 'White',
    email: 'ethan.white@example.com',
    phone: '+1234567812',
    address: {
      street: '791 Poplar Rd',
      city: 'Fort Worth',
      state: 'TX',
      zipCode: '76101',
      country: 'USA'
    }
  },
  {
    firstName: 'Mia',
    lastName: 'Harris',
    email: 'mia.harris@example.com',
    phone: '+1234567813',
    address: {
      street: '802 Magnolia St',
      city: 'Columbus',
      state: 'OH',
      zipCode: '43085',
      country: 'USA'
    }
  },
  {
    firstName: 'Alexander',
    lastName: 'Clark',
    email: 'alexander.clark@example.com',
    phone: '+1234567814',
    address: {
      street: '913 Dogwood Ave',
      city: 'Charlotte',
      state: 'NC',
      zipCode: '28201',
      country: 'USA'
    }
  },
  {
    firstName: 'Charlotte',
    lastName: 'Lewis',
    email: 'charlotte.lewis@example.com',
    phone: '+1234567815',
    address: {
      street: '1010 Cypress Rd',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94101',
      country: 'USA'
    }
  },
  {
    firstName: 'Benjamin',
    lastName: 'Walker',
    email: 'benjamin.walker@example.com',
    phone: '+1234567816',
    address: {
      street: '1111 Redwood St',
      city: 'Indianapolis',
      state: 'IN',
      zipCode: '46201',
      country: 'USA'
    }
  },
  {
    firstName: 'Amelia',
    lastName: 'Hall',
    email: 'amelia.hall@example.com',
    phone: '+1234567817',
    address: {
      street: '1212 Palm Ave',
      city: 'Seattle',
      state: 'WA',
      zipCode: '98101',
      country: 'USA'
    }
  },
  {
    firstName: 'Lucas',
    lastName: 'Allen',
    email: 'lucas.allen@example.com',
    phone: '+1234567818',
    address: {
      street: '1313 Cottonwood Rd',
      city: 'Denver',
      state: 'CO',
      zipCode: '80201',
      country: 'USA'
    }
  },
  {
    firstName: 'Harper',
    lastName: 'Young',
    email: 'harper.young@example.com',
    phone: '+1234567819',
    address: {
      street: '1414 Palm St',
      city: 'Washington',
      state: 'DC',
      zipCode: '20001',
      country: 'USA'
    }
  },
  {
    firstName: 'Henry',
    lastName: 'King',
    email: 'henry.king@example.com',
    phone: '+1234567820',
    address: {
      street: '1515 Bay Ave',
      city: 'Boston',
      state: 'MA',
      zipCode: '02101',
      country: 'USA'
    }
  },
  {
    firstName: 'Evelyn',
    lastName: 'Scott',
    email: 'evelyn.scott@example.com',
    phone: '+1234567821',
    address: {
      street: '1616 River Rd',
      city: 'Nashville',
      state: 'TN',
      zipCode: '37201',
      country: 'USA'
    }
  },
  {
    firstName: 'Jack',
    lastName: 'Green',
    email: 'jack.green@example.com',
    phone: '+1234567822',
    address: {
      street: '1717 Harbor St',
      city: 'Detroit',
      state: 'MI',
      zipCode: '48201',
      country: 'USA'
    }
  },
  {
    firstName: 'Ella',
    lastName: 'Baker',
    email: 'ella.baker@example.com',
    phone: '+1234567823',
    address: {
      street: '1818 Forest Ln',
      city: 'Portland',
      state: 'OR',
      zipCode: '97201',
      country: 'USA'
    }
  },
  {
    firstName: 'William',
    lastName: 'Adams',
    email: 'william.adams@example.com',
    phone: '+1234567824',
    address: {
      street: '1919 Canyon Rd',
      city: 'Las Vegas',
      state: 'NV',
      zipCode: '88901',
      country: 'USA'
    }
  },
  {
    firstName: 'Scarlett',
    lastName: 'Nelson',
    email: 'scarlett.nelson@example.com',
    phone: '+1234567825',
    address: {
      street: '2020 Garden St',
      city: 'Baltimore',
      state: 'MD',
      zipCode: '21201',
      country: 'USA'
    }
  },
  {
    firstName: 'Michael',
    lastName: 'Carter',
    email: 'michael.carter@example.com',
    phone: '+1234567826',
    address: {
      street: '2121 Oakwood Ave',
      city: 'Louisville',
      state: 'KY',
      zipCode: '40201',
      country: 'USA'
    }
  },
  {
    firstName: 'Grace',
    lastName: 'Mitchell',
    email: 'grace.mitchell@example.com',
    phone: '+1234567827',
    address: {
      street: '2222 Summit Rd',
      city: 'Oklahoma City',
      state: 'OK',
      zipCode: '73101',
      country: 'USA'
    }
  },
  {
    firstName: 'Samuel',
    lastName: 'Perez',
    email: 'samuel.perez@example.com',
    phone: '+1234567828',
    address: {
      street: '2323 Valley Rd',
      city: 'Milwaukee',
      state: 'WI',
      zipCode: '53201',
      country: 'USA'
    }
  },
  {
    firstName: 'Chloe',
    lastName: 'Roberts',
    email: 'chloe.roberts@example.com',
    phone: '+1234567829',
    address: {
      street: '2424 Riverbend St',
      city: 'Albuquerque',
      state: 'NM',
      zipCode: '87101',
      country: 'USA'
    }
  },
  {
    firstName: 'Joseph',
    lastName: 'Turner',
    email: 'joseph.turner@example.com',
    phone: '+1234567830',
    address: {
      street: '2525 Highland Ave',
      city: 'Tucson',
      state: 'AZ',
      zipCode: '85701',
      country: 'USA'
    }
  },
  {
    firstName: 'Victoria',
    lastName: 'Phillips',
    email: 'victoria.phillips@example.com',
    phone: '+1234567831',
    address: {
      street: '2626 Park Rd',
      city: 'Fresno',
      state: 'CA',
      zipCode: '93701',
      country: 'USA'
    }
  },
  {
    firstName: 'Andrew',
    lastName: 'Campbell',
    email: 'andrew.campbell@example.com',
    phone: '+1234567832',
    address: {
      street: '2727 Hill St',
      city: 'Sacramento',
      state: 'CA',
      zipCode: '94203',
      country: 'USA'
    }
  },
  {
    firstName: 'Lily',
    lastName: 'Parker',
    email: 'lily.parker@example.com',
    phone: '+1234567833',
    address: {
      street: '2828 Meadow Ln',
      city: 'Kansas City',
      state: 'MO',
      zipCode: '64101',
      country: 'USA'
    }
  },
  {
    firstName: 'Christopher',
    lastName: 'Evans',
    email: 'christopher.evans@example.com',
    phone: '+1234567834',
    address: {
      street: '2929 Brookside Rd',
      city: 'Atlanta',
      state: 'GA',
      zipCode: '30301',
      country: 'USA'
    }
  },
  {
    firstName: 'Zoe',
    lastName: 'Edwards',
    email: 'zoe.edwards@example.com',
    phone: '+1234567835',
    address: {
      street: '3030 Sunset Blvd',
      city: 'Miami',
      state: 'FL',
      zipCode: '33101',
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
