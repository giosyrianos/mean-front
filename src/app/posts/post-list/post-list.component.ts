import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Post } from '../post.model';

import { PostService } from '../post.service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit {

  public posts: Post[] = [];
  private postsSub: Subscription;
  isLoading = false;

  totalPosts = 10;

  currentPage = 1;

  postsPerPage = 2;

  pageSizeOptions = [1, 3, 4, 10];

  constructor(
    public postService: PostService
  ) { }

  ngOnInit() {
    // this.posts = this.postService.getPosts();
    this.isLoading = true;
    this.postService.getPosts(this.postsPerPage, this.currentPage);
    this.postsSub = this.postService.updatePostsListener()
      .subscribe((upDatedPosts) => {
        this.isLoading = false;
        this.posts = upDatedPosts;
      });
  }

  pageChanged(pageData: PageEvent) {
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postService.getPosts(this.postsPerPage, this.currentPage );
  }

  onDelete(id: string) {
    this.postService.deletePost(id);
  }

  ngOnDestroy()  {
    // Called once, before the instance is destroyed.
    // Add 'implements OnDestroy' to the class.
    this.postsSub.unsubscribe();
  }

}
