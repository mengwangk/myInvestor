/*
 * @Author: mwk 
 * @Date: 2017-09-04 15:30:44 
 * @Last Modified by: mwk
 * @Last Modified time: 2017-09-04 15:36:58
 */
import API from "../../App/Services/Api";
import FixtureAPI from "../../App/Services/FixtureApi";
import R from "ramda";

test("FixtureAPI getMappedStocks return mapped stocks", () => {
  const response = FixtureAPI.getMappedStocks("KLSE", "YTLPOWR");
  if (response.ok) {
    console.log(JSON.stringify(response.data[0]));
  }
  expect(response).toBeDefined();
});
