import { Address } from "./address.model";
import { User } from "./user.model";

export class AdOffer {
    adName!: string;
    description!: string;
    plotSurface!: number;
    price!: number;
    numberOfBedrooms!: number;
    numberOfBathrooms!: number;
    floorNumber!: number;
    address: Address = new Address();
    user: User = new User();
    adType!: string;
    lowIncomeBuilding: boolean = false;
    adImages: string[] = [];

}
