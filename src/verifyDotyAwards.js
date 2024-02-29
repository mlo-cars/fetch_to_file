import fs from "node:fs";
import { parse } from "csv-parse";
import { mkConfig, generateCsv, asString } from "export-to-csv";
import { Buffer } from "node:buffer";
import { writeFile } from "node:fs";

let stateResults = { success: 0, fail: 0, failedAwards: [] };
let stateCount = 1;
const filePath = "./assets/csv/doty_state.csv";

let nationalResults = { success: 0, fail: 0, failedAwards: [] };
let nationalCount = 1;
const nationalFilePath = "./assets/csv/doty_national.csv";

let regionalResults = { success: 0, fail: 0, failedAwards: [] };
let regionalCount = 1;
const regionalFilePath = "./assets/csv/doty_regional.csv";

/**
 *
 * @param {Array} awards - an array of awards
 *
 * Award struct `[{year: "2018", make: "1", state: "IL"}]`
 *
 * example state award endpoint:
 * https://cdn-user.dealerrater.com/doty/2021/US/seal2/state/13-AL.png
 */
const verifyStateAward = async (awards) => {
  return new Promise((resolve) => {
    const orginalAwardsCount = awards.length;

    do {
      const tempAwards = awards.splice(0, 500);

      setTimeout(() => {
        tempAwards.forEach(async (award) => {
          const { make: make, state: state, year: year } = award;
          const url = `https://cdn-user.dealerrater.com/doty/${year}/US/seal2/state/${make}-${state}.png`;

          fetch(url, { method: "HEAD" })
            .then((response) => {
              const awardResponseStatus = response.status;
              console.log(">>> awardResponseStatus", {
                awardResponseStatus,
                url,
                stateCount,
              });

              if (awardResponseStatus === 200) {
                stateResults.success = stateResults.success + 1;
              } else {
                stateResults.fail = stateResults.fail + 1;
                stateResults.failedAwards.push(award);
              }

              stateCount = stateCount + 1;

              if (stateCount === orginalAwardsCount) {
                console.log(">>>> state results: ", stateResults);
                exportResults(stateResults);

                resolve();
              }
            })
            .catch((err) => {
              console.error("fetch error: ", err);

              stateResults.fail = stateResults.fail + 1;
              stateResults.failedAwards.push(award);

              stateCount = stateCount + 1;

              if (stateCount === orginalAwardsCount) {
                console.log(">>>> state results: ", stateResults);
                exportResults(stateResults);

                resolve();
              }
            });
        });
      }, 10000);
    } while (awards.length > 0);
  });
};

/**
 * Parses award CSV file and starts verifying image path
 *
 * @param {string} filePath - local path to award CSV file
 */
const checkStateAwardImages = async (filePath) => {
  return new Promise((resolve) => {
    const parser = parse(
      {
        columns: true,
        delimiter: ",",
      },
      async (err, awards) => {
        if (err) {
          console.error("parser error: ", err);

          resolve();
          return;
        }

        await verifyStateAward(awards);
        resolve();
      }
    );

    fs.createReadStream(filePath).pipe(parser);
  });
};

/**
 *
 * @param {Array} awards - an array of awards
 *
 * Award struct `[{year: "2018", make: "1"}]`
 *
 * example state award endpoint:
 * https://cdn-user.dealerrater.com/doty/2021/US/seal2/national/13.png
 */
const verifyNationalAward = async (awards) => {
  return new Promise((resolve) => {
    const orginalAwardsCount = awards.length;

    do {
      const tempAwards = awards.splice(0, 500);

      setTimeout(() => {
        tempAwards.forEach(async (award) => {
          const { make: make, year: year } = award;
          const url = `https://cdn-user.dealerrater.com/doty/${year}/US/seal2/national/${make}.png`;

          fetch(url, { method: "HEAD" })
            .then((response) => {
              const awardResponseStatus = response.status;
              console.log(">>> awardResponseStatus", {
                awardResponseStatus,
                url,
                nationalCount,
              });

              if (awardResponseStatus === 200) {
                nationalResults.success = nationalResults.success + 1;
              } else {
                nationalResults.fail = nationalResults.fail + 1;
                nationalResults.failedAwards.push(award);
              }

              nationalCount = nationalCount + 1;

              if (nationalCount === orginalAwardsCount) {
                console.log(">>>> national results: ", nationalResults);
                exportResults(nationalResults);

                resolve();
              }
            })
            .catch((err) => {
              console.error("fetch error: ", err);

              nationalResults.fail = nationalResults.fail + 1;
              nationalResults.failedAwards.push(award);

              nationalCount = nationalCount + 1;

              if (nationalCount === orginalAwardsCount) {
                console.log(">>>> national results: ", nationalResults);
                exportResults(nationalResults);

                resolve();
              }
            });
        });
      }, 10000);
    } while (awards.length > 0);
  });
};

