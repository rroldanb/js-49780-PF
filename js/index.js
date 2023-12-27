// Inicializa PRODUCTOS desde archivo JSON


let PRODUCTOS = [];

fetch("./js/productos.json")
    .then(response => {
        if (!response.ok) {
            throw new Error('Error cargando el archivo de productos');
        }
        return response.json();
    })
    .then(data => {
        importaProductos = data;
        localStorage.setItem("productos-json-ls", JSON.stringify(importaProductos));
        let productosEnLS = localStorage.getItem("productos-json-ls");
        PRODUCTOS = JSON.parse(productosEnLS);
        despliegaProductos(PRODUCTOS);
    })
    .catch(error => {
        const errorContainer = document.getElementById('error-container');
        errorContainer.textContent = `Error: ${error.message}`;
        console.error('Error:', error);
    });


//Despliega productos

let row = document.createElement("div");
row.classList.add("row");


// Carga elementos del DOM en variables
const contenedorProductos = document.querySelector("#contenedor-productos");

let botonesAgregar = document.querySelectorAll(".producto-agregar");
let stockproductos = document.querySelectorAll(".producto-stock");
const numerito = document.querySelector("#numerito");

const botonCarrito = document.querySelector("#boton-carrito");

function despliegaProductos(productosElegidos) {
    contenedorProductos.innerHTML = "";
    productosElegidos.forEach(producto => {

        let cardProducto = document.createElement("div");
        cardProducto.classList = "card producto cardProducto text-center mx-auto"
        cardProducto.innerHTML = `
        <div class="contenedor-producto-imagen">
        <img class="producto-imagen" src="${producto.img}" alt="${producto.nombre}">
        </div>

        <div class="producto-detalles">
            <h3 class="producto-titulo">${producto.nombre}</h3>
            <p class="producto-precio">${producto.precio.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })} / ${producto.unidad}</p>
            <p id="stock-${producto.id}" class="producto-stock"> Stock: ${producto.stock} ${producto.unidad}</p>
            <button class="producto-agregar btn btn-primary" id="${producto.id}">Agregar al Carro</button>
        </div>
        `;
        contenedorProductos.append(cardProducto);


    })
    actualizaBotonesAgregar()
}



despliegaProductos(PRODUCTOS);


function actualizaBotonesAgregar() {
    botonesAgregar = document.querySelectorAll(".producto-agregar");

    botonesAgregar.forEach(boton => {
        boton.addEventListener("click", agregarAlCarito);
    })
}


// Gestion de compras

let productosEnCarrito;
let productosEnCarritoLS = localStorage.getItem("productos-en-carrito");
if (productosEnCarritoLS) {
    productosEnCarrito = JSON.parse(productosEnCarritoLS);
    actualizaNumerito();
} else {
    productosEnCarrito = [];
}



function agregarAlCarito(e) {

    const idBoton = e.currentTarget.id;
    const productoAgregado = PRODUCTOS.find(producto => producto.id === idBoton);
    if (productosEnCarrito.some(producto => producto.id === idBoton)) {
        const index = productosEnCarrito.findIndex(producto => producto.id === idBoton);
        productosEnCarrito[index].cantidad++;
    } else {
        productoAgregado.cantidad = 1;
        productosEnCarrito.push(productoAgregado);
    }
    actualizaNumerito();

    //Guarda en Local Storage
    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));


    Toastify({
        text: `Agregando ${productoAgregado.nombre} al carrito`,
        duration: 1000,
        position: "center",
        gravity: "top",
        offset: {
            x: 0,
            y: 135
        },
        style: {
            background: "var(--clr-main-light)",
        }
    }).showToast();
};

function actualizaNumerito() {
    let nuevoNumerito = productosEnCarrito.reduce((acc, producto) => acc + producto.cantidad, 0);
    numerito.innerText = nuevoNumerito;
    if (nuevoNumerito === 0) {
        botonCarrito.querySelector("i").classList.remove("bi-cart-fill");
        botonCarrito.querySelector("i").classList.add("bi-cart");
    } else {
        botonCarrito.querySelector("i").classList.remove("bi-cart");
        botonCarrito.querySelector("i").classList.add("bi-cart-fill");
        actualizaStock();
    }
}


function actualizaStock() {
    productosEnCarrito.forEach(productoEnCarrito => {
        const stockDisponible = productoEnCarrito.stock - getProductosEnCarritoCantidad(productoEnCarrito.id);
        const stockElement = document.querySelector(`#stock-${productoEnCarrito.id}`);
        const botonAgregar = document.getElementById(productoEnCarrito.id);

        if (stockElement) {
            stockElement.textContent = `Stock: ${stockDisponible} ${productoEnCarrito.unidad}`;
            if (stockDisponible <= 0 && botonAgregar) {
                botonAgregar.classList.add("noHayMas");
                botonAgregar.disabled = true;
                stockDisponible === 0 ? stockElement.classList.add("stock-cero") : stockElement.classList.remove("stock-cero");

            } else {
                botonAgregar.classList.remove("noHayMas");
                botonAgregar.disabled = false;
            }
        }
    });
}

function getProductosEnCarritoCantidad(id) {
    const productoEnCarrito = productosEnCarrito.find(producto => producto.id === id);
    return productoEnCarrito ? productoEnCarrito.cantidad : 0;
}




document.getElementById('linkMantenimiento').addEventListener('click', function () {
    const sesionIniciada = localStorage.getItem('sesionIniciada');
    const linkMantenimiento = document.getElementById('linkMantenimiento');


    if (sesionIniciada) {
        window.location.href = 'mantenimiento.html';
    } else {
        $('#modalLogin').modal('show');
    }
});

function validarCredenciales() {
    const usuario = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Verificar si las credenciales son correctas
    if (usuario === 'coder' && password === 'coder49780') {
        // Redirigir a la página de mantenimiento y almacenar en localStorage
        localStorage.setItem('sesionIniciada', 'true');
        window.location.href = 'mantenimiento.html';
    } else {
        // Mostrar mensaje de error o tomar alguna otra acción
        Toastify({
            text: 'Credenciales incorrectas. Intente de nuevo.',
            duration: 3000,
            backgroundColor: 'red',
        }).showToast();
    }
}

// Seleccionar elementos
const inputPassword = document.getElementById('password');
const botonMostrarOcultar = document.getElementById('mostrar-ocultar-password');
const iconoPassword = document.getElementById('icono-password');

// Agregar evento al botón
botonMostrarOcultar.addEventListener('click', function () {
    if (inputPassword.type === 'password') {
        inputPassword.type = 'text';
        iconoPassword.classList.remove('bi-eye');
        iconoPassword.classList.add('bi-eye-slash');
    } else {
        inputPassword.type = 'password';
        iconoPassword.classList.remove('bi-eye-slash');
        iconoPassword.classList.add('bi-eye');
    }
});



function cerrarSesion() {
    localStorage.removeItem('sesionIniciada');
    window.location.href = 'index.html';
}
