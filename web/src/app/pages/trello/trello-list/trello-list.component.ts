import { TrelloBoardService } from './../trello-board/trello-board.service';
import { AuthService } from './../../../@core/auth/shared/auth.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { SmartTableService } from './../../../@core/data/smart-table.service';
import { User, Board } from '../../../@core/model';
import { UserService } from '../../../@core/data/users.service';
import { validateConfig } from '@angular/router/src/config';
import { map } from 'rxjs/operators';

@Component({
  selector: 'trello-list',
  templateUrl: './trello-list.component.html',
  styleUrls: ['./trello-list.component.scss']
})
export class TrelloListComponent implements OnInit {

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
        title: 'ID',
        editable: false,
      },
      title: {
        title: 'Project Name'
      },
      owner: {
        title: 'Owner'
      }
    },
  };

  source: LocalDataSource = new LocalDataSource();

  constructor(private smartTableService: SmartTableService,
              private activeRoute: ActivatedRoute,
              private authService: AuthService,
              private userService: UserService,
              private boardService: TrelloBoardService,
              private router: Router) {

    this.fetchDataAndRefreshTable();
    this.userService.getUsers().subscribe(users => this.users = users);
  }

  ngOnInit() {
  }

  fetchDataAndRefreshTable() {
    this.activeRoute.url.subscribe(x => {
      if(x.length > 0){
        this.boardService.getDataForUser(this.authService.decToken._id)
          .subscribe(boards => {
            this.boards = boards;
            this.source.load(boards.map(val => ({...val, owner: val.owner.email})));
          });
          return;
      }
      this.boardService.getAll()
        .subscribe(boards => {
          this.boards = boards;
          this.source.load(boards.map(val => ({...val, owner: val.owner.email})));
        });
    });
  }

  onDeleteConfirm(event): void {
    if (window.confirm('Are you sure you want to delete?')) {
      event.confirm.resolve();
    } else {
      event.confirm.reject();
    }
  }

  onUserRowSelect(event) {
    if(event.isSelected){
      this.selectedRow = this.boards.filter(board => board._id === event.data._id)[0];
    } else {
      this.selectedRow = null;
    }
  }

  getRowData() {
    if(this.selectedRow){
      this.router.navigate([`/pages/trello/board/${this.selectedRow._id}`]);
    } else {
      alert('You need to choose project');
    }
  }

  addBoard(board: Board){
    this.boardService.add(board).subscribe(() => {
      this.fetchDataAndRefreshTable();
    });
  }

  editBoard(board: Board) {
    this.boardService.edit(board).subscribe(() => {
      this.fetchDataAndRefreshTable();
    });
  }

}
