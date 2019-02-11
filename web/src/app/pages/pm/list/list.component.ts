import { ColumnService } from "./../../../@core/data/column.service";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { LocalDataSource } from "ng2-smart-table";
import { AuthService } from "../../../@core/auth/shared/auth.service";
import { BoardService } from "../../../@core/data/board.service";
import { SmartTableService } from "../../../@core/data/smart-table.service";
import { UserService } from "../../../@core/data/users.service";
import { Board, User, Column } from "../../../@core/model";

@Component({
  selector: "ngx-list",
  templateUrl: "./list.component.html",
  styleUrls: ["./list.component.scss"]
})
export class ListComponent implements OnInit {
  selectedRow = null;
  users: User[] = [];
  boards: Board[] = [];
  settings = {
    actions: false,
    // actions: {
    //   position: 'right',
    // },
    // add: {
    //   addButtonContent: '<i class="nb-plus"></i>',
    //   createButtonContent: '<i class="nb-checkmark"></i>',
    //   cancelButtonContent: '<i class="nb-close"></i>',
    // },
    // edit: {
    //   editButtonContent: '<i class="nb-edit"></i>',
    //   saveButtonContent: '<i class="nb-checkmark"></i>',
    //   cancelButtonContent: '<i class="nb-close"></i>',
    // },
    // delete: {
    //   deleteButtonContent: '<i class="nb-trash"></i>',
    //   confirmDelete: true,
    // },
    columns: {
      _id: {
        title: "ID",
        editable: false
      },
      title: {
        title: "Project Name"
      },
      owner: {
        title: "Owner"
      }
    }
  };

  source: LocalDataSource = new LocalDataSource();

  constructor(
    private smartTableService: SmartTableService,
    private activeRoute: ActivatedRoute,
    private authService: AuthService,
    private userService: UserService,
    private boardService: BoardService,
    private columnService: ColumnService,
    private router: Router
  ) {
    this.fetchDataAndRefreshTable();
    this.userService.getUsers().subscribe(users => (this.users = users));
  }

  ngOnInit() {}

  fetchDataAndRefreshTable() {
    this.activeRoute.url.subscribe(x => {
      if (x.length > 0) {
        this.boardService
          .getDataForUser(this.authService.decToken._id)
          .subscribe(boards => {
            this.boards = boards;
            this.source.load(
              boards.map(val => ({ ...val, owner: val.owner.email }))
            );
          });
        return;
      }
      this.boardService.getAll().subscribe(boards => {
        this.boards = boards;
        this.source.load(
          boards.map(val => ({ ...val, owner: val.owner.email }))
        );
      });
    });
  }

  onDeleteConfirm(event): void {
    if (window.confirm("Are you sure you want to delete?")) {
      event.confirm.resolve();
    } else {
      event.confirm.reject();
    }
  }

  onUserRowSelect(event) {
    if (event.isSelected) {
      this.selectedRow = this.boards.filter(
        board => board._id === event.data._id
      )[0];
    } else {
      this.selectedRow = null;
    }
  }

  getRowData() {
    if (this.selectedRow) {
      this.router.navigate([`../board/${this.selectedRow._id}`], {
        relativeTo: this.activeRoute
      });
    } else {
      alert("You need to choose project");
    }
  }

  addBoard(data) {
    const { board, columns } = data;
    this.boardService.add(board).subscribe(board => {
      this.columnService
        .addMany(
          columns.map(col => ({
            title: col,
            boardId: board._id
          }))
        )
        .subscribe(() => this.fetchDataAndRefreshTable());
    });
  }

  editBoard(board: Board) {
    this.boardService.edit(board).subscribe(() => {
      this.fetchDataAndRefreshTable();
    });
  }

  deleteBoard() {
    if (this.selectedRow) {
      this.boardService
        .delete(this.selectedRow._id)
        .subscribe(() => this.fetchDataAndRefreshTable());
    } else {
      alert("You need to choose project to delete");
    }
  }
}
