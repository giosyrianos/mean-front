import { Component, OnInit } from '@angular/core';
import { Post } from '../post.model';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';

import { PostService } from '../post.service';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { mimeType } from './mime-type.validator';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.scss']
})
export class PostCreateComponent implements OnInit {
  public newPost = '';
  public enteredTitle = '';
  public enteredContent = '';
  private mode = 'create';
  private postId: string;
  public post: any;
  private ownerId: string;
  isLoading = false;
  form: FormGroup;
  imgPreview: string;
  category = '';
  subCategory = '';

  categories = ['Web Design', 'Web app', 'Application', 'Game'];
  subCategories = ['Design', 'Develop', 'SEO', 'Performance'];

  selectedCategory = new FormControl();
  selectedSubCategory = new FormControl();

  constructor(
    public postService: PostService,
    public authService: AuthService,
    public route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.form = new FormGroup({
    // Adding form controls here
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      content: new FormControl(null, {
        validators: [Validators.required]
      }),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType]
      })
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        // Pre-populate form if i am in Editing Mode
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.isLoading = true;
        this.postService.getPost(this.postId).subscribe(postData => {
          console.log(postData);
          this.isLoading = false;
          const post = {
            id: postData._id,
            title: postData.basicFields.title,
            content: postData.basicFields.description,
            imgPath: postData.basicFields.imgPath,
            owner: postData.basicFields.ownerId,
            category: postData.basicFields.category,
            subCategory: postData.basicFields.subCategory
          };
          console.log(post);
          this.form.setValue({
            title: post.title,
            content: post.content,
            image: post.imgPath,
          });
          this.selectedCategory.setValue(post.category);
          this.selectedSubCategory.setValue(post.subCategory);
        });
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    });
  }

  getCategorySelection() {
    this.category = this.selectedCategory.value;
  }

  getSubCategorySelection() {
    this.subCategory = this.selectedSubCategory.value;
  }


  onFileImported(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ image: file });
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imgPreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  onSavePost() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === 'create') {
      this.ownerId = this.authService.getUserId();
      this.postService.addPost(
        this.form.value.title,
        this.form.value.content,
        this.form.value.image,
        this.selectedCategory.value,
        this.selectedSubCategory.value,
        this.ownerId
      );
      this.form.reset();
    } else {
      this.ownerId = this.authService.getUserId();
      console.log(this.ownerId);
      // this.postService.updatePost(
      //   this.postId,
      //   this.form.value.title,
      //   this.form.value.content,
      //   this.form.value.image,
      //   this.selectedCategory.value,
      //   this.selectedSubCategory.value,
      //   this.ownerId
      // );
    }
    console.log('worked');
  }

}
