import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'Dashboard',
    icon: 'nb-home',
    link: '/pages/dashboard',
    home: true,
  },
  {
    title: 'Trello',
    icon: 'nb-tables',
    link: '/pages/trello',
  },
  {
    title: 'FEATURES',
    group: true,
  },
  {
    title: 'Admin Panel',
    icon: 'nb-locked',
    children: [
      {
        title: 'Login',
        link: '/auth/login',
      },
      {
        title: 'Register',
        link: '/auth/signup',
      },
      {
        title: 'Account confirmation',
        link: '/auth/reconfirm',
      },
      {
        title: 'Reset Password',
        link: '/auth/reset-password',
      },
      {
        title: 'Users',
        link: '/pages/admin/users',
      },
    ],
  },
];
