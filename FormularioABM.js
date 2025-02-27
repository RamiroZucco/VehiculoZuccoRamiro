import {Utilidades} from "./Utilidades.js";
import {Validaciones} from "./Validaciones.js";
import {FormularioSpinner} from "./FormularioSpinner.js";
import {arrayFinal, ActualizarTabla} from "./index.js";
import {SanitizadorClases} from "./SanitizadorClases.js";

class FormularioABM
{
    //Los 4 array deben ser iguales en lenght. Como listas paralelas
    constructor(etiquetaPadre, arrayClasesDiv, arrayLabelsClases, arrayLabelsTextos, arrayInputClases, accion="alta", objEdit=null, select=false, idSelect=null, opc1=null,opc2=null,opc3=null,opc4=null, hayFuncionCambio=false, funcion=null)
    {
        this.accion = accion;
        this.objEdit = objEdit;

        //Crea titulo y subtitulo
        let titulo = Utilidades.CrearElementoHtml("h2", "titulo", "Formulario ABM", true);
        let subTitulo =Utilidades.CrearElementoHtml("h4", "subTitulo", "Alta", true);

        etiquetaPadre.appendChild(titulo);
        etiquetaPadre.appendChild(subTitulo);

        //Genera los campos del formulario dinámicamente en base a los arrays de clases y etiquetas
        for (let i=0; i<arrayClasesDiv.length; i++)
        {
            let divActual = this.AgregarDivLabelInput(arrayClasesDiv[i], arrayLabelsClases[i],
                                                    arrayLabelsTextos[i], arrayInputClases[i])
            etiquetaPadre.appendChild(divActual);
        }

        //Si select es true, se agrega un <select> con opciones predefinidas
        if (select != false)
        {
            let select = null;
            if (hayFuncionCambio) select = this.AgregarSelect(idSelect, opc1, opc2, opc3, opc4, true, funcion);
            else select = this.AgregarSelect(idSelect, opc1, opc2, opc3, opc4);
            
            etiquetaPadre.appendChild(select);
        }

        //Crea botones y los agrega al DOM
        let botonAceptar = Utilidades.CrearElementoHtml("button", "btnAceptar", "Aceptar", true);
        let botonCancelar = Utilidades.CrearElementoHtml("button", "btnCancelar", "Cancelar", true);
        etiquetaPadre.appendChild(botonAceptar);
        etiquetaPadre.appendChild(botonCancelar);

        this.HabilitarInputs();

        Utilidades.ExtraerListaClase("txt_id")[0].readOnly = true;

        //Asigna eventos al botón "Aceptar" según la acción (alta, modificar, eliminar).
        //Carga datos si se está editando o eliminando.
        //Deshabilita campos según sea necesario.
        if (this.accion == "alta")
        {
            botonAceptar.addEventListener("click", this.btnAceptarAlta.bind(this));

            subTitulo.textContent = "Alta";
            Utilidades.ExtraerListaClase("selectTipo")[0].value = "auto";

            Utilidades.ExtraerListaClase("txt_id")[0].value = "";
            Utilidades.ExtraerListaClase("txt_modelo")[0].value = "";
            Utilidades.ExtraerListaClase("txt_anoFabricacion")[0].value = "";
            Utilidades.ExtraerListaClase("txt_velMax")[0].value = "";
            Utilidades.ExtraerListaClase("txt_atr1")[0].value = "";
            Utilidades.ExtraerListaClase("txt_atr2")[0].value = "";


            Utilidades.ExtraerListaClase("lbl_atr1")[0].textContent = "cantidadPuertas";
            Utilidades.ExtraerListaClase("lbl_atr2")[0].textContent = "asientos";
        }
        else if (this.accion == "modificar")
        {
            botonAceptar.addEventListener("click", this.btnAceptarModificar.bind(this));

            subTitulo.textContent = "Modificar";
            this.DeshabilitarCiertosInputs(true, true, false, false, false, false, false);

            this.SetearValoresObjeto();
            this.id = Utilidades.ExtraerListaClase("txt_id")[0].value;
        }
        else
        {
            botonAceptar.addEventListener("click", this.btnAceptarEliminar.bind(this));

            subTitulo.textContent = "Eliminar";
            this.DeshabilitarCiertosInputs(true, true, true, true, true, true, true);

            this.SetearValoresObjeto();
            this.id = Utilidades.ExtraerListaClase("txt_id")[0].value;
        }
        botonCancelar.addEventListener("click", this.btnCancelar.bind(this));
    }

