import { ChangeDetectionStrategy, Component, effect, ElementRef, input, viewChild } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-pie-chart',
  standalone: true,
  imports: [],
  templateUrl: './pie-chart.component.html',
  styleUrl: './pie-chart.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PieChartComponent {
  public data = input<{ category: string, value: number }[]>();

  protected chartContainer = viewChild<ElementRef>('chart');

  constructor() {
    effect(() => { // todo: it can be replace with ngAfterViewInit and ngOnChanges logic
      this.createChart(this.data());
    });
  }

  private createChart(data: { category: string; value: number }[] | undefined) {
    // todo: better to split this to small parts and reuse it
    if (!data || data.length === 0) return;

    const element = this.chartContainer()?.nativeElement;
    element.innerHTML = '';

    const width = 400;
    const height = 400;
    const radius = Math.min(width, height) / 2;

    const svg = d3.select(element)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const pie = d3.pie<{ category: string; value: number }>()
      .value(d => d.value);

    const arc = d3.arc<d3.PieArcDatum<{ category: string; value: number }>>()
      .innerRadius(0)
      .outerRadius(radius);

    const tooltip = d3.select(element)
      .append('div')
      .style('position', 'absolute')
      .style('visibility', 'hidden')
      .style('background', 'rgba(0, 0, 0, 0.7)')
      .style('color', '#fff')
      .style('padding', '5px 10px')
      .style('border-radius', '5px')
      .style('font-size', '12px');

    svg.selectAll('path')
      .data(pie(data))
      .enter()
      .append('path')
      .attr('d', arc as any)
      .attr('fill', (d, i) => color(i.toString()))
      .attr('stroke', '#fff')
      .style('stroke-width', '2px')
      .on('mouseover', (event, d) => {
        tooltip.style('visibility', 'visible')
          .text(`Category: ${d.data.category}, Value: ${d.data.value}`);
      })
      .on('mousemove', (event) => {
        tooltip.style('top', `${event.pageY - 30}px`)
          .style('left', `${event.pageX + 10}px`);
      })
      .on('mouseout', () => {
        tooltip.style('visibility', 'hidden');
      });
  }
}
