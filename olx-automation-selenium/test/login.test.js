
// Struktura svakog testa bi trebala izgledati ovako:
// describe('Naslov grupe testova', function() {
//   before(function() {
//     // Kod koji se izvršava jednom prije svih testova
//   });
//   after(function() {
//     // Kod koji se izvršava jednom nakon svih testova
//   });
//   beforeEach(function() {
//     // Kod koji se izvršava prije svakog pojedinačnog testa
//   });
//   afterEach(function() {
//     // Kod koji se izvršava nakon svakog pojedinačnog testa
//   });
//   it('Treba da provjeri specifičnu funkcionalnost', function() {
//     // Logika pojedinačnog testa
//   });
//   it('Treba da provjeri drugu funkcionalnost', function() {
//     // Logika drugog testa
//   });
// });

import { Browser, Builder, By, until } from "selenium-webdriver";
import { expect } from "chai";
describe("iframe Tests", function () {
let driver;
beforeEach(async function () {
    driver = await new Builder().forBrowser(Browser.CHROME).build();
await driver.get("https://the-internet.herokuapp.com/iframe");
await driver.manage().window().maximize();
  });
afterEach(async function () {
await driver.quit();
  });
it("Test iframe", async function () {
let iframeElement = await driver.wait(
      until.elementLocated(By.id("mce_0_ifr")),
      10000
    );
await driver.switchTo().frame(iframeElement);
let iframeBodyElement = await driver.findElement(By.id("tinymce"));
let pElement = await iframeBodyElement.findElement(By.css("p"));
expect(await pElement.getText()).to.equal("Your content goes here.");
  });
});