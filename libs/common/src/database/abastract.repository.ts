import { Logger, NotFoundException } from '@nestjs/common';
import { FilterQuery, Model, Types, UpdateQuery } from 'mongoose';
import { AbstractDocument } from './abstract.schema';
import { CurrentUserDto } from '../dtos';
import { UserTypes } from '../usertypes';

export abstract class AbstractRepository<TDocument extends AbstractDocument> {
  protected abstract readonly logger: Logger;

  constructor(protected readonly model: Model<TDocument>) {}

  async create(document: Omit<TDocument, '_id'>): Promise<TDocument> {
    const createdDocument = new this.model({
      ...document,
      _id: new Types.ObjectId(),
    });
    return (await createdDocument.save()).toJSON() as unknown as TDocument;
  }

  // New insertMany method to insert multiple documents
  async createMany(preparedDocuments: object[]): Promise<TDocument[]> {
    try {
      const result = await this.model.insertMany(preparedDocuments, {
        ordered: false,
      });
      return result.map((doc) => doc.toJSON() as unknown as TDocument); // Return the inserted documents as JSON
    } catch (error) {
      this.logger.error('Error inserting multiple documents', error);
      throw new Error('Failed to insert multiple documents');
    }
  }

  async findOne(
    filterQuery: FilterQuery<TDocument>,
    throwErr = true,
  ): Promise<TDocument> {
    const document = await this.model
      .findOne(filterQuery)
      .lean<TDocument>(true);

    if (!document && throwErr) {
      this.logger.warn('Document was not found with filterQuery', filterQuery);
      throw new NotFoundException('Document was not found');
    }

    return document;
  }

  async findById(_id: string, throwErr = true): Promise<TDocument> {
    const document = await this.model.findById(_id).lean<TDocument>(true);

    if (!document && throwErr) {
      this.logger.warn('Document was not found with the id', _id);
      throw new NotFoundException('Document was not found');
    }

    return document;
  }

  async findOneAndUpdate(
    filterQuery: FilterQuery<TDocument>,
    update: UpdateQuery<TDocument>,
    throwErr = true,
  ): Promise<TDocument> {
    const document = await this.model
      .findOneAndUpdate(filterQuery, update, {
        new: true,
      })
      .lean<TDocument>(true);

    if (!document && throwErr) {
      this.logger.warn('Document was not found with filterQuery', filterQuery);
      throw new NotFoundException('Document was not found');
    }

    return document;
  }

  async findManyAndUpdate(
    filterQuery: FilterQuery<TDocument>,
    update: UpdateQuery<TDocument>,
    throwErr = true,
  ): Promise<TDocument> {
    const document = await this.model
      .updateMany(filterQuery, update, {
        new: true,
      })
      .lean<TDocument>(true);

    if (!document && throwErr) {
      this.logger.warn('Document was not found with filterQuery', filterQuery);
      throw new NotFoundException('Document was not found');
    }

    return document;
  }

  async find(
    filterQuery: FilterQuery<TDocument>,
    limit: number = 100, //default limit
    skip?: number,
  ): Promise<TDocument[]> {
    let query = this.model
      .find(filterQuery)
      .sort({ _id: -1 })
      .lean<TDocument[]>(true);

    if (limit) {
      query = query.limit(limit);
    }

    if (skip) {
      query = query.skip(skip);
    }

    return query;
  }

  async findOneAndDelete(
    filterQuery: FilterQuery<TDocument>,
  ): Promise<TDocument> {
    return this.model.findOneAndDelete(filterQuery).lean<TDocument>(true);
  }

  getOwnershipCondition(user: CurrentUserDto): FilterQuery<TDocument> {
    if (user.uType === UserTypes.SUPERADMIN) {
      return {};
    }
    return {
      $or: [
        { ownerId: user.userId }, // self data.
        { accountId: user.accountId }, // (main node) parent's data and peer's data
        { partnerId: user.userId }, // if loggedInUser is partner, he/she can see all under him.
      ],
    };
  }

  async countDocuments(filterQuery: FilterQuery<TDocument>): Promise<number> {
    return this.model.countDocuments(filterQuery);
  }

  async deleteOne(filterQuery: FilterQuery<TDocument>): Promise<any> {
    return this.model.deleteOne(filterQuery);
  }

  async estimatedDocumentCount(): Promise<number> {
    return this.model.estimatedDocumentCount();
  }
}
