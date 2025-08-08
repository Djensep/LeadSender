import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';

export class CreateContactDto {
  @ApiProperty({
    description: 'Имя контакта',
    example: 'Иван Петров',
    minLength: 2,
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @Length(2, 255)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  name!: string;

  @ApiProperty({
    description: 'Телефон в любом человекочитаемом виде',
    example: '+7 (708) 123-45-67',
  })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.replace(/\D+/g, '') : value,
  )
  @Matches(/^\d{10,15}$/, {
    message: 'phone должен содержать только цифры, 10–15 символов',
  })
  phone!: string;
}
