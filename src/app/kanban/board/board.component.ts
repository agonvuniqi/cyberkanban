import { Component, OnInit, Input } from '@angular/core';
import { moveItemInArray, CdkDragDrop } from '@angular/cdk/drag-drop';
import { BoardService } from '../board.service';


@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {
  @Input() board;

  constructor(private boardService: BoardService) { }

  taskDrop(event: CdkDragDrop<string[]>) {
    // Targets when the inner task object moves within the board
    moveItemInArray(this.board.tasks, event.previousIndex, event.currentIndex);
    this.boardService.updateTasks(this.board.id, this.board.tasks);
  }


  ngOnInit(): void {
  }

}
