import { Router } from 'express';
import multer from 'multer'
import uploadConfig from '../config/upload'
import { getCustomRepository } from 'typeorm'

import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
import ImportTransactionsService from '../services/ImportTransactionsService';
import Transaction from '../models/Transaction';

const upload = multer(uploadConfig); 

interface Request {
  title: string,
  value: number,
  type: 'income' | 'outcome',
  category: string
}

const transactionsRouter = Router();



transactionsRouter.get('/', async (request, response) => {
  // TODO
  const transactionsRepository = getCustomRepository(TransactionsRepository);

  const balance = await transactionsRepository.getBalance();

  const transactions = await transactionsRepository.find();

  return response.json({ transactions, balance });
});

transactionsRouter.post('/', async (request, response) => {
  // TODO
  const { title, value, type, category } = request.body

  const createTransaction = new CreateTransactionService();

  const transaction = await createTransaction.execute({ title, value, type, category });

  return response.json(transaction)

});

transactionsRouter.delete('/:id', async (request, response) => {
  // TODO
  const { id } = request.params;

  const deleteTransaction = new DeleteTransactionService();

  console.log("Deletando");

  await deleteTransaction.execute(id);

  return response.status(204).json("")

});

transactionsRouter.post('/import', upload.single('file'), async (request, response) => {
  // TODO
  const importTransaction = new ImportTransactionsService();
  const transactions  = await importTransaction.execute(request.file.path);
  console.log("Fim do '/import'");
  return response.json(transactions);
});

export default transactionsRouter;
