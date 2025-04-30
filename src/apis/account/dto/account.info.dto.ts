export class AccountInfoDto {
  email: string;
  name: string;
  carrier: string;
  phone: string;
  role: string;
  constructor(data) {
    this.email = data.email;
    this.name = data.name;
    this.carrier = data.carrier;
    this.phone = data.phone;
    this.role = data.role;
  }
}
