const {test, expect} = require('@playwright/test'); //import always

//test.only will only run that test in the file
test('Verify user is able to Naviage to Flipkart page with all Labels and Other Fields are visible',async ({page})=> //basic structure
{

    //Got to url
    await page.goto("https://www.flipkart.com/");

    //assert the title and print the title
    console.log(await page.title());
    await page.title();
    await expect(page).toHaveTitle(/Online Shopping/i);

    //Verify user is able to see core header elements (Travel/Cart links removed from Flipkart's redesigned nav)
    await expect(page.getByLabel("Flipkart")).toBeVisible();
    await expect(page.getByLabel("Login")).toBeVisible();
    await expect(page.locator('input[name="q"], input[type="text"]').first()).toBeVisible();

    //Dismiss Flipkart login modal if present - try multiple strategies
    await page.waitForTimeout(1500);
    const modalDismissed = await page.evaluate(() => {
        //Find any element containing only ✕ or × and click it (close button)
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
        let node;
        while ((node = walker.nextNode())) {
            const txt = node.textContent.trim();
            if (txt === '✕' || txt === '×' || txt === 'x') {
                const el = node.parentElement;
                if (el && el.tagName !== 'SCRIPT' && el.offsetParent !== null) {
                    el.click();
                    return true;
                }
            }
        }
        return false;
    });
    if (!modalDismissed) {
        await page.keyboard.press('Escape');
    }
    await page.waitForTimeout(800);

    //Force-hide any remaining modal/overlay blocking the header
    await page.evaluate(() => {
        document.querySelectorAll('[class*="mcO4kT"],[class*="Overlay"],[class*="modal__"]').forEach(el => {
            if (el.offsetParent !== null) el.style.display = 'none';
        });
    });
    await page.waitForTimeout(300);

    //Hover on Login button to trigger dropdown
    const loginBtn = page.getByLabel("Login");
    await loginBtn.scrollIntoViewIfNeeded();
    await loginBtn.hover();
    await page.waitForTimeout(800);

    //Verify hover dropdown items are visible
    await expect(page.getByText('My Profile')).toBeVisible();
    await expect(page.getByText('Orders')).toBeVisible();
    await expect(page.getByText('Wishlist', {exact:true})).toBeVisible();
    await expect(page.getByRole('link',{name:'Become a Seller',exact:true})).toBeVisible();
    await expect(page.getByText('Notification Preferences')).toBeVisible();

    //Verify On hovering on More as well some options should be visible
    const moreLink = page.getByRole("link",{name:"More", exact: true});
    await moreLink.hover();
    await page.waitForTimeout(400);
    await expect(moreLink).toBeVisible();
    await expect(page.getByRole('link',{name:'Become a Seller',exact:true})).toBeVisible();
    await expect(page.getByRole('link',{name:'Notification Settings'})).toBeVisible();
});