import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http/';
import { Subject, BehaviorSubject } from 'rxjs';

import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class UserService{
  private devs: any[] = [];
  private devsListUpdated = new Subject<{ devs: any[] }>();
  userId: string;
  user: any;



  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  getUserId() {
    console.log(this.userId);
  }

  getSingleUser(id: string) {
    return this.http.get<any>(`http://localhost:3000/api/user/${id}`);
  }

  getUsersPosts(id: string) {
    return this.http.get(`http://localhost:3000/api/posts/client/${id}`);
  }

  // getUsersPost(postsPerPage: number, currentPage: number) {
  //   const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
  //   this.http
  //     .get<{ message: string, posts: any, total: number }>('http://localhost:3000/api/posts' + queryParams)
  //     .pipe(
  //       map((postData) => {
  //         return {
  //           posts: postData.posts.map(post => {
  //           return {
  //             title: post.basicFields.title,
  //             content: post.basicFields.description,
  //             id: post._id,
  //             imgPath: post.basicFields.imgPath,
  //             owner: post.basicFields.ownerId
  //           };
  //         }),
  //           totalPosts: postData.total
  //         };
  //       })
  //     );
  // }
}
