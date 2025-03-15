document.addEventListener('DOMContentLoaded', () => {
    const tablaDatos = document.getElementById('tablaDatos').querySelector('tbody');
    const datosFormulario = JSON.parse(localStorage.getItem('datosFormulario')) || [];

    datosFormulario.forEach(datos => {
        const nuevaFila = tablaDatos.insertRow();
        Object.entries(datos).forEach(([key, valor]) => {
            if (key !== 'agregarPersona') { // Filtra el dato del checkbox
                const nuevaCelda = nuevaFila.insertCell();
                nuevaCelda.textContent = valor;
            }
        });
    });
});