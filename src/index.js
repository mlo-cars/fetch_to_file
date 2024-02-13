import { mkConfig, generateCsv, asString } from "export-to-csv";
import { XMLParser } from "fast-xml-parser";
import { writeFile } from "node:fs";
import { Buffer } from "node:buffer";

const baseUrl = "";
const adminUser = "";
const adminPassword = "";
const siteId = "";

const xmlParserOptions = {
  allowBooleanAttributes: true,
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
};

/**
 * Gets auth token and site id
 * @returns object of token and site id
 */
const fetchTokenAndSiteId = async () => {
  const url = `${baseUrl}/api/3.19/auth/signin`;
  const body = `
    <tsRequest>
      <credentials name="${adminUser}" password="${adminPassword}" >
          <site contentUrl="${siteId}" />
      </credentials>
    </tsRequest>
  `;

  const dataResponse = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/xml",
    },
    body: body,
  });
  const responseData = await dataResponse.text();

  const xmlParser = new XMLParser(xmlParserOptions);

  const responseText = xmlParser.parse(responseData);

  const credentials = responseText.tsResponse.credentials;

  return {
    token: credentials?.["@_token"],
    siteId: credentials?.site?.["@_id"],
  };
};

/**
 * Gets user count on site
 * @param token - an auth token
 * @param siteId - site id
 * @returns number of users on site
 */
const fetchUserCount = async ({ token, siteId }) => {
  const url = `${baseUrl}/api/3.19/sites/${siteId}/users`;

  const headers = {
    "X-Tableau-Auth": token,
  };

  const countResponse = await fetch(url, {
    method: "GET",
    headers: {
      ...headers,
    },
  });

  const countResponseData = await countResponse.text();

  const xmlParser = new XMLParser(xmlParserOptions);
  const countResponseText = xmlParser.parse(countResponseData);

  return countResponseText?.tsResponse?.pagination?.["@_totalAvailable"];
};

/**
 *
 * @param auth - object of token and site id
 * @param pageNumber - which page to return results from if multiple pages
 * @returns array of user objects
 */
const fetchUsersByPage = async ({ token, siteId }, pageNumber) => {
  const queryString = `pageSize=1000&pageNumber=${pageNumber}`;
  const url = `${baseUrl}/api/3.19/sites/${siteId}/users?${queryString}`;

  const headers = {
    "X-Tableau-Auth": token,
  };

  const countResponse = await fetch(url, {
    method: "GET",
    headers: {
      ...headers,
    },
  });

  const countResponseData = await countResponse.text();

  const xmlParser = new XMLParser(xmlParserOptions);
  const countResponseText = xmlParser.parse(countResponseData);

  return countResponseText?.tsResponse?.users;
};

(async () => {
  const tokenAndSiteId = await fetchTokenAndSiteId();

  let userCount = await fetchUserCount(tokenAndSiteId);
  let shouldPageNext = userCount - 1000 > 1000;
  let pageNumber = 1;

  console.log({ shouldPageNext, userCount });

  let userStorage = [];

  do {
    const usersOnPage = await fetchUsersByPage(tokenAndSiteId, pageNumber);

    const tempUsers = usersOnPage?.user?.reduce((accum, currentValue) => {
      if (currentValue?.["@_email"]) {
        const userObj = {
          id: currentValue?.["@_id"],
          email: currentValue?.["@_email"],
          fullName: currentValue?.["@_fullName"],
          name: currentValue?.["@_name"],
        };

        accum.push(userObj);
      }

      return accum;
    }, []);

    // shouldPageNext = userCount - 1000 > 0;
    // pageNumber = shouldPageNext ? pageNumber + 1 : pageNumber;

    shouldPageNext = false;
    pageNumber = 4;

    console.log({ tempUsers });
    userStorage = [...userStorage, ...tempUsers];
  } while (shouldPageNext);

  console.log({ userStorage });

  const csvConfig = mkConfig({
    useKeysAsHeaders: true,
    filename: "tableau_users",
  });
  const csv = generateCsv(csvConfig)(userStorage);
  const csvFilename = `./dist/${csvConfig.filename}.csv`;
  const csvBuffer = new Uint8Array(Buffer.from(asString(csv)));

  writeFile(csvFilename, csvBuffer, (err) => {
    if (err) throw err;
    console.log("file saved: ", csvFilename);
  });
})();
