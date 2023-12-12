// Creación de productos

class Producto {
    constructor(codigo, nombre, precio, stock, unidad, img) {
        this.codigo = codigo;
        this.nombre = nombre;
        this.precio = precio;
        this.stock = stock;
        this.unidad = unidad;
        this.img = img
    }
}

let asado = new Producto(1, "Asado", 11000, 10, "Kg", "./assets/img/asado.webp");
let bife = new Producto(2, "Bife", 12000, 9, "Kg", "./assets/img/bife-angus.webp");
let cuadril = new Producto(3, "Colita de Cuadril", 13000, 8, "Kg", "./assets/img/colita-de-cuadril.webp");
let entrana = new Producto(4, "Entraña", 14000, 9, "Kg", "./assets/img/entrana.webp");
let tomahawk = new Producto(5, "Tomahawk", 15000, 9, "Kg", "./assets/img/tomahawk.webp");
let entrecot = new Producto(6, "Entrecot", 16000, 9, "Kg", "./assets/img/entrecot.webp");

const PRODUCTOS = [asado, bife, cuadril, entrana, tomahawk, entrecot];


//Despliega productos

let row = document.createElement("div");
row.classList.add("row");


PRODUCTOS.forEach((producto, index) => {
    let col = document.createElement("div");
    col.classList = ("col-md-4 col-sm-6 text-center");

    let cardProducto = document.createElement("div");
    cardProducto.classList = "card cardProducto text-center mx-auto"
    cardProducto.innerHTML =

        `
        <img src="${producto.img} " class="card-img-top img-fluid" alt="Imagen de ${producto.nombre}">
        <div class="card-body">
            <h5 class="card-title">${producto.nombre}</h5>
            <p class="card-text">Precio: ${producto.precio.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })} por ${producto.unidad}</p>
            <p class="card-text">Stock: <span id="stock-${index}">${producto.stock}  </span> ${producto.unidad}</p>
            <button class="btn btn-primary" onclick="agregarAlCarro(${index})">Agregar al Carro</button>
    
        </div>
    `;
    col.appendChild(cardProducto);
    row.appendChild(col);
});
contenedorProductos.appendChild(row);


// Gestion de compras

function agregarAlCarro(index) {
    if (PRODUCTOS[index].stock > 0) {
        ingresaCantidad(index)
        document.getElementById(`stock-${index}`).innerText = PRODUCTOS[index].stock;
    } else {
        alert('No hay stock disponible para este producto');
    }
}

function ingresaCantidad(index) {
    let reintentar = true;
    let productoIngresar = PRODUCTOS[index].nombre;
    let stockActual = PRODUCTOS[index].stock;
    while (reintentar) {
        let cantidadProducto = prompt(`Está agregando al Carro ${productoIngresar}; El stock disponible es de ${stockActual} ${PRODUCTOS[index].unidad} Por favor indique la cantidad en ${PRODUCTOS[index].unidad} que desea comprar (Esc para salir)`);
        if (cantidadProducto === null) {
            cantidadProducto = 0;
            reintentar = false
        } else {
            if (reintentar) {
                cantidadProducto = parseFloat(cantidadProducto)
                if (isNaN(cantidadProducto)) {
                    alert("Por favor ingrese un número válido");
                } else {
                    if (cantidadProducto > stockActual) {
                        alert(`No contamos con stock suficiente para cumplir con su requerimiento, el stock actual es de ${stockActual} ${PRODUCTOS[index].unidad}`)
                    } else {
                        if (cantidadProducto < 0) {
                            alert(`Por favor indique un numero positivo`)
                        } else {
                            agregaCarro(index, cantidadProducto);
                            reintentar = false
                        }
                    }
                }
            }
        }
    }
}


// Creación Carro de compras

let carroCompras = [];

class ItemCarro {
    constructor(producto, cantidad) {
        this.producto = producto;
        this.cantidad = cantidad
    }
}

function agregaCarro(index, cantidadProducto) {
    let stockActual = PRODUCTOS[index].stock - cantidadProducto;;
    PRODUCTOS[index].stock = stockActual;
    let existeProducto = carroCompras.some(ItemCarro => ItemCarro.producto === PRODUCTOS[index]);

    if (!existeProducto) {
        let nuevoItemCarro = new ItemCarro(PRODUCTOS[index], cantidadProducto);
        carroCompras.push(nuevoItemCarro)
    } else {
        let indiceEnCarro = carroCompras.findIndex(item => item.producto === PRODUCTOS[index]);
        carroCompras[indiceEnCarro].cantidad += cantidadProducto;
    }
    refrescaCarro();
}

