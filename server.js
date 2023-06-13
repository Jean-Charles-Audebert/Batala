import * as dotenv from 'dotenv';
dotenv.config();

import app from './app/index.js';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log('The server is running on : http://localhost:' + PORT);
});
