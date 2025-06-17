document.addEventListener('DOMContentLoaded', () => {
    const formulario = document.getElementById('persona-1');
    const codigoDiv = formulario.querySelector('.codigoGenerado');

    formulario.addEventListener('submit', function(event) {
        event.preventDefault();

         // Validar campos vacíos
        const nombre = formulario.nombre.value.trim();
        const apellido = formulario.apellido.value.trim();
        const documento = formulario.documento.value.trim();
        const fechaNacimiento = formulario.fechaNacimiento.value.trim();
        const destino = formulario.destino.value.trim();

        if (!nombre || !apellido || !documento || !fechaNacimiento || !destino) {
            codigoDiv.textContent = "Por favor, completa todos los campos.";
            codigoDiv.classList.add('error');
        return;
        }

        const codigo = generarCodigoAleatorio();

        // Mostrar el código en pantalla
        codigoDiv.textContent = `Código generado: ${codigo}`;

        // Obtener los datos del formulario
        const datos = {
            nombre: formulario.nombre.value,
            apellido: formulario.apellido.value,
            documento: formulario.documento.value,
            fechaNacimiento: formulario.fechaNacimiento.value,
            destino: formulario.destino.value,
            codigo: codigo
        };

        // Guardar en localStorage
        const datosFormulario = JSON.parse(localStorage.getItem('datosFormulario')) || [];
        datosFormulario.push(datos);
        localStorage.setItem('datosFormulario', JSON.stringify(datosFormulario));

        formulario.reset();
    });
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

        const codigoAleatorio = generarCodigoAleatorio()

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
                codigoGenerado.innerHTML = `El código generado es: ${codigoAleatorio}`;
                }
            },
            todosLosDatos.push(formularioDatos));
        };

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
            inputVacio.classList.toggle('error');
        }

    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('enviarFormulario')) {
            event.preventDefault();
            enviarDatosFormularios();
        }
    });