import path from 'path'
import { fileURLToPath } from 'url';

import express from 'express';
import "dotenv/config";

import getRouts from './routs/get-routs.js'
import postRouts from './routs/post-routs.js'

const app= express();
const __dirname= path.dirname(fileURLToPath(import.meta.url));

app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(express.static(path.join(__dirname, "public")))


app.use(getRouts);
app.use(postRouts);


app.listen(3000);

export { __dirname as rootPath } 