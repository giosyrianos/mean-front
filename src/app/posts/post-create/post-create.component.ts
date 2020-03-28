import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Post } from '../post.model';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.scss']
})
export class PostCreateComponent implements OnInit {
  public newPost = '';
  public enteredTitle = '';
  public enteredContent = '';
  @Output() createdPost = new EventEmitter<Post  >();

  constructor() { }

  ngOnInit() {
  }

  onAddPost(form: NgForm) {
    if (form.invalid) {
      return
    }
    const post: Post = {
      title: form.value.title,
      content: form.value.content
    };
    this.createdPost.emit(post);
    this.enteredTitle = '';
    this.enteredContent = '';
  }

}
