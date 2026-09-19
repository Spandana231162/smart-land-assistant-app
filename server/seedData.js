// seedData.js - Comprehensive Cadastral, Soil, Water & Weather Seed Data for Smart Land Assistant

export const initialUsers = [
  {
    user_id: "FAR-101",
    name: "Ramesh Kumar (రమేష్ కుమార్)",
    phone: "+91 98480 12345",
    email: "ramesh.farmer@bhoomi.gov.in",
    role: "farmer",
    passbook_number: "TG-RR-142-9982",
    location: "Kondapur Village, Ghatkesar Mandal, Ranga Reddy District, Telangana",
    land_ids: ["LAND-TG-501", "LAND-TG-502"],
    avatar: "👨‍🌾"
  },
  {
    user_id: "FAR-102",
    name: "Lakshmi Devi (లక్ష్మీ దేవి)",
    phone: "+91 94401 67890",
    email: "lakshmi.devi@bhoomi.gov.in",
    role: "farmer",
    passbook_number: "TG-RR-143-4412",
    location: "Shabad Mandal, Ranga Reddy District, Telangana",
    land_ids: ["LAND-TG-503"],
    avatar: "👩‍🌾"
  },
  {
    user_id: "SUR-502",
    name: "Srikanth Rao (శ్రీకాంత్ రావు)",
    phone: "+91 91234 56789",
    email: "srikanth.surveyor@telangana.gov.in",
    role: "surveyor",
    designation: "Senior Cadastral Land Surveyor",
    badge_number: "TS-SURV-GRADE1-884",
    department: "Survey, Settlement & Land Records Dept, Govt of Telangana",
    jurisdiction: "Ranga Reddy West Sub-Division (Mandal: Ghatkesar, Keesara)",
    avatar: "👨‍💼"
  }
];

