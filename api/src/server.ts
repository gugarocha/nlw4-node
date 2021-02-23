import 'reflect-metadata';
import express from 'express';

import './database';

const app = express();

app.post('/', (req, res) => {
  res.json({ message: 'Dados salvos com sucesso' });
});

app.listen(3333, () => console.log('Server is running!'));