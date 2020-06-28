import { Component, OnInit } from '@angular/core';
import { Post } from './posts/post.model';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'mean-app';
  postList: Post[] = [];
  showFiller = false;
  constructor(
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.authService.autoAuthUser();
  }

  le() {
    console.log('works')
  }

  getPost(post: Post) {
    console.log(post);
    this.postList.push(post);
  }
}