/**
 * Parses award CSV file and starts verifying image path
 *
 * @param {string} filePath - local path to award CSV file
 */
const checkNationalAwardImages = async (filePath) => {
  return new Promise((resolve) => {
    const parser = parse(
      {
        columns: true,
        delimiter: ",",
      },
      async (err, awards) => {
        if (err) {
          console.error("parser error: ", err);

          resolve();
          return;
        }

        await verifyNationalAward(awards);
        resolve();
      }
    );

    fs.createReadStream(filePath).pipe(parser);
  });
};

/**
 *
 * @param {Array} awards - an array of awards
 *
 * Award struct `[{year: "2018", region: "Mid-Atlantic"}]`
 *
 * example state award endpoint:
 * https://cdn-user.dealerrater.com/doty/2021/US/seal2/regional/Mid-Atlantic.png
 */
const verifyRegionalAward = async (awards) => {
  return new Promise((resolve) => {
    const orginalAwardsCount = awards.length;

    do {
      const tempAwards = awards.splice(0, 500);

      setTimeout(() => {
        tempAwards.forEach(async (award) => {
          const { region: region, year: year } = award;
          const url = `https://cdn-user.dealerrater.com/doty/${year}/US/seal2/regional/${region}.png`;

          fetch(url, { method: "HEAD" })
            .then((response) => {
              const awardResponseStatus = response.status;
              console.log(">>> awardResponseStatus", {
                awardResponseStatus,
                url,
                regionalCount,
              });

              if (awardResponseStatus === 200) {
                regionalResults.success = regionalResults.success + 1;
              } else {
                regionalResults.fail = regionalResults.fail + 1;
                regionalResults.failedAwards.push(award);
              }

              regionalCount = regionalCount + 1;

              if (regionalCount === orginalAwardsCount) {
                console.log(">>>> regional results: ", regionalResults);
                exportResults(regionalResults);

                resolve();
              }
            })
            .catch((err) => {
              console.error("fetch error: ", err);

              regionalResults.fail = regionalResults.fail + 1;
              regionalResults.failedAwards.push(award);

              regionalCount = regionalCount + 1;

              if (regionalCount === orginalAwardsCount) {
                console.log(">>>> regional results: ", regionalResults);
                exportResults(regionalResults);

                resolve();
              }
            });
        });
      }, 10000);
    } while (awards.length > 0);
  });
};

/**
 * Parses award CSV file and starts verifying image path
 *
 * @param {string} filePath - local path to award CSV file
 */
const checkRegionalAwardImages = async (filePath) => {
  return new Promise((resolve) => {
    const parser = parse(
      {
        columns: true,
        delimiter: ",",
      },
      async (err, awards) => {
        if (err) {
          console.error("parser error: ", err);

          resolve();
          return;
        }

        await verifyRegionalAward(awards);
        resolve();
      }
    );

    fs.createReadStream(filePath).pipe(parser);
  });
};

/**
 * Export results to a CSV to:
 * - ./dist/award_result.csv
 * - ./dist/failed_awards_results.csv
 *
 * @param {object} results - results struct: `{ success: 2998, fail: 0, failedAwards: [] }`
 */
const exportResults = (results) => {
  // export success and failure counts
  const resultConfig = mkConfig({
    useKeysAsHeaders: true,
    filename: "award_result",
  });
  const result = [
    {
      success: results.success,
      failed: results.fail,
      file: filePath,
    },
  ];
  const csv = generateCsv(resultConfig)(result);
  const csvFilename = `./dist/${resultConfig.filename}.csv`;
  const csvBuffer = new Uint8Array(Buffer.from(asString(csv)));

  writeFile(csvFilename, csvBuffer, (err) => {
    if (err) throw err;
    console.log("file saved: ", csvFilename);
  });

  // export failed awards if exist
  if (results?.failedAwards?.length) {
    const failedAwardResultConfig = mkConfig({
      useKeysAsHeaders: true,
      filename: "failed_awards_results",
    });

    const csv = generateCsv(failedAwardResultConfig)(results?.failedAwards);
    const csvFilename = `./dist/${failedAwardResultConfig.filename}.csv`;
    const csvBuffer = new Uint8Array(Buffer.from(asString(csv)));

    writeFile(csvFilename, csvBuffer, (err) => {
      if (err) throw err;
      console.log("file saved: ", csvFilename);
    });
  }
};

/**
 * Start checking awards
 *
 * Uncomment/comment the scope function as needed
 */
(async () => {
  // // filePath declared globally
  // await checkStateAwardImages(filePath);

  // // nationalFilePath declared globally
  // await checkNationalAwardImages(nationalFilePath);
  
  // // regionalFilePath declared globally
  // await checkRegionalAwardImages(regionalFilePath);
})();
