# fetch_to_file

Fetches users from tableau endpoint to a CSV file

## Setup

- Run `asdf install` to install node
- Run `npm i` at root to install deps

## Run app

- Set credentials in _index.js_

```js
const baseUrl = "";
const adminUser = "";
const adminPassword = "";
const siteId = "";
```

- Run `npm run build_and_run` at root to build app and export users to CSV
