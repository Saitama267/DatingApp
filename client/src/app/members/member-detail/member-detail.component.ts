import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  NgxGalleryAnimation,
  NgxGalleryImage,
  NgxGalleryOptions,
} from '@kolkov/ngx-gallery';
import { TabDirective, TabsModule, TabsetComponent } from 'ngx-bootstrap/tabs';
import { Member } from 'src/app/_models/member';
import { MembersService } from 'src/app/_services/members.service';
import { TimeagoModule } from 'ngx-timeago/timeago.module';
import { MessageService } from 'src/app/_service/message.service';
import { Message } from 'src/app/_models/message';
@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css'],
})
export class MemberDetailComponent implements OnInit {
  @ViewChild('memberTabs', {static:true}) memberTabs?: TabsetComponent;
  member: Member = {} as Member ;
  galleryOptions: NgxGalleryOptions[] = [];
  galleryImages: NgxGalleryImage[] = [];
  activeTab?: TabDirective;
  messages: Message[] = [];

  constructor(
    private memberService: MembersService,
    private route: ActivatedRoute,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.route.data.subscribe({
      next: data=> this.member = data['member']
    })

    this.galleryOptions = [
      {
        width: '500px',
        height: '500px',
        imagePercent: 100,
        thumbnailsColumns: 4,
        imageAnimation: NgxGalleryAnimation.Slide,
        preview: false,
      },
    ];

    this.route.queryParams.subscribe({
      next: params=>{
        params['tab'] && this.selectTab(params['tab']);
      }
    })
    this.galleryImages = this.getImages();
  }

  selectTab(heading:string){
    if (this.memberTabs) {
      this.memberTabs.tabs.find(x=>x.heading === heading)!.active =true;
    }
  }

  onTabActivated(data: TabDirective) {
    this.activeTab = data;
    if (this.activeTab.heading === 'Messages') {
      this.loadMessages();
    }
  }

  loadMessages() {
    if (this.member) {
      this.messageService.getMessageThread(this.member.username).subscribe({
        next: (messages) => (this.messages = messages),
      });
    }
  }

  getImages() {
    if (!this.member) {
      return [];
    }
    const imageUrls = [];
    for (const photo of this.member.photos) {
      imageUrls.push({
        small: photo.url,
        medium: photo.url,
        big: photo.url,
      });
    }
    return imageUrls;
  }

}
