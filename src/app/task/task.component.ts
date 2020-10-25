import Swal from 'sweetalert2/dist/sweetalert2.js';

import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

import { Component, HostListener, OnInit } from '@angular/core';

declare var $: any;

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit {
  TodoList: { taskName: string, taskComplete: boolean }[] = [];
  enteredTaskName = "";

  @HostListener("window:beforeunload", ["$event"]) unloadHandler(event: Event) {
    let index;
    for(index = 0 ; index < this.TodoList.length ; index++){
      if(!this.TodoList[index].taskComplete){
        localStorage.setItem('task'+index , this.TodoList[index].taskName);
      }
    }
    //event.returnValue = false;
  }

  constructor() { }

  ngOnInit(): void {
    let number = 0 ;
    let key = 'task'+number;
    while(true){
      key = 'task'+number;
      if(localStorage.getItem(key) == null){
        break;
      }
      this.TodoList.push({taskName: localStorage.getItem(key) , taskComplete: false});
      number = number + 1;

    }
  }
  addTask(){
    if(this.enteredTaskName === ''){
      Swal.fire({
        title: 'Error!',
        text: 'Can\'t add an Empty String',
        icon: 'error',
        confirmButtonText: 'Retry'
      })
    } else {
      this.TodoList.push({taskName:this.enteredTaskName , taskComplete: false});
      this.enteredTaskName = '';

    }
  }
  DeleteAllTasks(){
    localStorage.clear();
    this.TodoList= [];
    Swal.fire({
      title: 'Deleted!',
      text: 'the Local Storage is Empty',
      icon: 'success',
      confirmButtonText: 'ok'
    })
  }
  onDeleteTask(id){
    let key = 'task'+id;
    localStorage.removeItem(key);
    this.TodoList.splice(id,1);
  }
  CompleteTask(name , id , complete){
    this.TodoList.splice(id,1);
    this.TodoList.push({taskName:name , taskComplete: !complete});
    let key = 'task'+id;
    localStorage.removeItem(key);
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer !== event.container) {
    transferArrayItem(event.previousContainer.data,event.container.data,
    event.previousIndex, event.currentIndex)
    } else {
    moveItemInArray(this.TodoList, event.previousIndex, event.currentIndex);
    }
  }
}
