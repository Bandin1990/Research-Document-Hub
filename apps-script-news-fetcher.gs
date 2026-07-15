const NEWS_SHEET_NAME = "ข่าวสาร";
const SOURCE_SHEET_NAME = "แหล่งข่าวอัตโนมัติ";
const TIMEZONE = "Asia/Bangkok";
const MAX_ITEMS_PER_SOURCE = 3;
const MAX_TOTAL_ITEMS = 36;

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu("Portal ข่าวสาร")
    .addItem("ดึงข่าวตอนนี้", "fetchNewsNow")
    .addItem("ตั้งเวลาดึงข่าว 09.00 น.", "installDailyNewsTrigger")
    .addToUi();
}

function installDailyNewsTrigger() {
  ScriptApp.getProjectTriggers()
    .filter((trigger) => trigger.getHandlerFunction() === "fetchNewsNow")
    .forEach((trigger) => ScriptApp.deleteTrigger(trigger));

  ScriptApp.newTrigger("fetchNewsNow")
    .timeBased()
    .everyDays(1)
    .atHour(9)
    .nearMinute(0)
    .inTimezone(TIMEZONE)
    .create();
}

function fetchNewsNow() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const newsSheet = spreadsheet.getSheetByName(NEWS_SHEET_NAME);
  const sourceSheet = spreadsheet.getSheetByName(SOURCE_SHEET_NAME);

  if (!newsSheet || !sourceSheet) {
    throw new Error("ไม่พบแท็บข่าวสารหรือแท็บแหล่งข่าวอัตโนมัติ");
  }

  const sources = readSources_(sourceSheet);
  const existingKeys = new Set();
  const items = [];

  sources.forEach((source) => {
    fetchFeedItems_(source).slice(0, MAX_ITEMS_PER_SOURCE).forEach((item) => {
      const key = normalizeKey_(item.url || item.title);
      if (!key || existingKeys.has(key)) return;
      existingKeys.add(key);
      items.push([
        item.date,
        source.name,
        source.category,
        item.title,
        item.summary,
        item.url,
        source.area,
        source.relevance,
        "ดึงอัตโนมัติ"
      ]);
    });
  });

  const header = [
    "วันที่เผยแพร่/ตรวจพบ",
    "แหล่งข่าว",
    "หมวด",
    "หัวข้อข่าว/ช่องทาง",
    "สรุปสาระ",
    "ลิงก์",
    "พื้นที่",
    "ความเกี่ยวข้องกับงาน",
    "สถานะตรวจสอบ"
  ];

  const output = [header].concat(items.slice(0, MAX_TOTAL_ITEMS));
  newsSheet.clearContents();
  newsSheet.getRange(1, 1, output.length, header.length).setValues(output);
  newsSheet.getRange(1, 1, 1, header.length).setFontWeight("bold").setBackground("#4f46e5").setFontColor("#ffffff");
  newsSheet.setFrozenRows(1);
}

function readSources_(sheet) {
  const values = sheet.getDataRange().getValues();
  return values.slice(1)
    .filter((row) => String(row[0]).toUpperCase() === "TRUE" && row[4])
    .map((row) => ({
      name: String(row[1] || "").trim(),
      category: String(row[2] || "").trim(),
      area: String(row[3] || "").trim(),
      url: String(row[4] || "").trim(),
      keywords: String(row[5] || "").split(",").map((word) => word.trim().toLowerCase()).filter(Boolean),
      relevance: String(row[6] || "").trim()
    }));
}

function fetchFeedItems_(source) {
  try {
    const response = UrlFetchApp.fetch(source.url, {
      muteHttpExceptions: true,
      followRedirects: true,
      headers: { "User-Agent": "ResearchPortalNewsBot/1.0" }
    });

    if (response.getResponseCode() >= 400) return [];

    const document = XmlService.parse(response.getContentText());
    const root = document.getRootElement();
    const channel = root.getChild("channel");
    const entries = channel ? channel.getChildren("item") : root.getChildren("entry", root.getNamespace());

    return entries.map((entry) => parseEntry_(entry, source))
      .filter((item) => item.title && item.url)
      .filter((item) => matchesKeywords_(item, source.keywords))
      .sort((a, b) => b.timestamp - a.timestamp);
  } catch (error) {
    return [];
  }
}

function parseEntry_(entry, source) {
  const title = cleanText_(childText_(entry, "title"));
  const summary = cleanText_(childText_(entry, "description") || childText_(entry, "summary") || childText_(entry, "content")).slice(0, 280);
  const link = extractLink_(entry);
  const published = childText_(entry, "pubDate") || childText_(entry, "published") || childText_(entry, "updated");
  const date = published ? new Date(published) : new Date();
  const safeDate = Number.isNaN(date.getTime()) ? new Date() : date;

  return {
    title,
    summary: summary || "อ่านรายละเอียดจากแหล่งข่าวต้นทาง",
    url: link,
    date: Utilities.formatDate(safeDate, TIMEZONE, "dd/MM/yyyy HH:mm"),
    timestamp: safeDate.getTime(),
    source: source.name
  };
}

function childText_(entry, childName) {
  const direct = entry.getChild(childName);
  if (direct) return direct.getText();

  const namespace = entry.getNamespace();
  const namespaced = entry.getChild(childName, namespace);
  return namespaced ? namespaced.getText() : "";
}

function extractLink_(entry) {
  const link = entry.getChild("link") || entry.getChild("link", entry.getNamespace());
  if (!link) return "";

  const href = link.getAttribute("href");
  if (href) return href.getValue();

  return cleanText_(link.getText());
}

function matchesKeywords_(item, keywords) {
  if (!keywords.length) return true;
  const haystack = `${item.title} ${item.summary}`.toLowerCase();
  return keywords.some((keyword) => haystack.includes(keyword));
}

function cleanText_(value) {
  return String(value || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeKey_(value) {
  return String(value || "").trim().toLowerCase().replace(/^https?:\/\/(www\.)?/, "");
}
