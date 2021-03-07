import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    // TODO
    const transactions = await this.find()

    console.log("Dentro da GET BALANCE");
    let income: number = 0;
    let outcome: number = 0;
    let total: number = 0;

    var sumIncome = 0;
    sumIncome = transactions.reduce(function (acumulador, valorAtual) {
      console.log(valorAtual)
      if (valorAtual.type == 'income'){
        return acumulador + Number(valorAtual.value);
      }
      console.log("Acumulador fora do If")
      console.log(acumulador)
      return acumulador
    }, sumIncome)

    income = sumIncome 

    var valorInicial = 0

    outcome = transactions.reduce(function (acumulador, valorAtual) {
      console.log("outcome")
      if (valorAtual.type == 'outcome'){
        return acumulador + Number(valorAtual.value);
      }
      return outcome
    }, valorInicial)
    valorInicial = 0

    total = income - outcome

    return { income, outcome, total }

  }
}

export default TransactionsRepository;
