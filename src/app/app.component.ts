import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { UploadFormComponent } from './components/upload-form/upload-form.component';
import { BarChartComponent } from './components/bar-chart/bar-chart.component';
import { PieChartComponent } from './components/pie-chart/pie-chart.component';
import { ProgressSpinner } from 'primeng/progressspinner';
import { AppStore } from './store/app.store';
import { FormsModule } from '@angular/forms';
import { FiltersComponent } from './components/filters/filters.component';
import { HistoryComponent } from './components/history/history.component';
import { FILTERS_KEYS } from './constants/filters';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    UploadFormComponent,
    BarChartComponent,
    PieChartComponent,
    FormsModule,
    FiltersComponent,
    HistoryComponent,
    ProgressSpinner,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  protected appStore = inject(AppStore);

  protected loadFile(data: { name: string, data: { category: string, value: number }[] }): void {
    this.appStore.loadFiles(data);
  }

  protected setFilter(filterKey: FILTERS_KEYS): void {
    this.appStore.setFilter(filterKey);
  }

  protected selectFile(fileData: { category: string, value: number }[]): void {
    this.appStore.selectFileFromHistory(fileData);
  }
}