// Despliega el carro
const contenedorCarro = document.getElementById('contenedorCarro');


function refrescaCarro() {

    let acumulaTotal = 0;

    contenedorCarro.innerHTML = '';

    // carroCompras.forEach((itemCarro) => {
    carroCompras.forEach((itemCarro, index) => {
        let col = document.createElement("div");
        col.classList = "col-md-4 col-sm-6 text-center";

        let cardCarro = document.createElement("div");
        cardCarro.classList = "card mb-3 cardCarro mx-auto";

        let subTotal = itemCarro.cantidad * itemCarro.producto.precio;
        acumulaTotal += subTotal;

        cardCarro.innerHTML =
            `
            <div class="row g-0">
                <div class="col-md-4">
                    <img src="${itemCarro.producto.img}" class="img-fluid rounded imagenCarro"
                        alt="Imagen de ${itemCarro.producto.nombre}">
                        <button type="button"  class="btn btn-danger btn-sm cancelarCompra" data-index="${index}">Quitar</button>
                </div>
                <div class="col-md-8">
                    <div class="card-body">
                        <h5 class="card-text"> ${itemCarro.producto.nombre} </h5>
                        <p class="card-text"> Cantidad: ${itemCarro.cantidad} ${itemCarro.producto.unidad}</p>
                        <p class="card-text"> Subtotal: <strong>${subTotal.toLocaleString('es-CL', {
                style: 'currency',
                currency: 'CLP'
            })}</strong></p>
                    </div>
                </div>
            </div>
    `;

        col.appendChild(cardCarro);
        contenedorCarro.appendChild(col);



    });

    // Desplegar el total acumulado

    if (acumulaTotal > 0) {
        document.getElementById("carritoHeader").innerHTML = "Su carro de compras contiene:";
        let carritoFooter = document.getElementById('carritoFooter');
        carritoFooter.innerHTML = `
                        <h5 class="font-weight-bold mt-3">El total de su compra es: <strong> ${acumulaTotal.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}</strong></h5>
                        <button class="btn btn-primary" onclick="finalizaCompra()">Finalizar su compra</button>

                    `;
    } else {
        document.getElementById("carritoHeader").innerHTML = "Su carro de compras está vacío";
        let carritoFooter = document.getElementById('carritoFooter');
    carritoFooter.innerHTML = ``;
    }


};

document.addEventListener('click', function (event) {
    if (event.target.classList.contains('cancelarCompra')) {
        const index = event.target.getAttribute('data-index');
        cancelarCompra(index);
    }
});

function cancelarCompra(index) {
    const itemCancelado = carroCompras[index];
    const productoCancelado = itemCancelado.producto;
    const cantidadCancelada = itemCancelado.cantidad;

    // Devolver la cantidad al stock disponible
    productoCancelado.stock += cantidadCancelada;

    // Eliminar el producto del carro
    carroCompras.splice(index, 1);

    // Actualizar la visualización del carro
    refrescaCarro();

    // Refrescar el contenedor de productos
    refrescarProductos();
}

function refrescarProductos() {
    contenedorProductos.innerHTML = ''; 

    PRODUCTOS.forEach((producto, index) => {
        let col = document.createElement("div");
        col.classList = ("col-md-4 col-sm-6 text-center");

        let cardProducto = document.createElement("div");
        cardProducto.classList = "card cardProducto text-center mx-auto";
        cardProducto.innerHTML = `
                <img src="${producto.img} " class="card-img-top img-fluid" alt="Imagen de ${producto.nombre}">
                <div class="card-body">
                    <h5 class="card-title">${producto.nombre}</h5>
                    <p class="card-text">Precio: ${producto.precio.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })} por ${producto.unidad}</p>
                    <p class="card-text">Stock: <span id="stock-${index}">${producto.stock}  </span> ${producto.unidad}</p>
                    <button class="btn btn-primary" onclick="agregarAlCarro(${index})">Agregar al Carro</button>
                </div>
            `;

        col.appendChild(cardProducto);
        contenedorProductos.appendChild(col);
    });
}

function finalizaCompra(){
    alert (`Gracias por su compra, vuelva pronto`)
    carroCompras=[];
    refrescaCarro();
}