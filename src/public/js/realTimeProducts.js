
const socket = io();
socket.emit("load")

const form = document.getElementById('formProduct');



    form.addEventListener('submit', (e) => {
        e.preventDefault()
            const dataForm = new FormData(e.target);
            const prod = Object.fromEntries(dataForm);

            Swal.fire({
                title: "Producto creado correctamente"
            });

            socket.emit('nuevoProducto', prod);
            e.target.reset()
    });

const productList = document.getElementById('productList');

    socket.on('nuevoProducto', (nuevoProducto) =>{
        const productoItem = document.createElement('li');
        productoItem.textContent = `Nuevo Producto: ${nuevoProducto.title}`;

            productList.appendChild(productoItem);
    })

    socket.on('productoEliminado', (idProducto) => {
        const productoEliminar = document.querySelector(`#producto-${idProducto}`);
        if(productoEliminar){
            productoEliminar.remove();
        }
    })
