# Realtime Data Backend

This is the backend server for the Realtime Data application.

## Prerequisites

Before you begin, ensure you have the following installed on your local machine:

- [Node.js](https://nodejs.org/) (version 14 or higher)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)
- [MongoDB](https://www.mongodb.com/) (Make sure it's installed and running)

## Installation

To set up the project locally, follow these steps:

1. Clone the repository:
   ```
   git clone https://github.com/AnshumanX304/Realtime-data.git
   cd Realtime-data
   ```

2. Install the dependencies:
   ```
   npm install
   ```

This will install all the necessary dependencies listed in the `package.json` file.

## Configuration

1. Create a `.env` file in the root directory of the project.
2. Obtain the necessary environment variables from the project administrator or secure source.
3. Add these environment variables to your `.env` file.

Note: Never commit your `.env` file to version control. It contains sensitive information that should be kept private.

## Running the Server

To start the server:

```
node index.js
```

The server will run on the port specified in your environment configuration.

## Project Structure

- `index.js`: The entry point of the application
- `/routes`: Contains all the route definitions
- `/models`: Contains Mongoose models for MongoDB
- `/controllers`: Contains the logic for handling requests
- `/middleware`: Contains custom middleware functions

## Dependencies

This project uses several key dependencies:

- `express`: Web application framework
- `mongoose`: MongoDB object modeling tool
- `bcrypt`: Library for hashing passwords
- `jsonwebtoken`: Implementation of JSON Web Tokens
- `cors`: Middleware to enable CORS
- `dotenv`: Loads environment variables from .env file
- `body-parser`: Middleware to parse incoming request bodies
- `axios`: Promise based HTTP client for making requests
- `node-cron`: Task scheduler in Node.js

For a full list of dependencies and their versions, refer to the `package.json` file.

