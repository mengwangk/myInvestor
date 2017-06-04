import { Injectable } from '@angular/core';

import { Criteria } from "../criteria.enum";
import { Stock, DividendSummary } from "../../shared/model";

@Injectable()
export class FundamentalService {

  constructor() { }

  // Check the stock is a dividend achiever
  public isDividendAchiever(
    stock: Stock, dividendSummaries: DividendSummary[], dividendYield: number,
    numberOfYears: number, scopeOfYears: number, yearOption: Criteria) {

    if (!dividendSummaries || dividendSummaries.length == 0) return false;

    var achievedCounter = 0;
    var currentYear = new Date().getFullYear();
    var recentYear = currentYear;
    var compareCounter = 0;

    stock.dividendHistories = [];
    for (var counter = 0; counter < dividendSummaries.length; counter++) {
      var summary = dividendSummaries[counter];

      // Ignore current year
      if (summary.dividendYear === currentYear) {
        continue;
      }
      recentYear -= 1;
      if (yearOption == Criteria.RecentYears && summary.dividendYear !== recentYear) {
        return false;
      }

      compareCounter++;
      if (summary.dividendYield >= dividendYield) {
        if (++achievedCounter === numberOfYears) {
          stock.dividendHistories = (dividendSummaries);
          return true;  // Meet the criteria
        }
        /*
        if (compareCounter >= numberOfYears) {
          return false;
        }
        */
      } else {
        if (yearOption == Criteria.RecentYears) {
          //if (compareCounter >= numberOfYears) {
            return false;
         //}
        } else if (yearOption == Criteria.AnyYears) {
          // Just continue until year
        }
      }
      if (compareCounter >= scopeOfYears) {
        break;
      }
    }
    return false;
  }
}