export const initialLands = [
  {
    land_id: "LAND-TG-501",
    survey_number: "142/2A",
    sub_division: "2A",
    area_name: "Kondapur North Agricultural Sector",
    village: "Kondapur",
    mandal: "Ghatkesar",
    district: "Ranga Reddy",
    state: "Telangana",
    owner_id: "FAR-101",
    present_owner: "Ramesh Kumar (రమేష్ కుమార్)",
    previous_owner: "Venkat Rama Rao (Inheritance/Pattedar passbook #T142981)",
    total_area_acres: 4.75,
    cultivated_area_acres: 4.50,
    land_nature: "Wetland / Irrigated Agricultural (Paddy & Cotton)",
    survey_status: "Verified", // "Verified" | "Survey Verification Pending" | "Disputed"
    verification_status: "Officially Verified by Survey Dept",
    last_survey_date: "2024-03-18",
    passbook_number: "TG-RR-142-9982",
    revenue_circle: "Circle-IV, Ghatkesar Sub-Registrar",
    center_coords: [17.4520, 78.6850],
    data_provenance: "Official Revenue Dept (Dharani/Bhoomi Cadastre Record)",
    // Verified Official Polygon Coordinates
    boundary_polygon: [
      [17.4535, 78.6830],
      [17.4537, 78.6872],
      [17.4505, 78.6870],
      [17.4503, 78.6828]
    ],
    // Boundary stone corner GPS points
    boundary_points: [
      { id: "P1", code: "NW-101", name: "North-West Cadastral Stone", lat: 17.4535, lng: 78.6830, status: "Intact", verified: true },
      { id: "P2", code: "NE-102", name: "North-East Cadastral Stone", lat: 17.4537, lng: 78.6872, status: "Intact", verified: true },
      { id: "P3", code: "SE-103", name: "South-East Cadastral Ridge", lat: 17.4505, lng: 78.6870, status: "Disputed / Disturbed", verified: false },
      { id: "P4", code: "SW-104", name: "South-West Bund Stone", lat: 17.4503, lng: 78.6828, status: "Intact", verified: true }
    ],
    // Disputed area polygon within or adjacent to this land
    disputed_polygon: [
      [17.4518, 78.6868],
      [17.4522, 78.6872],
      [17.4508, 78.6871],
      [17.4505, 78.6867]
    ],
    // Reported incorrect boundary line
    reported_incorrect_line: [
      [17.4537, 78.6872],
      [17.4522, 78.6875],
      [17.4505, 78.6874]
    ],
    neighboring_lands: [
      {
        survey_number: "142/1",
        owner_display: "P. Narsimha Reddy (Authorized Record)",
        boundary_direction: "North",
        area_acres: 3.20,
        status: "Verified",
        privacy_note: "Basic cadastral owner info verified under Right to Public Services",
        polygon: [
          [17.4555, 78.6830],
          [17.4557, 78.6872],
          [17.4537, 78.6872],
          [17.4535, 78.6830]
        ]
      },
      {
        survey_number: "142/2B",
        owner_display: "K. Mohan Rao (Authorized Record)",
        boundary_direction: "East",
        area_acres: 5.10,
        status: "Verified",
        privacy_note: "Adjacent boundary claim currently under review",
        polygon: [
          [17.4537, 78.6872],
          [17.4539, 78.6915],
          [17.4507, 78.6913],
          [17.4505, 78.6870]
        ]
      },
      {
        survey_number: "143/1 (Public Canal)",
        owner_display: "Irrigation Dept - Canal Distributary D-14",
        boundary_direction: "South",
        area_acres: 1.80,
        status: "Public Water Resource",
        privacy_note: "Government Irrigation Channel Reserve Area",
        polygon: [
          [17.4505, 78.6828],
          [17.4505, 78.6870],
          [17.4495, 78.6870],
          [17.4495, 78.6828]
        ]
      },
      {
        survey_number: "141/4",
        owner_display: "B. Anjaneyulu (Authorized Record)",
        boundary_direction: "West",
        area_acres: 4.10,
        status: "Verified",
        privacy_note: "Private agricultural land with shared west bund",
        polygon: [
          [17.4535, 78.6790],
          [17.4535, 78.6830],
          [17.4503, 78.6828],
          [17.4503, 78.6788]
        ]
      }
    ]
  },
  {
    land_id: "LAND-TG-502",
    survey_number: "158/3",
    sub_division: "3",
    area_name: "Kondapur South Mango Orchard Sector",
    village: "Kondapur",
    mandal: "Ghatkesar",
    district: "Ranga Reddy",
    state: "Telangana",
    owner_id: "FAR-101",
    present_owner: "Ramesh Kumar (రమేష్ కుమార్)",
    previous_owner: "G. Shankaraiah (Purchased in 2017)",
    total_area_acres: 2.30,
    cultivated_area_acres: 2.30,
    land_nature: "Horticultural Dryland (Mango & Guava Plantation)",
    survey_status: "Survey Verification Pending",
    verification_status: "Field Re-Demarcation Pending",
    last_survey_date: "2021-11-04",
    passbook_number: "TG-RR-158-3310",
    revenue_circle: "Circle-IV, Ghatkesar Sub-Registrar",
    center_coords: [17.4420, 78.6780],
    data_provenance: "Revenue Records Archive (Pending Field Re-Survey)",
    boundary_polygon: [
      [17.4435, 78.6765],
      [17.4436, 78.6798],
      [17.4408, 78.6796],
      [17.4407, 78.6764]
    ],
    boundary_points: [
      { id: "P11", code: "NW-201", name: "Road-Side Concrete Peg", lat: 17.4435, lng: 78.6765, status: "Intact", verified: true },
      { id: "P12", code: "NE-202", name: "East Ridge Boundary Marker", lat: 17.4436, lng: 78.6798, status: "Intact", verified: true },
      { id: "P13", code: "SE-203", name: "South Pond Ridge", lat: 17.4408, lng: 78.6796, status: "Verification Due", verified: false },
      { id: "P14", code: "SW-204", name: "South-West Boundary Stone", lat: 17.4407, lng: 78.6764, status: "Intact", verified: true }
    ],
    disputed_polygon: null,
    reported_incorrect_line: null,
    neighboring_lands: [
      { survey_number: "158/2", owner_display: "T. Rajendar", boundary_direction: "North", area_acres: 2.10, status: "Verified" },
      { survey_number: "159/1", owner_display: "Village Panchayat Grazing Land", boundary_direction: "South", area_acres: 6.50, status: "Public Common" }
    ]
  },
  {
    land_id: "LAND-TG-503",
    survey_number: "89/1C",
    sub_division: "1C",
    area_name: "Shabad Central Agricultural Basin",
    village: "Shabad",
    mandal: "Shabad",
    district: "Ranga Reddy",
    state: "Telangana",
    owner_id: "FAR-102",
    present_owner: "Lakshmi Devi (లక్ష్మీ దేవి)",
    previous_owner: "M. Narsimha Reddy (Ancestral Partition)",
    total_area_acres: 3.80,
    cultivated_area_acres: 3.60,
    land_nature: "Semi-Irrigated Dryland (Chilli & Groundnut)",
    survey_status: "Verified",
    verification_status: "Officially Verified by Survey Dept",
    last_survey_date: "2023-08-12",
    passbook_number: "TG-RR-143-4412",
    revenue_circle: "Circle-II, Shabad Tahsildar",
    center_coords: [17.1520, 78.1340],
    data_provenance: "Official Revenue Dept (Dharani/Bhoomi Cadastre Record)",
    boundary_polygon: [
      [17.1535, 78.1325],
      [17.1536, 78.1358],
      [17.1508, 78.1356],
      [17.1507, 78.1324]
    ],
    boundary_points: [
      { id: "P21", code: "SB-01", name: "North-West Marker", lat: 17.1535, lng: 78.1325, status: "Intact", verified: true },
      { id: "P22", code: "SB-02", name: "North-East Marker", lat: 17.1536, lng: 78.1358, status: "Intact", verified: true },
      { id: "P23", code: "SB-03", name: "South-East Marker", lat: 17.1508, lng: 78.1356, status: "Intact", verified: true },
      { id: "P24", code: "SB-04", name: "South-West Marker", lat: 17.1507, lng: 78.1324, status: "Intact", verified: true }
    ],
    disputed_polygon: null,
    reported_incorrect_line: null,
    neighboring_lands: []
  }
];

