import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Post } from '../post.model';

import { PostService } from '../post.service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material';

import { AuthService } from '../../auth/auth.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit, OnDestroy {

  public posts: Post[] = [];

  public filteredPosts: Post[] = [];
  // tslint:disable-next-line: variable-name
  private _searchCatTerm: string;

  private postsSub: Subscription;
  private authStatusSup: Subscription;
  public userIsAuthenticated = false;
  public userId: string;
  public  isClient = false;
  public price = 0;
  public userType: string;
  form: FormGroup;
  isLoading = false;

  totalPosts = 0;
  currentPage = 1;
  postsPerPage = 10;
  pageSizeOptions = [1, 3, 8, 10];

  // get searchTagTerm(): string{
  //   return this._searchTagTerm
  // }

  // set searchTagTerm(value: string){
  //   this._searchTagTerm = value
  //   this.filteredPosts = this.filtereTagPosts(value)
  // }


  // filtereTagPosts(searchString: string) {
  //   return this.posts.filter( post =>{
  //     for(var i in post.tags){
  //       post.tags[i].toLowerCase().indexOf(searchString.toLowerCase()) !== -1
  //     }
  //   })
  // }

  constructor(
    public postService: PostService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.form = new FormGroup({
      price: new FormControl(null, {
        validators: [Validators.required]
      })
    });
    this.isclient();
    // this.posts = this.postService.getPosts();
    this.isLoading = true;
    this.userId = this.authService.getUserId();
    this.userType = this.authService.getUserType();
    this.postService.getPosts(this.postsPerPage, this.currentPage);
    this.postsSub = this.postService.updatePostsListener()
      .subscribe((postData: {posts: Post[], postCount: number}) => {
        this.isLoading = false;
        this.posts = postData.posts;
        this.filteredPosts = this.posts;
        this.totalPosts = postData.postCount;
      });
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSup = this.authService.getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });
  }


  get searchCatTerm(): string {
    return this._searchCatTerm;
  }

  set searchCatTerm(value: string) {
    this._searchCatTerm = value;
    this.filteredPosts = this.filterePosts(value);
  }

  filterePosts(searchString: string) {
    return this.posts.filter( post =>
      post.category.toLowerCase().indexOf(searchString.toLowerCase()) !== -1);
  }

  declineBid(postid: string, bidid: string, devid: string) {
    this.userId = this.authService.getUserId();
    this.postService.declineBid(postid, bidid, devid, this.userId);
  }

  acceptBid(postid: string, bidid: string, devid: string) {
    this.userId = this.authService.getUserId();
    this.postService.acceptBid(postid, bidid, devid, this.userId);
  }

  makeBid(postid: string) {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if (!this.form.invalid) {
      this.userId = this.authService.getUserId();
      this.postService.putBid(postid, this.userId, this.form.value.price, this.userId );
    }
  }

  isclient() {
    if (this.authService.getUserType() === 'Client') {
      this.isClient = true;
    } else {
      return false;
    }
  }

  pageChanged(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postService.getPosts(this.postsPerPage, this.currentPage );
  }

  onDelete(id: string) {
    this.isLoading = true;
    this.postService.deletePost(id).subscribe(() => {
      this.postService.getPosts(this.postsPerPage, this.currentPage);
    });
  }

  ngOnDestroy()  {
    // Called once, before the instance is destroyed.
    // Add 'implements OnDestroy' to the class.
    this.postsSub.unsubscribe();
    this.authStatusSup.unsubscribe();
  }

}
