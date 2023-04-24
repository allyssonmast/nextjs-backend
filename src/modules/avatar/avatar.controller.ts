import {
  Controller,
  Get,
  Delete,
  Param,
  UseFilters,
  Inject,
} from '@nestjs/common';
import { UserNotFoundExceptionFilter } from '../../utils/errors/notfound.exception';
import { IAvatarService } from './interfaces/avatar.service.interface';

@Controller('api/user/:userId/avatar')
export class AvatarController {
  constructor(
    @Inject('IAvatarService')
    private readonly getAvatarrService: IAvatarService,
  ) {}

  @Get()
  @UseFilters(new UserNotFoundExceptionFilter())
  async getUserAvatar(@Param('userId') userId: number): Promise<string> {
    return this.getAvatarrService.getUserAvatar(userId);
  }

  @Delete()
  @UseFilters(new UserNotFoundExceptionFilter())
  async deleteAvatar(@Param('userId') userId: number): Promise<void> {
    return this.getAvatarrService.deleteAvatar(userId);
  }
}
