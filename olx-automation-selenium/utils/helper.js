import { By, until } from "selenium-webdriver";

export async function setMobileViewport(driver) {
  await driver.manage().window().setRect({
    width: 430,   // iPhone 14 Pro Max dimenzije
    height: 932,
    x: 0,
    y: 0
  });
};

export async function closeCookiePopup(driver) {
  try {
    await driver.sleep(3000); 

    const acceptButton = await driver.wait(
      until.elementLocated(By.id('accept-btn')),
      15000
    );
    
    await driver.wait(until.elementIsVisible(acceptButton), 5000);
    
    await driver.executeScript("arguments[0].scrollIntoView(true);", acceptButton);
    await driver.sleep(500);
    
    await acceptButton.click();
    
    console.log("Cookie popup zatvoren");
    await driver.sleep(2000); 
    
  } catch (error) {
    console.log("Cookie popup nije pronađen:", error. message);
    try {
      const altButton = await driver.findElement(
        By.xpath("//button[contains(., 'SLAŽEM SE')]")
      );
      await altButton.click();
      console.log("Cookie popup zatvoren (alternativni selector)");
      await driver.sleep(2000);
    } catch (err) {
      console.log("Cookie popup nije dostupan - nastavljam test");
    }
  }
};


export async function waitForElement(driver, locator, timeout = 10000) {
  return await driver.wait(until.elementLocated(locator), timeout);
};


export async function waitForElementInteractable(driver, locator, timeout = 10000) {
  const element = await driver.wait(until.elementLocated(locator), timeout);
  await driver.wait(until.elementIsVisible(element), timeout);
  await driver.wait(until.elementIsEnabled(element), timeout);
  return element;
};


export async function clickElement(driver, locator, timeout = 10000) {
  const element = await waitForElementInteractable(driver, locator, timeout);
  
  await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", element);
  await driver.sleep(500);
  
  await element.click();
};


export async function scrollToElement(driver, element) {
  await driver.executeScript("arguments[0].scrollIntoView(true);", element);
  await driver.sleep(500);
};


export async function inputText(driver, locator, text, timeout = 10000) {
  const element = await waitForElementInteractable(driver, locator, timeout);
  await element.clear();
  await element.sendKeys(text);
};


export async function findOlxSearchInput(driver, timeout = 15000) {
 
  await driver.sleep(1000);
  
  const searchInput = await driver.wait(
    until.elementLocated(By.css('.main-search')),
    timeout
  );
  
  await driver.wait(until.elementIsVisible(searchInput), timeout);
  await driver.wait(until.elementIsEnabled(searchInput), timeout);
  
  await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", searchInput);
  await driver.sleep(500);

  await driver.executeScript("arguments[0].focus();", searchInput);
  await driver.sleep(300);
  
  return searchInput;
};

/**
 * @param {WebDriver} driver 
 * @returns {Promise<string>} 
 */
export async function selectMobilniUredjaji(driver) {
  await driver.executeScript("window.scrollBy(0, 200);");
  await driver.sleep(1000);

  const mobilniUredjajiIcon = await driver.wait(
    until.elementLocated(By.css('.svg-wrapper.cat-color5')),
    10000
  );

  await driver.executeScript(
    "arguments[0].scrollIntoView({block: 'center'});",
    mobilniUredjajiIcon
  );
  await driver.sleep(500);
  await mobilniUredjajiIcon.click();
  console.log("Kliknuto na Mobilni uređaji");

  await driver.sleep(3000);

  const urlAfterCategory = await driver.getCurrentUrl();
  console.log("URL nakon kategorije:", urlAfterCategory);

  return urlAfterCategory;
}

/**
 * @param {WebDriver} driver 
 * @param {string} labelText 
 */
export async function openDropdownByLabel(driver, labelText) {
  const allDivs = await driver.findElements(By.css('div'));
  
  for (const div of allDivs) {
    try {
      const text = await div.getText();
      if (text.trim() === labelText) {
        const className = await div.getAttribute('class');
        if (className && className.includes('cursor-pointer')) {
          await driver.executeScript("arguments[0]. scrollIntoView({block: 'center'});", div);
          await driver.sleep(500);
          await div. click();
          console.log(`Dropdown "${labelText}" otvoren`);
          await driver.sleep(1500);
          return;
        }
      }
    } catch (e) {
      continue;
    }
  }
  
  throw new Error(`Dropdown "${labelText}" nije pronađen`);
}