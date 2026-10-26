const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');

const DOWNLOADS_DIR = path.join(__dirname, '../../downloads');

class ExcelHelper {
    static async downloadExcel(page, buttonSelector, fileName) {
        if (!fs.existsSync(DOWNLOADS_DIR)) {
            fs.mkdirSync(DOWNLOADS_DIR, { recursive: true });
        }
        const [download] = await Promise.all([
            page.waitForEvent('download'),
            page.click(buttonSelector),
        ]);
        const filePath = path.join(DOWNLOADS_DIR, fileName);
        await download.saveAs(filePath);
        return filePath;
    }

    static readExcel(filePath) {
        const workbook = XLSX.readFile(filePath);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        return XLSX.utils.sheet_to_json(sheet, { header: 1 });
    }

    static readExcelAsJSON(filePath) {
        const workbook = XLSX.readFile(filePath);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        return XLSX.utils.sheet_to_json(sheet);
    }

    static findValue(filePath, value) {
        const data = ExcelHelper.readExcel(filePath);
        for (let row = 1; row < data.length; row++) {
            for (let col = 0; col < data[row].length; col++) {
                if (data[row][col] === value) {
                    return { row, col, value };
                }
            }
        }
        return null;
    }

    static getColumn(filePath, colIndex) {
        const data = ExcelHelper.readExcel(filePath);
        return data.slice(1).map(row => row[colIndex]);
    }

    static filterData(filePath, filterFn) {
        const data = ExcelHelper.readExcel(filePath);
        return data.filter((row, index) => index === 0 || filterFn(row));
    }

    static writeExcel(data, filePath, sheetName = 'Sheet1') {
        const dir = path.dirname(filePath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        const workbook = XLSX.utils.book_new();
        const sheet = XLSX.utils.aoa_to_sheet(data);
        XLSX.utils.book_append_sheet(workbook, sheet, sheetName);
        XLSX.writeFile(workbook, filePath);
    }

    static writeExcelFromJSON(jsonData, filePath, sheetName = 'Sheet1') {
        const dir = path.dirname(filePath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        const workbook = XLSX.utils.book_new();
        const sheet = XLSX.utils.json_to_sheet(jsonData);
        XLSX.utils.book_append_sheet(workbook, sheet, sheetName);
        XLSX.writeFile(workbook, filePath);
    }

    static addRow(filePath, newRow, outputPath) {
        const data = ExcelHelper.readExcel(filePath);
        data.push(newRow);
        ExcelHelper.writeExcel(data, outputPath);
    }

    static async uploadExcel(page, filePath) {
        const fileInput = page.locator('input[type="file"]');
        await fileInput.setInputFiles(filePath);
    }
}

module.exports = { ExcelHelper };
