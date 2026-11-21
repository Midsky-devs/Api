import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe, Query,  Req } from '@nestjs/common';
import { LibroService } from './libro.service.js';
import { CreateLibroDto } from './dto/create-libro.dto.js';
import { UpdateLibroDto } from './dto/update-libro.dto.js';
import { Libro } from './entities/libro.entity.js';
import * as express from 'express';

@Controller('libro')
export class LibroController {
  constructor(private readonly libroService: LibroService) {}

  @Post()
  create(@Body(new ValidationPipe() ) createLibroDto: CreateLibroDto) {
    return this.libroService.create(createLibroDto);
  }

  @Get()
  findAll() {
    return this.libroService.findAll();
  }

  @Get(':id_libro')
  findOne(@Param('id_libro') id_libro: number) {
    return this.libroService.findOne(id_libro);
  }

  @Patch(':id_libro')
  update(@Param('id_libro') id_libro: number, @Body() data: UpdateLibroDto) {
    return this.libroService.update(id_libro, data);
  }

  @Delete(':id_libro')
  remove(@Param('id_libro') id_libro: number) {
    return this.libroService.remove(id_libro);
  }
  @Get('consultas/total')
  total() {
    return this.libroService.total();
  }
  @Get('consultas/data')
  async data() {
    return this.libroService.data();
  }
  @Post('insertar-masivo')
  async insertMasivo(@Body() lecturas: Libro []){
    await this.libroService.insertMasivo(lecturas);

    return{datos_ingresados:  lecturas.length};
  }
  @Get('consultas/paginado')
      paginado( @Query('pagina') pagina = 1, @Query('limite') limite = 50, @Req() request: express.Request ) {
        const baseUrl: string = `${request.protocol}://${request.host}${request.baseUrl}/libro/consultas/paginado`;
        return this.libroService.paginado( pagina, limite, baseUrl );
    }
} 
