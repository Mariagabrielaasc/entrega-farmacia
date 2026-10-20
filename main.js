// aca creamos el array con los objetos
const farmacias = [
    {
        comuna: "Santiago",
        nombre: "Farmacia Ahumada",
        direccion: "Av. Libertador Bernardo O'Higgins 123",
        apertura: "08:00",
        cierre: "23:00"
    },
    {
        comuna: "Providencia",
        nombre: "Farmacia Salud",
        direccion: "Av. Providencia 456",
        apertura: "09:00",
        cierre: "22:00"
    },
    {
        comuna: "Maipú",
        nombre: "Farmacia Vida",
        direccion: "Av. Pajaritos 789",
        apertura: "08:00",
        cierre: "21:00"
    },
    {
        comuna: "La Florida",
        nombre: "Farmacia Bienestar",
        direccion: "Av. Vicuña Mackenna 321",
        apertura: "08:00",
        cierre: "23:30"
    }
];

// Clase encargada de consultar las farmacias
class Serviciofarmacias {
    async buscarPorComuna(comuna) {
        // utilizamos promise y resolve para simular el tiempo en que se demora 
        await new Promise(resolve => setTimeout(resolve, 500));

        const comunaBuscada = comuna.trim().toLocaleLowerCase("es");
// ACA RETORNAMOS LA FARMACIA BUSCADO CON EL METODO FILTER
        return farmacias.filter(farmacia =>
            farmacia.comuna.toLocaleLowerCase("es") === comunaBuscada
        );
    }
}
// Creamos una instancia de la clase
const servicio = new Serviciofarmacias();

function calcularMinutosRestantes(horaCierre) {
    const ahora = new Date();
    const [horas, minutos] = horaCierre.split(":").map(Number);

    const cierre = new Date();
    cierre.setHours(horas, minutos, 0, 0);

    // Si la hora de cierre ya pasó, consideramos el cierre del día siguiente
    if (cierre <= ahora) {
        cierre.setDate(cierre.getDate() + 1);
    }

    const diferencia = cierre - ahora;
    return Math.ceil(diferencia / (1000 * 60));
}

function generarRecomendacion(minutosRestantes) {
    if (minutosRestantes < 60) {
        return "Dirígete lo antes posible.";
    }

    if (minutosRestantes > 240) {
        return "Tienes tiempo para planificar tu visita.";
    }

    return "Ten en cuenta el horario y organiza tu salida.";
}
// ACA HACEMOS USO DEL DOM para Acceder al html 
const formulario = document.getElementById("formulario-busqueda");
const campoComuna = document.getElementById("comuna");
const contenedorResultados = document.getElementById("resultados");
const mensaje = document.getElementById("mensaje");
const botonBuscar = document.getElementById("boton-buscar");

function mostrarFarmacias(listaFarmacias) {
    contenedorResultados.replaceChildren();

    if (listaFarmacias.length === 0) {
        mensaje.textContent = "No encontramos farmacias para esa comuna.";
        return;
    }

    mensaje.textContent = `Encontramos ${listaFarmacias.length} farmacia(s).`;

    listaFarmacias.forEach(farmacia => {
        const minutos = calcularMinutosRestantes(farmacia.cierre);
        const recomendacion = generarRecomendacion(minutos);

        const tarjeta = document.createElement("article");
        tarjeta.className = "farmacia";

        const titulo = document.createElement("h2");
        titulo.textContent = farmacia.nombre;

        const direccion = document.createElement("p");
        direccion.textContent = `Dirección: ${farmacia.direccion}`;

        const horario = document.createElement("p");
        horario.textContent = `Horario: ${farmacia.apertura} - ${farmacia.cierre}`;

        const tiempo = document.createElement("p");
        const horasRestantes = Math.floor(minutos / 60);
        const minutosRestantes = minutos % 60;

        tiempo.textContent =
            `Tiempo estimado hasta el cierre: ${horasRestantes} h ${minutosRestantes} min`;

        const consejo = document.createElement("p");
        consejo.className = "recomendacion";
        consejo.textContent = `💡 ${recomendacion}`;

        tarjeta.append(titulo, direccion, horario, tiempo, consejo);
        contenedorResultados.appendChild(tarjeta);
    });
}
// CREAMOS UN EVENTO 

formulario.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    const comuna = campoComuna.value.trim();

    if (!comuna) {
        mensaje.textContent = "Por favor, ingresa una comuna.";
        contenedorResultados.replaceChildren();
        return;
    }

    botonBuscar.disabled = true;
    mensaje.textContent = "Buscando farmacias...";
    contenedorResultados.replaceChildren();

    try {
        const resultados = await servicio.buscarPorComuna(comuna);
        mostrarFarmacias(resultados);
    } catch (error) {
        console.error("Error en la búsqueda:", error);
        mensaje.textContent = "Ocurrió un error al buscar. Inténtalo nuevamente.";
    } finally {
        botonBuscar.disabled = false;
    }
});
