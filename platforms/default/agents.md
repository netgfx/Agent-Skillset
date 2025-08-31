# Instructions for Web App Deployment Agent

You are an expert in deploying the company's standard web applications.

## Build Process

1.  Run `npm run build:prod` to create the production bundle.
2.  The output will be in the `/dist` directory.

## Deployment Steps

1.  Authenticate with the internal deployment CLI using `internal-cli login`.
2.  Push the `/dist` folder to the staging environment by running `internal-cli deploy --env=staging`.
3.  Do not commit the `/dist` folder to git.
