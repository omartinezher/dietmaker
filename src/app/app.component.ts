import { Component } from '@angular/core';
import dataPlatos from '../assets/platosdieta.json';
import { Plato } from 'src/dishes/Plato';
import { Ingrediente } from 'src/dishes/Ingrediente';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
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
      console.log(this.ingredientesTotales);

    }
  }

  countIngredients() {
    const arrayCompletoComidas = [...this.comidasArray, ...this.cenasArray];
    console.log(arrayCompletoComidas);

    if (this.ingredientesTotales.length === 0) {
      for (let i = 0; i < arrayCompletoComidas.length; i++) {
        for (let j = 0; j < arrayCompletoComidas[i].ingredientes.length; j++) {
          const nombreIngrediente = arrayCompletoComidas[i].ingredientes[j].nombreIngrediente;
          const ingredienteExistente = this.getIngredientByName(this.ingredientesTotales, nombreIngrediente);

          if (ingredienteExistente) {
            const auxIngrediente = JSON.parse(JSON.stringify(ingredienteExistente));
            const auxCantidad = parseInt(auxIngrediente.cantidad) + parseInt(arrayCompletoComidas[i].ingredientes[j].cantidad);
            auxIngrediente.cantidad = auxCantidad.toString();

            this.ingredientesTotales = this.ingredientesTotales.map((ingrediente) =>
              ingrediente.nombreIngrediente === nombreIngrediente ? auxIngrediente : ingrediente
            );
          } else {
            this.ingredientesTotales.push(arrayCompletoComidas[i].ingredientes[j]);
          }
        }

        this.ingredientesTotales.sort((a, b) => a.nombreIngrediente.localeCompare(b.nombreIngrediente));
      }
    }
  }


  getIngredientByName(array: any[], nombre: string): any | null {
    const foundObject = array.find(item => item.nombreIngrediente === nombre);
    return foundObject || null;
  }


  numColumns = 10; // Número de columnas que deseas mostrar

  calculateColumns(): number {
    const screenWidth = window.innerWidth; // Ancho de la ventana del navegador
    const columnWidth = 300; // Ancho deseado para cada columna

    const numColumns = Math.floor(screenWidth / columnWidth); // Cálculo del número de columnas

    return numColumns > 0 ? numColumns : 1; // Asegurarse de que haya al menos una columna
  }

}
