const container = document.getElementById("container");
const divCarrito = document.getElementById("carrito");
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// Función para crear las tarjetas de producto
function crearCard(coleccionable, contenedor, productos) {
  const card = document.createElement("div");
  card.className = coleccionable.stock ? "card" : "no-card";

  const titulo = document.createElement("p");
  titulo.innerText = coleccionable.nombre;
  titulo.className = "titulo";

  const imagen = document.createElement("img");
  imagen.src = coleccionable.imagen;
  imagen.alt = "NOIMG";
  imagen.className = "img";

  const precio = document.createElement("p");
  precio.innerText = `$${coleccionable.precio}`;
  precio.className = "titulo";

  const botonAgregar = document.createElement("button");
  botonAgregar.innerText = contenedor === "container" ? "Agregar" : "Quitar del carrito";
  botonAgregar.className = "btn-add";
  if (contenedor === "container") {
    botonAgregar.onclick = () => agregarAlCarrito(coleccionable.id, productos); 
  } else {
    botonAgregar.onclick = () => quitarDelCarrito(coleccionable.id);
  }

  card.appendChild(titulo);
  card.appendChild(imagen);
  card.appendChild(precio);
  card.appendChild(botonAgregar);

  const nuevoContenedor = document.getElementById(contenedor);
  nuevoContenedor.appendChild(card);
}

// Función para agregar productos al carrito
function agregarAlCarrito(id, productos) {
  const coleccionableAgregar = productos.find(el => el.id === id); // Utiliza los datos de los productos pasados como parámetro
  if (carrito.some(element => element.id === coleccionableAgregar.id)) {
    Toastify({
      text: `Ya agregaste a ${coleccionableAgregar.nombre} al carrito`,
      duration: 2000,
      gravity: `bottom`,
      position: `right`,
      style: {
        background: `linear-gradient(to right, #931010, #cc0000)`,
        color: `black`
      },
    }).showToast();
  } else {
    divCarrito.innerHTML = "";
    carrito.push(coleccionableAgregar);
    localStorage.setItem("carrito", JSON.stringify(carrito));
    carrito.forEach(el => crearCard(el, "carrito"));
    Toastify({
      text: `${coleccionableAgregar.nombre} agregado al carrito`,
      duration: 1000,
      gravity: `bottom`,
      position: `right`,
      style: {
        background: `linear-gradient(to right, #0b6730, #008f39)`,
        color: `black`
      },
    }).showToast();
  }
}

// Función para quitar productos del carrito
function quitarDelCarrito(id) {
  const productoAQuitar = carrito.find(el => el.id === id);
  Swal.fire({
    title: `Quieres eliminar el producto del carrito? ${productoAQuitar.nombre}`,
    icon: `Warning`,
    showCancelButton: true,
    confirmButtonText: `si, estoy seguro`,
    cancelButtonText: `No, no quiero`,
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        title: "Exito!",
        text: `Eliminado del carrito ${productoAQuitar.nombre}`,
        icon: "success",
        showConfirmButton: false,
        timer: 2000,
      });
      divCarrito.innerHTML = "";
      let nuevoCarrito = carrito.filter(el => el.id !== id);
      localStorage.setItem("carrito", JSON.stringify(nuevoCarrito));
      carrito = nuevoCarrito;
      carrito.forEach(el => crearCard(el, "carrito"));
    } else {
      Swal.fire({
        title: "No se elimino",
        text: `No eliminaste a ${productoAQuitar.nombre}`,
        icon: "error",
        showConfirmButton: false,
        timer: 2000,
      });
    }
  });
}

// Función para mostrar u ocultar el carrito
function mostrarOcultar(estadoActual) {
  if (estadoActual) {
    mostrar = false;
    botonMostrarOcultar.innerText = "Mostrar"
    divCarrito.innerHTML = "";
  } else {
    divCarrito.innerHTML = "";
    botonMostrarOcultar.innerText = "Ocultar"
    mostrar = true;
    carrito.forEach(el => crearCard(el, "carrito"));
  }
}


fetch('./js/data.json')
  .then(response => response.json())
  .then(data => {
    data.forEach(producto => crearCard(producto, "container", data)); 
  })
  .catch(error => console.error('Error al obtener los datos:', error));


carrito.forEach(producto => crearCard(producto, "carrito"));