    //Carga los datos desde una fila de la tabla (objEdit) al formulario.
    //Extrae los valores de las celdas (td) y los asigna a los inputs del formulario.
    //Determina si el objeto es auto o camion con base en si el cantidadPuertas está presente.
    //Guarda el id del objeto en this.id
    SetearValoresObjeto()
    {
        let listaTd = this.objEdit.querySelectorAll("td");

        Utilidades.ExtraerListaClase("txt_id")[0].value = listaTd[0].textContent;
        Utilidades.ExtraerListaClase("txt_modelo")[0].value = listaTd[1].textContent;
        Utilidades.ExtraerListaClase("txt_anoFabricacion")[0].value = listaTd[2].textContent;
        Utilidades.ExtraerListaClase("txt_velMax")[0].value = listaTd[3].textContent;

        if (listaTd[4].textContent != "N/A") 
        {
            //Es un AUTO
            Utilidades.ExtraerListaClase("selectTipo")[0].value = "auto";
            Utilidades.ExtraerListaClase("txt_atr1")[0].value = listaTd[4].textContent; // cantidadPuertas
            Utilidades.ExtraerListaClase("lbl_atr1")[0].textContent = "cantidadPuertas";
            Utilidades.ExtraerListaClase("txt_atr2")[0].value = listaTd[6].textContent; // asientos
            Utilidades.ExtraerListaClase("lbl_atr2")[0].textContent = "asientos";
        }
        else 
        {
            //Es un CAMIÓN
            Utilidades.ExtraerListaClase("selectTipo")[0].value = "camion";
            Utilidades.ExtraerListaClase("txt_atr1")[0].value = listaTd[5].textContent; // carga
            Utilidades.ExtraerListaClase("lbl_atr1")[0].textContent = "carga";
            Utilidades.ExtraerListaClase("txt_atr2")[0].value = listaTd[7].textContent; // autonomía
            Utilidades.ExtraerListaClase("lbl_atr2")[0].textContent = "autonomia";
        }
    }

    //Recibe un conjunto de booleanos y deshabilita los campos correspondientes
    DeshabilitarCiertosInputs(select,id,modelo,anoFabricacion,velMax,atr1,atr2)
    {
        if (select==true)Utilidades.ExtraerListaClase("selectTipo")[0].disabled = true;
        if (id==true)Utilidades.ExtraerListaClase("txt_id")[0].disabled = true;
        if (modelo==true)Utilidades.ExtraerListaClase("txt_modelo")[0].disabled = true;
        if (anoFabricacion==true)Utilidades.ExtraerListaClase("txt_anoFabricacion")[0].disabled = true;
        if (velMax==true)Utilidades.ExtraerListaClase("txt_velMax")[0].disabled = true;
        if (atr1==true)Utilidades.ExtraerListaClase("txt_atr1")[0].disabled = true;
        if (atr2==true)Utilidades.ExtraerListaClase("txt_atr2")[0].disabled = true;
    }   

    //Activa todos los inputs del formulario, permitiendo su edición
    HabilitarInputs()
    {
        Utilidades.ExtraerListaClase("selectTipo")[0].disabled = false;
        Utilidades.ExtraerListaClase("txt_id")[0].disabled = false;
        Utilidades.ExtraerListaClase("txt_modelo")[0].disabled = false;
        Utilidades.ExtraerListaClase("txt_anoFabricacion")[0].disabled = false;
        Utilidades.ExtraerListaClase("txt_velMax")[0].disabled = false;
        Utilidades.ExtraerListaClase("txt_atr1")[0].disabled = false;
        Utilidades.ExtraerListaClase("txt_atr2")[0].disabled = false;
    }

