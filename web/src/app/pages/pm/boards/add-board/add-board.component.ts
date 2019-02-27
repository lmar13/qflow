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
import { User, Board, AutoCompleteTag, Column, Skill } from "../../../../@core/model";
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
  usersForSkills = [] as User[];
  // usersForSkillsContainer = [] as User[];
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
    this.skillsService.get().subscribe(skills => this.skills = skills);
    // this.skillsService.getUsersForSkills().subscribe(users =>
    //   this.usersForSkillsContainer = users);
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

  getUsersForSkill(skill: Skill) {
    console.log(skill);
    if(!skill){
      this.usersForSkills = [];
    }
    else {
      this.skillsService.getUsersBySkill(skill._id).subscribe(users =>
        this.usersForSkills = users);
    }

  }

  submit() {
    let formData = this.form.value;
    let layoutData: Column = this.layoutForm.controls["fields"].value.map(
      col => col.colName
    );
    let skillData: any = this.skillForm.controls['fields'].value;

    const skillObj = _.groupBy(skillData, "skillName._id");
    const userObj = _.groupBy(skillData, "assignedUsers._id");

    const skillKeyArray = Object.keys(skillObj);
    const userKeyArray = Object.keys(userObj);

    const { _id, email } = this.authService.decToken;

    formData = {
      ...formData,
      owner: {
        _id,
        email
      },
      assignedUsers: userKeyArray.map(key => ({
      _id: userObj[key][0].assignedUsers._id,
      email: userObj[key][0].assignedUsers.email
    })),
      assignedSkills: skillKeyArray.map(key => ({
        _id: skillObj[key][0].skillName._id,
        name: skillObj[key][0].skillName.name,
        userId: skillObj[key].map(data => data.assignedUsers._id)
      })),
    };

    console.log(formData);

    this.onAddBoard.emit({ board: formData, columns: layoutData });
    this.dialogRef.close();
  }
}
