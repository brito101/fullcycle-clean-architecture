export default class Address {
  private _street: string;
  private _number: string;
  private _zipcode: string;
  private _city: string;

  constructor(street: string, number: string, zipcode: string, city: string) {
    this._street = street;
    this._number = number;
    this._zipcode = zipcode;
    this._city = city;
    this.validate();
  }

  get street(): string {
    return this._street;
  }

  get number(): string {
    return this._number;
  }

  get zipcode(): string {
    return this._zipcode;
  }

  get city(): string {
    return this._city;
  }
  toString(): string {
    return `${this._street}, ${this._number}, ${this._city}, ${this._zipcode}`;
  }

  validate(): boolean {
    if (this._street.length === 0) {
      throw new Error("Street is mandatory");
    }
    if (this._number.length === 0) {
      throw new Error("Number is mandatory");
    }
    if (this._city.length === 0) {
      throw new Error("City is mandatory");
    }
    if (this._zipcode.length === 0) {
      throw new Error("Zipcode is mandatory");
    }

    return true;
  }
}
