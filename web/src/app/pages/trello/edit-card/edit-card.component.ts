import { TrelloCardService } from './../trello-card/trello-card.service';
import { Component, EventEmitter, Input, OnDestroy, Output, TemplateRef, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NbDialogService } from '@nebular/theme';
import { Subscription } from 'rxjs';
import { UserService } from '../../../@core/data/users.service';
import { Card, Column, AutoCompleteTag, User } from '../../../@core/model';
import { TrelloColumnService } from '../trello-column/trello-column.service';
import { AuthService } from './../../../@core/auth/shared/auth.service';

@Component({
  selector: 'ngx-edit-card',
  templateUrl: './edit-card.component.html',
  styleUrls: ['./edit-card.component.scss'],
})
export class EditCardComponent implements OnDestroy {
  @Input() card: Card;
  @Input() users: User[];
  @Input() columns: Column[];


  title = "Edit card";
  // columns = [] as Column[];
  requestAutocompleteItems: AutoCompleteTag[] = [];

  form: FormGroup;
  dialogRef: any;

  private subscriptions: Subscription[] = [];

  constructor(private dialogService: NbDialogService,
              private fb: FormBuilder,
              private userService: UserService,
              private authService: AuthService,
              private columnService: TrelloColumnService,
              private cardService: TrelloCardService) { }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private createForm() {
    this.form = this.fb.group({
      title: [this.card.title, Validators.required],
      content: [this.card.content],
      columnId: ['', Validators.required],
      assignedUsers: [this.card.assignedUsers.map(val => ({
        ...val,
        readonly: val.value === this.card.owner._id ? true : false
      })), Validators.required],
      owner: [this.card.owner.email]
    });
  }

  private getDefaultData() {
    // this.columnService.getAll().subscribe(columns => this.columns = columns);
    // this.userService.getUsers().subscribe(users => {
      this.requestAutocompleteItems = this.users.map(user => ({
          value: user._id,
          display: user.email,
          readonly: false,
        }));
    // });
  }

  open(dialog: TemplateRef<any>) {
    this.dialogRef = this.dialogService.open(dialog, { closeOnBackdropClick : false, closeOnEsc: false });
    this.getDefaultData();
    console.log(this.card);
    this.createForm();
    setTimeout(() => this.form.controls['columnId'].setValue(this.card.columnId),0);
  }

  submit() {
    let formData: Card = this.form.value;

    const { order, owner, boardId, _id } = this.card;

    // console.log(formData);
    // console.log(this.card);

    formData = {
      ...formData,
      owner,
      boardId,
      order,
      _id,
    };

    // console.log(formData);

    // this.onEditCard.emit(formData);
    // this.dialogRef.close();

    this.cardService.changeEditState(formData);
    this.dialogRef.close();
  }

}
