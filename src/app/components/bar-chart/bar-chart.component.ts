import { ChangeDetectionStrategy, Component, effect, ElementRef, input, viewChild } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-bar-chart',
  standalone: true,
  imports: [],
  templateUrl: './bar-chart.component.html',
  styleUrl: './bar-chart.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BarChartComponent {
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

    const margin = { top: 20, right: 30, bottom: 40, left: 40 };
    const width = 500 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select(element)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand()
      .domain(data.map(d => d.category))
      .range([0, width])
      .padding(0.1);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.value)!])
      .nice()
      .range([height, 0]);

    const tooltip = d3.select(element)
      .append('div')
      .style('position', 'absolute')
      .style('visibility', 'hidden')
      .style('background', 'rgba(0, 0, 0, 0.7)')
      .style('color', '#fff')
      .style('padding', '5px 10px')
      .style('border-radius', '5px')
      .style('font-size', '12px');

    svg.append('g')
      .selectAll('.bar')
      .data(data)
      .enter().append('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d.category)!)
      .attr('y', d => y(d.value)!)
      .attr('width', x.bandwidth())
      .attr('height', d => height - y(d.value)!)
      .attr('fill', 'steelblue')
      .on('mouseover', (event, d) => {
        tooltip.style('visibility', 'visible')
          .text(`Category: ${d.category}, Value: ${d.value}`);
      })
      .on('mousemove', (event) => {
        tooltip.style('top', `${event.pageY - 30}px`)
          .style('left', `${event.pageX + 10}px`);
      })
      .on('mouseout', () => {
        tooltip.style('visibility', 'hidden');
      });

    // Ось X
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x));

    // Ось Y
    svg.append('g')
      .call(d3.axisLeft(y));
  }
}
