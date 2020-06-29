import { Component, OnInit } from '@angular/core';
import { Post } from 'src/app/posts/post.model';
import { PostService } from 'src/app/posts/post.service';
import { AuthService } from 'src/app/auth/auth.service';
import { Subscription } from 'rxjs';
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.scss']
})
export class ClientComponent implements OnInit {
  
  public posts: Post[] = [];
  private postsSub: Subscription;
  private authStatusSup: Subscription;
  public userIsAuthenticated = false;
  public userId: string;
  isLoading = false;

  columnsToDisplay = ["id", "Name", "Description", "Category"]

  totalPosts = 0;
  currentPage = 1;
  postsPerPage = 2;
  pageSizeOptions = [1, 3, 4, 10];
  
  constructor(
    public postService: PostService,
    private authService: AuthService
  ) { }



  ngOnInit() {
    // this.posts = this.postService.getPosts(this.postsPerPage, this.currentPage);
    this.isLoading = true;
    this.userId = this.authService.getUserId();
    this.postService.getPosts(this.postsPerPage, this.currentPage);
    this.postsSub = this.postService.updatePostsListener()
      .subscribe((postData: {posts: Post[], postCount: number}) => {
        this.isLoading = false;
        this.posts = postData.posts;
        this.totalPosts = postData.postCount;
      });
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSup = this.authService.getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });
  }

}
