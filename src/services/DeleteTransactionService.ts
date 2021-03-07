// import AppError from '../errors/AppError';

import { response } from "express";
import AppError from '../errors/AppError';
import { getCustomRepository, ObjectID } from 'typeorm'
import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository'

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    // TODO
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    console.log("IDDDDDDDDDDDDDDDd")
    console.log(id)
    const findIdenx = await transactionsRepository.findOne({
      where: {id: id}
    })
    
    
    console.log("Procurando o index")
    console.log(findIdenx)
    console.log("Fim Procurando o index")
    await transactionsRepository.delete({
      id: id
    });
  }
}

export default DeleteTransactionService;
