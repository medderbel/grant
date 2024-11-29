import { Connection } from 'mongoose';
import { COORDINATE } from 'src/common/mongoose/consts/consts';
import { CoordinateSchema } from 'src/common/mongoose/models/coordinates';
import { COORDINATE_PROVIDER, DB_PROVIDER } from 'src/config';

export const Coordinateprovider = [
  {
    provide: COORDINATE_PROVIDER,
    useFactory: (connection: Connection) =>
      connection.model(COORDINATE, CoordinateSchema),
    inject: [DB_PROVIDER],
  },
];
