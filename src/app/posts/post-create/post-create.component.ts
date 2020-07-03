import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { PostService } from '../post.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import {MatAutocompleteSelectedEvent, MatAutocomplete} from '@angular/material/autocomplete';

import {Observable} from 'rxjs';
import { mimeType } from './mime-type.validator';
import { AuthService } from 'src/app/auth/auth.service';
import { startWith, map } from 'rxjs/operators';
import { MatChipInputEvent } from '@angular/material/chips';

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

  // #### Chips ####
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  skillTags: string[] = ['CSS', 'HTML']



  // ####   ####
  categories = ['Web Design', 'Web app', 'Application', 'Game'];
  subCategories = ['Design', 'Develop', 'SEO', 'Performance'];

  selectedCategory = new FormControl();
  selectedSubCategory = new FormControl();

  constructor(
    public postService: PostService,
    public authService: AuthService,
    public route: ActivatedRoute,
    
  ) {}

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
            subCategory: postData.basicFields.subCategory,
            skillTags: postData.nonReqFields.recomendedTags
          };
          this.skillTags = post.skillTags
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
        this.ownerId,
        this.skillTags
      );
      this.form.reset();
    } else {
      this.ownerId = this.authService.getUserId();
      this.postService.updatePost(
        this.postId,
        this.form.value.title,
        this.form.value.content,
        this.form.value.image,
        this.selectedCategory.value,
        this.selectedSubCategory.value,
        this.ownerId,
        this.skillTags
      );
    }
    console.log(this.skillTags);
  }


  // #### CHIPS FUNCTIONS ####

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      this.skillTags.push( input.value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  remove(skill: string): void {
    const index = this.skillTags.indexOf(skill);

    if (index >= 0) {
      this.skillTags.splice(index, 1);
    }
  }
}
