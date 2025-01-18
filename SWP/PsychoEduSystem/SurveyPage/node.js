// server.mjs
import { createServer } from 'node:http';

const server = createServer((req, res) => {
  console.log(`Received request: ${req.method} ${req.url}`);
  try {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Hello World!' }));
  } catch (error) {
    console.error('Error handling request:', error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Internal Server Error' }));
  }
});

// starts a simple http server locally on port 3000
server.listen(3000, '127.0.0.1', () => {
  console.log('Server is listening on http://127.0.0.1:3000');
});

// run with `node server.mjs`
