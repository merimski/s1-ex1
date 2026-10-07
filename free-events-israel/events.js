// נתוני דוגמה. כל אירוע מוגדר לפי מספר ימים מהיום (daysFromNow),
// כדי שהרשימה תמיד תציג אירועים קרובים. כשתחברו מקור נתונים אמיתי,
// אפשר להחליף את daysFromNow בשדה date בפורמט YYYY-MM-DD.
window.REGIONS = ["צפון", "חיפה והקריות", "שרון", "מרכז", "ירושלים", "שפלה", "דרום", "אילת והערבה"];

window.CATEGORIES = ["מוזיקה", "תיאטרון ומחול", "הרצאות", "סיורים", "משפחה וילדים", "ספורט", "אמנות ותערוכות", "קולנוע", "שווקים ופסטיבלים", "סדנאות"];

window.EVENTS = [
  { title: "קונצרט ג'אז בפארק", description: "ערב ג'אז פתוח על הדשא, הביאו שמיכה ופיקניק.", daysFromNow: 0, time: "19:30", city: "תל אביב-יפו", venue: "פארק הירקון", region: "מרכז", category: "מוזיקה", kids: true },
  { title: "סיור מודרך בעיר העתיקה", description: "סיור רגלי בסמטאות העיר העתיקה עם מדריך מוסמך.", daysFromNow: 1, time: "10:00", city: "ירושלים", venue: "שער יפו", region: "ירושלים", category: "סיורים", kids: false },
  { title: "שעת סיפור לפעוטות", description: "סיפורים, שירים ויצירה לגילאי 2–6.", daysFromNow: 1, time: "17:00", city: "חיפה", venue: "הספרייה העירונית", region: "חיפה והקריות", category: "משפחה וילדים", kids: true },
  { title: "ריצת בוקר קבוצתית", description: "ריצה של 5 ק\"מ לאורך החוף, לכל הרמות.", daysFromNow: 2, time: "06:30", city: "נתניה", venue: "טיילת נתניה", region: "שרון", category: "ספורט", kids: false },
  { title: "תערוכת צילום מקומית", description: "תערוכה של צלמים צעירים מהאזור. כניסה חופשית.", daysFromNow: 2, time: "11:00", city: "באר שבע", venue: "בית הקהילה", region: "דרום", category: "אמנות ותערוכות", kids: true },
  { title: "הרצאה: כוכבים מעל המדבר", description: "הרצאה על אסטרונומיה ותצפית כוכבים בטלסקופים.", daysFromNow: 3, time: "20:00", city: "מצפה רמון", venue: "מרכז המבקרים", region: "דרום", category: "הרצאות", kids: true },
  { title: "שוק אמנים", description: "דוכני אמנים ויוצרים מקומיים, מוזיקה חיה.", daysFromNow: 4, time: "10:00", city: "נהלל", venue: "מרכז המושב", region: "צפון", category: "שווקים ופסטיבלים", kids: true },
  { title: "סדנת יוגה על החוף", description: "שיעור יוגה פתוח בשקיעה. הביאו מזרן.", daysFromNow: 4, time: "17:30", city: "אילת", venue: "החוף הצפוני", region: "אילת והערבה", category: "ספורט", kids: false },
  { title: "קולנוע תחת כיפת השמיים", description: "הקרנת סרט קלאסי עם כתוביות בעברית.", daysFromNow: 5, time: "20:30", city: "רחובות", venue: "הפארק המרכזי", region: "שפלה", category: "קולנוע", kids: true },
  { title: "מופע מחול רחוב", description: "להקת מחול צעירה במופע פתוח במרחב הציבורי.", daysFromNow: 6, time: "18:00", city: "רמת גן", venue: "כיכר העירייה", region: "מרכז", category: "תיאטרון ומחול", kids: true },
  { title: "סדנת קרמיקה למתחילים", description: "היכרות עם עבודה באבניים. מספר המקומות מוגבל, יש להירשם מראש.", daysFromNow: 7, time: "16:00", city: "כפר סבא", venue: "המתנ\"ס העירוני", region: "שרון", category: "סדנאות", kids: false },
  { title: "פסטיבל אוכל רחוב", description: "הכניסה חופשית, ויש דוכנים ומופעים לאורך כל היום.", daysFromNow: 9, time: "12:00", city: "עכו", venue: "הנמל", region: "צפון", category: "שווקים ופסטיבלים", kids: true },
  { title: "קונצרט קאמרי בספרייה", description: "רביעיית מיתרים מנגנת יצירות קלאסיות.", daysFromNow: 11, time: "19:00", city: "ירושלים", venue: "הספרייה הלאומית", region: "ירושלים", category: "מוזיקה", kids: false },
  { title: "יום כיף משפחתי", description: "מתנפחים, הפעלות ומופע לילדים.", daysFromNow: 13, time: "10:00", city: "אשדוד", venue: "פארק אשדוד ים", region: "דרום", category: "משפחה וילדים", kids: true },
  { title: "סיור טבע: נחל עמוד", description: "מסלול מעגלי של 6 ק\"מ עם מדריך טבע.", daysFromNow: 15, time: "08:00", city: "צפת", venue: "חניון המסלול", region: "צפון", category: "סיורים", kids: true },
  { title: "הרצאה: היסטוריה של יפו", description: "הרצאה פתוחה לקהל הרחב, בליווי מצגת.", daysFromNow: 18, time: "19:30", city: "תל אביב-יפו", venue: "המרכז הקהילתי", region: "מרכז", category: "הרצאות", kids: false },
  { title: "ג'אם סשן פתוח", description: "מוזמנים להביא כלי ולהצטרף לנגינה.", daysFromNow: 21, time: "21:00", city: "חיפה", venue: "המושבה הגרמנית", region: "חיפה והקריות", category: "מוזיקה", kids: false },
  { title: "תיאטרון בובות", description: "הצגת בובות לכל המשפחה.", daysFromNow: 25, time: "11:00", city: "מודיעין", venue: "הספרייה העירונית", region: "שפלה", category: "משפחה וילדים", kids: true },
];
