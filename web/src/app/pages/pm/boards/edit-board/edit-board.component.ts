import { Component, EventEmitter, Input, Output, TemplateRef } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NbDialogService } from "@nebular/theme";
import * as _ from "lodash";
import { AuthService } from "../../../../@core/auth/shared/auth.service";
import { BoardService } from "../../../../@core/data/board.service";
import { SkillsService } from "../../../../@core/data/skills.service";
import { UserService } from "../../../../@core/data/users.service";
import { Board, Skill, User } from "../../../../@core/model";

@Component({
  selector: "ngx-edit-board",
  templateUrl: "./edit-board.component.html",
  styleUrls: ["./edit-board.component.scss"]
})
export class EditBoardComponent {
  @Input() users: User[];
  @Input() title: string;
  @Input() board: Board;

  @Output() onEditBoard = new EventEmitter<Board>();
  @Output() onAddBoard = new EventEmitter<Board>();

  form: FormGroup;
  skillForm: FormGroup;
  dialogRef: any;
  skills: any;
  usersForSkills = [] as User[];
  usersForSkillsDefault = [] as User[];

  date = new Date();
  filter = date => date.getDay() !== 0 && date.getDay() !== 6;

  constructor(
    private dialogService: NbDialogService,
    private fb: FormBuilder,
    private userService: UserService,
    private authService: AuthService,
    private boardService: BoardService,
    private skillsService: SkillsService
  ) {
    this.skillsService.get().subscribe(skills => this.skills = skills);
    this.skillsService.getUsersForSkills().subscribe(users => {
      this.usersForSkills = users;
      this.usersForSkillsDefault = users;
    });
  }

  private createForm(board: Board) {
    this.form = this.fb.group({
      title: [board.title, Validators.required],
      owner: [board.owner.email],
      startDate: [new Date(board.startDate), Validators.required],
      endDate: [new Date(board.endDate)]
    });

    this.skillForm = this.fb.group({
      fields: this.fb.array(board.assignedSkills.length > 0 ?
        board.assignedSkills.map(skill =>
          skill.userId.map(userId => this.initSkillFields(skill, userId))
        ).reduce((acc, val) => acc.concat(val), []) : [this.initSkillFields()])
    });
  }

  private initSkillFields(skill = {}, userId = ""): FormGroup {
    const user = this.usersForSkillsDefault.filter(user => user._id === userId)[0];
    return this.fb.group({
      skillName: [skill, Validators.required],
      assignedUsers: [user, Validators.required]
    });
  }

  open(dialog: TemplateRef<any>) {
    this.dialogRef = this.dialogService.open(dialog, {
      closeOnBackdropClick: false,
      closeOnEsc: false
    });
    if (this.board) {
      this.createForm(this.board);
    }
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
    let skillData: any = this.skillForm.controls['fields'].value;

    const skillObj = _.groupBy(skillData, "skillName._id");
    const userObj = _.groupBy(skillData, "assignedUsers._id");

    const skillKeyArray = Object.keys(skillObj);
    const userKeyArray = Object.keys(userObj);

    const { owner, _id } = this.board;

    formData = {
      ...formData,
      _id,
      owner,
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

    this.onEditBoard.emit(formData);
    this.dialogRef.close();
  }
}
