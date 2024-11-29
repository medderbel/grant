interface ICreateAdmin {
  FirstName: string;
  LastName: string;
  email: string;
  password: string;
  image: string;
}
interface IEditAdmin {
  _id: string;
  updatedBy: string;
}
export type { ICreateAdmin, IEditAdmin };
