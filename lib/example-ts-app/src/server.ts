import {createServer} from 'http';

const portEnv = process.env.PORT;
const port =
  portEnv !== undefined && portEnv !== null && portEnv !== ''
    ? Number(portEnv)
    : 3000;

const server = createServer((_req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello, TypeScript World!\n');
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
