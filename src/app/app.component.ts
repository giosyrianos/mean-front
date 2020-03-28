import { Component } from '@angular/core';
import { Post } from './posts/post.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'mean-app';
  postList: Post[] = [];

  getPost(post: Post) {
    console.log(post);
    this.postList.push(post);
  }
}
