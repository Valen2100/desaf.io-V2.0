import express from 'express';
import generalRoutes from './src/routes/generalRoutes.js';
import errorHandler from './src/middlewares/errorHandler.js';

const app = express();
const port = 3000;

app.use(express.json());
app.use(generalRoutes);
app.use(errorHandler);





app.listen(port, () => {
  console.log(`time: ${new Date().toISOString()}`);
  console.log(`Server is running on http://localhost:${port}`);
});

