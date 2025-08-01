import { Body, Controller, Param, Post, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from 'src/common/entities/user.entity';
import { UpdateuserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create-user')
  async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.createUser(createUserDto);
  }

  @Put('update-user/:userid')
  async updateUser(
    @Param('userId') userId: string,
    @Body() updateuserDto: UpdateuserDto,
  ) {
    return this.userService.updateUser(userId, updateuserDto);
  }
}
