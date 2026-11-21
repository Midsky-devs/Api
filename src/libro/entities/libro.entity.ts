import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Libro {
    @PrimaryGeneratedColumn()
    id_libro: number;

    @Column()
    titulo: string;

    @Column()
    autor: string;

    @Column()
    anio_publicacion: number;

    @Column()
    genero: string;

    @Column()
    pais_autor: string;
    
}