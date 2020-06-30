import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http/';
import { Post } from './post.model';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  private posts: Post[] = [];
  private postsListUpdated = new Subject<{posts: Post[], postCount: number}>();

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  getPosts(postsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
    this.http
      .get<{ message: string, posts: any, total: number }>('http://localhost:3000/api/posts' + queryParams)
      .pipe(
        map((postData) => {
          return {
            posts: postData.posts.map(post => {
            return {
              title: post.title,
              content: post.content,
              id: post._id,
              imgPath: post.imgPath,
              owner: post.owner
            };
          }),
            totalPosts: postData.total
          };
        })
      )
      .subscribe((regularPostData) => {
        this.posts = regularPostData.posts;
        this.postsListUpdated.next({
          posts: [...this.posts],
          postCount: regularPostData.totalPosts
        });
      });
    return [...this.posts];
  }

  updatePostsListener() {
    return this.postsListUpdated.asObservable();
  }

  getPost(id: string) {
    return this.http.get<{
      _id: string;
      title: string;
      content: string;
      imgPath: string;
      owner: string;
    }>(`http://localhost:3000/api/posts/${id}`);
  }

  addPost(title: string, content: string, image: File) {
    // const post: Post = {
    //   title,
    //   content
    // };
    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    
    // ######
    // Find id of current client !!!!!
    postData.append('ownerId', "5ef6fe4972f8c853dc7727f2")
    // ######


    // Give to the property the same name the post function tries to find (line:31@ posts.js)
    postData.append('image', image, title);

    this.http.post<{ message: string, post: Post }>('http://localhost:3000/api/posts', postData)
      .subscribe((res) => {
        this.router.navigate(['/']);
      });
  }

  updatePost(id: string, title: string, content: string, image: File | string) {
    let postData: Post | FormData;
    if (typeof image === 'object') {
      postData = new FormData();
      postData.append('id', id);
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image, title);
    } else {
      postData = {
        id,
        title,
        content,
        imgPath: image,
        owner: null
      };
    }
    this.http
      .put('http://localhost:3000/api/posts/' + id, postData)
      .subscribe(response => {
        this.router.navigate(['/']);
      });
  }


  deletePost(postId: string) {
    return this.http.delete(`http://localhost:3000/api/posts/${postId}`);
      // .subscribe((msg) => {
      //   console.log(msg);
      //   const newPostList = this.posts.filter(post => post.id !== postId);
      //   this.posts = newPostList;
      //   this.postsListUpdated.next([...this.posts]);
      // });
  }
}
