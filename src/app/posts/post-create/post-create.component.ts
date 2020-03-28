import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.scss']
})
export class PostCreateComponent implements OnInit {
  public newPost = '';
  public enteredTitle = '';
  public enteredContent = '';
  @Output() createdPost = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  onAddPost() {
    const post = {
      title: this.enteredTitle,
      content: this.enteredContent
    };
    this.createdPost.emit(post);
    this.enteredTitle = '';
    this.enteredContent = '';
  }

}
