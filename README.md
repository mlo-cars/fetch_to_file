# fetch_to_file

Utilize fetch API to perform tasks like checking if an endpoint is valid or pulling data from endpoints.

Includes a CSV parser.

## Setup

- Run `asdf install` to install node
- Run `npm i` at root to install deps

## Run fetch tableau users app

1. Set credentials in _/src/fetchTableauUsers.js_

```js
const baseUrl = "";
const adminUser = "";
const adminPassword = "";
const siteId = "";
```

2. Run the following command at root to build app and export users to CSV

```js
npm run build_and_run
```

## Run DOTY image check

_WIP_

### Requirements

- A state file located at `/assets/csv/doty_state_image_check_1.csv`
  - _Note:_ May need multiple files due to rate limiting


1. Run the following command at root to build app and export users to CSV

```js
npm run build_and_run_doty_verification
```
