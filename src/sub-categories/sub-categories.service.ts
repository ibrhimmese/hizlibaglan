import { Injectable } from '@nestjs/common';
import { CreateSubCategoryDto } from './dto/create-sub-category.dto';
import { UpdateSubCategoryDto } from './dto/update-sub-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SubCategory } from './entities/sub-category.entity';

@Injectable()
export class SubCategoriesService {
  constructor(
    @InjectRepository(SubCategory)
    private subCategoryRepository: Repository<SubCategory>,
  ) {}

  async create(createSubCategoryDto: CreateSubCategoryDto) {
    const subCategory = this.subCategoryRepository.create(createSubCategoryDto);

    return await this.subCategoryRepository.save(subCategory);
  }

  async findByCategoryId(categoryId: string) {
    return await this.subCategoryRepository.find({
      where: { category: { id: categoryId } },
      order: { order: 'ASC' },
    });
  }

  async update(id: string, updateSubCategoryDto: UpdateSubCategoryDto) {
    const subCategory = await this.subCategoryRepository.preload({
      id,
      ...updateSubCategoryDto,
    });

    if (!subCategory) {
      throw new Error(`SubCategory with id ${id} not found`);
    }

    return await this.subCategoryRepository.save(subCategory);
  }

  async remove(id: string) {
    const subCategory = await this.subCategoryRepository.findOne({
      where: { id },
    });

    if (!subCategory) {
      throw new Error(`SubCategory with id ${id} not found`);
    }

    await this.subCategoryRepository.remove(subCategory);
    return { message: 'SubCategory removed successfully' };
  }
}
