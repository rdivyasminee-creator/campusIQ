export const INSTITUTION_INFO = {
  name: "NIIS Institute of Business Administration",
  location: "Sarada Vihar, Madanpur, Bhubaneswar, Khordha, Odisha, India – 752054",
  coordinates: {
    lat: 20.142389,
    lng: 85.433000,
    dms: `20°08'32.6"N 85°25'58.8"E`
  },
  campusInfo: {
    area: "10 acres",
    builtUpArea: "2.5 lakh+ sq. ft.",
    programs: ["MBA – Master of Business Administration", "MCA – Master of Computer Applications"],
    facilities: ["Academic wings", "Hostel facilities", "Laboratories and workshops", "Playing field", "Leisure/recreational grounds", "Classrooms", "Auditorium", "IT Lab"]
  }
};

export const DEMO_DATA = {
  energy: {
    currentConsumption: 450, // kWh
    status: "Normal", // Normal | High
    trend: [320, 350, 410, 390, 420, 450],
    locations: [
      { name: "Academic Area", value: 180 },
      { name: "IT Lab", value: 120 },
      { name: "Auditorium", value: 60 },
      { name: "Hostel", value: 50 },
      { name: "Administrative Area", value: 40 },
    ]
  },
  water: {
    currentUsage: 1250, // Liters
    status: "Normal", // Normal | High
    trend: [1000, 1100, 1050, 1200, 1150, 1250],
    locations: [
      { name: "Academic Area", value: 400 },
      { name: "Hostel", value: 600 },
      { name: "Laboratory Area", value: 150 },
      { name: "Campus Facilities", value: 100 },
    ]
  },
  airQuality: {
    aqi: 45,
    co2: 410, // ppm
    temperature: 24, // Celsius
    humidity: 55, // %
    status: "Good", // Good | Moderate | Poor
    trend: [42, 45, 48, 50, 47, 45]
  },
  waste: {
    generated: 120, // kg
    status: "Normal", // Normal | Attention
    breakdown: [
      { name: "Recyclable", value: 40 },
      { name: "Organic", value: 50 },
      { name: "Plastic", value: 15 },
      { name: "Paper", value: 10 },
      { name: "Other", value: 5 }
    ]
  },
  assets: {
    utilization: 75, // %
    facilities: [
      { name: "Classrooms", utilization: 80, available: 5, inUse: 20, maintenance: 1 },
      { name: "IT Lab", utilization: 90, available: 5, inUse: 45, maintenance: 2 },
      { name: "Auditorium", utilization: 30, available: 1, inUse: 0, maintenance: 0 },
      { name: "Library", utilization: 60, available: 40, inUse: 60, maintenance: 0 },
      { name: "Laboratories", utilization: 50, available: 10, inUse: 10, maintenance: 2 },
      { name: "Sports/Playing Facilities", utilization: 40, available: 3, inUse: 2, maintenance: 0 },
      { name: "Hostel Facilities", utilization: 95, available: 10, inUse: 190, maintenance: 5 },
    ]
  },
  maintenance: {
    pendingRequests: 4,
    requests: [
      { id: "REQ-001", issue: "AC Not Cooling", location: "IT Lab", priority: "High", assignedTo: "Ramesh M.", status: "Pending", date: "2023-10-25" },
      { id: "REQ-002", issue: "Leaking Tap", location: "Hostel Block A", priority: "Medium", assignedTo: "Suresh K.", status: "In Progress", date: "2023-10-24" },
      { id: "REQ-003", issue: "Projector Malfunction", location: "Classroom 102", priority: "High", assignedTo: "IT Support", status: "Completed", date: "2023-10-22" },
      { id: "REQ-004", issue: "Broken Chair", location: "Library", priority: "Low", assignedTo: "Facility Team", status: "Pending", date: "2023-10-26" }
    ]
  },
  alerts: {
    activeCount: 2,
    list: [
      { id: 1, title: "Energy alert: High consumption", description: "Demo alert: Energy consumption exceeded the configured threshold in IT Lab.", category: "Energy", date: "2023-10-26T10:00:00", priority: "High", status: "New" },
      { id: 2, title: "Water alert: Abnormal usage", description: "Demo alert: Water usage is above the configured threshold in Hostel Block B.", category: "Water", date: "2023-10-26T08:30:00", priority: "Medium", status: "Reviewed" }
    ]
  },
  sustainabilityScore: 82 // out of 100
};
