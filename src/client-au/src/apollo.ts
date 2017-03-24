import { CommentService } from './comment/comment-service';
import {Comment} from './comment/comment';
import {autoinject} from 'aurelia-framework';
import {Subscription} from 'rxjs/Rx'

@autoinject()
export class Apollo {
  comment: Comment;
  _commentSubscription: Subscription;

  constructor(
    private commentService: CommentService
  ) {
    
  }

  async attached() {
    console.log("apollo attached");
    await this.commentService.init();

    this._commentSubscription = this.commentService.comment.subscribe((comment)=>{
      this.comment = comment;
    })
  }

  detached() {
    this._commentSubscription.unsubscribe();
  }
}
