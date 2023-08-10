import { Injectable, inject } from '@angular/core';
import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
  ResolveFn,
} from '@angular/router';
import { Observable } from 'rxjs';
import { Member } from '../_models/member';
import { MembersService } from '../_services/members.service';

export const memberDetailedResolver: ResolveFn<Member> = (route,state)=>{
  const memberService = inject(MembersService);
  return memberService.getMember(route.paramMap.get('username')!)
}
