import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class UpdatePasswordDto {
  @IsString({ message: 'Senha atual precisa ser uma string' })
  @IsNotEmpty({ message: 'Senha atual precisa ser preenchida' })
  currentPassword!: string;

  @IsString({ message: 'Nova senha precisa ser uma string' })
  @IsNotEmpty({ message: 'Nova senha precisa ser preenchida' })
  @MinLength(6, { message: 'Nova senha precisa ter pelo menos 6 caracteres' })
  newPassword!: string;
}
