import { CommentService } from './comment/comment-service';
import {Comment} from './comment/comment';
import {autoinject, observable} from 'aurelia-framework';
import {Subscription} from 'rxjs/Rx'
import 'medium-editor/dist/css/medium-editor.css';
import MediumEditor from 'medium-editor';

@autoinject()
export class Apollo {
  comment: Comment;
  _commentSubscription: Subscription;

  @observable
  commentbody: string;

  editor: MediumEditor;

  constructor(
    private commentService: CommentService
  ) {
    
  }

  async attached() {
    console.log("apollo attached");
    await this.commentService.init();

    this._commentSubscription = this.commentService.comment.subscribe((comment)=>{
      this.comment = comment;
      this.commentbody = this.commentbody || this.comment.comment;
    })

    this.editor = new MediumEditor('.editable');
    this.editor.subscribe('editableInput', (event, editable) => {
        this.commentbody = editable.innerHTML;
    });
  }

  detached() {
    this._commentSubscription.unsubscribe();
  }

  commentbodyChanged(newValue) {
    this.commentService.mutateComment(this.commentbody);
  }
}
