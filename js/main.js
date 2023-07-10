
//correcto
//función init que reconozca parámetros, para mostrar el carro o los productos
// función consulta que consultará en función de lo que se quiera hacer
// el producto tendrá como keys: brand, title imagen y price
class Producto {
    constructor(brand, title, image, price, id, rating,) {
        this.brand = brand;
        this.title = title;
        this.image = image;
        this.price = price;
        this.id = id;
        this.rating = rating;
    }
}

let pedido = JSON.parse(localStorage.getItem('carrito')) || {};
const grid = document.querySelector('.gridcontainer');
const fragment = document.createDocumentFragment();
const paginas = document.querySelector('#paginas')




document.body.addEventListener('click', (ev) => {
    if (ev.target.matches('.añadir')) {
        añadir(ev.target.id)
    }

    if (ev.target.matches('.paginas')) {
        cambiarPagina(ev.target.textContent)
    }

    if (ev.target.matches('.eliminar')) {
        eliminarDePedido(ev.target.id)
    }

    if (ev.target.matches('.irTabla')) {
        location.href = `./compra.html`;
    }

    if (ev.target.matches('.eliminar2')) {
        eliminarDeCompra(ev.target.id);
    }

    if (ev.target.matches('.eliminarTodo')) {
        vaciarCarrito();
    }

    if (ev.target.matches('.icono-carrito')) {
        cosi();
    }
})


const cambiarPagina = async (page) => {
    
    const peticion = await consulta(null, page);
    pintarIndex(peticion)
}

const eliminarDePedido = (id) => {

    for (let key in pedido) {
        
        if (pedido[key][0].id == id && pedido[key][1] == 1) {
            delete pedido[key]
        } else if (pedido[key][0].id == id && pedido[key][1] != 1) {
            pedido[key][1]--;
        }
    }
    localStorage.setItem('carrito', JSON.stringify(pedido))
    pintarCarritoPeq();
   

}

const vaciarCarrito = () => {
    pedido = {};
    localStorage.clear();
    pintarCarritoPeq();

}

const añadir = async (id) => {
    const peticion = await consulta(id);
    const rating = redondearRating(peticion.resp.rating)
    let producto = new Producto(peticion.resp.brand, peticion.resp.title, peticion.resp.images[0], peticion.resp.price, peticion.resp.id, rating);

    if (peticion.resp.title in pedido) {
        pedido[peticion.resp.title][1]++;
        pedido[peticion.resp.title][2] = subTotal(pedido[peticion.resp.title][1], pedido[peticion.resp.title][0].price);
    } else {
        let arrayProducto = [peticion.resp, 1, peticion.resp.price]
        pedido[peticion.resp.title] = arrayProducto
    }

   
    localStorage.setItem('carrito', JSON.stringify(pedido))
    pintarCarritoPeq();
}

const subTotal = (cantidad, precio) => {
    return cantidad * precio
}

const consulta = async (id, page) => {
    let url = ''

    if (id) {
        url = `https://dummyjson.com/products/${id}`
    } else if (page) {
        switch (page) {
            case '1':
                url = 'https://dummyjson.com/products/';
                break;
            case '2':
                
                url = 'https://dummyjson.com/products/?skip=30'
                break;
            case '3':
                url = 'https://dummyjson.com/products/?skip=60'
                break;
            case '4':
                url = 'https://dummyjson.com/products/?skip=90'
                break;
        }
    } else {
        url = 'https://dummyjson.com/products/'
    }



    try {
        let request = await fetch(url);

        if (request) {
            let peticion = await request.json()
            return {
                ok: true,
                resp: peticion
            }

        } else {
            throw ({
                ok: false,
                mensaje: 'fallo  en el servidor'
            })
        }

    } catch (error) {
        return error
    }
}

const pintarIndex = async (peticion) => {


    grid.innerHTML = '';
    peticion.resp.products.forEach((item) => {
        const contProducto = document.createElement('ARTICLE');
        const contImagen = document.createElement('FIGURE');
        const contStars = document.createElement('DIV');
        const divInfo = document.createElement('DIV');
        const divButton = document.createElement('DIV');
        const button = document.createElement('BUTTON')
        const img = document.createElement('IMG');
        contProducto.classList.add('contproducto');
        contStars.classList.add('estrellitas');
        contImagen.classList.add('contimagen');
        divButton.classList.add('button');
        divInfo.classList.add('button')
        button.classList.add('añadir');
        button.setAttribute('id', item.id)
        button.textContent = 'Añadir producto';
        divInfo.innerHTML = `<u>${item.title}</u><br><u>Precio:</u> ${item.price} €`
        img.setAttribute('src', item.images[0]);
        img.setAttribute('class', 'imagen');
        img.setAttribute('id', item.id);
        contImagen.append(img);
        contStars.append(pintarEstrellitas(item.rating));
        divButton.append(button);
        contProducto.append(contImagen, contStars, divButton, divInfo);
        fragment.append(contProducto);
    })
    paginas.append(paginacion())
    grid.append(fragment);
}

