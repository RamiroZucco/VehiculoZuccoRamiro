class Vehiculo
{
    //Propiedades de la clase
    id;
    modelo;
    anoFabricacion;
    velMax;

    constructor(modelo,anoFabricacion,velMax,id=null)
    {
        this.id = id; //Asigna valores recibidos en el construct a las propiedades del objeto
        this.modelo = modelo;
        this.anoFabricacion = anoFabricacion;
        this.velMax = velMax;
    }

    toString() {
        return `ID: ${this.id}, Modelo: ${this.modelo}, Año de Fabricación: ${this.anoFabricacion}, Velocidad Máxima: ${this.velMax}`;
    }
}
export { Vehiculo }; //Permite que sea importada y usada en otros archivos


//http://localhost/VehiculoZuccoRamiro-main/index.html