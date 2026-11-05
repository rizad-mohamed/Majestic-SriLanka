const { chromium } = await import('@playwright/test');
const browser = await chromium.launch({channel:'msedge'});
const page = await browser.newPage();
await page.goto('http://127.0.0.1:4327/tours/');
for (const width of [1440,768,390]) {
 await page.setViewportSize({width,height:900});
 await page.locator('[data-guest-gallery]').scrollIntoViewIfNeeded();
 await page.waitForTimeout(1000);
 await page.screenshot({path:`docs/gallery/gallery-${width}.png`});
 console.log(width, await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,loaded:[...document.querySelectorAll('.guest-gallery-group:first-child img')].filter(i=>i.getBoundingClientRect().left<innerWidth).every(i=>i.complete&&i.naturalWidth)})));
}
const v=page.locator('.guest-gallery-window');
const a=await v.evaluate(e=>e.scrollLeft);await page.waitForTimeout(800);if(await v.evaluate(e=>e.scrollLeft)<=a)throw Error('Autoflow failed');
await page.getByRole('button',{name:'Pause gallery',exact:true}).click();const b=await v.evaluate(e=>e.scrollLeft);await page.waitForTimeout(400);if(await v.evaluate(e=>e.scrollLeft)!==b)throw Error('Pause failed');
await page.emulateMedia({reducedMotion:'reduce'});await page.getByRole('button',{name:'Play gallery',exact:true}).click();const c=await v.evaluate(e=>e.scrollLeft);await page.waitForTimeout(400);if(await v.evaluate(e=>e.scrollLeft)!==c)throw Error('Reduced motion failed');
console.log('Autoflow, pause, reduced motion passed');await browser.close();
