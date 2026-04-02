import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Products } from './entities/products.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { PartialUpdateProductDto } from './dto/partial-update-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Products)
    private readonly productsRepo: Repository<Products>,
  ) {}

  async create(dto: CreateProductDto) {
    const product = this.productsRepo.create(dto);
    const saved = await this.productsRepo.save(product);
    return { message: 'Product created successfully', data: saved };
  }

  async findAll() {
    const data = await this.productsRepo.find({
      order: { createdAt: 'DESC' },
    });
    return { message: 'Products fetched successfully', count: data.length, data };
  }

  async findOne(id: number) {
    const product = await this.productsRepo.findOne({ where: { id } });
    if (!product) throw new NotFoundException(`Product with id ${id} not found`);
    return { message: 'Product fetched successfully', data: product };
  }

  async update(id: number, dto: PartialUpdateProductDto) {
    const product = await this.productsRepo.findOne({ where: { id } });
    if (!product) throw new NotFoundException(`Product with id ${id} not found`);

    Object.assign(product, dto);
    const saved = await this.productsRepo.save(product);
    return { message: 'Product updated successfully', data: saved };
  }

  async replace(id: number, dto: UpdateProductDto) {
    const product = await this.productsRepo.findOne({ where: { id } });
    if (!product) throw new NotFoundException(`Product with id ${id} not found`);

    // Full replacement: ensure all fields are overwritten
    product.name = dto.name;
    product.description = dto.description;
    product.price = dto.price;
    product.stock = dto.stock ?? 0;
    product.category = dto.category;
    product.isActive = dto.isActive ?? true;

    const saved = await this.productsRepo.save(product);
    return { message: 'Product replaced successfully', data: saved };
  }

  async remove(id: number) {
    const product = await this.productsRepo.findOne({ where: { id } });
    if (!product) throw new NotFoundException(`Product with id ${id} not found`);

    await this.productsRepo.delete(id);
    return { message: 'Product deleted successfully', id };
  }

  async findByCategory(category: string) {
    const data = await this.productsRepo.find({ where: { category } });
    return {
      message: `Products in category '${category}' fetched successfully`,
      count: data.length,
      data,
    };
  }

  async search(keyword: string) {
    const data = await this.productsRepo.find({
      where: { name: ILike(`%${keyword}%`) },
    });
    return {
      message: `Search results for '${keyword}' fetched successfully`,
      count: data.length,
      data,
    };
  }

  async toggleActive(id: number) {
    const product = await this.productsRepo.findOne({ where: { id } });
    if (!product) throw new NotFoundException(`Product with id ${id} not found`);

    product.isActive = !product.isActive;
    const saved = await this.productsRepo.save(product);
    return { message: 'Product active status toggled successfully', data: saved };
  }
}