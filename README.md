# react-large-project-demo

[![Build Status](https://github.com/mucsi96/react-large-project-demo/workflows/Build/badge.svg?branch=master)](https://github.com/mucsi96/react-large-project-demo/actions?query=workflow%3ABuild+branch%3Amaster)

Demonstration for large scale React application in TypeScript

[Live friends storybook](https://mucsi96.github.io/react-large-project-demo/friends)

[Live mock app](https://mucsi96.github.io/react-large-project-demo/app-mock)

[Live production app](https://mucsi96.github.io/react-large-project-demo/app-prod)

## Packages

- [dev-tools](packages/dev-tools/README.md)
- [mock-api](packages/mock-api/README.md)
- [core](packages/core/README.md)
- friends-api
- friends
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

## Demo steps

- [Simple list](https://github.com/mucsi96/react-large-project-demo/compare/demo-step-0..demo-step-1-simple-list)
- [Loading spinner](https://github.com/mucsi96/react-large-project-demo/compare/demo-step-1-simple-list..demo-step-2-loading)
- [Loading failure](https://github.com/mucsi96/react-large-project-demo/compare/demo-step-2-loading..demo-step-3-loading-failure)
- [Lazy loading](https://github.com/mucsi96/react-large-project-demo/compare/demo-step-3-loading-failure..demo-step-4-lazy-loading)
- [Empty list](https://github.com/mucsi96/react-large-project-demo/compare/demo-step-4-lazy-loading..demo-step-5-empty-list)
- [Add to favorite](https://github.com/mucsi96/react-large-project-demo/compare/demo-step-5-empty-list..demo-step-6-add-to-favorite)
