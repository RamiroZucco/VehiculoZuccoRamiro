import { Vehiculo }  from "./Vehiculo.js";

class Auto extends Vehiculo
{
    cantidadPuertas;
    asientos;

    constructor(modelo,anoFabricacion,velMax,cantidadPuertas,asientos,id)
    {
        super(modelo,anoFabricacion,velMax,id); 
        this.cantidadPuertas = cantidadPuertas;
        this.asientos = asientos;
    }

    toJson(){return JSON.parse(this);}

    toString() {
        return `${super.toString()}, Puertas: ${this.cantidadPuertas}, Asientos: ${this.asientos}`;
    }

}
export { Auto };
