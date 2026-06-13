import { Test, TestingModule } from '@nestjs/testing';
import { UrlsService } from './urls.service';
import { getModelToken } from '@nestjs/mongoose';
import { Url } from './schemas/url.schema';
import { NotFoundException } from '@nestjs/common';

describe('UrlsService', () => {
  let service: UrlsService;
  let mockModel: any;

  beforeEach(async () => {
    mockModel = function(data: any) {
      this.userId = data.userId;
      this.originalUrl = data.originalUrl;
      this.shortCode = data.shortCode;
      this.save = jest.fn().mockResolvedValue(this);
    };
    mockModel.findOne = jest.fn();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UrlsService,
        {
          provide: getModelToken(Url.name),
          useValue: mockModel,
        },
      ],
    }).compile();

    service = module.get<UrlsService>(UrlsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createUrl', () => {
    it('should create a short code successfully', async () => {
      const result = await service.createUrl('user1', 'https://google.com');
      expect(result.originalUrl).toBe('https://google.com');
      expect(result.shortCode).toBeDefined();
    });

    it('should use custom alias if provided', async () => {
      const result = await service.createUrl('user1', 'https://google.com', undefined, 'my-alias');
      expect(result.shortCode).toBe('my-alias');
    });
  });

  describe('findByShortCode', () => {
    it('should throw NotFoundException if code not found', async () => {
      mockModel.findOne.mockReturnValue({ exec: jest.fn().mockResolvedValue(null) });
      await expect(service.findByShortCode('notfound')).rejects.toThrow(NotFoundException);
    });

    it('should return URL document if found', async () => {
      const doc = { originalUrl: 'https://test.com', shortCode: 'test' };
      mockModel.findOne.mockReturnValue({ exec: jest.fn().mockResolvedValue(doc) });
      const result = await service.findByShortCode('test');
      expect(result).toEqual(doc);
    });
  });
});
