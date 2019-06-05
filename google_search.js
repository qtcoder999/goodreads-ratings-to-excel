/* eslint-disable linebreak-style */
const { Builder, By, until, Key } = require("selenium-webdriver");
const excel = require("./excel");
require("chromedriver");

const url = "https://google.com";
let driver;
const suffix = "goodreads";
let arrayDuplicate = [];
const metaData = {
  titles: [],
  authors: [],
  ratings: [],
  numberOfRatings: []
};

async function openChrome() {
  return new Promise(async resolve => {
    driver = new Builder().forBrowser("chrome").build();
    driver.then(() => {
      resolve();
    });
  });
}

const openTabs = async count => {
  await driver.executeScript("window.open(); window.focus();");
  const newCount = count - 1;
  if (count > 1) return openTabs(newCount);
  return null;
};
const getTitles = async () => {
  await driver.findElement(By.css("#bookTitle")).then(async element => {
    await element.getText().then(text => {
      metaData.titles.push(text);
      driver.findElement(By.css("body")).sendKeys(Key.ESCAPE);
    });
  });
};

const getAuthors = async () => {
  await driver
    .findElement(By.css('span[itemprop="author"]'))
    .then(async element => {
      await element.getText().then(text => {
        metaData.authors.push(text);
      });
    });
};

const getRatings = async () => {
  await driver
    .findElement(By.css('span[itemprop="ratingValue"]'))
    .then(async element => {
      await element.getText().then(text => {
        metaData.ratings.push(text.trim());
      });
    });
};

const getNumberOfRatings = async () => {
  await driver
    .findElement(By.css("#bookMeta > a:nth-child(7)"))
    .then(async element => {
      await element.getText().then(text => {
        const stringAfterReplacement = text.replace("ratings", "").trim();
        metaData.numberOfRatings.push(stringAfterReplacement);
      });
    });
};

const searchTheTerm = async searchTerm => {
  try {
    // console.log(searchTerm);
    const searchLocator = By.name("q");
    const iAmFeelingLuckyLocator = By.css(
      '.FPdoLc.VlcLAe input[aria-label="I\'m Feeling Lucky"]'
    );
    return driver
      .get(url)
      .then(
        await driver
          .findElement(async () =>
            driver.wait(until.elementLocated(searchLocator))
          )
          .sendKeys(`${searchTerm} ${suffix}`)
      )
      .then(
        await driver
          .findElement(async () =>
            driver.wait(until.elementLocated(iAmFeelingLuckyLocator))
          )
          .then(
            await driver.executeScript(
              'document.querySelector("#tsf > div:nth-child(2) > div > div.FPdoLc.VlcLAe > center > input[type=submit]:nth-child(2)").click()'
            )
          )
      )
      .then(await getTitles(searchTerm))
      .then(await getAuthors())
      .then(await getRatings())
      .then(await getNumberOfRatings());
  } catch (err) {
    console.log("@@@@Failure", searchTerm);
    console.log("@@@@Reason", err);
    return 1;
  }
  // .then(console.log(metaData));
};

async function windowSwitcher(searchTerm) {
  await driver.switchTo().window(arrayDuplicate[arrayDuplicate.length - 1]);
  await searchTheTerm(searchTerm).then(arrayDuplicate.pop());
}

const mainLoop = async (arr, count) => {
  if (count <= arr.length - 1) {
    const searchTerm = arr[count].toString().trim();
    await windowSwitcher(searchTerm, count);
    const newCount = count + 1;
    return mainLoop(arr, newCount);
  }
  return 1;
};

const getHandles = async () => {
  await driver.getAllWindowHandles().then(async handles => {
    arrayDuplicate = handles;
    /*
      Selenium issue
      https://github.com/w3c/webdriver/issues/386

      Using a temporary workaround
    */
    arrayDuplicate.push(arrayDuplicate.shift());
  });
};

const passToDev = async arr => {
  await openChrome();
  await openTabs(arr.length - 1);
  await getHandles();
  // console.log("Search terms history:");
  await mainLoop(arr, 0);
};

const getData = () => excel.getDataFromExcel();

const start = async () => getData().then(result => passToDev(result[0].data));

exports.start = start;
exports.metaData = metaData;
