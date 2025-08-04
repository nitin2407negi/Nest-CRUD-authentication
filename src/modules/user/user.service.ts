import {
  ConflictException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from 'src/common/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
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
      if (existingUser) {
        throw new ConflictException('user already exist');
      }
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await this.userRepository.create({
        name,
        email,
        password: hashedPassword,
      });
      const savedUser = await this.userRepository.save(user);
      delete savedUser.password;
      return savedUser;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.error(error);
      throw new HttpException('something went wrong', 500);
    }
  }

  async updateUser(
    userId: string,
    updateUserDto: UpdateuserDto,
  ): Promise<Partial<any>> {
    try {
      const user = await this.userRepository.findOne({ where: { userId } });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      // ✅ Check for email conflict if email is being updated
      if (updateUserDto.email && updateUserDto.email !== user.email) {
        const emailExist = await this.userRepository.findOne({
          where: { email: updateUserDto.email },
        });
        if (emailExist) {
          throw new ConflictException('Email already in use');
        }
      }

      // ✅ Hash password if provided
      if (updateUserDto.password) {
        updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
      }

      // ✅ Merge and save regardless of which field was updated
      const updatedUser = this.userRepository.merge(user, updateUserDto);
      const savedUser = await this.userRepository.save(updatedUser);

      delete savedUser.password;
      return savedUser;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('something went wrong', 500);
    }
  }
}
