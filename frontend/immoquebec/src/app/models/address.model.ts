import { City } from "./city.model";
import { Country } from "./country.model";

export class Address {
    streetName!: string;
    streetNumber!: number;
    postalCode!: string;
    latitude!: number;
    longitude!: number;
    country: Country = new Country();
    city: City = new City();
}
