import { ConflictException, HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/common/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UpdateuserDto } from './dto/update-user.dto';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    try {
      const { name, email, password } = createUserDto;
      const existingUser = await this.userRepository.findOne({
        where: { email },
      });
      console.log(existingUser, 'existingUser');
      if (existingUser) {
        throw new ConflictException('user alreeady exist');
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = this.userRepository.create({
        email,
        name,
        password: hashedPassword,
      });
      return await this.userRepository.save(user);
    } catch (error) {
      throw new HttpException('something went wrong', 500);
    }
  }

  async updateUser(userId: string, updateuserDto: UpdateuserDto) {
    const user = await this.userRepository.findOne({ where: { userId } });
    if (!user) {
      throw new ConflictException('user not found');
    }
    if (updateuserDto.password) {
      updateuserDto.password = await bcrypt.hash(updateuserDto.password, 10);
    }
    const updatedUser = Object.assign(user, updateuserDto);
    const result = await this.userRepository.save(updatedUser);
    const { password, ...userWithoutPassword } = result;
    return userWithoutPassword;
  }
}
