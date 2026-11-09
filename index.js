import express from 'express';
import generalRoutes from './src/routes/generalRoutes.js';

const app = express();
const port = 3000;

app.use(express.json());
app.use(generalRoutes);




app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

