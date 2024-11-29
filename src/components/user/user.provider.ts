import { Connection } from 'mongoose';
import { USER } from 'src/common/mongoose/consts/consts';
import { UserSchema } from 'src/common/mongoose/models/user';
import { DB_PROVIDER, USER_PROVIDER } from 'src/config';

export const Userprovider = [
  {
    provide: USER_PROVIDER,
    useFactory: (connection: Connection) => connection.model(USER, UserSchema),
    inject: [DB_PROVIDER],
  },
];
