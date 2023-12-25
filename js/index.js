// Creación de productos

class Producto {
    constructor(id, nombre, precio, stock, unidad, img) {
        this.id = id;
        this.nombre = nombre;
        this.precio = precio;
        this.stock = stock;
        this.unidad = unidad;
        this.img = img
    }
}

let asado = new Producto("carne-01", "Asado", 11000, 10, "Kg", "./assets/img/asado.webp");
let bife = new Producto("carne-02", "Bife", 12000, 10, "Kg", "./assets/img/bife-angus.webp");
let cuadril = new Producto("carne-3", "Colita de Cuadril", 13000, 10, "Kg", "./assets/img/colita-de-cuadril.webp");
let entrana = new Producto("carne-04", "Entraña", 14000, 10, "Kg", "./assets/img/entrana.webp");
let tomahawk = new Producto("carne-05", "Tomahawk", 15000, 10, "Kg", "./assets/img/tomahawk.webp");
let entrecot = new Producto("carne-06", "Entrecot", 16000, 10, "Kg", "./assets/img/entrecot.webp");

const PRODUCTOS = [asado, bife, cuadril, entrana, tomahawk, entrecot];


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


function actualizaStock(){
    productosEnCarrito.forEach (productoEnCarrito =>{
        const stockDisponible = productoEnCarrito.stock - getProductosEnCarritoCantidad(productoEnCarrito.id);
        const stockElement = document.querySelector(`#stock-${productoEnCarrito.id}`);
        const botonAgregar = document.getElementById(productoEnCarrito.id);

        if (stockElement) {
            stockElement.textContent = `Stock: ${stockDisponible} ${productoEnCarrito.unidad}`;
            if (stockDisponible <= 0 && botonAgregar) {
                botonAgregar.classList.add("noHayMas");
                botonAgregar.disabled = true;
        stockDisponible === 0 ? stockElement.classList.add("stock-cero"): stockElement.classList.remove("stock-cero");

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
    window.location.href = 'mantenimiento.html';});

