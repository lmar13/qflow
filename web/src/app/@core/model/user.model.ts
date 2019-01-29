export interface User {
  _id: string;
  name: string;
  surname: string;
  email: string;
  empId: number,
  role: 'admin' | 'user' | 'guest',
}
