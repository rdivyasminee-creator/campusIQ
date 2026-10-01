/**
 * Initial Sample Database Records
 * Used strictly for prototype demonstrations.
 * To remove or clear initial sample records, use the "Clear All Records" option in the Admin Panel
 * or clear the ZoneRecord collection in MongoDB Atlas.
 */
export const INITIAL_SAMPLE_ZONES = [
  {
    zoneName: "Academic Block A",
    electricityKwh: 420.5,
    waterLitres: 2400,
    wasteKg: 45.0,
    airQuality: 62,
    utilization: 85,
    status: "Normal" as const,
    notes: "Main lecture theatres and computer laboratories operating normally.",
    source: "admin" as const,
    readingDateTime: new Date()
  },
  {
    zoneName: "MBA & MCA Wing",
    electricityKwh: 310.0,
    waterLitres: 1850,
    wasteKg: 32.5,
    airQuality: 58,
    utilization: 78,
    status: "Normal" as const,
    notes: "Postgraduate classrooms and seminar halls.",
    source: "admin" as const,
    readingDateTime: new Date()
  },
  {
    zoneName: "Central Library & Reading Rooms",
    electricityKwh: 190.0,
    waterLitres: 850,
    wasteKg: 15.0,
    airQuality: 48,
    utilization: 92,
    status: "Normal" as const,
    notes: "High quiet study utilization during examination prep.",
    source: "admin" as const,
    readingDateTime: new Date()
  },
  {
    zoneName: "Student Residential Hostels",
    electricityKwh: 540.0,
    waterLitres: 6200,
    wasteKg: 88.0,
    airQuality: 72,
    utilization: 95,
    status: "Warning" as const,
    notes: "Elevated water draw during morning routine hours; flagged for maintenance check.",
    source: "admin" as const,
    readingDateTime: new Date()
  },
  {
    zoneName: "Central Administrative Block",
    electricityKwh: 220.0,
    waterLitres: 980,
    wasteKg: 24.0,
    airQuality: 55,
    utilization: 65,
    status: "Normal" as const,
    notes: "Admissions, Accounts, and Principal office facilities.",
    source: "admin" as const,
    readingDateTime: new Date()
  },
  {
    zoneName: "Campus Canteen & Grounds",
    electricityKwh: 280.0,
    waterLitres: 3100,
    wasteKg: 110.0,
    airQuality: 68,
    utilization: 70,
    status: "Critical" as const,
    notes: "High organic waste accumulation after lunch hours; custodial collection dispatched.",
    source: "admin" as const,
    readingDateTime: new Date()
  }
];
