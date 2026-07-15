# ระบบจัดการและติดตามบันทึก

ชุดไฟล์นี้เตรียมไว้สำหรับอัปขึ้น GitHub Pages

## ไฟล์ในชุดนี้

- `index.html` หน้าเว็บหลัก
- `config.js` ไฟล์ตั้งค่าลิงก์ Google Sheet และ OneDrive
- `.nojekyll` ไฟล์เปล่าสำหรับ GitHub Pages

## Google Sheet ที่เชื่อมอยู่

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
```

ถ้าเปลี่ยน Google Sheet ให้คัดลอก ID จาก URL ตรงส่วนหลัง `/d/` และก่อน `/edit`

