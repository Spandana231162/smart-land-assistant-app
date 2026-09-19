// db.js - In-memory and state management with audit tracking
import {
  initialUsers,
  initialLands,
  initialComplaints,
  initialResurveys,
  initialWeather,
  initialSoil,
  initialWater,
  initialFarmerSafety,
  initialNotifications,
  initialAuditLogs
} from './seedData.js';

class Database {
  constructor() {
    this.users = [...initialUsers];
    this.lands = JSON.parse(JSON.stringify(initialLands));
    this.complaints = JSON.parse(JSON.stringify(initialComplaints));
    this.resurveys = JSON.parse(JSON.stringify(initialResurveys));
    this.weather = JSON.parse(JSON.stringify(initialWeather));
    this.soil = JSON.parse(JSON.stringify(initialSoil));
    this.water = JSON.parse(JSON.stringify(initialWater));
    this.farmerSafety = JSON.parse(JSON.stringify(initialFarmerSafety));
    this.notifications = JSON.parse(JSON.stringify(initialNotifications));
    this.auditLogs = JSON.parse(JSON.stringify(initialAuditLogs));
  }

  // --- AUDIT LOGGING ---
  addAuditLog(entry) {
    const newLog = {
      audit_id: `AUD-${Date.now()}`,
      timestamp: new Date().toISOString(),
      ...entry
    };
    this.auditLogs.unshift(newLog);
    return newLog;
  }

  // --- NOTIFICATIONS ---
  addNotification({ userId, role, title, message, type }) {
    const notif = {
      notification_id: `NOTIF-${Date.now()}`,
      user_id: userId,
      role: role || "farmer",
      title,
      message,
      type: type || "system",
      status: "unread",
      timestamp: new Date().toISOString()
    };
    this.notifications.unshift(notif);
    return notif;
  }

  markNotificationRead(notificationId) {
    const notif = this.notifications.find(n => n.notification_id === notificationId);
    if (notif) notif.status = "read";
    return notif;
  }

  // --- USERS ---
  findUserById(userId) {
    return this.users.find(u => u.user_id === userId);
  }

  // --- LANDS ---
  getAllLands() {
    return this.lands;
  }

  getLandById(landId) {
    return this.lands.find(l => l.land_id === landId || l.survey_number === landId);
  }

  getLandsForUser(userId) {
    return this.lands.filter(l => l.owner_id === userId);
  }

  // Update land boundary or status (Surveyor action)
  updateLandSurvey(landId, updates, surveyorUser) {
    const land = this.getLandById(landId);
    if (!land) throw new Error("Land record not found");

    const previousSnapshot = {
      survey_status: land.survey_status,
      verification_status: land.verification_status,
      total_area_acres: land.total_area_acres,
      last_survey_date: land.last_survey_date,
      boundary_polygon: land.boundary_polygon
    };

    if (updates.survey_status) land.survey_status = updates.survey_status;
    if (updates.verification_status) land.verification_status = updates.verification_status;
    if (updates.total_area_acres) land.total_area_acres = Number(updates.total_area_acres);
    if (updates.boundary_polygon) land.boundary_polygon = updates.boundary_polygon;
    if (updates.boundary_points) land.boundary_points = updates.boundary_points;
    if (updates.disputed_polygon !== undefined) land.disputed_polygon = updates.disputed_polygon;
    if (updates.reported_incorrect_line !== undefined) land.reported_incorrect_line = updates.reported_incorrect_line;
    land.last_survey_date = new Date().toISOString().split('T')[0];

    // Audit log
    this.addAuditLog({
      user_id: surveyorUser?.user_id || "SUR-502",
      user_name: surveyorUser?.name || "Srikanth Rao (Surveyor)",
      action: "LAND_SURVEY_UPDATED",
      entity: `Land Parcel #${land.survey_number}`,
      details: updates.remarks || `Surveyor updated cadastral measurements & verification status to ${land.survey_status}`,
      data_snapshot: { previous: previousSnapshot, updated: updates }
    });

    // Notify farmer
    this.addNotification({
      userId: land.owner_id,
      role: "farmer",
      title: "Land Survey Verified & Updated",
      message: `Cadastral update completed for Survey #${land.survey_number}. Official status is now '${land.survey_status}'.`,
      type: "survey"
    });

    return land;
  }

