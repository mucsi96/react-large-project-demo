# react-large-project-demo

[![Build Status](https://github.com/mucsi96/react-large-project-demo/workflows/Build/badge.svg?branch=master)](https://github.com/mucsi96/react-large-project-demo/actions?query=workflow%3ABuild+branch%3Amaster)

Demonstration for large scale React application in TypeScript

[Live ui-lib storybook](https://mucsi96.github.io/react-large-project-demo/ui-lib)

[Live mock app](https://mucsi96.github.io/react-large-project-demo/app-mock)

[Live production app](https://mucsi96.github.io/react-large-project-demo/app-prod)

## Packages

- dev-tools
- frinds-api
- ui-lib
- app

## Features

- Encapsulate all development related configration in single package
  - ESLint
  - TypeScript
  - Jest
  - Rollup
  - Create React App
  - Storybook
  - Cucumber + Puppetier
  - Api mocking
- Supports React application and libraries developent

## Commands

- `dev-tools check-types`
- `dev-tools lint`
- `dev-tools test`
- `dev-tools int-test`
- `dev-tools start-storybook`
- `dev-tools start-app`
- `dev-tools build-lib`
- `dev-tools build-storybook`
- `dev-tools build-app`

## API mocking

Based on service worker. Benefits:

- Easy debugging in browser
- All network calls available in Network panel
- Deployable as static site
- Easy configuration - no need to run servers

## Intergration testing

Based on Cucumber and Puppetier

Additional features

- snapshot testing