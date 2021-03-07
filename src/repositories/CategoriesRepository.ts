import { EntityRepository, Repository } from 'typeorm';

import Category from '../models/Category';

@EntityRepository(Category)
class CategoriesRepository extends Repository<Category> {
  public async checkIfExist(): Promise<void> {
    // TODO
  }
}

export default CategoriesRepository;