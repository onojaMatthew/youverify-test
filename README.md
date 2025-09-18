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


## To access the database in command line

run: `docker exec -it customer-db mongosh`

## To switch to a particular database
run: `use database_name`

## To see the databases in the connection
run: `show databases`

## To see the tables in the database
run: `show tables`

## To see the data in a particular table
run: `db.collection_name.find({})`