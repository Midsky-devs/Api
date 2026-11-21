import { Type } from 'class-transformer';
import {
    IsInt,
    IsString,
    Max,
    MaxLength,
    Min,
    MinLength,
} from 'class-validator';

export class CreateLibroDto {

    @IsString()
    @MinLength(1)
    @MaxLength(250)
    titulo: string;

    @IsString()
    @MinLength(1)
    @MaxLength(250)
    autor: string;

    @Type(() => Number)
    @IsInt()
    @Min(1000)
    @Max(2050)
    anio_publicacion: number;

    @IsString()
    @MinLength(1)
    @MaxLength(100)
    genero: string;

    @IsString()
    @MinLength(1)
    @MaxLength(100)
    pais_autor: string;

}
