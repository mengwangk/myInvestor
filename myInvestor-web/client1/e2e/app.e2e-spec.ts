import { MyInvestorPage } from './app.po';

describe('my-investor App', () => {
  let page: MyInvestorPage;

  beforeEach(() => {
    page = new MyInvestorPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
