import express from 'express';
import publicRouter from './src/routes/publicRouter.js';
import componentsRouter from './src/routes/componentsRouter.js';

const app = express();
const port = 3000;

app.use(express.json());

app.use('/', publicRouter);


app.use('/', componentsRouter);




app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

