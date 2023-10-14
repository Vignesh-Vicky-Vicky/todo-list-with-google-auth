import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { LoaderService } from 'src/app/services/loader.service';
import { AuthService } from 'src/app/shared/auth.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
  host: {
    '(document:click)': 'onClick($event)',
  },
})
export class HomePageComponent implements OnInit {
  user: any;
  signoutDropdown: boolean = false;
  @ViewChild('header') header: ElementRef;
  todoData: any[] = [];
  editMode: boolean = false;
  editItemNumber: number;
  editItemBackup: {
    generatedDate: "",
    status: "",
    todoDate: "",
    todoItem: "",
    todo_id: ""
  };
  today: any;

  constructor(private auth: AuthService, private fb: FormBuilder, private api: ApiService, private loader: LoaderService) { }

  formData = this.fb.group({
    todoDetails: ["", [Validators.required, Validators.minLength(10)]],
    date: ["", Validators.required]
  })


  ngOnInit(): void {
    const userDetails = JSON.parse(localStorage.getItem('user')!);
    this.user = userDetails;
    this.fetchAlltodos();
    const newDate = new Date();
    this.today = `${newDate.getFullYear()}-${(newDate.getMonth() + 1).toString().padStart(2, "0")}-${newDate.getDate().toString().padStart(2, "0")}`;
  }

  signout() {
    this.auth.signOut();
  }

  toggleLogoutDropdown() {
    this.signoutDropdown = !this.signoutDropdown;
  }

  onClick(event: any) {
    if (!event.target.classList.contains('profile-img-wrapper')) {
      this.signoutDropdown = false;
    }
  }

  replaceEmptySpace(e: any) {
    e.target.value = e.target.value.replaceAll("  ", " ");
  }

  // Upload todo
  fetchFormDetails() {
    const payLoad = {
      todoItem: this.formData.value.todoDetails,
      todoDate: this.formData.value.date,
      generatedDate: new Date(),
      status: "not-completed"
    };
    this.loader.open();
    this.api.postTodo(this.user.uid, payLoad).subscribe((res: any) => {
      this.formData.reset();
      this.fetchAlltodos();
    })
  }

  // Fetch todo
  fetchAlltodos() {
    this.loader.open();
    this.api.fetchAllTodos(this.user.uid).subscribe((res: any) => {
      this.todoData = [];
      if (res) {
        const keys = Object.keys(res);
        keys.forEach((item: any) => {
          const ele = {
            ...res[item],
            todo_id: item,
          }
          this.todoData.push(ele);
        })
      }
      this.loader.close();
    }, (err) => {
      console.log(err);
    })
  }

  // deleteTodo
  deleteTodo(id: any) {
    this.loader.open();
    this.api.deleteTodo(this.user.uid, id).subscribe((res: any) => {
      this.fetchAlltodos();
    })
  }

  // Change Status
  changeTodoStatus(index: any) {
    if (this.todoData[index].status === "completed") {
      this.todoData[index].status = "not-completed";
    } else {
      this.todoData[index].status = "completed";
    }
    const element = this.todoData[index];
    this.loader.open();
    this.api.changeTodostatus(this.user.uid, element.todo_id, element).subscribe((res: any) => {
      this.fetchAlltodos();
    })
  }

  editTodo(index: number) {
    this.editMode = true;
    this.editItemNumber = index;
    const currentItem = this.todoData[index];
    this.editItemBackup = currentItem;
    this.formData.controls.todoDetails.setValue(currentItem.todoItem);
    this.formData.controls.date.setValue(currentItem.todoDate);
  }

  updateTodoWithChanges() {
    const payLoad = {
      ...this.editItemBackup,
      todoItem: this.formData.get('todoDetails')?.value,
      todoDate: this.formData.get('date')?.value
    };
    this.loader.open();
    this.api.changeTodostatus(this.user.uid, payLoad.todo_id, payLoad).subscribe((res: any) => {
      this.editMode = false;
      this.formData.reset();
      this.fetchAlltodos();
    })
  }

  cancelEdit() {
    this.todoData[this.editItemNumber] = this.editItemBackup;
    this.editMode = false;
    this.formData.reset();
  }
}
