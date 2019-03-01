import { SkillsService } from './../../../@core/data/skills.service';
import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'ngx-skill-list',
  templateUrl: './skill-list.component.html',
  styleUrls: ['./skill-list.component.scss']
})
export class SkillListComponent implements OnInit {

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
      confirmCreate: true,
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
      // _id: {
      //   title: 'ID',
      //   type: 'string',
      //   editable: false,
      // },
      name: {
        title: 'Name',
        type: 'string',
      },
      type: {
        title: "Type",
        type: 'string'
      },
      category: {
        title: "Category",
        type: "string"
      }
    },
  };

  source: LocalDataSource = new LocalDataSource();

  constructor(private skillsService: SkillsService) {
    this.skillsService.get()
      .subscribe(data => this.source.load(data));
}

  ngOnInit() {
  }

  onCreateConfirm(event) {
    this.skillsService.addSkill(event.newData)
      .pipe(
        catchError(err => {
          event.confirm.reject();
          return err;
        })
      )
      .subscribe(() => {
        this.skillsService.get()
          .subscribe(data => this.source.load(data));
        event.confirm.resolve();
      })
  }

  onEditConfirm(event) {
    if (window.confirm('Are you sure you want to edit?')) {
      this.skillsService.updateSkillById(event.newData)
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
  }

  onDeleteConfirm(event): void {
    if (window.confirm('Are you sure you want to delete?')) {
      this.skillsService.deleteSkillById(event.data)
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
  }

}
