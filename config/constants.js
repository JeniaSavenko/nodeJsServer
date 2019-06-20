const Constants = {
  secretKey: 'secretKeyBlaBla',
  port: 3000,
  expiresIn: '1h',
  url: 'mongodb+srv://admin:2mn12d61409@cluster0-qsuzq.mongodb.net/testDataBase?retryWrites=true',
  status401: 401,
  status200: 200,
  status500: 500,
  message500: 'Some error occurred while retrieving notes.',
  messageUntitled: 'Untitled Note',
  save: 'save',
  getPost: 'get_post',
  editMode: 'edit_mode',
  sendPost: 'send_post',
  deletePost: 'delete_post',
  updatePost: 'update_post',
  editModeStart: 'edit_mode_start',
  editModeFinish: 'edit_mode_finish',
  connection: 'connection',
  disconnect: 'disconnect',
  mainUrl: '/auth',
  login: '/login',
  reg: '/reg',
};

export const messageIncorrect = 'Incorrect email or password';
export const messageExist = 'This name already exist';
export const status401 = 401;

export default Constants;
