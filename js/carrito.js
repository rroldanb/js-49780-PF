let productosEnCarrito = localStorage.getItem("productos-en-carrito");
productosEnCarrito = JSON.parse(productosEnCarrito);


const contenedorcarritoVacio = document.querySelector("#carrito-vacio");
const contenedorCarritoProductos = document.querySelector("#carrito-productos");
const contenedorCarritoFooter = document.querySelector("#carrito-footer");
const contenedorCarritoComprado = document.querySelector("#carrito-comprado");
let botonesEliminar = document.querySelectorAll(".carrito-producto-eliminar");
const botonVaciar = document.querySelector("#carrito-acciones-vaciar");
const contenedorTotal = document.querySelector("#total");
const botonComprar = document.querySelector("#carrito-acciones-comprar");
const botonCarrito = document.querySelector("#boton-carrito");
const cant = document.querySelector("#cant");
let totalCalculado;

function desplegarProductosCarrito() {
    if (productosEnCarrito && productosEnCarrito.length > 0) {

        contenedorcarritoVacio.classList.add("disabled");
        contenedorCarritoProductos.classList.remove("disabled");
        contenedorCarritoFooter.classList.remove("disabled");
        contenedorCarritoComprado.classList.add("disabled");
        botonCarrito.querySelector("i").classList.add("bi-cart-fill");
        botonCarrito.querySelector("i").classList.remove("bi-cart");

        contenedorCarritoProductos.innerHTML = "";
        productosEnCarrito.forEach(producto => {

            const div = document.createElement("div");
            div.classList.add("carrito-producto");
            div.innerHTML =
                `
            <img class="carrito-producto-imagen" src="${producto.img}" alt="${producto.nombre}">
                <div class="carrito-producto-titulo">
                    <small>Producto</small>
                    <h3>${producto.nombre}</h3>
                </div>
                <div class="carrito-producto-stock">
                    <small>Stock</small>
                    <p id="carrito-stock-${producto.id}" >${producto.stock} ${producto.unidad}</p>
                </div>
                <div class="carrito-producto-cantidad">
                    <small>Cantidad</small>
                    <input class="carrito-producto-cantidad-input" type="number"
                                value="${producto.cantidad}">
                </div>
                <div class="carrito-producto-precio">
                    <small>Precio</small>
                    <p> ${producto.precio.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}</p>
                </div>
                <div class="carrito-producto-subtotal">
                    <small>Subtotal</small>
                    <p>${(producto.precio * producto.cantidad).toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}</p>
                </div>
            <button class="carrito-producto-eliminar" id= "${producto.id}"><i class="bi bi-trash-fill"></i></button>
            `
                ;


            const inputCantidad = div.querySelector('.carrito-producto-cantidad-input');
            inputCantidad.addEventListener('change', nuevaCantidad);

            contenedorCarritoProductos.append(div);
        });
    } else {
        contenedorcarritoVacio.classList.remove("disabled");
        contenedorCarritoProductos.classList.add("disabled");
        contenedorCarritoFooter.classList.add("disabled");
        contenedorCarritoComprado.classList.add("disabled");
        botonCarrito.querySelector("i").classList.remove("bi-cart-fill");
        botonCarrito.querySelector("i").classList.add("bi-cart");
    }
    actualizaBotonesEliminar();
    actualizaCant();
    actualizarTotal();
}

desplegarProductosCarrito();


function actualizaBotonesEliminar() {
    botonesEliminar = document.querySelectorAll(".carrito-producto-eliminar");

    botonesEliminar.forEach(boton => {
        boton.addEventListener("click", eliminarDelCarito);
    })
}


function eliminarDelCarito(e) {
    const idBoton = e.currentTarget.id;
    const index = productosEnCarrito.findIndex(producto => producto.id === idBoton);

    Toastify({
        text:`Eliminó del carrito ${productosEnCarrito[index].nombre}`, 
        duration: 1200,
        position: "center",
        gravity: "top",
        offset:{
            x: 0,
            y: 135
        },
        style:{
            background: "var(--clr-main-light)",
        }
    }).showToast();
    productosEnCarrito.splice(index, 1);
    desplegarProductosCarrito();


    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito))
}

botonVaciar.addEventListener("click", vaciarCarrito);
function vaciarCarrito() {
    productosEnCarrito.length = 0;
    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
    desplegarProductosCarrito();
}

