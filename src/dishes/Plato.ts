import { Ingrediente } from "./Ingrediente";

export interface Plato {
  idPlato: number;
  nombrePlato: string;
  ingredientes: Ingrediente[];
  isLunch: boolean;
}
