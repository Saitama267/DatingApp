import { Injectable } from '@angular/core';
import {
  CanActivate,
} from '@angular/router';
import { Observable, map } from 'rxjs';
import { AccountService } from '../_services/account.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private acountService: AccountService,
    private toastr: ToastrService
  ) {}

  canActivate(): Observable<boolean> {
    return this.acountService.currentUser$.pipe(
      map(user=>{
        if (user) return true
        else{
          this.toastr.error('You shall not pass!!')
          return false;
        }  
        
      })
      );
  }
}
