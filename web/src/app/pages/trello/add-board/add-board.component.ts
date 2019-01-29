import { Component, OnInit, TemplateRef, Input, Output, EventEmitter } from '@angular/core';
import { Board, User, AutoCompleteTag } from '../../../@core/model';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { NbDialogService } from '@nebular/theme';
import { UserService } from '../../../@core/data/users.service';
import { AuthService } from '../../../@core/auth/shared/auth.service';
import { TrelloBoardService } from '../trello-board/trello-board.service';

@Component({
  selector: 'ngx-add-board',
  templateUrl: './add-board.component.html',
  styleUrls: ['./add-board.component.scss']
})
export class AddBoardComponent {
  @Input() users: User[];
  @Input() title: string;
  @Input() board: Board;

  @Output() onEditBoard = new EventEmitter<Board>();
  @Output() onAddBoard = new EventEmitter<Board>();

  requestAutocompleteItems: AutoCompleteTag[] = [];

  form: FormGroup;
  dialogRef: any;

  constructor(private dialogService: NbDialogService,
              private fb: FormBuilder,
              private userService: UserService,
              private authService: AuthService,
              private boardService: TrelloBoardService) { }

  private createForm() {

    const { email, _id } = this.authService.decToken;

    const readOnlyUser = {
      value: _id,
      display: email,
      readonly: true,
    } as AutoCompleteTag;

    this.form = this.fb.group({
      title: ['', Validators.required],
      assignedUsers: [[readOnlyUser], Validators.required],
      owner: [''],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
    });
  }

  private getDefaultData() {
      this.requestAutocompleteItems = this.users.map(user => ({
          value: user._id,
          display: user.email,
          readonly: false,
        }));
  }

  open(dialog: TemplateRef<any>) {
    this.dialogRef = this.dialogService.open(dialog, { closeOnBackdropClick : false, closeOnEsc: false });
    // if(this.board) {
      this.getDefaultData();
      this.createForm();
    // }
  }

  submit() {
    let formData: Board = this.form.value;

    const { _id, email } = this.authService.decToken;

    formData = {
      ...formData,
      owner: {
        _id,
        email
      },
    }

    this.onAddBoard.emit(formData);
    this.dialogRef.close();
  }
}
