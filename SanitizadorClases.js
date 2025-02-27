import {Auto} from "./clases/Auto.js"; 
import {Camion} from "./clases/Camion.js"; 

class SanitizadorClases 
{
    //Convierte un objeto común en una instancia de Auto o Camion
    static FromObjectToClass(obj)
    {
        let retorno;
        if (obj["cantidadPuertas"] == undefined && obj["asientos"] == undefined)
        {
            retorno = new Camion(obj["modelo"], obj["anoFabricacion"],
            obj["velMax"], obj["carga"], obj["autonomia"], obj["id"],
            )
        }
        else
        {
            retorno = new Auto(obj["modelo"], obj["anoFabricacion"],
            obj["velMax"], obj["cantidadPuertas"], obj["asientos"],obj["id"],
            )
        }
        return retorno;
    }

    //Convierte un array de objetos en un array de instancias de Auto o Camion.
    static FromObjectArrayToClassArray(arrayObject)
    {
        try
        {
            let arrayFinal = [];
            for (let i=0; i<arrayObject.length; i++)
            {
                let objeto = SanitizadorClases.FromObjectToClass(arrayObject[i]);
                arrayFinal.push(objeto);
            }
            return arrayFinal;
        }
        catch (e) {throw e;}
    }
    
    //Busca la posición (índice) de un objeto dentro de un array utilizando su id
    static EncontrarIndice(arrayObject, id)
    {
        try
        {
            let retorno = -1;

            for (let i=0; i<arrayObject.length; i++)
            {
                if (arrayObject[i].id == id) retorno = i; //Guarda indice en retorno
            }
            return retorno;
        }
        catch (e) {throw e;}
    }

    //Extrae ciertos valores de un objeto y los coloca en un array
    static ArrayValuesDeObjeto(objeto)
    {
        let lista = [objeto["id"], objeto["modelo"], objeto["anoFabricacion"], objeto["velMax"]];

        if (objeto.hasOwnProperty("cantidadPuertas") && objeto.hasOwnProperty("asientos")) 
        {
            //Es un AUTO
            lista.push(objeto["cantidadPuertas"]); // Cantidad de puertas
            lista.push("N/A"); // Carga no aplica a autos
            lista.push(objeto["asientos"]); // Asientos
            lista.push("N/A"); // Autonomía no aplica a autos
        }
        else if (objeto.hasOwnProperty("carga") && objeto.hasOwnProperty("autonomia")) 
        {
            //Es un CAMIÓN
            lista.push("N/A"); // Cantidad de puertas no aplica a camiones
            lista.push(objeto["carga"]); // Carga
            lista.push("N/A"); // Asientos no aplica a camiones
            lista.push(objeto["autonomia"]); // Autonomía
        }
        return lista;
    }

    //Crea una lista de clases CSS (auto o camion) para filas de una tabla HTML.
    static ListaClasesTr(arrayObjetosFinal)
    {
        let clasesTr = [];
        for (let i=0; i<arrayObjetosFinal.length; i++)
        {
            //Determina si el objeto es auto o camion y agrega la clase resultante a un array
            clasesTr.push(SanitizadorClases.StringSegunDosObjetos(arrayObjetosFinal[i], "auto", "camion", Auto, Camion));
        }
        return clasesTr;
    }

    //Retorna un string dependiendo del tipo de objeto
    //Si el objeto es un auto, devuelve "auto"
    //Si es un camion, devuelve "camion"
    static StringSegunDosObjetos(objeto, valor1, valor2, clase1, clase2)
    {
        let strRetorno = "";
        if (objeto instanceof clase1) strRetorno = valor1;
        else if (objeto instanceof clase2) strRetorno = valor2;
        return strRetorno;
    }
}

export {SanitizadorClases}