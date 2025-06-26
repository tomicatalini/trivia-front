import { CommonModule } from '@angular/common';
import { Component, computed, Input, Signal } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-time-bar',
  imports: [CommonModule],
  templateUrl: './time-bar.component.html',
})
export class TimeBarComponent {
  @Input({ required: true }) elapsedSeconds!: Signal<number>;
  @Input() maxSeconds: number = 50;

  progress = computed(() => {
    const pct = (this.elapsedSeconds() / this.maxSeconds) * 100;
    return Math.min(pct, 100);
  });

  color = computed(() => {
    const t = this.elapsedSeconds();
    if (t <= 5) return 'bg-green-500';
    if (t <= 20) return 'bg-yellow-500';
    return 'bg-red-500';
  });
}
