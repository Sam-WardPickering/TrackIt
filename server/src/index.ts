import { createApp } from './app.js';
import { initSchema } from './db/database.js';

const PORT = Number(process.env.PORT) || 4000;

initSchema();
const app = createApp();

app.listen(PORT, () => {
  console.log(`TrackIt API listening on http://localhost:${PORT}`);
});
