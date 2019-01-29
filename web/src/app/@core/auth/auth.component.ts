import { Component, OnInit } from '@angular/core';
import {Location} from '@angular/common';

@Component({
  selector: 'ngx-auth',
  styleUrls: ["./auth.component.scss"],
  templateUrl: './auth.component.html'})
export class AuthComponent implements OnInit {

  constructor(private location: Location) { }

  ngOnInit() {
  }

  back() {
    this.location.back();
    return false;
  }

}
