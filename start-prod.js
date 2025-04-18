// Cross-platform script to set NODE_ENV and start the production server
const { spawn } = require('child_process');

// Set the environment variable
process.env.NODE_ENV = 'production';

console.log('Starting production server with NODE_ENV=production...');

// Start the server using node
const server = spawn('node', ['dist/index.js'], { 
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