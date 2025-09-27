import { config } from 'dotenv';
import { resolve } from 'path';

// Cargar .env.test para las pruebas E2E
config({ path: resolve(__dirname, '../.env.test') });