function actualizarTotal() {
    totalCalculado = productosEnCarrito.reduce((acc, producto) => acc + (producto.precio * producto.cantidad), 0);
    total.innerText = `${totalCalculado.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}`

}

// botonComprar.addEventListener("click", comprarCarrito);
function comprarCarrito() {
    productosEnCarrito.length = 0;
    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
    desplegarProductosCarrito();
    contenedorcarritoVacio.classList.add("disabled");
    contenedorCarritoProductos.classList.add("disabled");
    contenedorCarritoFooter.classList.add("disabled");
    contenedorCarritoComprado.classList.remove("disabled");
    botonCarrito.querySelector("i").classList.remove("bi-cart-fill");
    botonCarrito.querySelector("i").classList.add("bi-cart");
}


function nuevaCantidad(event) {
    const input = event.target;
    const productoId = input.closest('.carrito-producto').querySelector('.carrito-producto-eliminar').id;
    const productoEnCarrito = productosEnCarrito.find(producto => producto.id === productoId);

    if (productoEnCarrito) {
        const nuevaCantidad = parseInt(input.value);
        const stockDisponible = productoEnCarrito.stock;
        const cantidadAnterior = productoEnCarrito.cantidad;

        if (nuevaCantidad > stockDisponible) {
            input.value = stockDisponible;
            productoEnCarrito.cantidad = stockDisponible;
        } else if (nuevaCantidad <= 0) {
            input.value = 1;
            productoEnCarrito.cantidad = 1;
        } else {
            productoEnCarrito.cantidad = nuevaCantidad;
        }

        // Mostrar Toastify con el mensaje correspondiente
        if ( (nuevaCantidad>0) && (nuevaCantidad <= stockDisponible)){
        const mensaje = (nuevaCantidad > cantidadAnterior) 
            ? `Agregó ${productoEnCarrito.nombre} al carrito`
            : `Quitó ${productoEnCarrito.nombre} del carrito`;

        Toastify({
            text: mensaje,
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
    }
        // Actualizar el objeto en el localStorage
        localStorage.setItem('productos-en-carrito', JSON.stringify(productosEnCarrito));
    }

    
    desplegarProductosCarrito();
    actualizarTotal();
}


function actualizaCant() {
    let nuevoNumerito = productosEnCarrito.reduce((acc, producto) => acc + producto.cantidad, 0);
    cant.innerText = nuevoNumerito;
    actualizaStockCarrito();
}

function actualizaStockCarrito() {
    productosEnCarrito.forEach(productoEnCarrito => {
        const stockDisponible = productoEnCarrito.stock - getProductosEnCarritoCantidad(productoEnCarrito.id);
        const stockElement = document.querySelector(`#carrito-stock-${productoEnCarrito.id}`);
        if (stockElement) {
            stockElement.textContent = `${stockDisponible} ${productoEnCarrito.unidad}`;
        }
        stockDisponible === 0 ? stockElement.classList.add("stock-cero") : stockElement.classList.remove("stock-cero");
    });
}

function getProductosEnCarritoCantidad(id) {
    const productoEnCarrito = productosEnCarrito.find(producto => producto.id === id);
    return productoEnCarrito ? productoEnCarrito.cantidad : 0;
}

// Modal Pago

function mostrarResumenCompra(descuento, totalAPagar) {
    const contenedorResumen = document.getElementById('modalResumenCompra');
    contenedorResumen.innerHTML = ''; // Limpiamos el contenido previo

    const divProducto = document.createElement('div');
    divProducto.classList.add('modal-resumen-producto'); 
    divProducto.innerHTML = `
    <div class="modal-resume-producto-titulo resumen-modal-encabezado">
        <small>Producto</small>
    </div>

    <div class="modal-resume-producto-cantidad resumen-modal-encabezado">
        <small>Cantidad</small>
    </div>
    <div class="modal-resume-producto-precio resumen-modal-encabezado">
        <small>Precio</small>
    </div>
    <div class="modal-resume-producto-subtotal resumen-modal-encabezado">
        <small>Subtotal</small>
    </div>
`;
    contenedorResumen.appendChild(divProducto);
    
    productosEnCarrito.forEach(producto => {
        const divProducto = document.createElement('div');
        divProducto.classList.add('modal-resumen-producto'); 

        divProducto.innerHTML = `
            <div class="modal-resume-producto-titulo">
                <p>${producto.nombre}</p>
            </div>
            <div class="modal-resume-producto-cantidad">
                <p>${producto.cantidad} ${producto.unidad}</p>
            </div>
            <div class="modal-resume-producto-precio">
                <p>${producto.precio.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}</p>
            </div>
            <div class="modal-resume-producto-subtotal">
                <p>${(producto.precio * producto.cantidad).toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}</p>
            </div>
        `;
        contenedorResumen.appendChild(divProducto);
    });

    const divProductoFooter = document.createElement('div');
    divProductoFooter.classList.add('modal-resumen-producto', 'modal-resumen-footer'); 
    divProductoFooter.innerHTML = `

    <div class="modal-resume-producto-titulo">
    <p>Total Compra:</p>
    </div>
    <div class="modal-resume-producto-cantidad">
    </div>
    <div class="modal-resume-producto-precio">
</div>
<div class="modal-resume-producto-total">
    <p > <bold> ${totalCalculado.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })} </bold></p>

</div>
    `
    contenedorResumen.appendChild(divProductoFooter);



    const divDetallesDescuento = document.createElement('div');
    divDetallesDescuento.classList.add('modal-resumen-producto', 'modal-resumen-footer');
    divDetallesDescuento.innerHTML = `
        <div class="modal-resume-producto-titulo">
            <p>Total Descuento:</p>
        </div>
        <div class="modal-resume-producto-cantidad">
        </div>
        <div class="modal-resume-producto-precio">
        </div>
        <div class="modal-resume-producto-total">
            <p id="descuentoAplicar">${descuento.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}</p>
        </div>
    `;
    contenedorResumen.appendChild(divDetallesDescuento);

    const divTotalAPagar = document.createElement('div');
    divTotalAPagar.classList.add('modal-resumen-producto', 'modal-resumen-footer');

    divTotalAPagar.innerHTML = `
        <div class="modal-resume-producto-titulo">
            <p>Total a Pagar:</p>
        </div>
        <div class="modal-resume-producto-cantidad">
        </div>
        <div class="modal-resume-producto-precio">
        </div>
        <div class="modal-resume-producto-total">
            <p>${totalAPagar.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}</p>
        </div>
    `;
    contenedorResumen.appendChild(divTotalAPagar);



}

// Llamamos a la función cuando se abre el modal
const modalPago = document.getElementById('modalPago');

modalPago.addEventListener('show.bs.modal', function () {
    //mostrarResumenCompra(0,totalCalculado);
    seleccionarMedioPago();
});


const formMedioPago = document.getElementById('formMedioPago');

// Agregar el event listener al formulario
formMedioPago.addEventListener('change', function() {
    // Llamar a la función para seleccionar el medio de pago
    seleccionarMedioPago();
});


function seleccionarMedioPago() {
    const form = document.getElementById('formMedioPago');
    const medioPagoSeleccionado = form.querySelector('input[name="medioPago"]:checked');
    const pagarCarrito = document.getElementById('pagarCarrito');

    pagarCarrito.disabled = true;
    pagarCarrito.innerText = "Seleccione metodo de pago";

    if (medioPagoSeleccionado) {
        const valorMedioPago = medioPagoSeleccionado.value;

        let descuento = 0;
        let totalAPagar = totalCalculado;

        switch (valorMedioPago) {
            case 'efectivo':
                descuento = totalCalculado * 0.10;
                totalAPagar = totalCalculado - descuento;
                pagarCarrito.disabled = false;
    pagarCarrito.innerText = "Confirmar pago";
                break;
            case 'tarjeta':
                // No hay descuento para tarjeta
                pagarCarrito.disabled = false;
    pagarCarrito.innerText = "Confirmar pago";
    break;
            case 'transferencia':
                descuento = totalCalculado * 0.05;
                totalAPagar = totalCalculado - descuento;
                pagarCarrito.disabled = false;
    pagarCarrito.innerText = "Confirmar pago";
    break;
            default:
                break;
        }

        // Actualiza los valores en el resumen del modal
        mostrarResumenCompra(descuento, totalAPagar);
    } else { mostrarResumenCompra(0,totalCalculado);}
}

