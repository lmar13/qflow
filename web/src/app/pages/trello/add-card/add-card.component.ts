import { Component, EventEmitter, Input, OnDestroy, Output, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NbDialogService } from '@nebular/theme';
import { Subscription } from 'rxjs';
import { UserService } from '../../../@core/data/users.service';
import { Card, Column, AutoCompleteTag, User } from '../../../@core/model';
import { TrelloColumnService } from '../trello-column/trello-column.service';
import { AuthService } from './../../../@core/auth/shared/auth.service';

@Component({
  selector: 'ngx-add-card',
  templateUrl: './add-card.component.html',
  styleUrls: ['./add-card.component.scss']
})
export class AddCardComponent implements OnDestroy {

  @Input() boardId: string;
  @Input() users: User[];
  @Input() columns: Column[];

  @Output() onAddCard = new EventEmitter<Card>();

  title = "Add new card"
  // columns = [] as Column[];
  requestAutocompleteItems: AutoCompleteTag[] = [];

  form: FormGroup;
  dialogRef: any;

  private subscriptions: Subscription[] = [];

  constructor(private dialogService: NbDialogService,
              private fb: FormBuilder,
              private columnService: TrelloColumnService,
              private userService: UserService,
              private authService: AuthService) {
    }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private createForm() {
    const { email, _id } = this.authService.decToken;

    const readOnlyUser = {
      value: _id,
      display: email,
      readonly: true,
    } as AutoCompleteTag;

    this.form = this.fb.group({
      title: ['', Validators.required],
      content: [''],
      columnId: ['', Validators.required],
      assignedUsers: [[readOnlyUser], Validators.required],
      owner: ['']
    });
  }

  private getDefaultData() {
    // this.columnService.getAll().subscribe(columns => this.columns = columns);
    // this.userService.getUsers().subscribe(users => {
      this.requestAutocompleteItems = this.users.filter(user => user._id !== this.authService.decToken._id)
        .map(user => ({
          value: user._id,
          display: user.email,
          readonly: false,
        } as AutoCompleteTag)) || [];
    // });
  }

  open(dialog: TemplateRef<any>) {
    this.dialogRef = this.dialogService.open(dialog, { closeOnBackdropClick : false, closeOnEsc: false });
    this.getDefaultData();
    this.createForm();
  }

  submit() {
    let formData: Card = this.form.value;
    const { email, _id } = this.authService.decToken;

    console.log(formData);

    formData = {
      ...formData,
      owner: {
        _id,
        email,
      },
      boardId: this.boardId,
      order: 0,
    };

    console.log(formData);

    this.onAddCard.emit(formData);
    this.dialogRef.close();
  }

}
