// import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository'
import CategoriesRepository from '../repositories/CategoriesRepository'
import { getCustomRepository, getRepository } from 'typeorm'
import AppError from '../errors/AppError';

interface Request {
  title: string,
  value: number,
  type: 'income' | 'outcome',
  category: string
}

class CreateTransactionService {
  public async execute({ title, value, type, category }: Request): Promise<Transaction> {
    // TODO
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const categoriesRepository = getCustomRepository(CategoriesRepository)

    const balance = await transactionsRepository.getBalance()
    if (type == 'outcome') {
      console.log(`Saldo na conta: ${(balance.total - value)}`)
      if ((balance.total - value) <= 0) {
        throw new AppError('Não há saldo suficiente')
      }
    }

    const idOfCategory = await categoriesRepository.findOne({
      where: { title: category }
    })

    if (!idOfCategory) {
      const categoryItem = categoriesRepository.create({ title: category });
      await categoriesRepository.save(categoryItem);
      const findIndex = await categoriesRepository.findOne({
        where: { title: category }
      })



      const transaction = transactionsRepository.create({ title, value, type, category_id: findIndex?.id })
      await transactionsRepository.save(transaction)
      return transaction;
    }
    else {
      const transaction = transactionsRepository.create({ title, value, type, category_id: idOfCategory?.id })
      await transactionsRepository.save(transaction)
      return transaction;
    }



  }
}

export default CreateTransactionService;
