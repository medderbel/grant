//mongoose
const USER_PROVIDER = 'Userprovider';
const DB_PROVIDER = 'DatabaseProvider';
const COORDINATE_PROVIDER = 'CoordinateProvider';
const FILE_PROVIDER = 'FileProvider';
const ADMIN_PROVIDER = 'AdminProvider';
export {
  USER_PROVIDER,
  DB_PROVIDER,
  COORDINATE_PROVIDER,
  FILE_PROVIDER,
  ADMIN_PROVIDER,
};
//tokens
const ACCESS_TOKEN_TIMEOUT = '300s';
const REFRESH_TOKEN_TIMEOUT = '2400h';
const RESET_TOKEN_TIMEOUT = '1h';
export { ACCESS_TOKEN_TIMEOUT, REFRESH_TOKEN_TIMEOUT, RESET_TOKEN_TIMEOUT };
