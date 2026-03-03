// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,

  connectorUrl: process.env['connectordbUrl'] || '',
  fivetranURL: process.env['fivetranURL'] || '',
  reportUrl: process.env['dbtUrl'] || '',
  userReportList: process.env['reportdbUrl'] || '',
  powerbiToken: process.env['embedTokenUrl'] || '',
  WEB_URL: process.env['WEB_URL'] || '',
  powerbiUrl: process.env['powerbiURL'] || '',
  adjustTest: process.env['adjustTestURL'] || '',
  adjustConnectorUrl: process.env['gcpApi'] || '',
  adjustDBApi: process.env['adjustDB'] || '',

  gaApiUrl: process.env['gcpApi'] || '',
  authGAApiUrl: process.env['authGA'] || '',
  gaDetailsUrl: process.env['gaDetails'] || '',
  ga4DetailsUrl: process.env['ga4Details'] || '',

  magentoUrl: process.env['gcpApi'] || '',

  baseUrlv2: process.env['base_Urlv2'] || '',
  productionbaseUrlv2: process.env['production_base_Urlv2'] || '',
  fivetranUrlv2: process.env['fivetran_Urlv2'] || '',

  secretKey: process.env['secretkey'] || '',

  clientIdKey: process.env['clientID'] || '',

  productionIdKey: process.env['productionID'] || '',

  slack_API: process.env['slack'] || '',

  socketUrl: 'https://datae-gpt-testing-35ce954a49b0.herokuapp.com/',

  // domain: "staging",
  domain: "prod",

  adSourceTemplateName: process.env['adSourceTemplateName'] || '',
  adjustTemplateName: process.env['adjustTemplateName'] || '',
  asanaTemplateName: process.env['asanaTemplateName'] || '',
  intradayTemplateName: process.env['intradayTemplateName'] || '',
  ecommerceTemplateName: process.env['ecommerceTemplateName'] || '',
  pipedriveTemplateName: process.env['pipedriveTemplateName'] || ''
};
