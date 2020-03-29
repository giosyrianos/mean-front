import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Post } from '../post.model';

import { PostService } from '../post.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit {

  public posts: Post[] = [];
  private postsSub: Subscription;

  constructor(
    public postService: PostService
  ) { }

  ngOnInit() {
    // this.posts = this.postService.getPosts();
    this.postService.getPosts();
    this.postsSub = this.postService.updatePostsListener()
      .subscribe((upDatedPosts) => {
        this.posts = upDatedPosts;
      } );
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