  // Mark Disputed Area
  markDisputedArea(landId, disputedPolygon, remarks, user) {
    const land = this.getLandById(landId);
    if (!land) throw new Error("Land record not found");

    land.disputed_polygon = disputedPolygon;
    if (land.survey_status === "Verified") {
      land.survey_status = "Disputed";
    }

    this.addAuditLog({
      user_id: user?.user_id || "FAR-101",
      user_name: user?.name || "Farmer",
      action: "DISPUTED_AREA_MARKED",
      entity: `Survey #${land.survey_number}`,
      details: remarks || "Marked approximate disputed parcel on cadastral map.",
      data_snapshot: { disputedPolygon }
    });

    return land;
  }

  // --- COMPLAINTS ---
  getAllComplaints() {
    return this.complaints;
  }

  getComplaintById(id) {
    return this.complaints.find(c => c.complaint_id === id);
  }

  createComplaint(data, user) {
    const id = `CMP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newComplaint = {
      complaint_id: id,
      land_id: data.land_id || "LAND-TG-501",
      farmer_id: user?.user_id || "FAR-101",
      farmer_name: user?.name || "Ramesh Kumar",
      survey_number: data.survey_number || "142/2A",
      complaint_type: data.complaint_type || "Incorrect Boundary",
      description: data.description || "",
      location: data.location || "On-site boundary point",
      problem_coords: data.problem_coords || { lat: 17.4520, lng: 78.6850 },
      disputed_area_acres: Number(data.disputed_area_acres) || 0.1,
      status: "Submitted",
      created_date: new Date().toISOString(),
      assigned_surveyor: "SUR-502",
      surveyor_remarks: "New complaint logged. Awaiting scrutiny.",
      evidence_files: data.evidence_files || []
    };

    this.complaints.unshift(newComplaint);

    // Audit log
    this.addAuditLog({
      user_id: user?.user_id || "FAR-101",
      user_name: user?.name || "Farmer",
      action: "COMPLAINT_FILED",
      entity: `Complaint #${id}`,
      details: `Filed '${newComplaint.complaint_type}' for Survey #${newComplaint.survey_number}: ${newComplaint.description}`,
      data_snapshot: newComplaint
    });

    // Notify surveyor
    this.addNotification({
      userId: "SUR-502",
      role: "surveyor",
      title: "New Survey Complaint Filed",
      message: `Farmer ${newComplaint.farmer_name} submitted complaint #${id} for Survey #${newComplaint.survey_number}.`,
      type: "complaint"
    });

    return newComplaint;
  }

  updateComplaintStatus(complaintId, updates, surveyorUser) {
    const complaint = this.getComplaintById(complaintId);
    if (!complaint) throw new Error("Complaint not found");

    const oldStatus = complaint.status;
    if (updates.status) complaint.status = updates.status;
    if (updates.surveyor_remarks) complaint.surveyor_remarks = updates.surveyor_remarks;
    if (updates.assigned_surveyor) complaint.assigned_surveyor = updates.assigned_surveyor;

    // Audit log
    this.addAuditLog({
      user_id: surveyorUser?.user_id || "SUR-502",
      user_name: surveyorUser?.name || "Srikanth Rao (Surveyor)",
      action: "COMPLAINT_STATUS_UPDATED",
      entity: `Complaint #${complaint.complaint_id}`,
      details: `Status shifted from '${oldStatus}' to '${complaint.status}'. Remarks: ${updates.surveyor_remarks || 'None'}`,
      data_snapshot: { oldStatus, newStatus: complaint.status }
    });

    // Notify farmer
    this.addNotification({
      userId: complaint.farmer_id,
      role: "farmer",
      title: `Complaint #${complaint.complaint_id} Status: ${complaint.status}`,
      message: `Your survey complaint status is updated to '${complaint.status}'. Remarks: ${complaint.surveyor_remarks}`,
      type: "complaint"
    });

    return complaint;
  }

  // --- RESURVEYS ---
  getAllResurveys() {
    return this.resurveys;
  }

  getResurveyById(id) {
    return this.resurveys.find(r => r.request_id === id);
  }

  createResurveyRequest(data, user) {
    const id = `RSV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newRequest = {
      request_id: id,
      land_id: data.land_id || "LAND-TG-501",
      farmer_id: user?.user_id || "FAR-101",
      farmer_name: user?.name || "Ramesh Kumar",
      survey_number: data.survey_number || "142/2A",
      reason: data.reason || "Re-demarcation of lost boundary stones",
      problem_type: data.problem_type || "Boundary Verification",
      contact_phone: data.contact_phone || user?.phone || "+91 98480 12345",
      preferred_time: data.preferred_time || "Morning (9:00 AM - 12:00 PM)",
      status: "Request Submitted",
      status_step: 1,
      scheduled_date: null,
      scheduled_time: null,
      assigned_surveyor: "SUR-502",
      surveyor_name: "Srikanth Rao",
      completion_date: null,
      field_measurements: null,
      created_date: new Date().toISOString(),
      evidence_files: data.evidence_files || []
    };

    this.resurveys.unshift(newRequest);

    // Audit log
    this.addAuditLog({
      user_id: user?.user_id || "FAR-101",
      user_name: user?.name || "Farmer",
      action: "RESURVEY_REQUESTED",
      entity: `Re-Survey #${id}`,
      details: `Requested re-survey for Survey #${newRequest.survey_number}. Reason: ${newRequest.reason}`,
      data_snapshot: newRequest
    });

    // Notify surveyor
    this.addNotification({
      userId: "SUR-502",
      role: "surveyor",
      title: "New Re-Survey Request",
      message: `Re-survey ticket #${id} submitted for Survey #${newRequest.survey_number}.`,
      type: "survey"
    });

    return newRequest;
  }

  updateResurvey(requestId, updates, surveyorUser) {
    const req = this.getResurveyById(requestId);
    if (!req) throw new Error("Re-survey request not found");

    const stepsMap = {
      "Request Submitted": 1,
      "Assigned to Surveyor": 2,
      "Under Review": 3,
      "Field Survey Scheduled": 4,
      "Survey Completed": 5,
      "Verification Pending": 6,
      "Approved": 7,
      "Resolved": 8,
      "Rejected": 7
    };

    if (updates.status) {
      req.status = updates.status;
      req.status_step = stepsMap[updates.status] || req.status_step;
    }
    if (updates.scheduled_date) req.scheduled_date = updates.scheduled_date;
    if (updates.scheduled_time) req.scheduled_time = updates.scheduled_time;
    if (updates.field_measurements) req.field_measurements = updates.field_measurements;
    if (updates.status === "Resolved" || updates.status === "Approved") {
      req.completion_date = new Date().toISOString().split('T')[0];
    }

    // Audit log
    this.addAuditLog({
      user_id: surveyorUser?.user_id || "SUR-502",
      user_name: surveyorUser?.name || "Srikanth Rao (Surveyor)",
      action: "RESURVEY_UPDATED",
      entity: `Re-Survey #${req.request_id}`,
      details: `Re-survey progressed to step: '${req.status}'.`,
      data_snapshot: { status: req.status, scheduled_date: req.scheduled_date }
    });

    // Notify farmer
    this.addNotification({
      userId: req.farmer_id,
      role: "farmer",
      title: `Re-Survey #${req.request_id}: ${req.status}`,
      message: req.scheduled_date 
        ? `Field re-survey is scheduled for ${req.scheduled_date} at ${req.scheduled_time || '10:00 AM'}.`
        : `Your re-survey request is now at '${req.status}' stage.`,
      type: "survey"
    });

    return req;
  }

  // --- GOVERNMENT DEPARTMENT FORWARDING SIMULATION ---
  forwardToGovernment(payload, surveyorUser) {
    const dispatchId = `GOV-REV-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
    const submissionRecord = {
      dispatch_id: dispatchId,
      timestamp: new Date().toISOString(),
      survey_number: payload.survey_number,
      land_id: payload.land_id,
      owner_name: payload.owner_name,
      verified_acres: payload.verified_acres,
      transmitting_officer: surveyorUser?.name || "Srikanth Rao, Senior Surveyor",
      target_department: payload.target_department || "Department of Survey, Settlement and Land Records (Dharani Integrated Cadastre)",
      verification_hash: `0x${Math.random().toString(16).substring(2, 10)}${Math.random().toString(16).substring(2, 10).toUpperCase()}`,
      status: "Transmission Confirmed & Queued for Official Gazette Register"
    };

    // Record in audit log
    this.addAuditLog({
      user_id: surveyorUser?.user_id || "SUR-502",
      user_name: surveyorUser?.name || "Srikanth Rao (Surveyor)",
      action: "FORWARDED_TO_GOVERNMENT",
      entity: `Dispatch #${dispatchId}`,
      details: `Dispatched verified cadastral dataset for Survey #${payload.survey_number} to ${submissionRecord.target_department}.`,
      data_snapshot: submissionRecord
    });

    // Notify farmer
    if (payload.farmer_id) {
      this.addNotification({
        userId: payload.farmer_id,
        role: "farmer",
        title: "Survey Record Transmitted to Govt Revenue Portal",
        message: `Your verified survey data (Survey #${payload.survey_number}) has been officially transmitted under Reference #${dispatchId}.`,
        type: "survey"
      });
    }

    return submissionRecord;
  }
}

export const db = new Database();
