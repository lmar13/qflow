import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  TemplateRef
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NbDialogService } from "@nebular/theme";
import { Subscription } from "rxjs";
import { CardService } from "../../../../@core/data/card.service";
import { ColumnService } from "../../../../@core/data/column.service";
import { Card, User, Column, AutoCompleteTag } from "../../../../@core/model";
import { UserService } from "../../../../@core/data/users.service";
import { AuthService } from "../../../../@core/auth/shared/auth.service";
import { SortablejsOptions } from "angular-sortablejs";

@Component({
  selector: "ngx-edit-card",
  templateUrl: "./edit-card.component.html",
  styleUrls: ["./edit-card.component.scss"]
})
export class EditCardComponent implements OnDestroy {
  @Input() card: Card;
  @Input() users: User[];
  @Input() columns: Column[];
  @Input() selected: string;

  @Output() onEditCard = new EventEmitter<Card>();

  title = "Edit card";
  selectedCard: string;
  // columns = [] as Column[];
  requestAutocompleteItems: AutoCompleteTag[] = [];

  options: SortablejsOptions = {
    group: "board",
    onUpdate: (event: any) => {
      // this.updateCardPosition(event);
    },
    onAdd: (event: any) => {
      // this.updateCardPosition(event);
    }
  };

  form: FormGroup;
  dialogRef: any;

  date = new Date();
  filter = date => date.getDay() !== 0 && date.getDay() !== 6;

  private subscriptions: Subscription[] = [];

  constructor(
    private dialogService: NbDialogService,
    private fb: FormBuilder,
    private userService: UserService,
    private authService: AuthService,
    private columnService: ColumnService,
    private cardService: CardService
  ) {}

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private createForm() {
    this.form = this.fb.group({
      title: [this.card.title, Validators.required],
      content: [this.card.content],
      columnId: ["", Validators.required],
      assignedUsers: [
        this.card.assignedUsers,
        Validators.required
      ],
      owner: [this.card.owner.email],
      startDate: [new Date(this.card.startDate), Validators.required],
      endDate: [new Date(this.card.endDate)]
    });
  }

  private getDefaultData() {
    // this.columnService.getAll().subscribe(columns => this.columns = columns);
    this.columns.map(col =>
      col.cards.map(card => {
        if (card._id === this.selected) {
          this.card = card;
        }
        return card;
      })
    );

    // this.userService.getUsers().subscribe(users => {
    // });
  }

  open(dialog: TemplateRef<any>) {
    if (this.selected) {
      this.dialogRef = this.dialogService.open(dialog, {
        closeOnBackdropClick: false,
        closeOnEsc: false
      });
      this.getDefaultData();
      this.createForm();
      setTimeout(
        () => this.form.controls["columnId"].setValue(this.card.columnId),
        0
      );
    } else {
      alert("You need to choose card first");
    }
  }

  submit() {
    let formData: Card = this.form.value;

    const { order, owner, boardId, _id, cardId } = this.card;

    // console.log(formData);
    // console.log(this.card);

    formData = {
      ...formData,
      owner,
      boardId,
      order,
      _id
    };

    if (cardId) {
      formData.cardId = cardId;
    }

    // console.log(formData);

    this.onEditCard.emit(formData);
    // this.dialogRef.close();

    // this.cardService.changeEditState(formData);
    this.dialogRef.close();
  }
}
