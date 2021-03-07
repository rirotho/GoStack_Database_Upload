import Transaction from '../models/Transaction';
import CreateTransactionService from '../services/CreateTransactionService';
import { getCustomRepository, In, Index } from 'typeorm';
import CategoriesRepository from '../repositories/CategoriesRepository';
import TransactionsRepository from '../repositories/TransactionsRepository'
import csvParse from 'csv-parse';
import fs from 'fs';
import path from 'path';
import Category from '../models/Category';

interface TransactionDTO {
  title: string,
  type: 'income' | 'outcome',
  value: number,
  category: string,
}

class ImportTransactionsService {
  async execute(filepath: string): Promise<void> {
    // TODO
    const readCSVStream = fs.createReadStream(filepath);

    const parseStream = csvParse({
      from_line: 2,
      ltrim: true,
      rtrim: true,
    });

    const parseCSV = readCSVStream.pipe(parseStream);

    const transactions: TransactionDTO[] = []
    const categories: string[] = []

    parseCSV.on('data', async line => {
      console.log(line);
      const [title, type, value, category] = line.map((cell: string) => cell.trim());

      if (!title || !type || !value) return

      categories.push(category)

      transactions.push({ title, type, value, category })
    });

    await new Promise(resolve => parseCSV.on('end', resolve));

    const categoriesRepository = getCustomRepository(CategoriesRepository);

    const existentsCategories = await categoriesRepository.find({
      where: {
        title: In(categories)
      }
    })

    const existentsCategoriesTitle = existentsCategories.map((category: Category) => category.title)

    const addCategoriesTitles = categories
      .filter(category => !existentsCategoriesTitle.includes(category))
      .filter((value, index, self) => self.indexOf(value) === index);

    const newCategories = categoriesRepository.create(
      addCategoriesTitles.map(title => ({
        title
      }))
    )

    await categoriesRepository.save(newCategories)

    const finalcategories = [...newCategories, ...existentsCategories];

    console.log(finalcategories)

    const transactionsRepository = getCustomRepository(TransactionsRepository);

    const idOfCategory = await categoriesRepository.find()

    console.log(idOfCategory)

    const createdTransactions = transactionsRepository.create(
      transactions.map(transaction => (
        
        {
          title: transaction.title,
          type: transaction.type,
          value: transaction.value,
          category: finalcategories.find(
            category => category.title === transaction.category
          )?.id,
        }
      ))
    )
    console.log(createdTransactions)
    await transactionsRepository.save(createdTransactions)

    await fs.promises.unlink(filepath);

    console.log("Inicio do parse");
    console.log(addCategoriesTitles);
    console.log(existentsCategories);
    console.log(categories);
    console.log(transactions);
    console.log("Fim do parse")







  }
}

export default ImportTransactionsService;
