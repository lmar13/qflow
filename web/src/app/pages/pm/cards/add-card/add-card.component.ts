import { Component, EventEmitter, Input, OnDestroy, Output, TemplateRef } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NbDialogService } from "@nebular/theme";
import { Subscription } from "rxjs";
import { AuthService } from "../../../../@core/auth/shared/auth.service";
import { ColumnService } from "../../../../@core/data/column.service";
import { UserService } from "../../../../@core/data/users.service";
import { Card, Column, User } from "../../../../@core/model";

@Component({
  selector: "ngx-add-card",
  templateUrl: "./add-card.component.html",
  styleUrls: ["./add-card.component.scss"]
})
export class AddCardComponent implements OnDestroy {
  @Input() boardId: string;
  @Input() users: User[];
  @Input() columns: Column[];
  @Input() cardId: string;

  @Output() onAddCard = new EventEmitter<Card>();

  title = "Add new card";
  // columns = [] as Column[];

  form: FormGroup;
  dialogRef: any;

  date = new Date();
  filter = date => date.getDay() !== 0 && date.getDay() !== 6;

  private subscriptions: Subscription[] = [];

  constructor(
    private dialogService: NbDialogService,
    private fb: FormBuilder,
    private columnService: ColumnService,
    private userService: UserService,
    private authService: AuthService
  ) {}

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private createForm() {
    const { email, _id } = this.authService.decToken;

    this.form = this.fb.group({
      title: ["", Validators.required],
      content: [""],
      columnId: ["", Validators.required],
      assignedUsers: ["", Validators.required],
      owner: [""],
      startDate: [new Date(Date.now()), Validators.required],
      endDate: [new Date(Date.now()), Validators.required]
    });
  }

  open(dialog: TemplateRef<any>) {
    this.dialogRef = this.dialogService.open(dialog, {
      closeOnBackdropClick: false,
      closeOnEsc: false
    });
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
        email
      },
      boardId: this.boardId,
      order: 0
    };

    if(this.cardId) {
      formData.cardId = this.cardId
    }

    console.log(formData);

    this.onAddCard.emit(formData);
    this.dialogRef.close();
  }
}