export const initialComplaints = [
  {
    complaint_id: "CMP-2026-8812",
    land_id: "LAND-TG-501",
    farmer_id: "FAR-101",
    farmer_name: "Ramesh Kumar",
    survey_number: "142/2A",
    complaint_type: "Incorrect Boundary",
    description: "During canal ridge desilting, the eastern survey boundary stones were disturbed and displaced by approx 12 feet inward, encroaching roughly 0.25 acres of cotton crop.",
    location: "East ridge adjoining Survey Number 142/2B",
    problem_coords: { lat: 17.4518, lng: 78.6870 },
    disputed_area_acres: 0.25,
    status: "Under Review", // "Submitted" | "Under Review" | "Survey Required" | "Verified" | "Resolved" | "Rejected"
    created_date: "2026-09-02T10:30:00Z",
    assigned_surveyor: "SUR-502",
    surveyor_remarks: "Initial GIS overlay matches farmer complaint regarding east ridge deviation. Field DGPS re-measurement scheduled.",
    evidence_files: [
      {
        id: "EV-101",
        file_name: "boundary_stone_damaged.jpg",
        file_type: "image/jpeg",
        size: "2.8 MB",
        preview_url: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80",
        uploaded_at: "2026-09-02T10:31:00Z",
        description: "Photo of displaced stone on eastern bund"
      },
      {
        id: "EV-102",
        file_name: "patta_passbook_extract.pdf",
        file_type: "application/pdf",
        size: "1.2 MB",
        preview_url: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80",
        uploaded_at: "2026-09-02T10:32:00Z",
        description: "Official 2018 Revenue Settlement Passbook extract showing original 4.75 acres"
      }
    ]
  },
  {
    complaint_id: "CMP-2026-9041",
    land_id: "LAND-TG-502",
    farmer_id: "FAR-101",
    farmer_name: "Ramesh Kumar",
    survey_number: "158/3",
    complaint_type: "Incorrect Land Area",
    description: "Pattadar passbook displays 2.30 acres, whereas recent municipal road widening took 0.15 acres without updated official land record adjustment.",
    location: "South-West approach road corner",
    problem_coords: { lat: 17.4410, lng: 78.6765 },
    disputed_area_acres: 0.15,
    status: "Submitted",
    created_date: "2026-09-09T15:20:00Z",
    assigned_surveyor: "SUR-502",
    surveyor_remarks: "Pending preliminary document scrutiny.",
    evidence_files: [
      {
        id: "EV-103",
        file_name: "road_widening_notice.jpg",
        file_type: "image/jpeg",
        size: "1.9 MB",
        preview_url: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=800&q=80",
        uploaded_at: "2026-09-09T15:21:00Z",
        description: "Photo of municipal road demarcation pegs"
      }
    ]
  }
];

