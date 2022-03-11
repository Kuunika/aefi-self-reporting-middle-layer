# Introduction: Adverse Effects Following Immunisation Self Reporting API

The following api document details....

## Deployment

## Requirements

npm version: 7.24.2
node version: v16.11.1

## Environment Variables

Copy the contents of .sample.env to an new .env file. the variables:

AEFI_OHSP_USERNAME,
AEFI_OHSP_PASSWORD,
AEFI_OHSP_URL

will need to be set before the application can be run.

## Installation and Execution

```bash
npm install --only=prod
npm run build
npm run start:prod
```

## Docker Installation

### Docker Run

docker run -d -v $(pwd)/logs:/usr/src/logs --env-file .env -p 3000:3000 kuunika/aefii-self-reporting-middle-layer-api:0.9
