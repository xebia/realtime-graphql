import { CommentService } from './comment/comment-service';
import {Comment} from './comment/comment';
import {autoinject, observable} from 'aurelia-framework';
import {Subscription} from 'rxjs/Rx'

@autoinject()
export class Apollo {
  comment: Comment;
  _commentSubscription: Subscription;

  @observable
  commentbody: string;

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

    this.commentService.mutateComment("test 123");
  }

  detached() {
    this._commentSubscription.unsubscribe();
  }

  commentbodyChanged(newValue) {
    this.commentService.mutateComment(this.commentbody);
  }
}
