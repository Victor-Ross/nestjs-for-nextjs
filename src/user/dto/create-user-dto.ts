import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString({ message: 'Nome precisa ser uma string' })
  @IsNotEmpty({ message: 'Nome precisa ser preenchido' })
  name!: string;

  @IsEmail({}, { message: 'Email inválido' })
  email!: string;

  @IsString({ message: 'Senha precisa ser uma string' })
  @IsNotEmpty({ message: 'Senha precisa ser preenchida' })
  @MinLength(6, { message: 'Senha precisa ter pelo menos 6 caracteres' })
  password!: string;
}
