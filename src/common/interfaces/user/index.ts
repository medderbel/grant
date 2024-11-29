interface IUserCommon {
  FirstName: string;
  LastName: string;
  email: string;
  password: string;
}
interface IEditUser extends IUserCommon {
  _id: string;
  updatedBy: string;
}
interface ICreateUser extends IUserCommon {}
export type { IEditUser, ICreateUser };
