import { Component, OnInit, OnChanges, ViewChild, ElementRef, Input, ViewEncapsulation } from '@angular/core';
import { indicatorBollingerBands } from 'd3fc-technical-indicator';
import * as d3 from 'd3';
import * as fc from 'd3fc';

@Component({
  selector: 'app-bollingerbands',
  templateUrl: './bollingerbands.component.html',
  styleUrls: ['./bollingerbands.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class BollingerBandsComponent implements OnInit, OnChanges {

  @ViewChild('chart') private chartContainer: ElementRef;
  @Input() private data: Array<any>;

  private margin: any = { top: 20, bottom: 20, left: 20, right: 20 };
  private chart: any;
  private width: number;
  private height: number;


  constructor() { }

  public ngOnInit() {
    this.setupChart();
  }

  public ngOnChanges() {

  }

  private setupChart() {
    let element = this.chartContainer.nativeElement;
    this.width = element.offsetWidth - this.margin.left - this.margin.right;
    this.height = element.offsetHeight - this.margin.top - this.margin.bottom;
    let container = d3.select(element)
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height);

    let dataGenerator = fc.randomFinancial().startDate(new Date(2014, 1, 1));

    let data = dataGenerator(50);

    let xScale = d3.scaleTime()
      .domain(
      fc.extentDate()
        .accessors([d => d.date])(data)
      )
      .range([0, this.width]);

    let yScale = d3.scaleLinear()
      .domain(
      fc.extentLinear()
        .pad([0.4, 0.4])
        .accessors([d => d.high, d => d.low])(data)
      )
      .range([this.height, 0]);

    // START
    // Create and apply the bollinger algorithm
    const bollingerAlgorithm = fc.indicatorBollingerBands().value(d => d.close);
    const bollingerData = bollingerAlgorithm(data);
    const mergedData = data.map((d, i) => Object.assign({}, d, bollingerData[i]));

    // Create the renderer
    //const bollinger = bollingerBandsExample().xScale(xScale).yScale(yScale);

    // Add it to the container
    //container.append('g')
    //  .datum(mergedData)
    //  .call(bollinger);
    
  }

}

