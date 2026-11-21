import { Module } from '@nestjs/common';
import { LibroService } from './libro.service.js';
import { LibroController } from './libro.controller.js';
import { Libro } from './entities/libro.entity.js';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ 
      Libro
    ],"mssql-connection")
  
  ],
  controllers: [LibroController],
  providers: [LibroService],
})
export class LibroModule {}
