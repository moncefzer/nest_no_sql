import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { Routes } from 'src/core/utils/constants';

@Controller(Routes.USERS)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async index(@Query('page') page = 1, @Query('limit') limit = 20) {
    const result = await this.userService.paginate({
      page,
      limit: limit > 20 ? 20 : limit,
    });

    return result;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
