import { Admin } from 'src/common/mongoose/models/admin';
import { User } from 'src/common/mongoose/models/user';
interface IJwtPayloadUser {
  userId: string;
  refresh?: boolean;
}
interface IRequest extends Request {
  user: User;
  image: string;
  admin: Admin;
}
interface IJwtPayloadAdmin {
  adminId: string;
  refresh?: boolean;
}
export type { IJwtPayloadUser, IRequest, IJwtPayloadAdmin };
