import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';

export class CreateDealDto {
  @ApiProperty({
    description: 'Название сделки',
    example: 'Заявка с лендинга №1024',
    minLength: 2,
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @Length(2, 255)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  dealName!: string;

  @ApiProperty({
    description: 'Имя контактного лица',
    example: 'Иван Петров',
    minLength: 2,
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @Length(2, 255)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  contactName!: string;

  @ApiProperty({
    description:
      'Телефон. На вход можно в любом виде, в DTO останутся только цифры.',
    example: '+7 (777) 123-45-67',
  })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.replace(/\D+/g, '') : value,
  )
  @Matches(/^\d{10,15}$/, {
    message: 'contactPhone должен содержать только цифры, 10–15 символов',
  })
  contactPhone!: string;
}
