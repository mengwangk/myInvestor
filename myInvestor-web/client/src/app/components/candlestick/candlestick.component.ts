import { Component, OnInit, OnChanges, ViewChild, ElementRef, Input, ViewEncapsulation } from '@angular/core';
import * as d3 from 'd3';
import * as techan from 'techan';


@Component({
  selector: 'app-candlestick',
  templateUrl: './candlestick.component.html',
  styleUrls: ['./candlestick.component.css'],
  encapsulation: ViewEncapsulation.None
})

/**
 * Refer http://bl.ocks.org/Jverma/887877fc5c2c2d99be10
 */
export class CandlestickComponent implements OnInit, OnChanges {

  @ViewChild('chart') private chartContainer: ElementRef;

  private chart: any;
  private margin: any = { top: 20, right: 20, bottom: 30, left: 50 };
  private width: number;
  private height: number;
  private svg: any;
  private candlestick: any;
  private x: any;
  private y: any;
  private xAxis: any;
  private yAxis: any;


  constructor() { }

  public ngOnInit() {
    this.createChart();
  }


  public ngOnChanges() {

  }

  private createChart() {
    let element = this.chartContainer.nativeElement;

    this.width = 960 - this.margin.left - this.margin.right;
    this.height = 600 - this.margin.top - this.margin.bottom;

    let parseDate = d3.timeParse("%Y-%m-%d");
    this.x = techan.scale.financetime().range([0, this.width]);
    this.y = d3.scaleLinear().range([this.height, 0]);
    this.candlestick = techan.plot.candlestick().xScale(this.x).yScale(this.y);
    this.xAxis = d3.axisBottom(this.x);
    this.yAxis = d3.axisLeft(this.y);
    this.svg = d3.select(element).append('svg')
      .attr("width", this.width + this.margin.left + this.margin.right)
      .attr("height", this.height + this.margin.top + this.margin.bottom)
      .append("g")
      .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

    //let me = this;
    d3.json("http://localhost:3001/services/history/KLSE/YTLPOWR", (error, data) => {
      // console.log(data[0]);
      var accessor = this.candlestick.accessor();
      let objects: any = data;
      let input = objects.map(function (d) {
        //let row: d3.DSVRowString = d;
        // console.log(d);

        let row = d;
        //console.log('object -----' + JSON.stringify(row));
        //console.log('date -----' + parseDate("2016-03-02"));
        return {
          date: parseDate(row.history_date),
          open: +row.history_open,
          high: +row.history_high,
          low: +row.history_low,
          close: +row.history_close,
          volume: +row.history_volume
        };
      }).sort(function (a, b) { return d3.ascending(accessor.d(a), accessor.d(b)); });


      this.svg.append("g")
        .attr("class", "candlestick");

      this.svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + this.height + ")");

      this.svg.append("g")
        .attr("class", "y axis")
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Price ($)");

      // console.log("---------" + input.slice(0, input.length - 20));
      // Data to display initially
      this.draw(input);

      // Only want this button to be active if the data has loaded
      d3.select("button").on("click", () => { this.draw(input); }).style("display", "inline");

    });

  }

  public draw(data) {
    this.x.domain(data.map(this.candlestick.accessor().d));
    this.y.domain(techan.scale.plot.ohlc(data, this.candlestick.accessor()).domain());

    this.svg.selectAll("g.candlestick").datum(data).call(this.candlestick);
    this.svg.selectAll("g.x.axis").call(this.xAxis);
    this.svg.selectAll("g.y.axis").call(this.yAxis);
  }

}