    //Crea dinámicamente un div con un label y un input dentro
    //Permite estructurar formularios de manera flexible
    AgregarDivLabelInput(claseDiv, claseLabel, txtLabel, claseInput)
    {
        let div = Utilidades.CrearElementoHtml("div", claseDiv, null, false);
        div.appendChild(Utilidades.CrearElementoHtml("label", claseLabel, txtLabel, true));
        div.appendChild(Utilidades.CrearElementoHtml("input", claseInput, null, false));
        return div;
    }

    //Crea un select con opciones dinámicas
    //Si hayEvento es true, agrega un evento change
    AgregarSelect(idSelect, opc1=null,opc2=null,opc3=null,opc4=null, hayEvento=false, funcion=null)
    {
        let select = Utilidades.CrearElementoHtml('select', "selectTipo", null, false);
        select.id = idSelect;
        
        if (opc1!=null)
        {
            let option1 = document.createElement('option');
            option1.value = opc1;
            option1.text = opc1;
            select.appendChild(option1);
        }
        if (opc2!=null)
        {
            let option1 = document.createElement('option');
            option1.value = opc2;
            option1.text = opc2;
            select.appendChild(option1);
        }
        if (opc3!=null)
        {
            let option1 = document.createElement('option');
            option1.value = opc3;
            option1.text = opc3;
            select.appendChild(option1);
        }
        if (opc4!=null)
        {
            let option1 = document.createElement('option');
            option1.value = opc4;
            option1.text = opc4;
            select.appendChild(option1);
        }

        if (hayEvento != false)
        {
            select.addEventListener('change', funcion);
        }

        return select;
    }

    //Limpia y oculta el formulario ABM
    btnCancelar()
    {
        Utilidades.ExtraerObjetoID("formulario-lista").style.display = "";
        let children = Utilidades.ExtraerObjetoID("formulario-abm").children;
        while (children.length > 0) {
            Utilidades.ExtraerObjetoID("formulario-abm").removeChild(children[0]);
        }
        Utilidades.ExtraerObjetoID("formulario-abm").style.display = "none";
    }

    //Recoge los datos del formulario
    //Realiza validaciones antes de enviarlos
    //Determina si es auto o camion y ajusta el objeto en consecuencia
    SetearEntidad()
    {
        let modelo = Utilidades.ExtraerListaClase("txt_modelo")[0].value;
        let anoFabricacion = Utilidades.ExtraerListaClase("txt_anoFabricacion")[0].value;
        let velMax = Utilidades.ExtraerListaClase("txt_velMax")[0].value;
        let atr1 = Utilidades.ExtraerListaClase("txt_atr1")[0].value;
        let atr2 = Utilidades.ExtraerListaClase("txt_atr2")[0].value;

        try
        {
            modelo = Validaciones.ValidarString(modelo, 2, "Modelo inválido");
            anoFabricacion = Validaciones.VerificarNumMayorInt(anoFabricacion, 1985, "Año de fabricacion inválido");
            velMax = Validaciones.VerificarNumMayorInt(velMax, 0, "Velocidad invalida");

            let pp = {
                modelo: modelo, 
                anoFabricacion: anoFabricacion, 
                velMax: velMax
            };

            if (Utilidades.ExtraerListaClase("selectTipo")[0].value == "auto") 
            {
                Validaciones.VerificarNumMayorInt(atr1, 2, "Cantidad de puertas invalida");
                Validaciones.VerificarNumMayorInt(atr2, 2, "Cantidad de asientos invalido");
                pp.cantidadPuertas = atr1;
                pp.asientos = atr2;

            }
            else
            {
                atr1 = Validaciones.VerificarNumMayorInt(atr1, 0, "Carga invalida");
                atr2 = Validaciones.VerificarNumMayorInt(atr2, 0, "Autonomia invalida");
                pp.carga = atr1;
                pp.autonomia = atr2;
            }
            console.log(pp);
            return pp;
        }
        catch (e) {throw e;}
    }

