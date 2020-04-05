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
  private postsListUpdated = new Subject<Post[]>();

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  getPosts() {
    this.http
      .get<{ message: string, posts: any }>('http://localhost:3000/api/posts')
      .pipe(
        map((postData) => {
          return postData.posts.map(post => {
            return {
              title: post.title,
              content: post.content,
              id: post._id,
              imgPath: post.imgPath
            };
          });
        })
      )
      .subscribe((regularPosts) => {
        this.posts = regularPosts;
        this.postsListUpdated.next([...this.posts]);
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
      imgPath: string
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

    // Give to the property the same name the post function tries to find (line:31@ posts.js)
    postData.append('image', image, title);

    this.http.post<{ message: string, post: Post }>('http://localhost:3000/api/posts', postData)
      .subscribe((res) => {
        const post: Post = {
          id: res.post.id,
          title,
          content,
          imgPath: res.post.imgPath
        };
        this.posts.push(post);
        this.postsListUpdated.next([...this.posts]);
        this.router.navigate(['/']);
      });
  }

  updatePost(id: string, title: string, content: string, image: File | string ) {
    // const post: Post = { id, title, content, imgPath: null };
    let postData: Post | FormData;
    if (typeof (image) === 'object') {
      postData = new FormData();
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image, title);
    } else {
      postData = {
        id,
        title,
        content,
        imgPath: image
      };
    }
    this.http
      .put(`http://localhost:3000/api/posts/${id}`, postData)
      .subscribe(res => {
        console.log(res);
        const updatedPosts = [...this.posts];
        const oldPostIndex = updatedPosts.findIndex(p => p.id === id);
        const post: Post = {
          id,
          title,
          content,
          imgPath: ''
        };
        updatedPosts[oldPostIndex] = post;
        this.posts = updatedPosts;
        this.postsListUpdated.next([...this.posts]);
        this.router.navigate(['/']);
      });
  }


  deletePost(postId: string) {
    this.http.delete(`http://localhost:3000/api/posts/${postId}`)
      .subscribe((msg) => {
        console.log(msg);
        const newPostList = this.posts.filter(post => post.id !== postId);
        this.posts = newPostList;
        this.postsListUpdated.next([...this.posts]);
      });
  }
}
