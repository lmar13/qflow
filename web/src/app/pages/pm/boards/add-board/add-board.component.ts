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
import { query } from "@angular/core/src/render3";
import { SkillsService } from "../../../../@core/data/skills.service";
import * as _ from "lodash";

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
  skillForm: FormGroup;
  dialogRef: any;
  skills: any;
  usersForSkills = [];
  usersForSkillsContainer = [];
  selectedSkills = [];

  date = new Date();
  filter = date => date.getDay() !== 0 && date.getDay() !== 6;

  initColumns = ["Planning", "Development", "Testing", "Ready to archive"];

  constructor(
    private dialogService: NbDialogService,
    private fb: FormBuilder,
    private userService: UserService,
    private authService: AuthService,
    private boardService: BoardService,
    private skillsService: SkillsService
  ) {
    this.skillsService.get().subscribe(skills => (this.skills = skills));
    this.skillsService.getUsersForSkills().subscribe(users => {
      console.log(users);
      this.usersForSkillsContainer = users;
    });
  }

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
      fields: this.fb.array(
        this.initColumns.map(col => this.initColumnFields(col))
      )
    });

    this.skillForm = this.fb.group({
      fields: this.fb.array([this.initSkillFields()])
    });
  }

  initColumnFields(col = "") {
    return this.fb.group({
      colName: [col, Validators.required]
    });
  }

  initSkillFields(skill = "") {
    return this.fb.group({
      skillName: [skill, Validators.required],
      assignedUsers: ["", Validators.required]
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

  addColumnField() {
    const control = <FormArray>this.layoutForm.controls["fields"];
    control.push(this.initColumnFields());
  }

  deleteColumnField(i: number) {
    const control = <FormArray>this.layoutForm.controls["fields"];
    control.removeAt(control.length - 1);
  }

  addSkillField() {
    const control = <FormArray>this.skillForm.controls["fields"];
    control.push(this.initSkillFields());
  }

  deleteSkillField(i: number) {
    const control = <FormArray>this.skillForm.controls["fields"];
    control.removeAt(control.length - 1);
  }

  getUsersForSkill(item) {
    console.log(item);
    if (!item) {
      item = {
        Skill: ""
      };
    }
    this.usersForSkills = this.usersForSkillsContainer.filter(
      user => user.TechnicalSkill === item.Skill
    );
  }

  submit() {
    let formData: Board = this.form.value;
    let layoutData: Column = this.layoutForm.controls["fields"].value.map(
      col => col.colName
    );
    // let skillData: any = this.skillForm.controls['fields'].value.map(record => ({
    //   skillName: record.skillName,

    // }));

    // console.log(skillData);

    const { _id, email } = this.authService.decToken;

    formData = {
      ...formData,
      owner: {
        _id,
        email
      }
    };

    // this.onAddBoard.emit({ board: formData, columns: layoutData });
    // this.dialogRef.close();
  }
}