export const initialResurveys = [
  {
    request_id: "RSV-2026-4409",
    land_id: "LAND-TG-501",
    farmer_id: "FAR-101",
    farmer_name: "Ramesh Kumar",
    survey_number: "142/2A",
    reason: "Boundary demarcation and replacement of damaged cadastral boundary stones after dispute with Survey 142/2B.",
    problem_type: "Sub-Division Boundary Demarcation",
    contact_phone: "+91 98480 12345",
    preferred_time: "Morning (9:00 AM - 12:00 PM)",
    status: "Field Survey Scheduled", // 8 steps:
    // 1. Request Submitted
    // 2. Assigned to Surveyor
    // 3. Under Review
    // 4. Field Survey Scheduled
    // 5. Survey Completed
    // 6. Verification Pending
    // 7. Approved
    // 8. Resolved
    status_step: 4,
    scheduled_date: "2026-09-18",
    scheduled_time: "10:30 AM",
    assigned_surveyor: "SUR-502",
    surveyor_name: "Srikanth Rao",
    completion_date: null,
    field_measurements: {
      perimeter_meters: 1042.5,
      computed_acres: 4.75,
      instrument_used: "Trimble R12i GNSS / DGPS System",
      survey_squad_leader: "Srikanth Rao, Senior Surveyor"
    },
    created_date: "2026-09-05T14:15:00Z",
    evidence_files: [
      {
        id: "EV-201",
        file_name: "boundary_line_claim.jpg",
        file_type: "image/jpeg",
        size: "3.1 MB",
        preview_url: "https://images.unsplash.com/photo-1592417817098-8f3d6910985c?auto=format&fit=crop&w=800&q=80",
        uploaded_at: "2026-09-05T14:16:00Z",
        description: "East boundary ridge panorama"
      }
    ]
  }
];

export const initialWeather = {
  location_name: "Kondapur Agricultural Region (Ghatkesar Mandal, Ranga Reddy)",
  coordinates: { lat: 17.4520, lng: 78.6850 },
  last_updated: "2026-09-11T19:20:00+05:30",
  current: {
    temp_c: 29.4,
    condition: "Partly Cloudy with Scattered Breezes",
    condition_code: "partly_cloudy",
    icon: "⛅",
    rain_probability_pct: 35,
    humidity_pct: 68,
    wind_speed_kmh: 14,
    wind_direction: "South-West (SW)",
    uv_index: 6,
    rainfall_24h_mm: 12.4
  },
  forecast: [
    { day: "Today", temp_max: 31, temp_min: 23, rain_prob: 35, condition: "Partly Cloudy", icon: "⛅" },
    { day: "Tomorrow", temp_max: 28, temp_min: 22, rain_prob: 65, condition: "Thunderstorms Evening", icon: "⛈️" },
    { day: "Sunday", temp_max: 27, temp_min: 21, rain_prob: 75, condition: "Moderate to Heavy Showers", icon: "🌧️" },
    { day: "Monday", temp_max: 29, temp_min: 22, rain_prob: 40, condition: "Scattered Rain", icon: "🌦️" },
    { day: "Tuesday", temp_max: 31, temp_min: 23, rain_prob: 20, condition: "Sunny & Pleasant", icon: "☀️" }
  ],
  agricultural_guidance: {
    irrigation_suitability: "Suitable for light drip irrigation only. Postpone flood/canal irrigation because 25-40mm rainfall is predicted within 48 hours.",
    spraying_advisory: "Foliar fertilizer and pesticide spraying should be avoided today after 1:00 PM due to afternoon wind gusting up to 24 km/h.",
    field_work_suitability: "Good for intercultivation and hand-weeding during morning hours (7:00 AM - 11:30 AM)."
  },
  severe_weather_alert: {
    level: "Orange",
    title: "⛈️ Thunderstorm & Squall Warning for Ranga Reddy District",
    description: "Telangana State Development Planning Society (TSDPS) warns of squalls (winds 35-45 km/h) and lightning in rural mandals on Saturday evening.",
    precautions: [
      "Avoid standing near high-tension electrical towers and lone palm trees in open fields.",
      "Shut off submersible borewell switchboards during active thunder strikes.",
      "Anchor nursery plastic sheets and loose cattle shed corrugated metal sheets."
    ]
  },
  provenance: "Live Agrometeorological Sync (Open-Meteo & IMD Hyderabad Regional Station)"
};

