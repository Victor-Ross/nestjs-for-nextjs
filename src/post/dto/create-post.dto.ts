import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Length,
} from 'class-validator';

export class CreatePostDto {
  @IsString({ message: 'Título precisa ser uma string' })
  @Length(3, 255, { message: 'Título precisa ter entre 10 e 150 caracteres' })
  title!: string;

  @IsString({ message: 'Excerto precisa ser uma string' })
  @Length(3, 255, { message: 'Excerto precisa ter entre 10 e 200 caracteres' })
  excerpt!: string;

  @IsString({ message: 'Conteúdo precisa ser uma string' })
  @IsNotEmpty({ message: 'Conteúdo precisa ser preenchido' })
  content!: string;

  @IsOptional()
  @IsUrl({ require_tld: false }, { message: 'Imagem precisa ser uma URL' })
  coverImageUrl?: string;
}
