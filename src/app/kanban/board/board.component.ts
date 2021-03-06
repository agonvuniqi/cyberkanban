import { Component, Input } from '@angular/core';
import { moveItemInArray, CdkDragDrop } from '@angular/cdk/drag-drop';
import { BoardService } from '../board.service';
import { TaskDialogComponent } from '../dialogs/task-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Task } from '../board.model'

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent {
  @Input() board;

  constructor(private boardService: BoardService, public dialog: MatDialog) { }

  taskDrop(event: CdkDragDrop<string[]>) {
    // Targets when the inner task object moves within the board
    moveItemInArray(this.board.tasks, event.previousIndex, event.currentIndex);
    this.boardService.updateTasks(this.board.id, this.board.tasks);
  }

  /*
  Creates a new task and also updates existing tasks by passing in an optional Task input/id variables  */
  openTaskDialog(task?: Task, idx?: number): void {
    // Sets default option color to purple + task description to blank
    const newTask = { label: 'purple' };
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '500px',
      data: task ? {task: { ...task }, isNew: false, boardId: this.board.id, idx } : { task: newTask, isNew: true }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.isNew) {
          this.boardService.updateTasks(this.board.id, [ ...this.board.tasks, result.task ]);
        } else {
          const update = this.board.tasks;
          update.splice(result.idx, 1, result.task);
          this.boardService.updateTasks(this.board.id, this.board.tasks)
        }
      }
    });
  }

  handleDelete() {
    this.boardService.deleteBoard(this.board.id);
  }
}
