

// Mostrar productos almacenados al cargar la página
mostrarProductosAlmacenados();

// Función para mostrar los productos almacenados
function mostrarProductosAlmacenados() {
    const contenedorProductosAlmacenados = document.getElementById('mantencion-productos-almacenados') //('productos-almacenados');
    contenedorProductosAlmacenados.innerHTML = '';

    const productosLocalStorage = JSON.parse(localStorage.getItem('productos-json-ls')) || [];
    const todosProductos = [...productosLocalStorage];

    let divProducto = document.createElement('div');

    divProducto.classList.add('mantencion-lista-encabezado');
    divProducto.innerHTML = `
    <div class="mantencion-producto-titulo resumen-mantencion-encabezado text-center">
        <small>Id</small>
    </div>
    <div class="mantencion-producto-titulo resumen-mantencion-encabezado text-center">
        <small>Nombre</small>
    </div>
    <div class="mantencion-producto-titulo resumen-mantencion-encabezado text-center">

        <small>Precio</small>
    </div>
    <div class="mantencion-producto-titulo resumen-mantencion-encabezado text-center">
        <small>Stock inicial</small>
    </div>
    <div class="mantencion-producto-titulo resumen-mantencion-encabezado text-center">
        <small>Unidad medida</small>
    </div>
    <div class="mantencion-producto-titulo resumen-mantencion-encabezado text-center">
        <small>URL imagen</small>
    </div>
    <div class="mantencion-producto-titulo resumen-mantencion-encabezado text-center">
        <small>Activo</small>
    </div>
    <div class="mantencion-producto-titulo resumen-mantencion-encabezado text-center">
        <small>Guardar</small>
    </div>
`;
    contenedorProductosAlmacenados.appendChild(divProducto);


    todosProductos.forEach(producto => {
        const divProducto = document.createElement('div');
        divProducto.classList.add('mantencion-producto-almacenado');
        const checkboxId = `checkbox-${producto.id}`;

        const activo = producto.activo ? 'checked' : '';

        divProducto.innerHTML = `

            <p class="text-center">${producto.id}</p>
            <input id="input-nombre-${producto.id}" class="mantencion-producto-input text-center d-flex justify-content-center" type="text" value="${producto.nombre}">
            <input id="input-precio-${producto.id}" class="mantencion-producto-input text-center" type="number" value="${producto.precio}">
            <input id="input-stock-${producto.id}" class="mantencion-producto-input text-center" type="number" value="${producto.stock}">
            <select id="unidad-medida-${producto.id}" class="form-select text-center d-flex justify-content-center" aria-label="unidad-medida">
                <option selected>${producto.unidad}</option>
                <option value="Kg">Kg</option>
                <option value="Unidades">Unidades</option>
                <option value="Litros">Litros</option>
            </select>       

            <div class="imagen-producto text-center">
            <img src="${producto.img}" alt="Imagen" id="img-${producto.id}" width="100">
            <input type="text" id="input-img-${producto.id}" value="${producto.img}" class="mantencion-img-ruta">
            </div>

            <input class="form-check-input text-center d-flex justify-content-center" type="checkbox" id="${checkboxId}" ${activo}>
            <div class="mantencion-botones">
                <button id="guardar-cambios-${producto.id}" class="guardar-cambios btn btn-outline-success text-center" data-id="${producto.id}"><i class="bi bi-floppy" title="Guardar los cambios"></i></button>
                <button id="reiniciar-${producto.id}" class="reiniciar btn btn-outline-danger text-center" data-id="${producto.id}"><i class="bi bi-recycle" title="Reinicializar producto"></i></button>
            </div>
        `;
        contenedorProductosAlmacenados.appendChild(divProducto);



        actualizaBotonesMantencion();
        const imgElement = document.getElementById(`img-${producto.id}`);
        const inputImgElement = document.getElementById(`input-img-${producto.id}`);

        // Agregar un listener al campo de entrada para actualizar la imagen al salir del campo
        inputImgElement.addEventListener('blur', () => {
            const newImageUrl = inputImgElement.value;
            imgElement.src = newImageUrl; // Actualiza la imagen en la vista principal
        });

        // Actualizar la imagen al inicializar
        imgElement.src = producto.img;


        const reiniciarBtn = document.getElementById(`reiniciar-${producto.id}`);
        reiniciarBtn.addEventListener('click', () => {
            const productId = reiniciarBtn.getAttribute('data-id');
            const productoOriginal = cargarDatosOriginalesProducto(productId);
            const checkboxId = `checkbox-${producto.id}`;

            const activo = producto.activo ? 'checked' : '';
            if (productoOriginal) {
                document.getElementById(`input-nombre-${productId}`).value = productoOriginal.nombre;
                document.getElementById(`input-precio-${productId}`).value = productoOriginal.precio;
                document.getElementById(`input-stock-${productId}`).value = productoOriginal.stock;
                // document.getElementById(`unidad-medida-${productId}`).value = productoOriginal.unidad;
                const selectElement = document.getElementById(`unidad-medida-${productId}`);
                const unidades = ['Kg', 'Unidades', 'Litros'];
                const selectedIndex = unidades.indexOf(productoOriginal.unidad);
                selectElement.selectedIndex = selectedIndex !== -1 ? selectedIndex : 0;
        
                document.getElementById(`input-img-${productId}`).value = productoOriginal.img;
        imgElement.src = producto.img;

                const checkbox = document.getElementById(`${checkboxId}`);
                checkbox.checked = productoOriginal.activo;
            } else {
                console.log('Producto original no encontrado en el almacenamiento local.');
            }
        });


    });

    let divProductoFooter = document.createElement('div');
    divProductoFooter.classList.add('mantencion-lista-footer');
    divProductoFooter.innerHTML = `
    <div class="resumen-mantencion-footer">

    </div>

`;
    contenedorProductosAlmacenados.appendChild(divProductoFooter);

}



