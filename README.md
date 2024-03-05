# Application

Utilize fetch API to perform tasks like checking if an endpoint is valid or pulling data from endpoints.

Includes a CSV parser/exporter.

# Setup

- Run `asdf install` to install node
- Run `npm i` at root to install deps

# Run fetch tableau users app

This will call Tableau for users and export to `./dist/tableau_users.csv`.

## Steps

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

3. Review CSV at `./dist/tableau_users.csv`

# Run DOTY image check

This will make calls to DR awards image CDN and verify for a 200. Success and failures will be exported to a results CSV.

- `./dist/award/_result.csv`
- `./dist/failed_awards_results.csv`

Due to rate limiting, it is best to split up a large set of awards. EG:

- `doty_state_image_check_1.csv`
- `doty_state_image_check_2.csv`

**Jumping on VPN will help get over rate limiting issue**

## Requirements

- A state file located at `/assets/csv/doty_state_image_check_1.csv`

## Steps

Run one scope at a time and uncomment/comment the function accordingly.
EG: scopes "National", "Regional", "State"

### State awards

**Note:** Some state awards at for Canadian awards so the fetch URL will need to be adjusted accordingly for a positive result.

```js
const url = `https://cdn-user.dealerrater.com/doty/${year}/US/seal2/state/${make}-${state}.png`;
```

1. Drop state award files in `/assets/csv/` and update the file path in `verifyDotyAwards.js`

```js
const filePath = "<path_to_csv>";
```

2. Run the following command at root to build app and export users to CSV

```js
npm run build_and_run_doty_verification
```

3. Verify award results at

- `./dist/award/_result.csv`
- `./dist/failed_awards_results.csv`

4. In the event of failures, copy _failed_awards_results.csv_ to `/assets/csv` and rerun steps.

---

### National awards

1. Drop national award files in `/assets/csv/` and update the file path in `verifyDotyAwards.js`

```js
const nationalFilePath = "<path_to_csv>";
```

2. Run the following command at root to build app and export users to CSV

```js
npm run build_and_run_doty_verification
```

3. Verify award results at

- `./dist/award/_result.csv`
- `./dist/failed_awards_results.csv`

4. In the event of failures, copy _failed_awards_results.csv_ to `/assets/csv` and rerun steps.

---

### Regional awards

1. Drop regional award files in `/assets/csv/` and update the file path in `verifyDotyAwards.js`

```js
const regionalFilePath = "<path_to_csv>";
```

2. Run the following command at root to build app and export users to CSV

```js
npm run build_and_run_doty_verification
```

3. Verify award results at

- `./dist/award/_result.csv`
- `./dist/failed_awards_results.csv`

4. In the event of failures, copy _failed_awards_results.csv_ to `/assets/csv` and rerun steps.
