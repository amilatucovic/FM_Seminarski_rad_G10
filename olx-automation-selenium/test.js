import { Builder, Browser, By } from "selenium-webdriver";
async function helloSelenium() {
    let driver = await new Builder().forBrowser(Browser.CHROME).build();
    await driver.get("https://www.demoblaze.com");
    await driver.manage().window().maximize();
    // let usernameField = await driver.findElement(By.id("loginusername"));
    // await usernameField.click();
    // await usernameField.clear();
    // await usernameField.sendKeys("admin");

    // let usernameField = inputElements[5];
    // await usernameField.click();
    // await usernameField.clear();
    // await usernameField.sendKeys("admin");



    await driver.quit();
}
helloSelenium();