function actualizaBotonesMantencion() {
    botonesGuardar = document.querySelectorAll(".guardar-cambios");
    botonesGuardar.forEach(boton => {
        boton.addEventListener("click", guardarCambios);
    })
}





function guardarCambios(event) {
    const productoId = event.currentTarget.dataset.id;
    //Agrefga bandera de productos editados
    localStorage.setItem('productoEditado', 'true');

    // Obtener productos del LocalStorage
    const productosLocalStorage = JSON.parse(localStorage.getItem('productos-json-ls')) || [];
    // Encontrar el producto a actualizar
    const productoIndex = productosLocalStorage.findIndex(producto => producto.id === productoId);

    if (productoIndex !== -1) {
        // Actualizar los valores del producto
        const producto = productosLocalStorage[productoIndex];
        const nombre = document.getElementById(`input-nombre-${producto.id}`).value
        const precio = parseInt(document.getElementById(`input-precio-${producto.id}`).value)
        const stock = document.getElementById(`input-stock-${producto.id}`).value
        const unidad = document.getElementById(`unidad-medida-${producto.id}`).value
        const imagen = document.getElementById(`input-img-${producto.id}`).value

        producto.nombre = nombre;
        producto.precio = precio;
        producto.stock = stock;
        producto.unidad = unidad;
        producto.img = imagen;

        // Obtener el estado del checkbox (activo o no activo)
        const activo = document.getElementById(`checkbox-${producto.id}`).checked
        producto.activo = activo;

        // Actualizar el producto en la lista
        productosLocalStorage[productoIndex] = producto;

        // Actualizar el LocalStorage
        localStorage.setItem('productos-json-ls', JSON.stringify(productosLocalStorage));
        Toastify({
            text: "Se han guardado los cambios",
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
    } else {
        Toastify({
            text: "Hubo un error guardando los cambios, Producto no encontrado",
            duration: 1000,
            position: "center",
            gravity: "top",
            offset: {
                x: 0,
                y: 135
            },
            style: {
                background: "var(--clr-red)",
            }
        }).showToast();
    }
}


function reinicializar() {
    Swal.fire({
        title: '¿Estás seguro?',
        text: "Esto reiniciará el sistema y perderás los cambios. ¿Deseas continuar?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#961818',
        cancelButtonColor: '#223da0',
        confirmButtonText: 'Sí, reiniciar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            fetch("./js/productos.json")
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Error cargando el archivo de productos');
                    }
                    return response.json();
                })
                .then(data => {
                    PRODUCTOS = data;
                    localStorage.setItem("productos-json-ls", JSON.stringify(PRODUCTOS));
                    despliegaProductos(PRODUCTOS);
                })
                .catch(error => {
                    const errorContainer = document.getElementById('error-container');
                    errorContainer.textContent = `Error: ${error.message}`;
                    console.error('Error:', error);
                });
            localStorage.removeItem('productoEditado');

            cerrarSesion();
        }
    });
}



function cargarDatosOriginalesProducto(productId) {
    const productosOriginales = JSON.parse(localStorage.getItem('productos-origen-ls'));
    const productoOriginal = productosOriginales.find(producto => producto.id === productId);
    return productoOriginal || null;
}


function cerrarSesion() {
    localStorage.removeItem('sesionIniciada');
    window.location.href = 'index.html';
}
