import { Connection } from 'mongoose';
import { ADMIN } from 'src/common/mongoose/consts/consts';
import { AdminSchema } from 'src/common/mongoose/models/admin';
import { ADMIN_PROVIDER, DB_PROVIDER } from 'src/config';

export const Adminprovider = [
  {
    provide: ADMIN_PROVIDER,
    useFactory: (connection: Connection) =>
      connection.model(ADMIN, AdminSchema),
    inject: [DB_PROVIDER],
  },
];
