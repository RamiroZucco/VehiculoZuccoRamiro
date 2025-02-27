class Validaciones //No necesita instanciarse, todos metodos estaticos
{
    //Verifica si id es unico en el array
    static VerificarIdUnico(id, array, errorMsg)
    {
        if (Validaciones.IdUnico(id, array)) return id;
        else throw new Error(errorMsg);
    }

    //Recorre array y compara si id existe (true si es unico)
    static IdUnico(id, array)
    {
        let retorno = true;
        for(let i=0; i<array.length; i++)
        {
            if (array[i] == id) 
            {
                retorno = false;
                break;
            }
        }
        return retorno;
    }

    //Verifica si un string es válido
    static ValidarString(valor, minimo, msjError) 
    {
        // Verifica que el valor no sea nulo ni vacío
        if (!this.VerificarNulo(valor, msjError)) {
            throw new Error(msjError);
        }

        // Verifica que el valor sea un string y NO un número
        if (typeof valor !== "string" || !isNaN(valor)) {
            throw new Error(msjError);
        }

        // Verifica que tenga al menos `minimo` caracteres
        if (valor.length < minimo) {
            throw new Error(msjError);
        }

        return valor; 
    }


    //Verifica si un número entero está dentro de un rango
    static ValidateNum(num, minimo=0, maximo=100, errorMsg)
    {
        if (!isNaN(num))
        {
            if (minimo!=null && maximo!=null)
            {
                if (parseInt(num) > minimo && parseInt(num) < maximo) return parseInt(num);
                else {throw new Error(errorMsg);}
            }
            else return parseInt(num);
        
        }
        else {throw new Error(errorMsg);}
    }

    //Igual que ValidateNum() pero para números con decimales
    static ValidateNumFloat(num, minimo=0, maximo=100, errorMsg)
    {
        if (!isNaN(num))
        {
            if (minimo!=null && maximo!=null)
            {
                if (parseFloat(num) > minimo && parseFloat(num) < maximo) return parseFloat(num);
                else {throw new Error(errorMsg);}
            }
            else return parseFloat(num);
        }
        else {throw new Error(errorMsg);}
    }

    //Verifica que valor no sea nulo ni vacío
    static VerificarNulo(valor, errorMsg)
    {
        if (valor != null && valor != "") return valor;
        else throw new Error(errorMsg);
    }

    //Verifica que valor no sea un string vacío
    static VerificarStrVacio(valor, errorMsg)
    {
        if (valor != "") return valor;
        else throw new Error(errorMsg);
    }

    //Valida si num es un número entero mayor que minimo
    static VerificarNumMayorInt(num, minimo, errorMsg) {
        if (!isNaN(num)) {
            if (num === "") throw new Error(errorMsg);
            let numInt = parseInt(num);
            if (numInt > minimo) return numInt;
            else throw new Error(errorMsg); 
        } else {
            throw new Error(errorMsg);
        }
    }
    
    //Similar a VerificarNumMayorInt(), pero para números decimales
    static VerificarNumMayorFloat(num, minimo, errorMsg) {
        if (!isNaN(num)) {
            if (num === "") throw new Error(errorMsg);
            let numFloat = parseFloat(num);
            if (numFloat > minimo) return numFloat;
            else throw new Error(errorMsg);  
        } else {
            throw new Error(errorMsg);
        }
    }
    
}

export { Validaciones }