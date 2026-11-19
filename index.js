import express from 'express';
import generalRoutes from './src/routes/generalRoutes.js';
import errorHandler from './src/middlewares/errorHandler.js';
import { addSeedUsers } from './src/repository/userRepository.js';
import { addSeedGames } from './src/repository/gameHistoryRepository.js';

const app = express();
const port = 3000;

console.log('Agregando usuarios de prueba...');
await addSeedUsers();
console.log('Usuarios de prueba agregados.');
console.log('Agregando juegos de prueba...');
addSeedGames();
console.log('Juegos de prueba agregados.');



app.use(express.json());
app.use(generalRoutes);
app.use(errorHandler);





app.listen(port, () => {
  console.log(`time: ${new Date().toISOString()}`);
  console.log(`Server is running on http://localhost:${port}`);
});

