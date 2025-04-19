import { Component, Output, EventEmitter, ChangeDetectionStrategy, signal } from '@angular/core';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavComponent {
  readonly panelOpenState = signal(false);
  
  @Output() linkClicked = new EventEmitter<void>();

  onLinkClick() {
    this.linkClicked.emit();
  }
}
