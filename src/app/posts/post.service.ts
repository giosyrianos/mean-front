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
        map((postData: any) => {
          return {
            posts: postData.posts.map(post => {
            return {
              title: post.basicFields.title,
              content: post.basicFields.description,
              id: post._id,
              imgPath: post.basicFields.imgPath,
              owner: post.basicFields.ownerId,
              category: post.basicFields.category,
              subCategory: post.basicFields.subCategory,
              bids: post.bids,
              rectags: post.nonReqFields.recomendedTags
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
        _id: string,
        basicFields: {
          title: string,
          description: string,
          category: string,
          subCategory: string,
          imgPath: string,
          ownerId: string,
        },
        nonReqFields: {
          recomendedTags: any
        }

    }>(`http://localhost:3000/api/posts/${id}`);

  }

  addPost(title: string, content: string, image: File, category: string, subCategory: string, id: string, skillTags: any) {
    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('ownerId', id);
    postData.append('category', category);
    postData.append('subCategory', subCategory);
    postData.append('skillTags', skillTags);
    // Give to the property the same name the post function tries to find (line:31@ posts.js)
    postData.append('image', image, title);
    console.log(postData);
    this.http.post<{ message: string, post: Post }>('http://localhost:3000/api/posts', postData)
      .subscribe((res) => {
        this.router.navigate(['/']);
      });
  }

  updatePost(
    id: string,
    title: string,
    content: string,
    image: File | string,
    category: string,
    subCategory: string,
    ownerId: string,
    skillTags: any) {
    // var postData: Post | FormData;
    if (typeof image === 'object') {
      const postData = new FormData();
      postData.append('id', id);
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image, title);
      postData.append('category', category);
      postData.append('subCategory', subCategory);
      postData.append('owner', ownerId);
      postData.append('skillTags', skillTags);
      this.http
      .put('http://localhost:3000/api/posts/' + id, postData)
      .subscribe(response => {
        this.router.navigate(['/']);
      });
    } else {
      const postData = {
        id,
        title,
        content,
        imgPath: image,
        owner: ownerId,
        category,
        subCategory,
        skillTags
      };
      this.http
      .put('http://localhost:3000/api/posts/' + id, postData)
      .subscribe(response => {
        this.router.navigate(['/']);
      });
    }
  }

  putBid(postid: string, userid: string, price: number, userID: string) {
    const bidData = {
      postId: postid,
      devId: userid,
      price
    };
    console.log('data' , bidData);
    this.http.post('http://localhost:3000/api/posts/bid', bidData)
      .subscribe(response => {
        this.router.navigate(['/profile/' + userID]);
      });
  }

  acceptBid(postid: string, bidid: string, devid: string, userid: string) {
    const data = {
      postId: postid,
      bidId: bidid,
      devId: devid,
    };
    console.log(data);
    this.http.put('http://localhost:3000/api/posts/bid/accept', data)
    .subscribe(response => {
      console.log(response);
      this.router.navigate(['/profile/' + userid]);
    });
  }

  declineBid(postid: string, bidid: string, devid: string, userid: string) {
    const data = {
      postId: postid,
      bidId: bidid,
      devId: devid
    };
    console.log('data', data);
    this.http.put('http://localhost:3000/api/posts/bid/decline', data)
    .subscribe(response => {
      this.router.navigate(['/profile/' + userid]);
    });
  }

  addTask(postid: string, name: string, description: string, userid: string) {
    const data = {
      postId: postid,
      name,
      description
    };
    console.log('data', data);
    this.http.post('http://localhost:3000/api/posts/tasks', data)
    .subscribe(response => {
      this.router.navigate(['/profile/' + userid]);
    });
  }

  completeTask(postid: string, taskid: string, userid: string) {
    const data = {
      postId: postid,
      taskId: taskid
    };
    this.http.put('http://localhost:3000/api/posts/tasks/complete', data)
    .subscribe(response => {
      this.router.navigate(['/profile/' + userid]);
    });
  }

  completePost(postId: string, userid: string) {
    const data = {
      postId
    };
    this.http.put('http://localhost:3000/api/posts/set/complete', data)
    .subscribe(response => {
      this.router.navigate(['/profile/' + userid]);
    });
  }

  commentDev(postId: string, rating: number, comment: string, clientId: string, devId: string) {
    console.log(postId);
    const comm = {
      postId,
      rating,
      comment,
      clientId,
      devId
    };
    this.http.post('http://localhost:3000/api/user/comment', comm)
    .subscribe(response => {
      this.router.navigate(['/profile/' + clientId]);
    });
  }


  deletePost(postId: string) {
    return this.http.delete(`http://localhost:3000/api/posts/${postId}`);
  }
}
