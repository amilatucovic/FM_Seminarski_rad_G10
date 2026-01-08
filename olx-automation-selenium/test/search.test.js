import { Browser, Builder, By, until, Key } from "selenium-webdriver";
import { expect } from "chai";
import { setMobileViewport, closeCookiePopup, findOlxSearchInput } from "../utils/helper.js";

describe("OLX - Testovi pretrage", function () {
  let driver;
  this.timeout(30000);
  beforeEach(async function () {
    driver = await new Builder().forBrowser(Browser.CHROME).build();
    await setMobileViewport(driver);
    await driver.get("https://olx.ba/");
    await closeCookiePopup(driver);
  });

  afterEach(async function () {
    await driver.quit();
  });

  // TC-EP-001:  Pretraga sa validnim unosom od 6 karaktera
  it("TC-EP-001: Pretraga sa validnim unosom od 6 karaktera - Golf 7", async function () {
    const searchInput = await findOlxSearchInput(driver);
    await searchInput.clear();
    await searchInput.sendKeys("Golf 7");
    await searchInput.sendKeys(Key.RETURN);


    await driver.sleep(3000);
    const currentUrl = await driver.getCurrentUrl();
    console.log("Current URL:", currentUrl);

    expect(currentUrl).to.not.equal("https://olx.ba/");

    const pageTitle = await driver.getTitle();
    expect(pageTitle).to.not.be.empty;
  });

  // TC-EP-003: Pretraga po ključnoj riječi sa numeričkim unosom (float vrijednost)
  it("TC-EP-003: Pretraga sa decimalnim brojem - 7.5", async function () {
    const searchInput = await findOlxSearchInput(driver);

    await searchInput.clear();
    await searchInput.sendKeys("7.5");
    await searchInput.sendKeys(Key.RETURN);

    await driver.sleep(3000);

    const currentUrl = await driver.getCurrentUrl();
    console.log("Current URL:", currentUrl);

    const pageTitle = await driver.getTitle();
    expect(pageTitle).to.not.be.empty;
  });

  // TC-EP-004: Pretraga bez unosa ključne riječi (prazno polje)
  it("TC-EP-004: Pretraga bez unosa - prazno polje", async function () {
    const searchInput = await findOlxSearchInput(driver);
    await searchInput.click();
    await searchInput.sendKeys(Key.RETURN);
    await driver.sleep(3000);
    const pageTitle = await driver.getTitle();
    expect(pageTitle).to.not.be.empty;
    expect(pageTitle).to.not.include("Error");
    const currentUrl = await driver.getCurrentUrl();
    console.log("URL nakon prazne pretrage:", currentUrl);


    const bodyElement = await driver.findElement(By.css('body'));
    const bodyText = await bodyElement.getText();
    expect(bodyText.length).to.be.greaterThan(50, "Stranica je prazna");


    const pageSource = await driver.getPageSource();
    expect(pageSource).to.not.include("500 Internal Server Error");
    expect(pageSource).to.not.include("Fatal error");
    expect(pageSource).to.not.include("Something went wrong");

    console.log("Empty search test - no crash");
  });

  // TC-EP-006: Pretraga po ključnoj riječi sa specijalnim karakterima i simbolima
  it("TC-EP-006: Pretraga sa specijalnim znakovima - !#$%()?=", async function () {
    const searchInput = await findOlxSearchInput(driver);
    await searchInput.clear();
    await searchInput.sendKeys("!#$%()?=");
    await searchInput.sendKeys(Key.RETURN);
    await driver.sleep(3000);

    const pageTitle = await driver.getTitle();
    expect(pageTitle).to.not.be.empty;

    const pageSource = await driver.getPageSource();
    expect(pageSource).to.not.include("Fatal error");

    console.log("Special chars test - no crash");
  });


  // TC-EP-007: Pretraga po postojećoj kategoriji - Nekretnine
  it("TC-EP-007: Pretraga po kategoriji - Nekretnine", async function () {

    const categoriesIcon = await driver.wait(
      until.elementLocated(By.css('.svg-wrapper.main-category-icon')),
      15000
    );
    await driver.wait(until.elementIsVisible(categoriesIcon), 5000);
    await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", categoriesIcon);
    await driver.sleep(500);

    await categoriesIcon.click();
    console.log("Kliknuto na Kategorije ikonicu");
    await driver.sleep(2000);

    const nekretnineLinkSelectors = [
      By.xpath("//a[contains(text(), 'Nekretnine')]"),
      By.xpath("//a[@href='/pretraga? category_id=2']"),
      By.css("a[href*='category_id=2']"),
      By.xpath("//a[contains(@class, 'text-xs') and contains(text(), 'Nekretnine')]")
    ];

    let nekretnineLink = null;

    for (const selector of nekretnineLinkSelectors) {
      try {
        nekretnineLink = await driver.wait(
          until.elementLocated(selector),
          5000
        );
        if (nekretnineLink) {
          console.log("Nekretnine link pronađen");
          break;
        }
      } catch (error) {
        continue;
      }
    }

    if (!nekretnineLink) {
      throw new Error("Nekretnine link nije pronađen");
    }

    await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", nekretnineLink);
    await driver.sleep(500);

    await nekretnineLink.click();
    console.log("Kliknuto na kategoriju: Nekretnine");
    await driver.sleep(3000);

    const currentUrl = await driver.getCurrentUrl();
    console.log("Current URL:", currentUrl);
    expect(currentUrl).to.satisfy(
      (url) => url.includes('category_id=2') || url.includes('nekretnine'),
      "URL ne sadrži parametar kategoriju: Nekretnine"
    );


    const pageTitle = await driver.getTitle();
    expect(pageTitle).to.not.be.empty;
    console.log("Page Title:", pageTitle);


    const pageSource = await driver.getPageSource();
    const hasNekretinineContent =
      pageSource.includes("Nekretnine") ||
      pageSource.includes("nekretnine") ||
      pageSource.includes("Stan") ||
      pageSource.includes("Kuća");

    expect(hasNekretinineContent).to.be.true;
    console.log("Stranica Nekretnine uspješno učitana");
  });


  // TC-STT-033: Pretraga po ključnoj riječi sa validnim unosom bez pronađenih parametara
  it("TC-STT-033: Pretraga nepostojećeg proizvoda - Rossen šampon keratin", async function () {
    const searchInput = await findOlxSearchInput(driver);

    await searchInput.clear();
    await searchInput.sendKeys("Rossen šampon keratin");
    console.log("Uneseno: 'Rossen šampon keratin'");

    await searchInput.sendKeys(Key.RETURN);
    await driver.sleep(3000);

    const currentUrl = await driver.getCurrentUrl();
    console.log("Current URL:", currentUrl);

    expect(currentUrl).to.not.equal("https://olx.ba/");
    expect(currentUrl).to.satisfy(
      (url) => url.includes('Rossen') || url.includes('šampon') || url.includes('keratin') || url.includes('pretraga'),
      "URL ne sadrži search parametre"
    );

    const pageTitle = await driver.getTitle();
    expect(pageTitle).to.not.be.empty;
    console.log("Page Title:", pageTitle);

    const nemaRezultataSelectors = [
      By.xpath("//h1[contains(text(), 'Nema rezultata')]"),
      By.css("h1[data-v-548c74dd]"),
      By.xpath("//h1[contains(text(), 'Nema rezultata za traženi pojam')]")
    ];

    let nemaRezultataElement = null;

    for (const selector of nemaRezultataSelectors) {
      try {
        nemaRezultataElement = await driver.wait(
          until.elementLocated(selector),
          5000
        );
        if (nemaRezultataElement) {
          console.log("'Nema rezultata' element pronađen");
          break;
        }
      } catch (error) {
        continue;
      }
    }

    if (!nemaRezultataElement) {
      const pageSource = await driver.getPageSource();
      const bodyText = await driver.findElement(By.css('body')).getText();

      const hasNoResultsMessage =
        pageSource.includes("Nema rezultata") ||
        bodyText.includes("Nema rezultata") ||
        pageSource.includes("Nema rezultata za traženi pojam");

      expect(hasNoResultsMessage).to.be.true;
      console.log("Poruka 'Nema rezultata' pronađena u page source-u");
    } else {
      const messageText = await nemaRezultataElement.getText();
      console.log("Poruka:", messageText);

      expect(messageText).to.satisfy(
        (text) => text.includes("Nema rezultata") || text.includes("Nema rezultata za traženi pojam"),
        "Poruka 'Nema rezultata' nije pronađena"
      );

      const isVisible = await nemaRezultataElement.isDisplayed();
      expect(isVisible).to.be.true;

      console.log("Poruka 'Nema rezultata' je vidljiva");
    }

    const resultsSelectors = [
      By.css('[data-cy="ad-card"]'),
      By.css('.ad'),
      By.css('.listing-item'),
      By.css('.offer')
    ];

    let foundResults = false;

    for (const selector of resultsSelectors) {
      try {
        const results = await driver.findElements(selector);
        if (results.length > 0) {
          foundResults = true;
          console.log(`Pronađeno ${results.length} rezultata`);
          break;
        }
      } catch (error) {
        continue;
      }
    }

    expect(foundResults).to.be.false;
    console.log("Nema oglasa u rezultatima");

    const pageSource = await driver.getPageSource();
    expect(pageSource).to.not.include("500 Internal Server Error");
    expect(pageSource).to.not.include("Fatal error");

    console.log("Test završen uspješno - Nema rezultata za 'Rossen šampon keratin'");
  });

});
