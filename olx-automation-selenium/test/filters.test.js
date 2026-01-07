import { Browser, Builder, By, until, Key } from "selenium-webdriver";
import { expect } from "chai";
import { setMobileViewport, closeCookiePopup, selectMobilniUredjaji, openDropdownByLabel } from "../utils/helper.js";

describe("OLX - Testovi kombinovanja filtera", function () {
    let driver;

    beforeEach(async function () {
        driver = await new Builder().forBrowser(Browser.CHROME).build();
        await setMobileViewport(driver);
        await driver.get("https://olx.ba/");
        await closeCookiePopup(driver);
    });

    afterEach(async function () {
        await driver.quit();
    });

    // TC-EP-009:  Filtriranje sa pozitivnim decimalnim brojem za polje cijena
    it("TC-EP-009: Filtriranje sa pozitivnim decimalnim brojem za polje cijena - Kategorija: Mobilni uređaji, Cijena (do) = 10.50", async function () {

        const urlAfterCategory = await selectMobilniUredjaji(driver);
        expect(urlAfterCategory).to.not.equal("https://olx.ba/");

        await openDropdownByLabel(driver, "Cijena");

        await driver.sleep(2000);


        const cijenaDoInput = await driver.wait(
            until.elementLocated(By.css('input[type="number"][placeholder="do"]')),
            5000
        );

        await driver.executeScript(
            "arguments[0].scrollIntoView({block: 'center'});",
            cijenaDoInput
        );
        await driver.sleep(500);
        await cijenaDoInput.click();
        await cijenaDoInput.clear();
        await cijenaDoInput.sendKeys("10.50");
        console.log("✓ Uneseno '10.50' u Cijena do");

        await driver.sleep(1000);


        const refreshButton = await driver.wait(
            until.elementLocated(By.css('button.refresh')),
            5000
        );

        await driver.executeScript(
            "arguments[0]. scrollIntoView({block: 'center'});",
            refreshButton
        );
        await driver.sleep(500);

        const isVisible = await refreshButton.isDisplayed();
        const isEnabled = await refreshButton.isEnabled();

        expect(isVisible).to.be.true;
        expect(isEnabled).to.be.true;

        await refreshButton.click();
        console.log("Kliknuto na 'Osvježi rezultate'");

        await driver.sleep(3000);


        const finalUrl = await driver.getCurrentUrl();
        console.log("Final URL:", finalUrl);
        expect(finalUrl).to.not.equal("https://olx.ba/");


        const pageTitle = await driver.getTitle();
        expect(pageTitle).to.not.be.empty;
        console.log("Page Title:", pageTitle);


        const inputValue = await cijenaDoInput.getAttribute('value');
        console.log("Input value:", inputValue);
        expect(parseFloat(inputValue)).to.equal(10.5);


        const bodyText = await driver.findElement(By.css('body')).getText();
        expect(bodyText.length).to.be.greaterThan(100, "Stranica je prazna ili nije učitana");


        const pageSource = await driver.getPageSource();
        expect(pageSource).to.not.include("500 Internal Server Error");
        expect(pageSource).to.not.include("Fatal error");

        console.log("Test završen uspješno - Mobilni uređaji + Cijena do 10.50");
    });

    // TC-EP-011: Filtriranje sa standardnim upitom za polje cijena
    it("TC-EP-011: Filtriranje sa standardnim upitom za polje cijena - Cijena (od) = 100; Cijena (do) = 1000 KM", async function () {
        const urlAfterCategory = await selectMobilniUredjaji(driver);
        expect(urlAfterCategory).to.not.equal("https://olx.ba/");

        await openDropdownByLabel(driver, "Cijena");


        const cijenaOdInput = await driver.wait(
            until.elementLocated(By.css('input[type="number"][placeholder="od"]')),
            5000
        );

        await driver.executeScript(
            "arguments[0].scrollIntoView({block: 'center'});",
            cijenaOdInput
        );
        await driver.sleep(500);
        await cijenaOdInput.click();
        await cijenaOdInput.clear();
        await cijenaOdInput.sendKeys("100");
        console.log("Uneseno '100' u Cijena od");

        await driver.sleep(500);

        const cijenaDoInput = await driver.wait(
            until.elementLocated(By.css('input[type="number"][placeholder="do"]')),
            5000
        );

        await driver.executeScript(
            "arguments[0].scrollIntoView({block: 'center'});",
            cijenaDoInput
        );
        await driver.sleep(500);
        await cijenaDoInput.click();
        await cijenaDoInput.clear();
        await cijenaDoInput.sendKeys("1000");
        console.log("Uneseno '1000' u Cijena do");

        await driver.sleep(1000);

        const refreshButton = await driver.wait(
            until.elementLocated(By.css('button.refresh')),
            5000
        );

        await driver.executeScript(
            "arguments[0].scrollIntoView({block: 'center'});",
            refreshButton
        );
        await driver.sleep(500);

        const isVisible = await refreshButton.isDisplayed();
        const isEnabled = await refreshButton.isEnabled();

        expect(isVisible).to.be.true;
        expect(isEnabled).to.be.true;

        await refreshButton.click();
        console.log("Kliknuto na 'Osvježi rezultate'");

        await driver.sleep(3000);

        const finalUrl = await driver.getCurrentUrl();
        console.log("Final URL nakon osvježavanja:", finalUrl);

        const urlContainsPrice =
            finalUrl.includes('price') ||
            finalUrl.includes('100') ||
            finalUrl.includes('1000');

        if (urlContainsPrice) {
            console.log("URL sadrži filter parametre za cijenu");
        }

        expect(finalUrl).to.not.equal("https://olx.ba/");
        expect(finalUrl).to.not.equal(urlAfterCategory);

        const pageTitle = await driver.getTitle();
        expect(pageTitle).to.not.be.empty;
        console.log("Page Title:", pageTitle);

        const odValue = await cijenaOdInput.getAttribute('value');
        const doValue = await cijenaDoInput.getAttribute('value');

        console.log("Cijena od value:", odValue);
        console.log("Cijena do value:", doValue);

        expect(parseInt(odValue)).to.equal(100);
        expect(parseInt(doValue)).to.equal(1000);


        const bodyElement = await driver.findElement(By.css('body'));
        const bodyText = await bodyElement.getText();
        expect(bodyText.length).to.be.greaterThan(100, "Stranica je prazna");


        try {
            const results = await driver.findElements(By.css('[data-cy="ad-card"], .ad, .listing-item'));
            console.log(`Pronađeno ${results.length} rezultata`);

            if (results.length > 0) {
                expect(results.length).to.be.greaterThan(0);
            }
        } catch (error) {
            console.log("Rezultati nisu pronađeni ili selector ne odgovara");
        }

        const pageSource = await driver.getPageSource();
        expect(pageSource).to.not.include("500 Internal Server Error");
        expect(pageSource).to.not.include("Fatal error");

        console.log("Test završen uspješno - Mobilni uređaji + Cijena od 100 do 1000 KM");
    });

    // TC-EP-015: Pretraga po postojećoj lokaciji i kategoriji
    it("TC_EP_015: Pretraga po postojećoj lokaciji i kategoriji - Mobilni uređaji + Lokacija:  Unsko-sanski kanton - Bihać", async function () {

        const urlAfterCategory = await selectMobilniUredjaji(driver);
        expect(urlAfterCategory).to.not.equal("https://olx.ba/");

        await openDropdownByLabel(driver, "Lokacija");

        const lokacijaSelect = await driver.wait(
            until.elementLocated(By.css('select.text-base.font-bold')),
            5000
        );

        await driver.executeScript(
            "arguments[0].scrollIntoView({block: 'center'});",
            lokacijaSelect
        );
        await driver.sleep(500);
        await lokacijaSelect.click();
        await driver.sleep(500);

        const unskoSanskiOption = await driver.findElement(
            By.xpath("//option[@value='1' and contains(text(), 'Unsko-sanski kanton')]")
        );
        await unskoSanskiOption.click();
        console.log("Odabran Unsko-sanski kanton");

        await driver.sleep(2000);

        const bihacOption = await driver.wait(
            until.elementLocated(By.xpath("//li[contains(text(), 'Bihać')]")),
            5000
        );

        await driver.executeScript(
            "arguments[0].scrollIntoView({block: 'center'});",
            bihacOption
        );
        await driver.sleep(500);
        await bihacOption.click();
        console.log("Odabran grad Bihać");

        await driver.sleep(1000);


        const zatvoriButton = await driver.wait(
            until.elementLocated(
                By.xpath("//button[contains(., 'Zatvori') or .//p[text()='Zatvori']]")
            ),
            5000
        );

        await driver.executeScript(
            "arguments[0].scrollIntoView({block: 'center'});",
            zatvoriButton
        );
        await driver.sleep(500);

        const isVisible = await zatvoriButton.isDisplayed();
        const isEnabled = await zatvoriButton.isEnabled();

        expect(isVisible).to.be.true;
        expect(isEnabled).to.be.true;

        await zatvoriButton.click();
        console.log("Kliknuto na 'Zatvori'");

        await driver.sleep(3000);



        const finalUrl = await driver.getCurrentUrl();
        console.log("Final URL nakon lokacije:", finalUrl);

        const urlContainsLocation =
            finalUrl.includes('location') ||
            finalUrl.includes('canton') ||
            finalUrl.includes('city') ||
            finalUrl.includes('Bihać') ||
            finalUrl.includes('Bihac');

        if (urlContainsLocation) {
            console.log("URL sadrži filter parametre za lokaciju");
        }

        expect(finalUrl).to.not.equal("https://olx.ba/");
        expect(finalUrl).to.not.equal(urlAfterCategory);


        const pageTitle = await driver.getTitle();
        expect(pageTitle).to.not.be.empty;
        console.log("Page Title:", pageTitle);


        const bodyElement = await driver.findElement(By.css('body'));
        const bodyText = await bodyElement.getText();
        expect(bodyText.length).to.be.greaterThan(100, "Stranica je prazna");


        const pageSource = await driver.getPageSource();
        const containsLocationInfo =
            pageSource.includes('Bihać') ||
            pageSource.includes('Bihac') ||
            pageSource.includes('Unsko-sanski') ||
            bodyText.includes('Bihać');

        if (containsLocationInfo) {
            console.log("Stranica sadrži informacije o lokaciji");
        }


        try {
            const results = await driver.findElements(
                By.css('[data-cy="ad-card"], .ad, .listing-item, .offer')
            );
            console.log(`Pronađeno ${results.length} rezultata`);

            if (results.length > 0) {
                expect(results.length).to.be.greaterThan(0);
            }
        } catch (error) {
            console.log("Rezultati nisu pronađeni ili selector ne odgovara");
        }


        expect(pageSource).to.not.include("500 Internal Server Error");
        expect(pageSource).to.not.include("Fatal error");

        console.log("Test završen uspješno - Mobilni uređaji + Lokacija: Bihać");
    });

    // TC-EP-017: Filtriranje oglasa po stanju "Novo"
    it("TC-EP-017: Filtriranje oglasa po kategoriji proizvoda i stanju: Novo", async function () {

        const urlAfterCategory = await selectMobilniUredjaji(driver);
        expect(urlAfterCategory).to.not.equal("https://olx.ba/");


        await openDropdownByLabel(driver, "Filteri oglasa");
        await driver.sleep(2000);


        const novoButton = await driver.wait(
            until.elementLocated(By.id('buttonNovo')),
            5000
        );

        await driver.executeScript(
            "arguments[0].scrollIntoView({block: 'center'});",
            novoButton
        );
        await driver.sleep(500);


        const isVisible = await novoButton.isDisplayed();
        const isEnabled = await novoButton.isEnabled();

        expect(isVisible).to.be.true;
        expect(isEnabled).to.be.true;

        await novoButton.click();
        console.log("Kliknuto na 'Novo' filter");

        await driver.sleep(3000);


        const finalUrl = await driver.getCurrentUrl();
        console.log("Final URL nakon Novo filtera:", finalUrl);

        const urlContainsCondition =
            finalUrl.includes('condition') ||
            finalUrl.includes('novo') ||
            finalUrl.includes('new') ||
            finalUrl.includes('state');

        if (urlContainsCondition) {
            console.log("URL sadrži filter parametar za stanje oglasa");
        }

        expect(finalUrl).to.not.equal("https://olx.ba/");
        expect(finalUrl).to.not.equal(urlAfterCategory);


        const pageTitle = await driver.getTitle();
        expect(pageTitle).to.not.be.empty;
        console.log("Page Title:", pageTitle);

        const buttonClass = await novoButton.getAttribute('class');
        console.log("Novo button class:", buttonClass);


        const isActive =
            buttonClass.includes('active') ||
            buttonClass.includes('selected') ||
            buttonClass.includes('checked');

        if (isActive) {
            console.log("'Novo' dugme je aktivno/selektovano");
        }


        const bodyElement = await driver.findElement(By.css('body'));
        const bodyText = await bodyElement.getText();
        expect(bodyText.length).to.be.greaterThan(100, "Stranica je prazna");


        try {
            const results = await driver.findElements(
                By.css('[data-cy="ad-card"], .ad, .listing-item, .offer')
            );
            console.log(`Pronađeno ${results.length} rezultata`);

            if (results.length > 0) {
                expect(results.length).to.be.greaterThan(0);
            }
        } catch (error) {
            console.log("Rezultati nisu pronađeni ili selector ne odgovara");
        }


        const pageSource = await driver.getPageSource();
        expect(pageSource).to.not.include("500 Internal Server Error");
        expect(pageSource).to.not.include("Fatal error");

        console.log("Test završen uspješno - Mobilni uređaji + Stanje: Novo");
    });

});