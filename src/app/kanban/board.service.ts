import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import { switchMap, map } from 'rxjs/operators';
import { Board, Task } from './board.model'

@Injectable({
  providedIn: 'root'
})
export class BoardService {

  constructor(private  afAuth: AngularFireAuth, private db: AngularFirestore) { }

  // Creates a new board for the current user
  async createBoard(data: Board) {
    const user = await this.afAuth.currentUser;
    return this.db.collection('boards').add({
      //Data that is passed from the front end through a dialog box
      ...data, 
      uid: user.uid,
      tasks: [{ description: 'Hello!', label: 'yellow'}]
    });
  }

    // Deletes a board
    deleteBoard(boardId: string) {
      return this.db 
        .collection('boards')
        .doc(boardId)
        .delete();
    }

    // Updates the task array
    updateTasks(boardId: string, tasks: Task[]){
      return this.db
        .collection('boards')
        .doc(boardId)
        .update({ tasks });
    }

    // Removes a specific task from the board
    // Firebase does a deep check on the specific object we want to remove 
    removeTask(boardId: string, task: Task) {
      return this.db
      .collection('boards')
      .doc(boardId)
      .update({
        tasks: firebase.firestore.FieldValue.arrayRemove(task);
      });
    }
    // Get all boards owned by a current user
    getUserBoards() {
      return this.afAuth.authState.pipe(
        switchMap(user => {
          //Handles if there is a user object, that means the user is signed in
          if (user) {
            return this.db
              .collection<Board>('boards', ref => 
                ref.where('uid', '==', user.uid).orderBy('priority')
              )
              .valueChanges({ idField: 'id' });
          } else {
            return [];
          }
        })
      )
    }
}
