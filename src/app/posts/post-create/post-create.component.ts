import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.scss']
})
export class PostCreateComponent implements OnInit {
  public newPost = '';
  public enteredValue = '';

  constructor() { }

  ngOnInit() {
  }

  onAddPost(postInput: HTMLTextAreaElement) {
    console.dir(postInput);
    this.newPost = this.enteredValue;
  }

}
