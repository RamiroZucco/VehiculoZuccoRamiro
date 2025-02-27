import { Vehiculo }  from "./Vehiculo.js"; //Hereda propiedades y metodos de Persona

class Camion extends Vehiculo //Obtiene propiedades y constructor de Persona
{
    carga;
    autonomia; //Propiedad exclusiva de Extranjero

    constructor(modelo,anoFabricacion,velMax,carga,autonomia,id)
    {
        super(modelo,anoFabricacion,velMax,id); //Llama al constructor de la clase padre
        this.carga = carga;
        this.autonomia = autonomia;
    }
    
    toJson(){return JSON.parse(this);}

    toString() {
        return `${super.toString()}, Carga: ${this.carga}, Autonomía: ${this.autonomia}`;
    }
}
export { Camion };