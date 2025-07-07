import { Address } from "./address.model";

export class HistoryItemModel {
  id!: number;
  address: Address = new Address();
  montantBail!: number;
  dateEntree!: Date;
  dateSortie!: Date;
  dateCreated: Date | null = null;
}
