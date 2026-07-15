# Portal กลุ่มงานวิจัยและวิชาการสิทธิมนุษยชน

ชุดไฟล์นี้เตรียมไว้สำหรับอัปขึ้น GitHub Pages

## ไฟล์ในชุดนี้

- `index.html` หน้าเว็บหลัก
- `config.js` ไฟล์ตั้งค่าลิงก์ Google Sheet, OneDrive และฐานข้อมูล Portal
- `apps-script-news-fetcher.gs` สคริปต์ Google Apps Script สำหรับดึงข่าวอัตโนมัติทุกวัน
- `.nojekyll` ไฟล์เปล่าสำหรับ GitHub Pages

## Google Sheet ที่เชื่อมอยู่

ฐานข้อมูล Portal:

```text
https://docs.google.com/spreadsheets/d/1OUTHRobKJZ2HG7qDMIWekcmuuk9JrDKnJlJsLnKqETg/edit?usp=sharing
```

แท็บที่ใช้ในฐานข้อมูล Portal:

- `ข่าวสาร`
- `แหล่งข่าวอัตโนมัติ`
- `โปรเจกต์`
- `เครื่องมือสนับสนุน`
- `แหล่งค้นคว้า`
- `คลัง Prompt`

## ตั้งค่าดึงข่าวอัตโนมัติ 09.00 น.

1. เปิดฐานข้อมูล Portal ใน Google Sheet
2. ไปที่ Extensions > Apps Script
3. วางโค้ดจากไฟล์ `apps-script-news-fetcher.gs`
4. กด Save
5. เลือกฟังก์ชัน `installDailyNewsTrigger` แล้วกด Run
6. อนุญาตสิทธิ์ครั้งแรก
7. หลังจากนั้นระบบจะดึงข่าวทุกวันประมาณ 09.00 น. ตามเวลาไทย

ถ้าต้องการทดสอบทันที ให้เลือกฟังก์ชัน `fetchNewsNow` แล้วกด Run ข้อมูลจะถูกเขียนลงแท็บ `ข่าวสาร`

ทะเบียนติดตามงาน:

```text
https://docs.google.com/spreadsheets/d/1KADy8kQ0sUepq3S1vPl5FirBDHqlMHVpukoWhWz463U/edit?usp=sharing
```

ทางลัดโฟลเดอร์:

```text
https://docs.google.com/spreadsheets/d/1D3kZi1tDUZHDLidw01-arkNJn8uoGiJ9_HGPmdCnrR8/edit?usp=sharing
```

## เงื่อนไขสำคัญ

ต้องตั้งค่า Google Sheet ให้คนที่เปิดหน้าเว็บเข้าถึงได้ อย่างน้อยเป็น `Anyone with the link can view` หรือแชร์ให้คนในทีมที่ต้องใช้งาน

ถ้า Sheet ไม่เปิดสิทธิ์ให้ดู หน้าเว็บบน GitHub Pages จะโหลดข้อมูลจากชีตไม่ได้

## วิธีอัปขึ้น GitHub Pages แบบง่าย

1. สร้าง repository ใหม่ใน GitHub
2. อัปโหลดไฟล์ `index.html`, `config.js`, `.nojekyll`, และ `README.md`
3. ไปที่ Settings > Pages
4. เลือก Deploy from a branch
5. เลือก branch `main` และ folder `/root`
6. รอ GitHub สร้างลิงก์เว็บ

## วิธีแก้ลิงก์ภายหลัง

เปิด `config.js` แล้วแก้ค่าเหล่านี้:

```javascript
window.RESEARCH_DOC_TRACKER_URL
window.RESEARCH_DOC_TRACKER_ID
window.RESEARCH_DOC_TRACKER_SHEET
window.RESEARCH_DOC_FOLDER_SHEET_URL
window.RESEARCH_DOC_FOLDER_SHEET_ID
window.RESEARCH_DOC_FOLDER_SHEET_NAME
window.RESEARCH_PORTAL_DB_URL
window.RESEARCH_PORTAL_DB_ID
window.RESEARCH_PORTAL_NEWS_SHEET
window.RESEARCH_PORTAL_PROJECTS_SHEET
window.RESEARCH_PORTAL_TOOLS_SHEET
window.RESEARCH_PORTAL_RESEARCH_SHEET
window.RESEARCH_PORTAL_PROMPTS_SHEET
```

ถ้าเปลี่ยน Google Sheet ให้คัดลอก ID จาก URL ตรงส่วนหลัง `/d/` และก่อน `/edit`
