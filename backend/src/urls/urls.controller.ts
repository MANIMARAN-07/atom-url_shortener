import { Controller, Post, Get, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { UrlsService } from './urls.service';
import { CreateUrlDto } from './dto/create-url.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('api/urls')
export class UrlsController {
  constructor(private urlsService: UrlsService) {}

  @Post()
  async create(@Request() req: any, @Body() createUrlDto: CreateUrlDto) {
    return this.urlsService.createUrl(
      req.user.userId,
      createUrlDto.originalUrl,
      createUrlDto.title,
      createUrlDto.customAlias
    );
  }

  @Get()
  async findAll(@Request() req: any) {
    return this.urlsService.findAllByUser(req.user.userId);
  }

  @Delete(':id')
  async remove(@Request() req: any, @Param('id') id: string) {
    return this.urlsService.deleteUrl(req.user.userId, id);
  }
}
