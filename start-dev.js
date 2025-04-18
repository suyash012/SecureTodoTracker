// Cross-platform script to set NODE_ENV and start the development server
const { spawn } = require('child_process');

// Set the environment variable
process.env.NODE_ENV = 'development';

console.log('Starting development server with NODE_ENV=development...');

// Start the server using tsx
const server = spawn('npx', ['tsx', 'server/index.ts'], { 
  stdio: 'inherit',
  env: { ...process.env }
});

server.on('error', (err) => {
  console.error('Failed to start server:', err);
});

// Handle process termination
process.on('SIGINT', () => {
  server.kill('SIGINT');
  process.exit();
});

process.on('SIGTERM', () => {
  server.kill('SIGTERM');
  process.exit();
});