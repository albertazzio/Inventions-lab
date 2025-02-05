import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { FormsModule } from '@angular/forms';
import { FILTERS_KEYS } from '../../constants/filters';

@Component({
  selector: 'app-filters',
  standalone: true,
  imports: [
    ToggleSwitch,
    FormsModule,
  ],
  templateUrl: './filters.component.html',
  styleUrl: './filters.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FiltersComponent {
  public filters = input<{ isAlphabeticSort: boolean, isHideSmallValues: boolean }>();

  protected setFilter= output<FILTERS_KEYS>();

  protected readonly FILTERS_KEYS = FILTERS_KEYS;
}
