export class Imagen {

    constructor(
        public id_imagen: number,
        public nombre: string,
        public descripcion: string,
        public imagen: string,
        public seleccion_imagen: number,
        public fecha_modifica_registro: string,
        public img_base64?: string,
        public fecha_modifica_registro_string?: string,
        public posicion?:number
    ) { }

}
