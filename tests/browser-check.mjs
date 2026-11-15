import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
import { mkdirSync } from 'node:fs';
mkdirSync('artifacts', {recursive:true});
const browser = await chromium.launch({channel:'msedge',headless:true});
const errors=[];
const page=await browser.newPage({viewport:{width:1440,height:1000}});
page.on('pageerror',e=>errors.push(e.message));
await page.goto(process.env.PREVIEW_URL || 'http://127.0.0.1:3000');
await page.locator('.cat-open').waitFor();
await page.waitForFunction(() => window.sundownLoaded === true);
await page.waitForTimeout(180);
const arrivalWidth = (await page.locator('.cat-book').boundingBox()).width;
await page.screenshot({path:'artifacts/hero-arrival.png'});
await page.waitForFunction(()=>document.querySelector('#hero')?.dataset.state==='closed',{timeout:20000});
const closedWidth = (await page.locator('.cat-book').boundingBox()).width;
assert.ok(closedWidth > arrivalWidth * 1.5, 'arrival should visibly fly and zoom toward the viewer');
await page.screenshot({path:'artifacts/hero-closed.png'});
await page.locator('.cat-open').click();
await page.waitForTimeout(600);
await page.screenshot({path:'artifacts/hero-opening.png'});
await page.waitForFunction(()=>document.querySelector('#hero')?.classList.contains('is-open'));
await page.waitForTimeout(400);
async function assertVisibleBook() {
  const state = await page.locator('.cat-book').evaluate(el => ({opacity: Number(getComputedStyle(el.parentElement).opacity), transform: el.style.transform, top: document.querySelector('.cat-pin').getBoundingClientRect().top, background: getComputedStyle(document.querySelector('.cat-pin')).backgroundColor}));
  assert.equal(state.opacity, 1, 'catalogue must remain visible after opening and flipping');
  assert.ok(Math.abs(state.top) < 1, 'catalogue must stay pinned in view');
  assert.ok(state.transform.includes('rotateX(0deg) rotateY(0deg)'), 'open book must stay upright');
  assert.notEqual(state.background, 'rgb(245, 240, 225)', 'hero must retain its dark background');
}
await assertVisibleBook();
assert.equal(await page.locator('#main-nav').evaluate(el => getComputedStyle(el).backgroundColor), 'rgba(0, 0, 0, 0)');
async function seek(p) { await page.evaluate(p=>{document.documentElement.style.scrollBehavior='auto';let el=document.querySelector('#hero');window.scrollTo({top:el.getBoundingClientRect().top+scrollY+(el.offsetHeight-innerHeight)*p/7,behavior:'instant'});},p);await page.waitForTimeout(160); }
for(const p of [0,1,2,3,4,5.6,6.5,7,3,1,4.8,0]) { await seek(p); if(p < 6) await assertVisibleBook(); }
await seek(5.6);
const finalPages = await page.locator('.cat-paper').evaluateAll(els => els.map(el => el.style.transform));
for (const p of [6, 6.25, 6.5, 6.75]) {
  await seek(p);
  assert.deepEqual(await page.locator('.cat-paper').evaluateAll(els => els.map(el => el.style.transform)), finalPages, 'exit must not fold the turned pages back');
  assert.ok((await page.locator('.cat-book').getAttribute('style')).includes('rotateY(0deg)'), 'exit must not spin the spread');
  await page.screenshot({path:`artifacts/hero-exit-${p}.png`});
}
await seek(0);
assert.equal(await page.locator('#hero').getAttribute('data-state'),'active');
await seek(1.6);await page.screenshot({path:'artifacts/hero-turn.png'});
await seek(2);await page.screenshot({path:'artifacts/hero-open.png'});
await page.locator('.cat-navigation button').first().focus();await page.keyboard.press('Home');await page.waitForTimeout(1300);
assert.equal(await page.locator('#hero').getAttribute('data-state'),'active');
await seek(7);await page.mouse.wheel(0,900);await page.waitForTimeout(500);
assert.ok(await page.locator('.marquee-section').evaluate(el=>el.getBoundingClientRect().top<innerHeight));
await page.setViewportSize({width:390,height:844});await seek(0);
await page.screenshot({path:'artifacts/hero-mobile.png'});
const mobileBook = await page.locator('.cat-book').boundingBox();
assert.ok(mobileBook.width > 280, 'mobile page should be large enough to read');
assert.ok(Math.abs(mobileBook.x + mobileBook.width / 2 - 195) < 2, 'mobile page should be centered');
assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
assert.equal(await page.locator('#floatingWhatsappBtn').evaluate(el => getComputedStyle(el).visibility), 'hidden', 'floating chat must not cover catalogue controls');
await page.locator('.cat-content').dispatchEvent('touchstart',{touches:[{identifier:1,clientX:300,clientY:300}]});
await page.locator('.cat-content').dispatchEvent('touchend',{changedTouches:[{identifier:1,clientX:100,clientY:305}]});
await page.waitForTimeout(1300);
await page.waitForFunction(()=>document.querySelector('.cat-caption').innerText.includes('02'), {timeout:5000});
await page.emulateMedia({reducedMotion:'reduce'});await page.waitForTimeout(100);await seek(2);
assert.ok((await page.locator('#hero').getAttribute('class')).includes('is-reduced'));
await page.screenshot({path:'artifacts/hero-reduced.png'});
assert.deepEqual(errors, []);
console.log(JSON.stringify({passed:true,errors}));await browser.close();




