import express from 'express';
import { Server } from 'http';
import { resolve } from 'path';

const app = express();
let server: Server;

export async function startDistServer({
  distDir,
}: {
  distDir: string;
}): Promise<void> {
  console.log(`Starting dist server on folder ${distDir}`);
  app.use(express.static(resolve(process.cwd(), distDir)));

  await new Promise<void>((resolve) => {
    server = app.listen(8080, resolve);
  });
}

export async function stopDistServer(): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    server.close((err) => (err ? reject(err) : resolve()));
  });
}
