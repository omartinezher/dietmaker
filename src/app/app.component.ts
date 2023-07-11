import { Component } from '@angular/core';
import dataPlatos from '../assets/platosdieta.json';
import { Plato } from 'src/dishes/Plato';
import { Ingrediente } from 'src/dishes/Ingrediente';
import { HttpClient } from '@angular/common/http';
import jsPDF from "jspdf";
import "jspdf-autotable";
import html2canvas from 'html2canvas';
// import * as mysql from 'mysql2';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {

  semanaArray: string[] = ["Lunes","Martes","Miercoles","Jueves","Viernes","Sabado","Domingo"];

  resultado: number = 0;

  platosArray: Plato[] = [];
  comidasArray: Plato[] = [];
  cenasArray: Plato[] = [];
  arrayCompletoComidas: Plato[] = [];

  comidasRandomArray: number[] = [];
  cenasRandomArray: number[] = [];
  ingredientesTotales : Ingrediente[] = [];

  auxPlato!: Plato;
  auxIngrediente!: Ingrediente;
  auxCantidad: number = 0;

  title = 'Dietmaker';
  mostrar = false;
  isButtonDisabled = false;

  constructor(private http: HttpClient) { }

  ngOnInit(){

    this.platosArray = dataPlatos.arrayPlatos;

    /*
    this.leerArchivoJSON().subscribe((data: any) => {
      const arrayPlatos: Plato[] = data.arrayPlatos;

      arrayPlatos.forEach((plato: Plato) => {
        const nombrePlato = plato.nombrePlato;
        const isLunch = plato.isLunch;

        const ingredientes = plato.ingredientes;
        const listaIngredientes: Ingrediente[] = [];

        ingredientes.forEach((ingrediente: Ingrediente) => {
          const nombreIngrediente = ingrediente.nombreIngrediente;
          const cantidad = ingrediente.cantidad;
          const unitario = ingrediente.unitario;

          // Crear objeto de ingrediente
          const nuevoIngrediente: Ingrediente = {
            nombreIngrediente,
            cantidad,
            unitario
          };

          listaIngredientes.push(nuevoIngrediente);
        });

        // Realizar la inserción en la base de datos utilizando HttpClient
        this.insertarDatosEnBD(nombrePlato, listaIngredientes, isLunch).subscribe(response => {
          console.log('Inserción exitosa');
        }, error => {
          console.error('Error al insertar datos', error);
        });
      });
    });

    */

  }

  /*
  leerArchivoJSON(): Observable<any> {
    return this.http.get<any>('../assets/platosdieta.json');
  }
  */

  /*
  insertarDatosEnBD(nombrePlato: string, ingredientes: Ingrediente[], isLunch: boolean): Observable<any> {

    // Aquí puedes realizar la lógica para realizar la inserción en la base de datos
    // Utiliza el HttpClient para enviar una solicitud HTTP POST con los datos a tu API o servicio backend que maneje las inserciones en la base de datos
    // Puedes enviar los datos en el cuerpo de la solicitud utilizando JSON.stringify()
    const datos = {
      nombrePlato,
      ingredientes,
      isLunch
    };

    return this.http.post<any>('URL_DEL_API_O_SERVICIO_BACKEND', JSON.stringify(datos));
  }
  */



  makeAdiet() {
    if(this.mostrar){
      this.mostrar = false;
    } else {

      this.mostrar = true;

      this.comidasArray = [];
      this.cenasArray = [];

      do {
        this.auxPlato = this.platosArray[Math.trunc(Math.random() * (this.platosArray.length - 0) + 0)];

        if (this.auxPlato.isLunch && this.comidasArray.length < 7) {
          this.comidasArray.push(this.auxPlato);
        } else if (!this.auxPlato.isLunch && this.cenasArray.length < 7) {
          this.cenasArray.push(this.auxPlato);
        }
      } while (this.comidasArray.length + this.cenasArray.length != 14);

      this.ingredientesTotales.length = 0;
      this.arrayCompletoComidas = [...this.comidasArray, ...this.cenasArray];
      this.countIngredients();

    }
  }

  countIngredients() {
    if (this.ingredientesTotales.length === 0) {
      for (let i = 0; i < this.arrayCompletoComidas.length; i++) {
        for (let j = 0; j < this.arrayCompletoComidas[i].ingredientes.length; j++) {
          const nombreIngrediente = this.arrayCompletoComidas[i].ingredientes[j].nombreIngrediente;
          const ingredienteExistente = this.getIngredientByName(this.ingredientesTotales, nombreIngrediente);

          if (ingredienteExistente) {
            const auxIngrediente = JSON.parse(JSON.stringify(ingredienteExistente));
            const auxCantidad = parseInt(auxIngrediente.cantidad) + parseInt(this.arrayCompletoComidas[i].ingredientes[j].cantidad);
            auxIngrediente.cantidad = auxCantidad.toString();

            this.ingredientesTotales = this.ingredientesTotales.map((ingrediente) =>
              ingrediente.nombreIngrediente === nombreIngrediente ? auxIngrediente : ingrediente
            );
          } else {
            this.ingredientesTotales.push(this.arrayCompletoComidas[i].ingredientes[j]);
          }
        }

        this.ingredientesTotales.sort((a, b) => a.nombreIngrediente.localeCompare(b.nombreIngrediente));
      }
    }
    this.buscarImagenes();
  }


  getIngredientByName(array: any[], nombre: string): any | null {
    const foundObject = array.find(item => item.nombreIngrediente === nombre);
    return foundObject || null;
  }


  downloadMenu(){

    const doc = new jsPDF();
    let numPages = 1;

    // Definir las coordenadas iniciales para dibujar el contenido
    let y = 20;
    const pageHeight = doc.internal.pageSize.getHeight(); // Obtener la altura de la página

    // Recorrer el array y agregar cada elemento al PDF
    doc.text("INGREDIENTES" , 10 , 10);
    doc.setFont('Arial', 'normal');
    doc.setFontSize(12);

    for(let i = 0 ; i < this.ingredientesTotales.length ; i++){
      if( y + 10 > pageHeight - 10){

        doc.addPage();
        y = 20;

      } else {

        let x = 20;
        doc.text(this.ingredientesTotales[i].nombreIngrediente , x , y);
        x += 100;
        doc.text(this.ingredientesTotales[i].cantidad + " gramos/unidades" , x , y);
        y += 5;
      }

    }
    y += 10;
    doc.text("MENÚ SEMANAL" , 10 , y);
    y += 10;
    for(let i = 0 ; i < this.arrayCompletoComidas.length ; i++){
      if( y + 10 > pageHeight - 10){

        doc.addPage();
        y = 20;

      } else {

        let x = 20;
        doc.text(this.arrayCompletoComidas[i].nombrePlato , x , y);
        x += 80;

        for(let j = 0; j < this.arrayCompletoComidas[i].ingredientes.length ; j++){
          if(y + 10 > pageHeight - 10){
            doc.addPage();
            y = 10;
          }
          else{
            doc.text(this.arrayCompletoComidas[i].ingredientes[j].nombreIngrediente + " - " + this.arrayCompletoComidas[i].ingredientes[j].cantidad + " gramos / unidades" , x ,y+10);
            y += 10;
          }

        }
        y += 10;
      }
    }
    // Guardar el archivo PDF
    doc.save('MenuSemanal.pdf');

  }

  addFooter(){

  }


  numColumns = 7; // Número de columnas que deseas mostrar

  calculateColumns(): number {
    const screenWidth = window.innerWidth; // Ancho de la ventana del navegador
    const columnWidth = 300; // Ancho deseado para cada columna

    const numColumns = Math.floor(screenWidth / columnWidth); // Cálculo del número de columnas

    return numColumns > 0 ? numColumns : 1; // Asegurarse de que haya al menos una columna
  }


  urlsImagenes: string[] = [];

  buscarImagenes() {
    for (let i = 0; i < this.ingredientesTotales.length; i++) {

      const ingredienteCompra = this.ingredientesTotales[i];
      const apiKey = '38154666-7565d61a70a128b350c90910c';
      const url = 'https://pixabay.com/api/?key='+apiKey+'&q='+ingredienteCompra.nombreIngrediente.split(" ")[0]+'&image_type=photo&lang=es&per_page=3&category=food';
      this.http.get(url).subscribe((response: any) => {
        if (response.hits && response.hits.length > 0) {
          const firstPageURL = response.hits[0].pageURL;
          this.urlsImagenes.push(firstPageURL);
        }
      });
    }
  }

  voltearCarta(index: number) {
    const carta = document.getElementById(`carta-${index}`);
    if (carta) {
      carta.classList.toggle('volteada');
    }
  }


}
