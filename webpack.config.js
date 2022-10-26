import path from 'path';
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const pages = [
  "rsvp",
  "registry",
  "details"
]

const config = {
  mode: 'development',
  watch: true,
  entry: {
    rsvp: './src/rsvp.js',
    registry: './src/registry.js',
    details: './src/details.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist/js'),
    filename: '[name].js'
  },
  experiments: {
    "topLevelAwait": true
  }
};

export default config;