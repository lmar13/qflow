import { NbMenuItem } from "@nebular/theme";

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: "Dashboard",
    icon: "nb-home",
    link: "/pages/dashboard",
    home: true
  },
  // {
  //   title: "LeanKit",
  //   icon: "nb-tables",
  //   link: "/pages/leankit"
  // },
  {
    title: "LEANKIT",
    group: true
  },
  {
    title: "Task Register",
    icon: "nb-title",
    link: "/pages/tr"
  },
  {
    title: "Project Manager",
    icon: "nb-tables",
    link: "/pages/pm/user"
    // children: [
    //   {
    //     title: "Create",
    //     link: "/pages/pm/create"
    //   },
    //   {
    //     title: "All projects",
    //     link: "/pages/pm"
    //   },
    //   {
    //     title: "My projects",
    //     link: "/pages/pm/user"
    //   }
    // ]
  },
  {
    title: "FEATURES",
    group: true
  },
  {
    title: "Statistics",
    icon: "nb-bar-chart",
    children: [
      {
        title: "All Projects",
        link: "/pages/stat/projects"
      },
      {
        title: "Projects for users",
        link: "/pages/stat/users"
      },
      {
        title: "My projects",
        link: "/pages/stat/my"
      }
    ]
  },
  {
    title: "Admin Panel",
    icon: "nb-locked",
    children: [
      {
        title: "Users",
        link: "/pages/admin/users"
      }
    ]
  }
];
