const dotenv = require('dotenv');

// Load environment variables before any other imports
dotenv.config();

const app = require('./src/app');
const connectDB = require('./src/config/db');

const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 5001;

const startServer = async () => {
  try {
    await connectDB();

    const listenOnPort = (port) => {
      const server = app.listen(port, () => {
        console.log(`WriteSpace server running on port ${port}`);
        console.log(`Swagger documentation available at http://localhost:${port}/api-docs`);
      });

      server.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
          console.warn(`[Port Warning] Port ${port} is already in use. Trying port ${port + 1}...`);
          listenOnPort(port + 1);
        } else {
          console.error(`Server error: ${err.message}`);
          process.exit(1);
        }
      });
    };

    listenOnPort(DEFAULT_PORT);
  } catch (error) {
    console.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

startServer();