const paginacion = () => {
    paginas.innerHTML = ''
    const fragment = document.createDocumentFragment();
    const button = document.createElement('BUTTON');
    const button2 = document.createElement('BUTTON');
    const button3 = document.createElement('BUTTON');
    const button4 = document.createElement('BUTTON');
    button.classList.add('paginas');
    button2.classList.add('paginas');
    button3.classList.add('paginas');
    button4.classList.add('paginas');
    button.textContent = '1';
    button2.textContent = '2';
    button3.textContent = '3';
    button4.textContent = '4';
    fragment.append(button, button2, button3, button4);
    return fragment
}

const pintarEstrellitas = (rating) => {
    const fragment2 = document.createDocumentFragment();
    const rat = redondearRating(rating);
    for (let i = 1; i <= 5; i++) {
        if (i <= rat) {
            const divEst = document.createElement('DIV');
            const img = document.createElement('IMG');
            divEst.classList.add('estrellita');
            img.classList.add('imagenestrella')
            img.setAttribute('src', 'fotos/star1.png');
            divEst.append(img)
            fragment2.append(divEst)

        } else {
            const divEst = document.createElement('DIV');
            const img = document.createElement('IMG');
            divEst.classList.add('estrellita');
            img.classList.add('imagenestrella')
            img.setAttribute('src', 'fotos/star2.png');
            divEst.append(img)
            fragment2.append(divEst)
        }
    }
    return fragment2
}

const redondearRating = (rating) => {
    const numSet = rating.toString()
    const cifra = numSet.charAt(2)
    const cifraInt = parseInt(cifra)
    if (cifraInt > 5) {
        return Math.ceil(rating)
    } else {
        return Math.floor(rating)
    }
}

const cosi = () => {
    const carro = document.querySelector('.carro');
    carro.classList.toggle('hidden');
    pintarCarritoPeq();
}

const pintarCarritoPeq = () => {

    const pedido = JSON.parse(localStorage.getItem('carrito'));
    const button = document.createElement('BUTTON');
    const tabla = document.querySelector('#cuerpoTabla');
    const total = document.querySelector('#total');
    const vaciar = document.querySelector('#vaciar');
    vaciar.innerHTML = '';
    button.classList.add('eliminarTodo')
    button.textContent = 'Vaciar carrito'
    tabla.innerHTML = '';
    total.textContent = 'TOTAL: 0 €';
    vaciar.append(button);

    for (let key in pedido) {
        const tr = document.createElement('TR');
        const button = document.createElement('BUTTON');
        const button2 = document.createElement('BUTTON')
        const tdI = document.createElement('TD');
        const img = document.createElement('IMG');
        const tdN = document.createElement('TD');
        const tdP = document.createElement('TD');
        const tdC = document.createElement('TD');
        const tdS = document.createElement('TD');
        img.setAttribute('src', pedido[key][0].images[0]);
        img.setAttribute('class', 'imagentabla');
        button2.classList.add('añadir')
        button2.textContent = '+'
        button.textContent = '-';
        button.classList.add('eliminar');
        button.setAttribute('id', pedido[key][0].id)
        button2.setAttribute('id', pedido[key][0].id)
        tdN.textContent = pedido[key][0].title
        tdP.textContent = pedido[key][0].price + ' €'
        tdC.textContent = pedido[key][1];
        tdS.textContent = pedido[key][0].price * pedido[key][1] + ' €';
        tdC.append(button)
        tdC.append(button2)
        tdI.append(img);
        tr.append(tdI, tdN, tdP, tdC, tdS);
        tabla.append(tr);
        total.textContent = 'TOTAL: ' + definirTotal(pedido) + ' €'
    }

}

const definirTotal = (pedido) => {
    let total = 0;
    for (let key in pedido) {
        if (pedido[key][1] == 1) {
            

            total += pedido[key][0].price
        } else {
            

            total += pedido[key][0].price * pedido[key][1]
        }
    }
   
    return total;
}


const init = async () => {
    const ruta = location.toString();


    if (ruta.includes('compra')) {
        pintarCarritoPeq();
    } else {
        cambiarPagina('1');
    }
}
init();
