# Formalne metode - Seminarski rad - Grupa 10

## 📘 Opis projekta

Ovaj repozitorij sadrži **seminarski rad iz predmeta Formalne metode**, čiji je cilj bio praktična primjena **formalnih testnih tehnika** na realnoj web aplikaciji, kao i automatizacija testnih slučajeva korištenjem alata obrađenih na predavanjima.

Kao predmet testiranja odabrana je **web aplikacija OLX.ba (responsive view)**, dok je fokusirana funkcionalnost bila **pretraga oglasa**.

---

## 📝 Testni slučajevi

- Svi testni slučajevi su napisani kao **low-level test cases**
- Testni slučajevi su dokumentovani u Excel fajlu **FM_G10_Low_level_test_cases**
- Detaljna dokumentacija i analiza primijenjenih testnih tehnika nalazi se u fajlu **FM_G10_Seminarski_rad_dokumentacija**

---

## 🤖 Automatizacija testiranja

Automatizacija je rađena nad funkcionalnošću **pretrage oglasa** koristeći:

- **Selenium WebDriver**
- **JavaScript**
- **Mocha testing framework**

### Karakteristike automatizacije:
- Automatizirano je **10 testnih slučajeva**
- Svaki test je zaseban (`it` blok)
- Svaki test sadrži validaciju (`assert`)

---

## 🐞 Prijava defekata

- Svi pronađeni defekti su dokumentovani korištenjem **šablona za prijavu defekata**
- Prijavljeno je **7** defekata

---

## ⚙️ Upute za pokretanje automatizovanih testova

### 1. Kloniranje repozitorija
```bash
git clone https://github.com/amilatucovic/FM_Seminarski_rad_G10.git
```
### 2. Ulazak u automation folder
```bash
cd FM_Seminarski_rad_G10/olx-automation-selenium
```
### 3. Instalacija zavisnosti
Potrebno je imati instaliran Node.js (verzija 16+).
```bash
npm install
```
### 4. Pokretanje testova
```bash
npm test
```
Napomena:

 - Prije pokretanja testova provjeriti da li je internet konekcija aktivna

 - Chrome browser mora biti instaliran

---
👥 Autori

 - Amila Tucović

 - Selma Alagić

 - Benjamin Muratović
---

- Fakultet informacijskih tehnologija, Univerzitet "Džemal Bijedić" u Mostaru
- Akademska godina: 2025/2026.







