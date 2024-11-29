import { Connection } from 'mongoose';
import { FILE } from 'src/common/mongoose/consts/consts';
import { FileSchema } from 'src/common/mongoose/models/file';
import { DB_PROVIDER, FILE_PROVIDER } from 'src/config';

export const FileProvider = [
  {
    provide: FILE_PROVIDER,
    useFactory: (connection: Connection) => connection.model(FILE, FileSchema),
    inject: [DB_PROVIDER],
  },
];
