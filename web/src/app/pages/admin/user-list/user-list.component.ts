import { AdminService } from './../../../@core/data/admin.service';
import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {

  selectedRow = null;
  settings = {
    // actions: false,
    actions: {
      position: 'right',
    },
    add: {
      addButtonContent: '<i class="nb-plus"></i>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmSave: true,
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
    },
    columns: {
      _id: {
        title: 'ID',
        type: 'string',
        editable: false,
      },
      name: {
        title: 'Name',
        type: 'string',
      },
      surname: {
        title: 'Surname',
        type: 'string',
      },
      email: {
        title: 'Email',
        type: 'string',
      },
      empId: {
        title: 'Employee ID',
        type: 'string',
      },
      role: {
        title: 'Role',
        type: 'string',
      },
      isVerified: {
        title: 'Active',
        type: 'boolean',
      }
    },
  };

  source: LocalDataSource = new LocalDataSource();

  constructor(private adminService: AdminService) {
      this.adminService.getUsers()
        .subscribe(data => this.source.load(data));
  }

  ngOnInit() {
  }

  onDeleteConfirm(event): void {
    if (window.confirm('Are you sure you want to delete?')) {
      event.confirm.resolve();
    } else {
      event.confirm.reject();
    }
  }

  onEditConfirm(event) {
    console.log(event);
    if (window.confirm('Are you sure you want to edit?')) {
      this.adminService.updateUserById(event.newData)
        .pipe(
          catchError(err => {
            event.confirm.reject();
            return err;
          })
        )
        .subscribe(() => event.confirm.resolve())
    } else {
      event.confirm.reject();
    }





    // if (window.confirm('Are you sure you want to delete?')) {
    //   console.log(event);
    //   event.confirm.resolve();
    // } else {
    //   event.confirm.reject();
    // }
  }
}