export const initialSoil = {
  land_id: "LAND-TG-501",
  survey_number: "142/2A",
  soil_type: "Red Sandy Loam (Erra Nelalu / చలివెంద్ర నేల)",
  soil_moisture_percentage: 62,
  moisture_status: "Good", // "Good" (60-80%) | "Moderate" (40-60%) | "Low" (<40%)
  ph_level: 6.8,
  ph_status: "Neutral / Optimal",
  nitrogen_kg_ha: 240,
  nitrogen_status: "Medium",
  phosphorus_kg_ha: 28,
  phosphorus_status: "High",
  potassium_kg_ha: 310,
  potassium_status: "High",
  soil_temperature_c: 24.5,
  organic_carbon_pct: 0.65,
  recommendations: [
    "Soil moisture at 62% is optimal for vegetative growth of cotton and paddy tillering.",
    "Phosphorus & Potassium levels are very healthy. No additional basal phosphate required.",
    "Apply 25 kg/acre urea top-dressing after light weeding, before expected rains.",
    "Maintain field drains at the north corner to prevent standing water during Saturday's predicted rain."
  ],
  last_tested: "2026-09-08",
  provenance: "Telangana Soil Health Card Registry + IoT Field Tensiometer Probe #TEL-771"
};

export const initialWater = {
  land_id: "LAND-TG-501",
  survey_number: "142/2A",
  water_availability: "Adequate / Satisfactory (సమృద్ధిగా నీరు)",
  groundwater_depth_meters: 6.8,
  groundwater_status: "Safe Zone (<8m)",
  primary_source: "Canal Distributary D-14 (Kaleshwaram Lift / Musi Basin)",
  secondary_source: "1 Deep Borewell (180 ft depth, 2.5 HP Solar Pump)",
  borewell_discharge_rate: "2.5 inches continuous flow",
  canal_schedule: "Next release scheduled for Tuesday 6:00 AM to Thursday 6:00 PM",
  water_quality_ec: "0.75 dS/m (Normal, Non-Saline, High Crop Safety)",
  water_alerts: [
    "Canal water release confirmed for Tuesday. Keep field check-gates clear.",
    "Groundwater table has risen by 1.2m following August monsoon showers."
  ],
  conservation_tips: [
    "Adopt Alternate Wetting and Drying (AWD) irrigation for paddy to save up to 25% water.",
    "Inspect sub-lateral drip pipes in the orchard zone for clogging to prevent pressure loss."
  ],
  provenance: "State Ground Water Board (SGWB) Station #RR-04 & Canal Command Registry"
};

export const initialFarmerSafety = [
  {
    category: "Heavy Rain & Waterlogging (భారీ వర్షాలు)",
    icon: "🌧️",
    urgency: "High",
    tips: [
      "Avoid working in deeply flooded fields or canal banks during sudden downpours.",
      "Switch off main electrical breakers for farm pump sheds to avoid electrocution.",
      "Do not attempt to drive tractors through submerged village culverts or overflowing streams.",
      "Inspect field bunds from a safe distance; avoid unstable wet mud ridges."
    ]
  },
  {
    category: "Extreme Heat & Sunstroke (తీవ్రమైన ఎండ)",
    icon: "☀️",
    urgency: "Medium",
    tips: [
      "Drink at least 4-5 liters of fresh water, ORS or buttermilk daily during farm hours.",
      "Restrict heavy manual ploughing or harvesting between 12:00 PM and 3:30 PM.",
      "Wear wide-brimmed cotton hats or traditional cotton cloth to protect neck and head.",
      "Keep cattle in shaded, well-ventilated shelters with clean drinking troughs."
    ]
  },
  {
    category: "Lightning & Electrical Safety (పిడుగులు & విద్యుత్)",
    icon: "⚡",
    urgency: "Critical",
    tips: [
      "Never take shelter under tall lone trees or metal transmission towers during storms.",
      "Immediately step away from metal agricultural tools, tractors, and wire fencing.",
      "If caught in an open field, crouch down low with feet together (do not lie flat on the ground).",
      "Keep away from open borewells or water channels carrying active storm run-off."
    ]
  },
  {
    category: "Strong Winds & Farm Machinery (తీవ్రమైన గాలులు)",
    icon: "💨",
    urgency: "Medium",
    tips: [
      "Secure loose zinc sheets, nursery shade nets, and harvest storage bags.",
      "Park sprayers and mobile farm machinery in enclosed sheds away from old dry trees.",
      "Watch for snapped electric overhead wires; report any dangling wire to DISCOM immediately."
    ]
  }
];

