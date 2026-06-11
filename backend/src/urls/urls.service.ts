import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Url, UrlDocument } from './schemas/url.schema';
import { nanoid } from 'nanoid';

@Injectable()
export class UrlsService {
  constructor(@InjectModel(Url.name) private urlModel: Model<UrlDocument>) {}

  async createUrl(userId: string, originalUrl: string, title?: string, customAlias?: string): Promise<UrlDocument> {
    const shortCode = customAlias || nanoid(7);
    
    try {
      const createdUrl = new this.urlModel({
        userId,
        originalUrl,
        shortCode,
        title,
      });
      return await createdUrl.save();
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException('Short code or alias already in use');
      }
      throw error;
    }
  }

  async findAllByUser(userId: string): Promise<UrlDocument[]> {
    return this.urlModel.find({ userId }).sort({ createdAt: -1 }).exec();
  }

  async findByShortCode(shortCode: string): Promise<UrlDocument> {
    const url = await this.urlModel.findOne({ shortCode }).exec();
    if (!url) {
      throw new NotFoundException('URL not found');
    }
    return url;
  }

  async deleteUrl(userId: string, urlId: string): Promise<void> {
    const result = await this.urlModel.deleteOne({ _id: urlId, userId }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException('URL not found or unauthorized');
    }
  }
}
