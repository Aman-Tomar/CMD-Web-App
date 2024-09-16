import { Component, OnInit } from '@angular/core';
import { SidebarService } from '../sidebar.service';
import { AuthserviceService } from '../services/auth/authservice.service';
import { TokenService } from '../services/token/token.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [NgIf],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  constructor(private sidebarService: SidebarService,private authService: AuthserviceService,private tokenService:TokenService) {}
  loggedIn=false;
  ngOnInit(): void {
    this.checkLoggedIn();
  }

  checkLoggedIn()
  {
    const token=this.tokenService.getToken();
    if(token)
    {
      this.loggedIn=true;
    }
  }

  toggleSidebar() {
    this.sidebarService.toggleSidebar();
  }

}

