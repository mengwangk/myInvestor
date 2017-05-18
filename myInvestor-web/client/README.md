* install bootstrap
* install font-awesome
* install angular material 2
* install ng2-bootstrap
* install d3, d3fc, d3fc-technical-indicator javascript and typescript files
* install techanjs
* install ag-grid


npm install --save d3
npm install --save d3fc
npm install d3fc-technical-indicator --save
npm install d3fc-series --save 
npm install --save-dev @types/d3
npm install --save techan

-- install ag-grid
npm i --save ag-grid ag-grid-angular
npm i --save @angular/common @angular/compiler @angular/compiler-cli @angular/core @angular/platform-browser @angular/platform-browser-dynamic typescript rxjs core-js zone.js
npm i --save-dev webpack webpack-dev-server angular2-template-loader awesome-typescript-loader extract-text-webpack-plugin file-loader canonical-path @types/node
npm i --save-dev css-loader style-loader html-loader html-webpack-plugin raw-loader url-loader


To use Javascript libraries in TypeScript - https://www.thepolyglotdeveloper.com/2017/03/javascript-libraries-in-a-typescript-application-revisited/

npm install @types/node --save

try nativescript.org, react native for mobile


http://www.buildingwidgets.com/blog/2015/9/10/week-36-stockchartr
http://techanjs.org/

Add this webpack.common.js
// myInvestor - for d3 techanjs
new webpack.ProvidePlugin({
    // d3: "d3", // if you add this line you can remove the import in the code
    "window.d3": "d3" // this adds d3 in the window object for techan
})

https://keathmilligan.net/create-reusable-chart-components-with-angular-2-and-d3-js-version-4/
to install https://www.npmjs.com/package/angular2-nvd3
https://github.com/tomwanzek/d3-ng2-service
https://github.com/keathmilligan/angular2-d3-v4/tree/master/src
Use sphinx for documentation - http://www.sphinx-doc.org/en/stable/theming.html or https://jekyllrb.com/

Integrate OHLC and candlestick - https://github.com/tlsim/sl-blog-d3, https://d3fc.io/

User - Use facebook, or google
JobGroup
Job
TAConfig


* style.scss import myinvestor.scss, bootstrap.css, font-awesome
* clear app.component.css, _variables.css, headings.css
* add app.component.html
* modified app.component.ts
* modified package.json app info
* modified webpack.common.js
* add "services" folder under src/app
* added myinvestor.service.ts under "services" folder
* modified title.services.ts under "src/app/home/title"
* modified webpack.dev.js and webpack.prod.js - https://github.com/AngularClass/angular2-webpack-starter/wiki/How-to-pass-environment-variables%3F
* modified custom-typings.d.ts for configuration changes
* modified home.component.ts
* create shared component under "src\app\components"
* modified app.module.ts to add the components
* modified assets/data.json
* added "analysis" page
* app.component.ts, app.component.ts.spec - modified angularclassLogo
* modified webpack.config.js


* https://www.metaltoad.com/blog/angular-2-using-http-service-write-data-api

* UI theme - https://startbootstrap.com/template-overviews/sb-admin-2/
