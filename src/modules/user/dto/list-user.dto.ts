import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsNumber,
  IsIn,
} from 'class-validator';

export class UserListDto {
  @IsOptional()
  @IsString()
  search: string;

  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  limit: number;

  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  page: number;

  @IsOptional()
  @Transform(({ value }) => value?.trim().toUpperCase())
  @IsIn(['ASC', 'DESC'])
  order: 'ASC' | 'DESC';

  @IsNotEmpty()
  orderColumn: string;
}
