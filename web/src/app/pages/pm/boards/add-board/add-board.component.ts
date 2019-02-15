import {
  Component,
  OnInit,
  TemplateRef,
  Input,
  Output,
  EventEmitter
} from "@angular/core";
import { Validators, FormGroup, FormBuilder, FormArray } from "@angular/forms";
import { NbDialogService } from "@nebular/theme";
import { User, Board, AutoCompleteTag, Column } from "../../../../@core/model";
import { UserService } from "../../../../@core/data/users.service";
import { AuthService } from "../../../../@core/auth/shared/auth.service";
import { BoardService } from "../../../../@core/data/board.service";

@Component({
  selector: "ngx-add-board",
  templateUrl: "./add-board.component.html",
  styleUrls: ["./add-board.component.scss"]
})
export class AddBoardComponent {
  @Input() users: User[];
  @Input() title: string;
  @Input() board: Board;

  @Output() onEditBoard = new EventEmitter<Board>();
  @Output() onAddBoard = new EventEmitter<Object>();

  requestAutocompleteItems: AutoCompleteTag[] = [];

  form: FormGroup;
  layoutForm: FormGroup;
  dialogRef: any;

  date = new Date();
  filter = date => date.getDay() !== 0 && date.getDay() !== 6;

  initColumns = ["Planning", "Development", "Testing", "Ready to archive"];

  constructor(
    private dialogService: NbDialogService,
    private fb: FormBuilder,
    private userService: UserService,
    private authService: AuthService,
    private boardService: BoardService
  ) {}

  private createForm() {
    const { email, _id } = this.authService.decToken;

    const readOnlyUser = {
      value: _id,
      display: email,
      readonly: true
    } as AutoCompleteTag;

    this.form = this.fb.group({
      title: ["", Validators.required],
      assignedUsers: [[readOnlyUser], Validators.required],
      owner: [email],
      startDate: [new Date(Date.now()), Validators.required],
      endDate: [new Date(Date.now()), Validators.required]
    });

    this.layoutForm = this.fb.group({
      fields: this.fb.array(this.initColumns.map(col => this.initFields(col)))
    });
  }

  initFields(col = "") {
    return this.fb.group({
      colName: [col, Validators.required]
    });
  }

  private getDefaultData() {
    this.requestAutocompleteItems = this.users.map(user => ({
      value: user._id,
      display: user.email,
      readonly: false
    }));
  }

  open(dialog: TemplateRef<any>) {
    this.dialogRef = this.dialogService.open(dialog, {
      closeOnBackdropClick: false,
      closeOnEsc: false
    });
    // if(this.board) {
    this.getDefaultData();
    this.createForm();
    // }
  }

  addField() {
    const control = <FormArray>this.layoutForm.controls["fields"];
    control.push(this.initFields());
  }

  deleteField(i: number) {
    const control = <FormArray>this.layoutForm.controls["fields"];
    control.removeAt(control.length - 1);
  }

  submit() {
    let formData: Board = this.form.value;
    let layoutData: Column = this.layoutForm.controls["fields"].value.map(
      col => col.colName
    );

    const { _id, email } = this.authService.decToken;

    formData = {
      ...formData,
      owner: {
        _id,
        email
      }
    };

    this.onAddBoard.emit({ board: formData, columns: layoutData });
    this.dialogRef.close();
  }
}
