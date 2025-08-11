#!/usr/bin/env node
/* eslint-disable */
import path from "path";
import { fileURLToPath } from "url";

import express from "express";
import mime from "mime-types";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Allow all CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});
const unityDir = process.cwd();

// Custom static middleware to handle .br files
app.get("/*", (req, res, next) => {
  const requestedPath = path.join(unityDir, req.path);
  console.log(`Requested path: ${requestedPath}`);
  if (requestedPath.endsWith(".br")) {
    res.setHeader("Content-Encoding", "br");
    console.log(`  -> Encoding: br`);
    if (requestedPath.endsWith(".wasm.br")) {
      res.type("application/wasm");
      console.log(`  -> MIME type: application/wasm`);
    } else {
      res.type(mime.lookup(requestedPath) || "application/octet-stream");
      console.log(`  -> MIME type: ${res.getHeader("Content-Type")}`);
    }
  }
  next();
});

app.use(express.static(unityDir));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(` -> Unity Build Server running at http://localhost:${PORT}`);
});
