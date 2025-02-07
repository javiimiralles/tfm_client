import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../../common/sidebar/sidebar.component';
import { NavbarComponent } from '../../common/navbar/navbar.component';
import {HeaderComponent} from '../../common/header/header.component';

@Component({
  selector: 'app-main-layout',
  imports: [
    RouterOutlet,
    SidebarComponent,
    NavbarComponent,
    HeaderComponent
  ],
  templateUrl: './main-layout.component.html',
  standalone: true,
  styleUrl: './main-layout.component.css'
})
export class MainLayoutComponent implements OnInit {

  ngOnInit(): void {

  }

}
