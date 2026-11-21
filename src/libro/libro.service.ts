import { Injectable } from '@nestjs/common';
import { CreateLibroDto } from './dto/create-libro.dto.js';
import { UpdateLibroDto } from './dto/update-libro.dto.js';
import { Repository, LessThan } from 'typeorm';
import { Libro} from './entities/libro.entity.js';
import { InjectRepository } from '@nestjs/typeorm';
import { Sensor } from '../sensors/entities/sensor.entity.js';

@Injectable()
export class LibroService {
  constructor(
    @InjectRepository( Libro, "mssql-connection")
    private libroRepository: Repository<Libro>
  ){}

  async create(data: CreateLibroDto) {
    const register = this.libroRepository.create(data);
    return await this.libroRepository.save(register);
  }

  async findAll() {
    return await this.libroRepository.find();
  }

  async findOne(id_libro: number) {
    return await this.libroRepository.findBy( { id_libro } );
  }

  async update(id_libro: number, data: UpdateLibroDto) {
    return await this.libroRepository.update(id_libro, data);
  }

  async remove(id_libro: number) {
    return await this.libroRepository.delete(id_libro); 
  }
  async insertMasivo( lecturas: Partial<Libro>[], tamanoLote=250 ){
      for ( let i = 0; i < lecturas.length; i += tamanoLote ){
        await this.libroRepository
          .createQueryBuilder()
          .insert()
          .into(Libro)
          .values(lecturas.slice(i, i + tamanoLote))
          .execute();
      }
    }

    async total() {
    // select count(*) from cliente;
    return await this.libroRepository.count();
  }

  async paginado( pagina: number = 1, limite: number = 50, baseUrl: string ) {
    /*
     (pagina 2)
      SELECT * FROM libro
      ORDER BY id_libro DESC
      LIMIT 50 OFFSET 50;
    */
    const data = await this.libroRepository.find({
      order: { id_libro: 'DESC' },
      skip: (pagina - 1) * limite,
      take: limite,
    });

    const pagina_next: number = pagina + 1;
    const next = `${baseUrl}?pagina=${+pagina_next}&limite=${limite}`;
    const prev = ( pagina - 1 == 0 ) ? null : `${baseUrl}?pagina=${+pagina_next}&limite=${limite}`;

    const author = "Author: KZ_SCJ";

    return {
      author,
      next,
      prev,
      data
    }
  }

    //Total de Libros
  private async estadoLibro(){
    return await this.libroRepository.find({
      select:{titulo: true, id_libro: true},
      order:{id_libro: 'DESC'},
      take: 10
    });
  }

  //Lista de libros publicados antes de 1960
  private async librosAntes1960(){
    return await this.libroRepository.find({
      select:{titulo: true, anio_publicacion: true, id_libro: true},
      where:{anio_publicacion: LessThan(1960)},
      order:{anio_publicacion: 'ASC'},
      take: 10
    });
  }

  //Libros por genero
  private async librosPorGenero(){
    return await this.libroRepository
    .createQueryBuilder('libro')
    .select('COUNT(libro.genero)', 'total')
    .addSelect('libro.genero', 'genero')
    .groupBy('libro.genero')
    .getRawMany();
  }

  //Libros de autores mexicanos por año
  private async librosMexicanosPorAnio(){
    return await this.libroRepository
    .createQueryBuilder('libro')
    .select('COUNT(libro.anio_publicacion)', 'total')
    .addSelect('libro.anio_publicacion', 'anio_publicacion')
    .where('libro.pais_autor = :pais', { pais: 'México' })
    .groupBy('libro.anio_publicacion')
    .orderBy('libro.anio_publicacion', 'ASC')
    .getRawMany();
  }

  //Libro más reciente y más antiguo
  private async libroRecienteYAntiguo(){
    const [libroReciente] = await this.libroRepository.find({
      order: { anio_publicacion: 'DESC' },
      take: 1
    });

    const [libroAntiguo] = await this.libroRepository.find({
      order: { anio_publicacion: 'ASC' },
      take: 1
    });
    
    return {
      libroReciente: libroReciente ?? null,
      libroAntiguo: libroAntiguo ?? null
    };
  }

  //Autores que han publicado más de un libro
  private async autoresConMasDeUnLibro(){
    return await this.libroRepository
    .createQueryBuilder('libro')
    .select('COUNT(libro.autor)', 'total')
    .addSelect('libro.autor', 'autor')
    .groupBy('libro.autor')
    .having('COUNT(libro.autor) > 1')
    .getRawMany();
  }

  //Libros publicados por decada
  private async librosPorDecada(){
    return await this.libroRepository
    .createQueryBuilder('libro')
    .select('COUNT(libro.anio_publicacion)', 'total')
    .addSelect('FLOOR(libro.anio_publicacion / 10) * 10', 'decada')
    .groupBy('FLOOR(libro.anio_publicacion / 10) * 10')
    .getRawMany();
  }

  async data() {
    const total = await this.total();
    const estado = await this.estadoLibro();
    const librosAntes1960 = await this.librosAntes1960();
    const librosPorGenero = await this.librosPorGenero();
    const librosMexicanosPorAnio = await this.librosMexicanosPorAnio();
    const libroRecienteYAntiguo = await this.libroRecienteYAntiguo();
    const autoresConMasDeUnLibro = await this.autoresConMasDeUnLibro();
    const librosPorDecada = await this.librosPorDecada();
    
    return {
      total,
      estado,
      librosAntes1960,
      librosPorGenero,
      librosMexicanosPorAnio,
      libroRecienteYAntiguo,
      autoresConMasDeUnLibro,
      librosPorDecada
    };
  }
}