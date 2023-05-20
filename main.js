const contenedor = document.getElementById("contenedor")
const searchForm = document.getElementById("searchForm")
const inputSearch = document.getElementById("inputSearch")
let db=[]


const cargarLibros = async() =>{
    try {
        // REQUEST DE LA API DE 100 LIBROS EN ESPAÑOL
        const res = await fetch("https://fakerapi.it/api/v1/books?_quantity=100&_locale=es_ES")
        console.log(res)
        if(res.ok){
        const data = await res.json()
        db=data.data    
        console.log(db)    
        pintarLibros(db)
        } 
    } catch (error) {
        console.log(error)
        contenedor.innerHTML=error
    }
}

// SE HACE LA PETICIÓN A LA API CUANDO TERMINA DE CARGAR EL DOM
document.addEventListener("DOMContentLoaded",cargarLibros)


// FUNCIÓN QUE ENCUENTRA LAS COINCIDENCIAS EN LOS TITULOS DE LIBROS A PARTIR DEL TEXTO INGRESADO EN EL INPUT 
const buscarLibros = (cadena) =>{
      let matches =""
      let num= 0
      db.forEach(el=>{
        if(el.title.toLowerCase().includes(cadena)){ 
        let titulo = el.title
        //CAPITALIZAMOS LA CADENA 
        let cadena_capital = cadena.charAt(0).toUpperCase()+cadena.slice(1)
        if(titulo.includes(cadena_capital)){
        //  SI EL TITULO INCLUYE LA CADENA CAPITALIZADA SE AGREGA UN ITEM ACCORDION POR MEDIO DE UN TEMPLATE STRING   
         num+=1
         //SE AGREGA UNA MARCA PARA QUE SUBRAYE LA COINCIDENCIA   
        let titulo_marca=titulo.replace(cadena_capital,`<mark>${cadena_capital}</mark>`)    
        matches+=`
        <div class="accordion-item">
        <h2 class="accordion-header" id="heading${num}">
          <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${num}" aria-expanded="true" aria-controls="collapse${num}">
            ${titulo_marca}
          </button>
        </h2>
        <div id="collapse${num}" class="accordion-collapse collapse show" aria-labelledby="heading${num}" data-bs-parent="#accordionExample">
          <div class="accordion-body">
            ${el.description}
          </div>
        </div>
      </div>
        `}
        else{
            // SI EL TITULO INCLUYE LA CADENA EN LOWERCASE AGREGA UN ITEM ACCORDION POR MEDIO DE UN TEMPLATE STRING
            num+=1
            //SE AGREGA UNA MARCA PARA QUE SUBRAYE LA COINCIDENCIA
            let titulo_marca=titulo.replace(cadena,`<mark>${cadena}</mark>`)    
            matches+=`
            <div class="accordion-item">
            <h2 class="accordion-header" id="heading${num}">
              <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${num}" aria-expanded="true" aria-controls="collapse${num}">
                ${titulo_marca}
              </button>
            </h2>
            <div id="collapse${num}" class="accordion-collapse collapse show" aria-labelledby="heading${num}" data-bs-parent="#accordionExample">
              <div class="accordion-body">
                ${el.description}
              </div>
            </div>
          </div>
            `   
        }     
        }
      })
      //SI AL FINALIZAR EL FOREACH SE AGREGARON ELEMENTOS AL TEMPLATE STRING MATCHES SE AGREGAN AL CONTENEDOR
      if(matches){
        contenedor.innerHTML=matches
      }else if(matches==""){
        //SI EL TEMPLATE MATCHES ESTA VACIO SE AGREGA EL MENSAJE AL CONTENEDOR
        contenedor.innerHTML=`<h4>No se encontraron resultados de la busqueda</h4>`
      }
    
}

//FUNCION QUE AGREGA EL TITULO DEL LIBRO Y LA DESCRIPCION EN ITEMS ACCORDEON DEL RESULTADO DE LA PETICION DE LA API POR MEDIO DE UN TEMPLATE STRING
const pintarLibros = (data) =>{
    let acordeonitems =""
    let num = 0
    data.forEach(el => {
    num+=1
    acordeonitems+=`
    <div class="accordion-item">
    <h2 class="accordion-header" id="heading${num}">
      <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${num}" aria-expanded="true" aria-controls="collapse${num}">
        ${el.title}
      </button>
    </h2>
    <div id="collapse${num}" class="accordion-collapse collapse show" aria-labelledby="heading${num}" data-bs-parent="#accordionExample">
      <div class="accordion-body">
        ${el.description}
      </div>
    </div>
  </div>
    `
    })
    contenedor.innerHTML=acordeonitems
   } 

//CADA QUE SE DEJA DE OPRIMIR UNA TECLA EN EL INPUTSEARCH SE EJECUTA LA FUNCION PARA BUSCAR LIBROS   
inputSearch.addEventListener("keyup",()=>{
    buscarLibros(inputSearch.value.toLowerCase().trim())
})

//AL EVENTO SUBMIT DEL SEARCHFORM SE EJECUTA LA FUNCION PARA BUSCAR LIBROS
searchForm.addEventListener("submit",(e)=>{
    e.preventDefault()
    buscarLibros(inputSearch.value.toLowerCase().trim())
})