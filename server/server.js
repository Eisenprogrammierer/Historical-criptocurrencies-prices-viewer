const app = require('./app');
const http = require('http');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const db = require('./config/db');
const { PORT = 3000, NODE_ENV } = process.env;


class Server {
  static async start() {
    try {
      await new Promise((resolve, reject) => {
        db.get('SELECT 1', (err) => {
          if (err) reject(err);
          else resolve();
        });
      });
      console.log('✅ Database connected');
    } catch (err) {
      console.error('❌ Database connection failed:', err.message);
      process.exit(1);
    }


    if (cluster.isPrimary && NODE_ENV === 'production') {
      console.log(`Master ${process.pid} is running`);
      

      for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
      }

      cluster.on('exit', (worker) => {
        console.log(`Worker ${worker.process.pid} died`);
        cluster.fork();
      });
    } else {
      const server = http.createServer(app);
      
      server.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT} (Worker ${process.pid})`);
      });


      process.on('SIGTERM', () => {
        console.log('SIGTERM received. Shutting down gracefully...');
        server.close(() => {
          db.close();
          process.exit(0);
        });
      });
    }
  }
}

Server.start().catch(err => {
  console.error('Fatal error during startup:', err);
  process.exit(1);
});
