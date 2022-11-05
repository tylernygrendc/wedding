import path from 'path';
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const pages = [
  "rsvp",
  "registry",
  "details",
  "dashboard"
]

const config = {
  mode: 'development',
  watch: true,
  entry: pages.reduce((config, page) => {
    config[page] = `./src/${page}.js`;
    return config;
  }, {}),
  output: {
    path: path.resolve(__dirname, 'dist/js'),
    filename: '[name].js'
  },
  experiments: {
    "topLevelAwait": true
  }
};

export default config;