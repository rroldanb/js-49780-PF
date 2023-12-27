
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

// Obtener la capacidad disponible del LocalStorage
function obtenerCapacidadLocalStorage() {
    const capacidadLocalStorage = (JSON.stringify(localStorage).length * 2 / 1024).toFixed(2); // en KB
    return capacidadLocalStorage;
}

// Función para mostrar los productos almacenados
function mostrarProductosAlmacenados() {
    const contenedorProductosAlmacenados = document.getElementById('productos-almacenados') //('productos-almacenados');
    contenedorProductosAlmacenados.innerHTML = '';

    // Obtener los productos del LocalStorage y de la matriz inicial
    const productosLocalStorage = JSON.parse(localStorage.getItem('productos-json-ls')) || [];
    const todosProductos = [ ...productosLocalStorage];

    let divProducto = document.createElement('div');

    divProducto.classList.add('mantencion-lista-encabezado'); 
    divProducto.innerHTML = `
    <div class="mantencion-producto-titulo resumen-mantencion-encabezado">
        <small>Id</small>
    </div>
    <div class="mantencion-producto-titulo resumen-mantencion-encabezado">
        <small>Nombre</small>
    </div>
    <div class="modal-resume-producto-cantidad resumen-modal-encabezado">
        <small>Precio</small>
    </div>
    <div class="modal-resume-producto-precio resumen-modal-encabezado">
        <small>Stock inicial</small>
    </div>
    <div class="modal-resume-producto-subtotal resumen-modal-encabezado">
        <small>imagen</small>
    </div>
`;
contenedorProductosAlmacenados.appendChild(divProducto);
    

    todosProductos.forEach(producto => {
        const divProducto = document.createElement('div');
        divProducto.classList.add('mantencion-producto-almacenado');
        
        divProducto.innerHTML = `
            <p>${producto.id}</p>
            <p>${producto.nombre}</p>
            <p>${producto.precio}</p>
            <p>${producto.stock}</p>
            <p>Imagen: <img src="${producto.img}" alt="${producto.nombre}" width="100"></p>
            <div class="mantencion-botones-editar">
            <button class="editar-producto" data-id="${producto.id}">Editar</button>
            <button class="eliminar-producto" data-id="${producto.id}">Eliminar</button>
            </div>
            <!-- <hr> -->  
        `;

        contenedorProductosAlmacenados.appendChild(divProducto);
    });
}

// Agregar nuevo producto al LocalStorage
document.getElementById('formulario-producto').addEventListener('submit', function(event) {
    event.preventDefault();

    const nombre = document.getElementById('nombre').value;
    const precio = parseFloat(document.getElementById('precio').value);
    const stock = parseInt(document.getElementById('stock').value);
    const imagen = URL.createObjectURL(document.getElementById('imagen').files[0]);

    // Crear el nuevo producto
    const nuevoProducto = new Producto(
        `producto-${Date.now()}`, // Generar un ID único (puede mejorar)
        nombre,
        precio,
        stock,
        'unidad', // Modificar la unidad según tu lógica
        imagen
    );

    // Obtener productos del LocalStorage o inicializar un array vacío
    const productosLocalStorage = JSON.parse(localStorage.getItem('productos')) || [];
    productosLocalStorage.push(nuevoProducto);
    localStorage.setItem('productos', JSON.stringify(productosLocalStorage));

    mostrarProductosAlmacenados();
});

// Mostrar la capacidad disponible en el LocalStorage
document.getElementById('capacidad-localstorage').textContent = obtenerCapacidadLocalStorage();

// Mostrar productos almacenados al cargar la página
mostrarProductosAlmacenados();


// Obtener los botones de editar y eliminar producto
document.getElementById('productos-almacenados').addEventListener('click', function(event) {
    if (event.target.classList.contains('editar-producto')) {
        const id = event.target.dataset.id;
        // Aquí puedes implementar la lógica para editar el producto con el ID especificado
        // Por ejemplo, puedes abrir un formulario prellenado con los detalles del producto para editar
        console.log(`Editar producto con ID: ${id}`);
    } else if (event.target.classList.contains('eliminar-producto')) {
        const id = event.target.dataset.id;
        if (confirm('¿Estás seguro que deseas eliminar este producto?')) {
            // Aquí puedes implementar la lógica para eliminar el producto con el ID especificado
            // Por ejemplo, eliminar el producto del array o del LocalStorage
            console.log(`Eliminar producto con ID: ${id}`);
            eliminarProducto(id);
            mostrarProductosAlmacenados(); // Actualizar la lista de productos después de eliminar
        }
    }
});

// Función para eliminar un producto por su ID
function eliminarProducto(id) {
    const productosLocalStorage = JSON.parse(localStorage.getItem('productos')) || [];
    const productosFiltrados = productosLocalStorage.filter(producto => producto.id !== id);
    localStorage.setItem('productos', JSON.stringify(productosFiltrados));
}

function cerrarSesion() {
    localStorage.removeItem('sesionIniciada');
    window.location.href = 'index.html';
}
