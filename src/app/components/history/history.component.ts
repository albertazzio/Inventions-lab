import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [
    TableModule,
  ],
  templateUrl: './history.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HistoryComponent {
  public data = input<{ name: string; date: string, data: { category: string, value: number }[] }[]>([]);

  protected selectFile= output<{ category: string, value: number }[]>();
}
