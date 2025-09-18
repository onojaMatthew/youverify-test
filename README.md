# E-Commerce Microservices Application

This is a Node.js microservice-based e-commerce application. It uses `RabbitMQ` for asynchronous communication. There is also an `API-GATEWAY` service that handles all requests and proxy them to the desired services. Below is a sample 
structure of the different services.

# APPLICATION STRUCTURE (Service)

Below is the structure of the services. All the services follow the same structure and naming convention and are collective in a parent folder.

`product-service/
├── src/                          # Source code directory
│   ├── config/                   # Configuration files
│   ├── controller/               # Request handlers & business logic
│   ├── middleware/               # Custom middleware functions
│   ├── models/                   # Database models & schemas
│   ├── routes/                   # API route definitions
│   ├── services/                 # Business logic & external services
│   ├── utils/                    # Utility functions & helpers
│   ├── worker/                   # Background job processors
│   └── server.js                 # Application entry point
├── .babelrc                      # Babel configuration
├── .dockerignore                 # Docker ignore patterns
├── .env                          # Environment variables
├── .gitignore                    # Git ignore patterns
├── Dockerfile                    # Docker container definition
├── ecosystem.config.js           # PM2 process manager config
├── package-lock.json             # NPM dependency lock file
└── package.json`

## Services

There are five(5) different services in the application. The services are as listed below:

1.  `api-gateway` is the service that receives all the requests going into the application and redirects them to the appropriate services.
2.  `customer-service` is responsible for customer account registration and management
3.  `order-service` is responsible for order management
4.  `payment-service` handles payment
5.  `product-service` for product management

## 🛠️ Tech Stack
1.  Runtime: `NodeJS`
2.  Framework: `ExpressJS`
3.  Database: `MongoDB`
4.  Containerization: `Docker and docker-compose`
5.  Message broker: `RabbitMQ`

## 📦 API Documentation

I have export a Postman collection for the APIs implemented. It is in the root directory of the application with the name: `Youverify-collection.json`. You can import it into Postman and make use of them.


## Getting started

To get started with the application, first clone the application from github by running the command below:

1.  run: `git clone https://github.com/onojaMatthew/youverify-test.git`

2.  run `cd youverify-test`. In this directory, all the different services are located.

### To run API Test

API testing can be ran at the service level. This means that each service is tested in isolation. Below is a detail information of how to test the APIs:

#### Testing the product service

Do the followings:

1.  `cd product-service`
2.  run `npm install`
3.  create a `.env` file in the product-service root directory. i.e `product-service/.env`
4.  Add the environment variables below to the .env file you created in step 3.
    `
      PORT=5100
      MONGODB_URI=mongodb://localhost:27017/products
      RABBITMQ_URI=amqp://admin:password@localhost:5672
    `
5.  run `npm run test`. This command should be run from the service root directory.


#### Testing the Order Service

Do the followings:

1.  `cd order-service`
2.  run `npm install`
3.  create a `.env` file in the `order-service` root directory. i.e `order-service/.env`
4.  Add the environment variables below to the .env file you created in step 3.
    `
      PORT=5300
      MONGODB_URI=mongodb://localhost:27017/orders
      CUSTOMER_SERVICE_URL=http://localhost:5002
      PRODUCT_SERVICE_URL=http://localhost:5001
      PAYMENT_SERVICE_URL=http://localhost:5000
      RABBITMQ_URI=amqp://admin:password@localhost:5672
    `
5.  run `npm run test`. This command should be run from the service root directory.


#### Testing the Customer Service

Do the followings:

1.  `cd order-service`
2.  run `npm install`
3.  create a `.env` file in the `customer-service` root directory. i.e `customer-service/.env`
4.  Add the environment variables below to the .env file you created in step 3.
    `
      PORT=5200
      MONGODB_URI=mongodb://localhost:27017/customers
      RABBITMQ_URI=amqp://admin:password@localhost:5672
    `
5.  run `npm run test`. This command should be run from the service root directory.


#### Testing the Payment Service

Do the followings:

1.  `cd payment-service`
2.  run `npm install`
3.  create a `.env` file in the `payment-service` root directory. i.e `payment-service/.env`
4.  Add the environment variables below to the .env file you created in step 3.
    `
      PORT=5000
      MONGODB_URI=mongodb://localhost:27017/payments
      RABBITMQ_URI=amqp://admin:password@localhost:5672
    `
5.  run `npm run test`. This command should be run from the service root directory.

### To RUN the application without 

Below are the steps that must be followed to run the application successfully.

1.  #### Build the docker containers
    From the general root directory i.e `youverify-test/` there is a `docker-compose.yaml` file used to build and run docker files. Run the command below to in this directory to execute the `docker-compose.yaml` file:

    run `docker-compose up --build` or `docker-compose up --build -d`. With the `-d` flag, you're are telling process to run in the background after a successful.

2.  When step 1 is successful, you can then access the application following the Postman collection I have dropped in  the root folder.


### Running the application outside docker container

After the environment variables are properly set as show above, you can run each of the services as follows:

### NOTE: you must first run all the services first before you can run the API-Gateway service.

Follow these steps:

1.  `cd product-service` and run `npm run dev`
2.  `cd order-service` and run `npm run dev`
3.  `cd customer-service` and run `npm run dev`
4.  `cd payment-service` and run `npm run dev`
5.  `cd api-gateway` and run `npm run dev`

