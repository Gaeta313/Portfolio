import { Comune } from "./comune";

export interface IndirizzoSede {
  id: number;
  via: string;
  civico: string;
  cap: string;
  localita: string;
  comune: Comune
}
