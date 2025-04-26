import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.scss'
})
export class BlogComponent implements OnInit {
  constructor() { }
  
  ngOnInit() {
    console.log('BlogComponent cargado');
  }
}
