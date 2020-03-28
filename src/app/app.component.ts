import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'mean-app';
  postList = [];

  getPost(post) {
    console.log(post);
    this.postList.push(post);
  }
}
