document.addEventListener('DOMContentLoaded', function() {
    const checkbox = document.querySelector('input[type="checkbox"]');
    const formularioNuevo = document.querySelector('.formularioNuevo');

    function agregarFormulario() {
        formularioNuevo.innerHTML = `
            <label for="nombre">Nombre</label>
            <input id="nombre" type="text" name="nombre">
            <label for="apellido">Apellidos</label>
            <input id="apellido" type="text" name="apellido">
            <label for="documento">N° de documento</label>
            <input id="documento" type="number" name="documento" min="6">
            <label for="fechaNacimiento">Fecha de Nacimiento</label>
            <input id="fechaNacimiento" type="date" name="fechaNacimiento">
            <label for="destino">Lugar de destino</label>
            <input id="destino" type="text" name="destino">
            <div class="formularioBotones">
                <input type="submit" class="enviarFormulario" value="Enviar">
            </div>
            <div class="codigoGenerado inputVacio"></div>
        `;
        formularioNuevo.classList.add('formularioContenedor');
    }

    checkbox.addEventListener('change', () => {
        if (checkbox.checked) {
            agregarFormulario();
        } else {
            formularioNuevo.innerHTML = '';
            formularioNuevo.classList.remove('formularioContenedor');
        }
    });

    const formOriginal = document.querySelector('.formularioContenedor');
    formOriginal.addEventListener('submit', (event) => {
        event.preventDefault();
        enviarDatosFormularios();
    });

    function generarCodigoAleatorio() {
        const numeros = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
        const letras = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'ñ', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
        const caracteres = numeros.concat(letras); 
        let codigo = "";
        for (let i = 0; i < 6; i++) {
            const indice = Math.floor(Math.random() * caracteres.length);
            codigo += caracteres[indice];
        }
        return codigo;
    }

    function enviarDatosFormularios() {
        const formularios = document.querySelectorAll('form');
        let todosLosDatos = [];
        let formularioVacio = false;

        // Generar un solo código aleatorio si hay más de un formulario o si el checkbox está marcado
        const codigoAleatorio = (formularios.length > 1 || checkbox.checked) ? generarCodigoAleatorio() : null;

        formularios.forEach(formulario => {
            const formData = new FormData(formulario);
            let formularioDatos = {};

            for (let [name, value] of formData.entries()) {
                if (value.trim() === '') {
                    formularioVacio = true;
                }
                formularioDatos[name] = value.trim();
            }

            if (!formularioVacio && codigoAleatorio) {
                formularioDatos['codigo'] = codigoAleatorio;
                const codigoGenerado = formulario.querySelector('.codigoGenerado');
                if (codigoGenerado && (formulario === formOriginal || checkbox.checked)) {
                    codigoGenerado.innerHTML = `El código generado es: ${codigoAleatorio}`;
                }
            }

            todosLosDatos.push(formularioDatos);
        });

        if (!formularioVacio) {
            console.log(todosLosDatos);

            // Recuperar los datos existentes en localStorage
            const datosExistentes = JSON.parse(localStorage.getItem('datosFormulario')) || [];
            // Filtrar duplicados
            let esDuplicado = false;
            todosLosDatos.forEach(nuevoDato => {
                if (datosExistentes.some(datoExistente => 
                    JSON.stringify(datoExistente) === JSON.stringify(nuevoDato)
                )) {
                    esDuplicado = true;
                }
            });

            if (!esDuplicado) {
                // Agregar los nuevos datos
                const nuevosDatos = datosExistentes.concat(todosLosDatos);
                // Guardar todos los datos juntos en localStorage
                localStorage.setItem('datosFormulario', JSON.stringify(nuevosDatos));
            } else {
                alert('Los datos ya existen. No se pueden enviar formularios duplicados.');
            }
        } else {
            const formulario = document.querySelector('.formularioContenedor');
            const inputVacio = formulario.querySelector('.inputVacio');
            inputVacio.innerHTML = `Por favor, complete todos los campos`;
            inputVacio.classList.toggle('error', true);
        }
    }

    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('enviarFormulario')) {
            event.preventDefault();
            enviarDatosFormularios();
        }
    });
});