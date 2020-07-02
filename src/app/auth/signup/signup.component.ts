import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm, FormControl, FormBuilder, FormGroup, Validators, NgModel } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

import { mimeType } from '../../posts/post-create/mime-type.validator';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit, OnDestroy {
  isLoading = false;
  private authStatusSub: Subscription;

  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  isEditable = false;
  userType = '';
  skills = []
  skillTags: string [] = ['CSS', 'HTML', 'PYTHON', 'WEB-DESIGN', 'WEB-DEV', 'JAVASCRIPT', 'JAVA']

  selectedRole = new FormControl();
  imgPreview: string;

  constructor(
    public authService: AuthService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
      authStatus => {
        this.isLoading = false;
      }
    );
    this.firstFormGroup = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      userType: this.userType
    });
    this.secondFormGroup = this.formBuilder.group({
      firstname: [''],
      lastname: [''],
      selectedSkills: [''],
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType]
      })
    });

  }
  show(skill){
    if (this.skills.includes(skill)){
      this.skills = this.skills.filter(function(skil){return skil != skill})
    }else{
      this.skills.push(skill)
    }
    console.log(this.skills)
  }
  getSelection() {
    this.userType = this.selectedRole.value;
  }

  signUp(formData: NgForm) {
    if (formData.invalid) {
      setTimeout(() => {
        this.isLoading = false;
      }, 3000);
      return;
    }
    this.authService.createUser(
      formData.value.email,
      formData.value.password,
      formData.value.userType
    );

  }

  onFileImported(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.secondFormGroup.patchValue({ image: file });
    this.secondFormGroup.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imgPreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }


  submitForm() {
    this.firstFormGroup.patchValue({ userType: this.userType });
    this.secondFormGroup.patchValue({ selectedSkills: this.skills})
      // console.log('first:', this.firstFormGroup.value);
      // console.log('second:', this.secondFormGroup.value);
    const newUserData = { ...this.firstFormGroup.value, ...this.secondFormGroup.value };
    console.log('from Angular:', newUserData);

    this.authService.createUser2(newUserData);
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }

}
