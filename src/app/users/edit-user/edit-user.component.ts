import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { UserService } from '../users.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { mimeType } from '../../posts/post-create/mime-type.validator';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {
  authListenerSubs: Subscription;
  userIsAuthenticated = false;
  userId: string;
  userType: string;
  user: any;
  profileID: string;
  isLoading = false;
  form: FormGroup;
  imgPreview: string;
  skills = []
  skillTags: string [] = ['CSS', 'HTML', 'PYTHON', 'WEB-DESIGN', 'WEB-DEV', 'JAVASCRIPT', 'JAVA']

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private route: ActivatedRoute

  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.profileID = this.authService.getUserId();
    this.userType = this.authService.getUserType();
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListenerSubs = this.authService.getAuthStatusListener()
    .subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      this.profileID = paramMap.get('userid');
      this.getUserData(this.profileID);
    });
  }

  getUserData(userID: string) {
    this.isLoading = true;
    this.userService.getSingleUser(userID).subscribe(userData => {
      this.isLoading = false;
      this.user = userData;
      this.initializeForm();
      this.form.patchValue({skills: userData.skillTags})
      this.skills = this.user.skillTags
    });
  }

  initializeForm() {
    this.form = new FormGroup({
      username: new FormControl(this.user.userFields.username, {}),
      email: new FormControl(this.user.userFields.email, {
        validators: [Validators.required, Validators.email]
      }),
      name: new FormControl(this.user.subUserFields.name, {}),
      surname: new FormControl(this.user.subUserFields.surname, {}),
      description: new FormControl(this.user.description, {}),
      // password: new FormControl('', [Validators.required,Validators.minLength(6)]),
      skills: new FormControl(this.user.skills,[]),
      image: new FormControl(this.user.subUserFields.imgPath, {
        validators: [Validators.required],
        asyncValidators: [mimeType]
      }),
      userType: new FormControl(this.authService.getUserType(),{})
    });
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

  onSaveChanges() {
    this.isLoading = true;
    if (this.form.invalid) {
      console.log('form invalid');
      setTimeout(() => {
        this.isLoading = false;
      }, 2000);
      return;
    }
    this.userId = this.authService.getUserId()
    this.form.patchValue({ skills : this.skills})
    this.isLoading = true;
    console.log(this.form.value);
    this.userService.updateUser(this.userId, this.form.value); 
  }
  show(skill){
    if (this.skills.includes(skill)){
      this.skills = this.skills.filter(function(skil){return skil != skill})
    }else{
      this.skills.push(skill)
    }
    console.log(this.skills)
  }
}