    async btnAceptarAlta()
    {
        try
        {
            //Recopila y valida datos del formulario
            let entidad = this.SetearEntidad();

            //Muestra spinner
            new FormularioSpinner(Utilidades.ExtraerObjetoID("body"));

            //Envia datos al servidor mediante POST
            const response = await fetch("https://examenesutn.vercel.app/api/VehiculoAutoCamion", {
                method: 'POST',
                mode: 'cors', 
                headers: {
                'Content-Type': 'application/json'
                },
                body: JSON.stringify(entidad)
            })
            if (response.ok) // Esto es q el server da 200. Si no, va al else. Pero no rompe, solo no es 200
            {
                let data = await response.json(); //Extrae rta JSON
                entidad.id = data.id; //Asigna el id devuelto por la API

                //Verifica id es unico
                let idArray = arrayFinal.map(function(e){return e.id;})
                Validaciones.VerificarIdUnico(data.id, idArray, "Id no único");

                //Convierte objeto en una instancia de auto o camion
                let obj = SanitizadorClases.FromObjectToClass(entidad);
                arrayFinal.push(obj); //Agrega obj a la lista de datos
                ActualizarTabla(); //Redibuja la tabla
            }
            else alert("Hubo un error con la petición a la api");
        }
        catch (e) {alert(e.message)}
        finally
        {
            this.btnCancelar(); //Oculta form y elimina spinner
            let spinner = Utilidades.ExtraerListaClase("spinner")[0];
            if (spinner) {
                Utilidades.ExtraerObjetoID("body").removeChild(spinner);
            }
        }
    }


    btnAceptarModificar()
    {
        try
        {
            let entidad = this.SetearEntidad();
            entidad.id = Utilidades.ExtraerListaClase("txt_id")[0].value;

            new FormularioSpinner(Utilidades.ExtraerObjetoID("body"));

            //Envía la solicitud PUT a la API para actualizar el registro
            const response = fetch("https://examenesutn.vercel.app/api/VehiculoAutoCamion", {
                method: 'PUT', 
                mode: 'cors', 
                headers: {
                'Content-Type': 'application/json'},
                body: JSON.stringify(entidad)
            })
            .then(response=>{ 
                console.log(response);
                if (!response.ok) {
                    throw new Error(`Error en la solicitud`);
                }
                return response;
            }) 
            .then(response=>{
                let indice = SanitizadorClases.EncontrarIndice(arrayFinal, entidad.id);
                let obj = SanitizadorClases.FromObjectToClass(entidad);
                
                //Reemplaza el objeto viejo con la version actualizada
                arrayFinal[indice] = obj;
                ActualizarTabla(arrayFinal);

                return response;
            }) 
            .catch(error=>{
                return alert(error.message);
            })
            .finally(() => {
                this.btnCancelar();
                Utilidades.ExtraerObjetoID("body").removeChild(Utilidades.ExtraerListaClase("spinner")[0]);
            });
        }
        catch (e) {alert(e.message)}
    }

    async btnAceptarEliminar()
    {
        try
        {
            let entidad = this.SetearEntidad();
            entidad.id = Utilidades.ExtraerListaClase("txt_id")[0].value;

            let id = {id : entidad.id};

            new FormularioSpinner(Utilidades.ExtraerObjetoID("body"));
            
            //Envía la solicitud DELETE a la API
            const response = await fetch("https://examenesutn.vercel.app/api/VehiculoAutoCamion", {
                method: 'DELETE',
                mode: 'cors', 
                headers: {
                'Content-Type': 'application/json'
                },
                body: JSON.stringify(id)
            })

            if (response.ok)
            {
                let index = SanitizadorClases.EncontrarIndice(arrayFinal, entidad.id);
                arrayFinal.splice(index, 1) //Elimina el registro del array
                ActualizarTabla(arrayFinal);
            }
            else alert("Hubo un error con la petición a la api");
        }
        catch (e) {alert(e.message)}
        finally
        {
            this.btnCancelar();
            Utilidades.ExtraerObjetoID("body").removeChild(Utilidades.ExtraerListaClase("spinner")[0]);
        }
    }
}   

export {FormularioABM}