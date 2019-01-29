import { Component, OnInit, Input, OnDestroy, TemplateRef, Output, EventEmitter } from '@angular/core';
import { User, AutoCompleteTag, Board } from '../../../@core/model';
import { FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { NbDialogService } from '@nebular/theme';
import { UserService } from '../../../@core/data/users.service';
import { AuthService } from '../../../@core/auth/shared/auth.service';
import { TrelloColumnService } from '../trello-column/trello-column.service';
import { TrelloBoardService } from '../trello-board/trello-board.service';

@Component({
  selector: 'ngx-edit-board',
  templateUrl: './edit-board.component.html',
  styleUrls: ['./edit-board.component.scss']
})
export class EditBoardComponent {
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
    this.form = this.fb.group({
      title: [this.board.title, Validators.required],
      assignedUsers: [this.board.assignedUsers, Validators.required],
      owner: [this.board.owner.email],
      startDate: [this.board.startDate, Validators.required],
      endDate: [this.board.endDate],
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
    if(this.board){
      this.getDefaultData();
      this.createForm();
    }
  }

  submit() {
    let formData: Board = this.form.value;

    const { owner, _id } = this.board;

    formData = {
      ...formData,
      _id,
      owner,
    }

    console.log(formData);

    this.onEditBoard.emit(formData);
    this.dialogRef.close();
  }


}
