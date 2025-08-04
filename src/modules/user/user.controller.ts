import {
  Body,
  Controller,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common';
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

  @Put('update-user/:userId')
  async updateUser(
    @Param('userId', new ParseUUIDPipe()) userId: string,
    @Body() updateuserDto: UpdateuserDto,
  ): Promise<Partial<User>> {
    console.log(updateuserDto);
    return this.userService.updateUser(userId, updateuserDto);
  }
}
