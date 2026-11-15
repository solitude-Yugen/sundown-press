import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
const browser=await chromium.launch({channel:'msedge',headless:true});
try{
const page=await browser.newPage({viewport:{width:1440,height:1000}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
for(const route of ['digital-greetings','printed-keepsakes','weddings','photo-booth']){
const response=await page.goto(`http://127.0.0.1:3002/${route}.html`);assert.equal(response.status(),200);
await page.locator('#design-preview svg').waitFor();
await page.locator('[name=names]').fill('Maya & Dev');assert.ok(await page.locator('#design-preview').innerText().then(x=>x.includes('Maya & Dev')));
await page.locator('[data-theme=rose]').click();assert.equal(await page.locator('[data-theme=rose]').getAttribute('aria-pressed'),'true');
await page.reload();assert.equal(await page.locator('[name=names]').inputValue(),'Maya & Dev');
const download=page.waitForEvent('download');await page.locator('button[type=submit]').click();assert.ok((await download).suggestedFilename().endsWith('.svg'));
await page.screenshot({path:`artifacts/${route}-desktop.png`});
await page.setViewportSize({width:390,height:844});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
await page.locator('#nav-hamburger').click();await page.locator('.mobile-menu').waitFor({state:'visible'});await page.screenshot({path:`artifacts/${route}-mobile-menu.png`});
await page.locator('#nav-hamburger').click();await page.screenshot({path:`artifacts/${route}-mobile.png`});
await page.setViewportSize({width:1440,height:1000});
}
await page.goto('http://127.0.0.1:3002/contact.html');await page.locator('#contact-form').waitFor();
await page.goto('http://127.0.0.1:3002');assert.equal(await page.locator('.nav-links a').first().getAttribute('href'),'digital-greetings.html');
assert.deepEqual(errors,[]);console.log('All collection routes, previews, saved drafts, downloads, mobile layouts, and navigation passed.');
}finally{await browser.close();}
