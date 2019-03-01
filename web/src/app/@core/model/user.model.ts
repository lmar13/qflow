export interface User {
  _id: string;
  name: string;
  surname: string;
  email: string;
  empId: number,
  role: 'admin' | 'user' | 'guest',
  skills: {
    _id: string;
    name: string;
  }
  cards: number;
  isVerified: boolean;
}
