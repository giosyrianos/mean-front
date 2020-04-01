import { Injectable } from '@angular/core';
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
    private http: HttpClient
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
              id: post._id
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
      _id: string,
      title: string,
      content: string
    }>(`http://localhost:3000/api/posts/${id}`);
  }

  addPost(title: string, content: string) {
    const post: Post = {
      title,
      content
    };
    this.http.post<{ message: string, postId: string }>('http://localhost:3000/api/posts', post)
      .subscribe((res) => {
        const postId = res.postId;
        post.id = postId;
        this.posts.push(post);
        this.postsListUpdated.next([...this.posts]);
      });
  }

  updatePost(id: string, title: string, content: string) {
    const post: Post = { id, title, content };
    this.http.put(`http://localhost:3000/api/posts/${id}`, post)
      .subscribe(res => {
        console.log(res);
        const updatedPosts = [...this.posts];
        const oldPostIndex = updatedPosts.findIndex(p => p.id === post.id);
        updatedPosts[oldPostIndex] = post;
        this.posts = updatedPosts;
        this.postsListUpdated.next([...this.posts]);
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
