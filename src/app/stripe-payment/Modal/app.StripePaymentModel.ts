export class StripePaymentModel {
    public fullname: string = "";
    public birthdate: Date;
    public amount: number;
    public address: StripeAddressModel;
}

export class StripeAddressModel {
    public line1: string = "";
    public line2: string = "";
    public city: string = "";
    public state: string = "";
    public postalcode: string = "";
    public country: string = "";
}