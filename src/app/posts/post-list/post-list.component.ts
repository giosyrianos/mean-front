import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit {

  @Input() posts = [
    // { title: 'First ‍', content: 'This if content of FIRST post' },
    // { title: 'Second', content: 'This if content of Second post' },
    // { title: 'Third ', content: 'This if content of Third post' },
    // { title: 'Fourth', content: 'This if content of Fourth post' }
  ];

  constructor() { }

  ngOnInit() {
  }

}
