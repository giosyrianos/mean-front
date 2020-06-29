import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http/';
import { User } from './user.model';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';


export class UserService {
    private user: User;

    constructor(
        private http: HttpClient,
        private router: Router
    ) {}

    getUser(id: string){
        this.http
            .get<{user: any}>(`http://localhost:3000/api/user/${id}`) 
            .pipe(
                map((userData) => {
                    console.log(userData)
                    // return {
                    //     username: userData.userFields.username,
                    //     email: userData.userFields.email,
                    //     id: userData.id,
                    //     userType: userData.userType
                    // };
                })
            )
    }
}