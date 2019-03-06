import { Injectable } from '@angular/core';
import { NbMenuItem } from '@nebular/theme';
import { Observable, of } from 'rxjs';
import { MENU_ITEMS } from './../../pages/pages-menu';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  constructor() {}

  getMenuForUser(): Observable<NbMenuItem[]> {
    return of(MENU_ITEMS.map(val => val.title === 'Statistics' ? {
      ...val,
      children: val.children.filter(res => res.title === "My projects")
    } : val).filter(val => val.title !== "Admin Panel"));
  }

  getMenuForAdmin(): Observable<NbMenuItem[]> {
    return of(MENU_ITEMS);
  }
}
