import { Controller, Get, Delete, Param, UseFilters } from '@nestjs/common';
import { AvatarService } from '../../infra/services/avatar.service';
import { UserNotFoundExceptionFilter } from '../../../../utils/errors/notfound.exception';

@Controller('api/user/:userId/avatar')
export class AvatarController {
  constructor(private readonly getAvatarrService: AvatarService) {}

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
