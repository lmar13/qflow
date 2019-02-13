import {
  Component,
  OnInit,
  TemplateRef,
  EventEmitter,
  Output
} from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { NbDialogService } from "@nebular/theme";
import { AuthService } from "../../../../@core/auth/shared/auth.service";
import { UserService } from "../../../../@core/data/users.service";
import { User, CardFilter, AutoCompleteTag } from "../../../../@core/model";
import { __core_private_testing_placeholder__ } from "@angular/core/testing";

@Component({
  selector: "ngx-card-filter",
  templateUrl: "./card-filter.component.html",
  styleUrls: ["./card-filter.component.scss"]
})
export class CardFilterComponent {
  title = "Card Filter";
  dialogRef: any;
  users = [] as User[];
  filter = {} as CardFilter;
  selectedUsers: any;

  @Output() filterSet = new EventEmitter<CardFilter>();

  constructor(
    private dialogService: NbDialogService,
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UserService
  ) {
    this.userService.getUsers().subscribe(users => (this.users = users));
  }

  ngOnDestroy() {}

  setUsers(val: string[]) {
    this.filter.userFilter = val;
    this.filterSet.emit({ ...this.filter });
  }
}
