import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  fetchAllTodos(uid: any) {
    return this.http.get(`https://todo-list-984fa-default-rtdb.firebaseio.com/${uid}.json`);
  }

  postTodo(uid: any, data: any) {
    return this.http.post(`https://todo-list-984fa-default-rtdb.firebaseio.com/${uid}.json`, JSON.stringify(data));
  }

  deleteTodo(uid: any, todoId: any) {
    return this.http.delete(`https://todo-list-984fa-default-rtdb.firebaseio.com/${uid}/${todoId}.json`);
  }

  changeTodostatus(uid: any, todoId: any, data: any) {
    return this.http.put(`https://todo-list-984fa-default-rtdb.firebaseio.com/${uid}/${todoId}.json`, JSON.stringify(data));
  }
}