export const initialNotifications = [
  {
    notification_id: "NOTIF-101",
    user_id: "FAR-101",
    role: "farmer",
    title: "Field Survey Scheduled",
    message: "Cadastral Surveyor Srikanth Rao has scheduled an on-site DGPS re-survey for your land (Survey 142/2A) on 18-Sep-2026 at 10:30 AM.",
    type: "survey",
    status: "unread",
    timestamp: "2026-09-08T11:00:00Z"
  },
  {
    notification_id: "NOTIF-102",
    user_id: "FAR-101",
    role: "farmer",
    title: "⛈️ Weather Advisory: Thunderstorms",
    message: "IMD Orange Advisory for Ranga Reddy. Evening gusty winds and thunder predicted for Saturday. Secure outdoor farm equipment.",
    type: "weather",
    status: "unread",
    timestamp: "2026-09-11T09:30:00Z"
  },
  {
    notification_id: "NOTIF-103",
    user_id: "FAR-101",
    role: "farmer",
    title: "Complaint #CMP-2026-8812 Under Review",
    message: "Your boundary complaint has been assigned to Cadastral Squad #2. Surveyor inspection notes have been recorded.",
    type: "complaint",
    status: "read",
    timestamp: "2026-09-03T14:20:00Z"
  },
  {
    notification_id: "NOTIF-104",
    user_id: "SUR-502",
    role: "surveyor",
    title: "New Re-Survey Request Assigned",
    message: "Re-Survey request #RSV-2026-4409 (Survey 142/2A, Kondapur) is pending field measurement and deed verification.",
    type: "survey",
    status: "unread",
    timestamp: "2026-09-05T14:20:00Z"
  }
];

export const initialAuditLogs = [
  {
    audit_id: "AUD-1001",
    timestamp: "2026-09-02T10:30:00Z",
    user_id: "FAR-101",
    user_name: "Ramesh Kumar (Farmer)",
    action: "COMPLAINT_SUBMITTED",
    entity: "Complaint #CMP-2026-8812",
    details: "Filed boundary shift complaint regarding east ridge and 0.25 acres dispute with Survey 142/2B.",
    data_snapshot: { land_id: "LAND-TG-501", complaint_type: "Incorrect Boundary" }
  },
  {
    audit_id: "AUD-1002",
    timestamp: "2026-09-03T14:20:00Z",
    user_id: "SUR-502",
    user_name: "Srikanth Rao (Surveyor)",
    action: "STATUS_UPDATED",
    entity: "Complaint #CMP-2026-8812",
    details: "Changed status from 'Submitted' to 'Under Review'. Appended GIS preliminary discrepancy notes.",
    data_snapshot: { status: "Under Review" }
  },
  {
    audit_id: "AUD-1003",
    timestamp: "2026-09-05T14:15:00Z",
    user_id: "FAR-101",
    user_name: "Ramesh Kumar (Farmer)",
    action: "RESURVEY_REQUESTED",
    entity: "Re-Survey #RSV-2026-4409",
    details: "Submitted formal request for boundary demarcation and cadastral marker replacement.",
    data_snapshot: { land_id: "LAND-TG-501", step: 1 }
  },
  {
    audit_id: "AUD-1004",
    timestamp: "2026-09-08T11:00:00Z",
    user_id: "SUR-502",
    user_name: "Srikanth Rao (Surveyor)",
    action: "SURVEY_SCHEDULED",
    entity: "Re-Survey #RSV-2026-4409",
    details: "Assigned survey squad and scheduled field DGPS inspection for 18-Sep-2026.",
    data_snapshot: { scheduled_date: "2026-09-18", step: 4 }
  }
];
