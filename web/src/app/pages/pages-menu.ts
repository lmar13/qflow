import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'Dashboard',
    icon: 'nb-home',
    link: '/pages/dashboard',
    home: true,
  },
  {
    title: 'LeanKit',
    icon: 'nb-tables',
    link: '/pages/leankit',
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
        title: 'Users',
        link: '/pages/admin/users',
      },
    ],
  },
];
