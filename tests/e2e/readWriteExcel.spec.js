const {test, expect} = require('@playwright/test');
const path = require('path');
const { ExcelHelper } = require('../utils/ExcelHelper');

test('Visit the Website and Download the Excel and read the columns and rows from the Excel', async ({page}) => {

    // Go to url
    await page.goto("https://rahulshettyacademy.com/upload-download-test/");

    // Download Excel file using helper
    const filePath = await ExcelHelper.downloadExcel(
        page, 
        'button:has-text("Download")', 
        'test.xlsx'
    );

    // Read Excel data using helper
    const data = ExcelHelper.readExcel(filePath);
    console.log('Excel data:', data);

    // Verify the columns (header row)
    expect(data[0]).toEqual(['sno', 'fruit_name', 'color', 'price', 'season']);

    // Verify the data rows
    expect(data[1]).toEqual([1, 'Mango', 'Yellow', 299, 'Summer']);
    expect(data[2]).toEqual([2, 'Apple', 'Red', 345, 'Winter']);
    expect(data[3]).toEqual([3, 'Papaya', 'Orange', 187, 'Spring']);

    console.log('✅ Excel data verified successfully');

    // Create updated data dynamically
    const newData = [
        ['sno', 'fruit_name', 'color', 'price', 'season'], // Header row
        [1, 'Tester', 'Pink', 500, 'Rainy'],
        [2, 'Grapes', 'Purple', 150, 'Hot'],
        [3, 'Blueberries', 'Blue', 200, 'Summer']
    ];
    
    // Write updated Excel using helper
    const downloadsPath = path.join(__dirname, '../downloads');
    const updatedFilePath = path.join(downloadsPath, 'test_updated.xlsx');
    ExcelHelper.writeExcel(newData, updatedFilePath, 'Sheet1');

    // Upload the updated file using helper
    await ExcelHelper.uploadExcel(page, updatedFilePath);
    
    // Wait for upload to complete and table to update
    await page.waitForTimeout(3000);
    
    // Verify the updated content is visible in the table
    await expect(page.getByText('Tester')).toBeVisible();
    await expect(page.getByText('Pink')).toBeVisible();
    await expect(page.getByText('500')).toBeVisible();
    await expect(page.getByText('Grapes')).toBeVisible();
    await expect(page.getByText('Purple')).toBeVisible();
    await expect(page.getByText('150')).toBeVisible();
    await expect(page.getByText('Blueberries')).toBeVisible();
    await expect(page.getByText('200')).toBeVisible();
    
    console.log('✅ Upload and verification completed successfully');
});

test('Advanced Excel operations using helper functions', async ({page}) => {
    
    // Go to url
    await page.goto("https://rahulshettyacademy.com/upload-download-test/");

    // Download Excel file
    const filePath = await ExcelHelper.downloadExcel(
        page, 
        'button:has-text("Download")', 
        'advanced_test.xlsx'
    );

    // Read as JSON objects
    const jsonData = ExcelHelper.readExcelAsJSON(filePath);
    console.log('JSON Data:', jsonData);

    // Find specific value
    const searchResult = ExcelHelper.findValue(filePath, 'Mango');
    expect(searchResult).not.toBeNull();
    expect(searchResult.row).toBe(1);

    // Get specific column (fruit names)
    const fruitNames = ExcelHelper.getColumn(filePath, 1);
    console.log('Fruit names:', fruitNames);
    expect(fruitNames).toContain('Mango');
    expect(fruitNames).toContain('Apple');

    // Filter data (fruits with price > 200)
    const expensiveFruits = ExcelHelper.filterData(filePath, (row) => row[3] > 200);
    console.log('Expensive fruits:', expensiveFruits);
    expect(expensiveFruits.length).toBeGreaterThan(1); // Header + at least 1 row

    // Add new row dynamically
    const downloadsPath = path.join(__dirname, '../downloads');
    const newFilePath = path.join(downloadsPath, 'with_new_row.xlsx');
    ExcelHelper.addRow(filePath, [4, 'Watermelon', 'Green', 80, 'Summer'], newFilePath);

    // Verify new row was added
    const updatedData = ExcelHelper.readExcel(newFilePath);
    expect(updatedData[updatedData.length - 1]).toEqual([4, 'Watermelon', 'Green', 80, 'Summer']);

    console.log('✅ Advanced Excel operations completed successfully');
});

test('Create Excel from JSON and upload', async ({page}) => {
    
    // Go to url
    await page.goto("https://rahulshettyacademy.com/upload-download-test/");

    // Create data as JSON objects
    const jsonData = [
        { sno: 1, fruit_name: 'Kiwi', color: 'Brown', price: 120, season: 'Winter' },
        { sno: 2, fruit_name: 'Strawberry', color: 'Red', price: 250, season: 'Spring' },
        { sno: 3, fruit_name: 'Pineapple', color: 'Yellow', price: 180, season: 'Summer' }
    ];

    // Write JSON to Excel
    const downloadsPath = path.join(__dirname, '../downloads');
    const jsonFilePath = path.join(downloadsPath, 'from_json.xlsx');
    ExcelHelper.writeExcelFromJSON(jsonData, jsonFilePath, 'Fruits');

    // Upload the file
    await ExcelHelper.uploadExcel(page, jsonFilePath);
    
    // Wait for upload
    await page.waitForTimeout(3000);
    
    // Verify uploaded data
    await expect(page.getByText('Kiwi')).toBeVisible();
    await expect(page.getByText('Strawberry')).toBeVisible();
    await expect(page.getByText('Pineapple')).toBeVisible();
    
    console.log('✅ JSON to Excel conversion and upload completed successfully');
});
