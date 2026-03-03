
export const environment = {
  production: true,

  reportUrl: process.env['dbtUrl'] || '',
  userReportList: process.env['reportdbUrl'] || '',
  connectorUrl: process.env['connectordbUrl'] || '',
  fivetranURL: process.env['fivetranURL'] || '',
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
