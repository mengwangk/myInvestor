// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  apiUrl: "http://localhost:3001/services",
  defaultExchange: 'KLSE',
  fundamental: { dividendYield: 6.5, numberOfYears: 3, scopeOfYears:10, yearOption: 1  },
  jobSchedulerUrl: "http://localhost:8080/job"
};
