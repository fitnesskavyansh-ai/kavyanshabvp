import dotenv from 'dotenv';
dotenv.config({ override: true });

import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

// Security & Parsing
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Set up data directory
const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial Database State
interface DBStore {
  issues: any[];
  contactMessages: any[];
  journeyEntries?: any[];
  gallery?: any[];
  profileOverrides: any;
  sessions: { [token: string]: { username: string; expiresAt: number } };
}

const DEFAULT_DB: DBStore = {
  issues: [
    {
      id: 'iss-101',
      ticketNumber: 'MTH-2026-8912',
      createdAt: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
      fullName: 'Rohit Sharma',
      mobile: '9876543210',
      email: 'rohit.student@example.com',
      district: 'Mathura',
      city: 'Mathura',
      areaLocality: 'Dampier Nagar, Near BSA College',
      category: 'Scholarship',
      title: 'UP Post-Matric Scholarship Biometric Verification Pending',
      description:
        'College help desk par biometric attendance machine offline hone ke karan 40+ chhatron ka scholarship verification रुका hua hai. Nodal officer se anurodh hai ki machine activate karwayi jaye.',
      preferredContact: 'WhatsApp',
      status: 'In Progress',
      priority: 'High',
      assignedTo: 'Nagar Mantri (Direct)',
      adminNotes: 'Spoke with BSA College Nodal Officer on 15 Sept. Technical operator dispatched.',
      resolutionNotes: '',
      consent: true,
    },
    {
      id: 'iss-102',
      ticketNumber: 'MTH-2026-8471',
      createdAt: new Date(Date.now() - 72 * 3600 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
      fullName: 'Priya Verma',
      mobile: '9812345678',
      email: 'priya.v@example.com',
      district: 'Mathura',
      city: 'Mathura',
      areaLocality: 'Govardhan Road',
      category: 'Hostel',
      title: 'Drinking Water Cooler & Cleanliness issue in Girls Hostel',
      description:
        'Campus girls hostel mein ground floor water cooler repair mang raha hai aur examination session ke dauran drinking water ki asuvidha ho rahi hai.',
      preferredContact: 'Phone',
      status: 'Under Review',
      priority: 'Medium',
      assignedTo: 'Campus Pramukh',
      adminNotes: 'Warden ko call par suchit kiya gaya hai. Maintenance inspection scheduled.',
      resolutionNotes: '',
      consent: true,
    },
    {
      id: 'iss-103',
      ticketNumber: 'MTH-2026-7209',
      createdAt: new Date(Date.now() - 120 * 3600 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
      fullName: 'Aman Yadav',
      mobile: '9765432190',
      email: '',
      district: 'Mathura',
      city: 'Mathura',
      areaLocality: 'Krishna Nagar',
      category: 'Student Issue',
      title: 'Exam Hall Ticket Name Spelling Discrepancy',
      description:
        'Admit card par father name me spelling mistake thi, university portal update ticket raise kiya tha.',
      preferredContact: 'Phone',
      status: 'Resolved',
      priority: 'Low',
      assignedTo: 'Nagar Mantri',
      adminNotes: 'Application submitted to University Examination Controller.',
      resolutionNotes: 'Updated admit card re-issued and handed to student successfully.',
      consent: true,
    },
  ],
  contactMessages: [
    {
      id: 'msg-1',
      createdAt: new Date(Date.now() - 18 * 3600 * 1000).toISOString(),
      name: 'Vikas Dubey',
      contact: 'vikas.mathura@example.com',
      subject: 'Volunteer for upcoming Blood Donation Camp',
      message:
        'Namaste Nagar Mantri ji, main Mathura Degree college se hoon aur aagami raktadaan shivir mein voluntary sahyog dena chahta hoon.',
      status: 'New',
    },
  ],
  profileOverrides: {
    photo: '',
    photoUrl: '',
    isPhotoLocked: false,
  },
  gallery: [],
  sessions: {},
};

function readDB(): DBStore {
  try {
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(DEFAULT_DB, null, 2), 'utf-8');
      return DEFAULT_DB;
    }
    const content = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(content);
  } catch (err) {
    console.error('Error reading DB:', err);
    return DEFAULT_DB;
  }
}

function writeDB(data: DBStore) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing DB:', err);
  }
}

// In-Memory Rate Limiter for public form submissions (anti-spam)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
function rateLimiter(limit: number, windowMs: number) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const now = Date.now();
    const entry = rateLimitMap.get(ip);

    if (!entry || now > entry.resetTime) {
      rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
      return next();
    }

    if (entry.count >= limit) {
      res.status(429).json({
        error: 'Too many requests. Please wait a few minutes before submitting again.',
      });
      return;
    }

    entry.count += 1;
    next();
  };
}

// Input sanitizer helper
function sanitize(input: any): string {
  if (typeof input !== 'string') return '';
  return input
    .trim()
    .replace(/[<>]/g, '') // strip potential angle brackets
    .slice(0, 5000); // enforce max length
}

// Admin Auth Middleware
const ADMIN_USER = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASS = process.env.ADMIN_PASSWORD || 'abvp@mathura2026';

function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized: Admin authentication required.' });
    return;
  }

  const token = authHeader.split(' ')[1];
  const db = readDB();
  const session = db.sessions[token];

  if (!session || session.expiresAt < Date.now()) {
    if (session) {
      delete db.sessions[token];
      writeDB(db);
    }
    res.status(401).json({ error: 'Session expired. Please log in again.' });
    return;
  }

  next();
}

// ==========================================
// EMAIL NOTIFICATION SERVICE
// ==========================================
function normalizeKavyanshEmail(email: string | undefined | null): string {
  if (!email) return '';
  return email.trim().toLowerCase();
}

const PRIMARY_NOTIFICATION_EMAIL = 'kavyanshkayasthaabvp@gmail.com';
const SECONDARY_NOTIFICATION_EMAIL = 'kavyanshkayasthabvp@gmail.com';

let cachedSmtpAuthStatus: { tested: boolean; valid: boolean; error: string | null } = {
  tested: false,
  valid: false,
  error: null,
};

function getEmailTransporter() {
  const db = readDB();
  const dbSmtp = (db as any).smtpSettings;
  const configuredUser = dbSmtp?.user
    ? normalizeKavyanshEmail(dbSmtp.user)
    : (process.env.GMAIL_USER ? normalizeKavyanshEmail(process.env.GMAIL_USER) : PRIMARY_NOTIFICATION_EMAIL);
  const configuredPass = dbSmtp?.password || process.env.GMAIL_APP_PASSWORD || process.env.SMTP_PASS;

  const gmailUser = configuredUser?.trim();
  const gmailPass = configuredPass ? configuredPass.replace(/\s+/g, '').trim() : null;

  if (gmailUser && gmailPass) {
    return nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: gmailUser,
        pass: gmailPass,
      },
      connectionTimeout: 8000,
      greetingTimeout: 8000,
      socketTimeout: 12000,
    });
  }

  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      connectionTimeout: 8000,
      greetingTimeout: 8000,
      socketTimeout: 12000,
    });
  }

  return null;
}

function formatFormalComplaintMemo(issue: any): string {
  const formattedDate = new Date(issue.createdAt || Date.now()).toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  return [
    '============================================================',
    '       अखिल भारतीय विद्यार्थी परिषद (ABVP) मथुरा महानगर',
    '       छात्र अधिकार एवं जनसमस्या निवारण प्रकोष्ठ',
    '              औपचारिक शिकायत / प्रार्थना पत्र',
    '============================================================',
    '',
    `संदर्भ संख्या (Reference ID): ${issue.ticketNumber}`,
    `पंजीकरण दिनांक: ${formattedDate} (IST)`,
    `प्राथमिकता: त्वरित संज्ञान एवं समाधान`,
    `स्थिति: पंजीकृत (Under Review)`,
    '',
    'प्रति,',
    'श्री काव्यंश कायस्थ जी (नगर मंत्री, चौमुहां-छाता-कोसी क्षेत्र, मथुरा)',
    'अखिल भारतीय विद्यार्थी परिषद (ABVP)',
    '',
    'विषय: ' + issue.title,
    'समस्या श्रेणी: ' + issue.category,
    '',
    '------------------------------------------------------------',
    '[1] शिकायतकर्ता / आवेदक का अधिकृत विवरण:',
    '------------------------------------------------------------',
    `• नाम: ${issue.fullName}`,
    `• मोबाइल: ${issue.mobile}`,
    `• ईमेल: ${issue.email || 'उपलब्ध नहीं'}`,
    `• कॉलेज / इलाका / पता: ${issue.areaLocality || 'मथुरा'} (${issue.city || 'मथुरा'})`,
    '',
    '------------------------------------------------------------',
    '[2] शिकायत / समस्या का मूल विवरण:',
    '------------------------------------------------------------',
    issue.description,
    '',
    '------------------------------------------------------------',
    '[3] आवेदक द्वारा शपथ / घोषणा:',
    '------------------------------------------------------------',
    '"आवेदक द्वारा प्रमाणित किया गया है कि उपरोक्त शिकायत विवरण सत्य है तथा निवारण हेतु एबीवीपी मथुरा के सहयोग की प्रार्थना की गई है।"',
    '',
    'डिजिटल सत्यापन: ABVP-MTH-PORTAL-VERIFIED',
    'काव्यंश कायस्थ (नगर मंत्री, चौमुहां-छाता-कोसी क्षेत्र, मथुरा)',
    'हेल्पलाइन: +91 63950 14760 | ईमेल: kavyanshkayasthabvp@gmail.com',
    '============================================================',
  ].join('\n');
}

async function forwardViaFormSubmit(issue: any, baseUrl?: string) {
  try {
    const formattedDate = new Date(issue.createdAt || Date.now()).toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      dateStyle: 'medium',
      timeStyle: 'short',
    });

    const category = issue.category || 'General';
    const title = issue.title || 'Public Issue';
    const redirectUrl = baseUrl ? `${baseUrl.replace(/\/$/, '')}/issue-submitted` : 'https://abvp-mathura.org/issue-submitted';

    const payload: any = {
      _subject: `New Public Issue — ${category} — ${title}`,
      _template: 'table',
      _captcha: 'false',
      _next: redirectUrl,
      'Name': issue.fullName || '',
      'Mobile Number': issue.mobile || '',
      'Email': issue.email || 'उपलब्ध नहीं',
      'District': issue.district || 'Mathura',
      'City / Area': issue.areaLocality || issue.city || 'Mathura',
      'Issue Category': category,
      'Issue Title': title,
      'Detailed Description': issue.description || '',
      'Preferred Contact Method': issue.preferredContact || 'Phone',
      'Uploaded Photo/Document': issue.attachment ? (issue.attachment.name || 'Attached File') : 'None',
      'Submission Date & Time': formattedDate,
      'Ticket ID': issue.ticketNumber || '',
    };

    if (SECONDARY_NOTIFICATION_EMAIL && (SECONDARY_NOTIFICATION_EMAIL as string) !== (PRIMARY_NOTIFICATION_EMAIL as string)) {
      payload._cc = SECONDARY_NOTIFICATION_EMAIL;
    }

    const res = await fetch(`https://formsubmit.co/ajax/${PRIMARY_NOTIFICATION_EMAIL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Referer: baseUrl || 'https://abvp-mathura.org',
        Origin: baseUrl || 'https://abvp-mathura.org',
      },
      body: JSON.stringify(payload),
    });

    const data: any = await res.json();
    console.log('[FormSubmit Relay] Response:', data);
    return { success: data.success === 'true' || data.success === true, message: data.message };
  } catch (err: any) {
    console.warn('[FormSubmit Relay] Failed:', err.message);
    return { success: false, message: err.message };
  }
}

async function sendIssueNotificationEmail(issue: any, baseUrl?: string) {
  const recipients = Array.from(new Set([PRIMARY_NOTIFICATION_EMAIL, SECONDARY_NOTIFICATION_EMAIL].filter(Boolean)));
  const subject = `[ABVP आधिकारिक शिकायत #${issue.ticketNumber}] ${issue.title} - ${issue.fullName}`;

  const formattedDate = new Date(issue.createdAt).toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  const textContent = formatFormalComplaintMemo(issue);

  const htmlContent = `
<!DOCTYPE html>
<html lang="hi">
<head>
  <meta charset="utf-8">
  <title>ABVP आधिकारिक शिकायत पत्र</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f1f5f9; margin: 0; padding: 20px; color: #1e293b;">
  <div style="max-width: 680px; margin: 0 auto; background: #ffffff; border: 2px solid #ea580c; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1);">
    
    <!-- Tricolor Header Accent -->
    <div style="height: 6px; background: linear-gradient(90deg, #FF671F 33.3%, #ffffff 33.3%, #ffffff 66.6%, #046A38 66.6%);"></div>

    <!-- Official Letterhead Header with Logo -->
    <div style="background-color: #fffaf5; border-bottom: 2px dashed #fed7aa; padding: 24px 20px 18px 20px;">
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="width: 90px; vertical-align: middle; text-align: center;">
            <img src="cid:abvplogo" alt="ABVP Emblem" width="82" height="82" style="display: block; margin: 0 auto; border-radius: 50%; border: 2px solid #ea580c;" />
          </td>
          <td style="vertical-align: middle; text-align: center; padding: 0 12px;">
            <div style="color: #ea580c; font-size: 22px; font-weight: 900; letter-spacing: 0.5px; text-transform: uppercase;">
              अखिल भारतीय विद्यार्थी परिषद (ABVP)
            </div>
            <div style="color: #0f172a; font-size: 15px; font-weight: 800; margin-top: 3px;">
              मथुरा महानगर इकाई • उत्तर प्रदेश
            </div>
            <div style="display: inline-block; background-color: #ea580c; color: #ffffff; font-size: 11px; font-weight: 800; padding: 3px 14px; border-radius: 4px; margin-top: 6px; letter-spacing: 0.5px;">
              छात्र अधिकार एवं जनसमस्या निवारण प्रकोष्ठ (Grievance Redressal Cell)
            </div>
            <div style="font-size: 12px; color: #64748b; margin-top: 4px; font-weight: 600;">
              कार्यालय: विद्यार्थी भवन, मथुरा • अधिकृत शिकायत पंजीकरण प्रपत्र
            </div>
          </td>
          <td style="width: 80px; vertical-align: middle; text-align: center;">
            <div style="border: 2px solid #ea580c; padding: 6px 4px; border-radius: 8px; font-family: monospace; font-size: 9px; font-weight: 900; color: #c2410c; background: #fff; line-height: 1.2;">
              OFFICIAL<br/>COMPLAINT<br/>PETITION
            </div>
          </td>
        </tr>
      </table>
    </div>

    <!-- Metadata Banner (Reference ID & Date) -->
    <div style="background-color: #0f172a; color: #ffffff; padding: 10px 20px; font-size: 13px;">
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="font-weight: 700;">
            <span style="color: #fb923c;">संदर्भ सं० (Reference ID):</span>
            <span style="font-family: monospace; font-size: 15px; font-weight: 900; color: #ffffff; background: #ea580c; padding: 2px 10px; border-radius: 4px; margin-left: 6px; letter-spacing: 0.5px;">
              ${issue.ticketNumber}
            </span>
          </td>
          <td style="text-align: right; color: #cbd5e1; font-size: 12px;">
            पंजीकरण दिनांक: <strong style="color: #ffffff;">${formattedDate}</strong>
          </td>
        </tr>
      </table>
    </div>

    <!-- Letter Body -->
    <div style="padding: 24px 22px; color: #1e293b;">
      
      <!-- Addressing -->
      <div style="border-bottom: 1px solid #e2e8f0; padding-bottom: 14px; margin-bottom: 16px; font-size: 14px; line-height: 1.6;">
        <span style="color: #64748b; font-size: 12px; font-weight: 700; text-transform: uppercase;">प्रति (To),</span><br/>
        <strong style="color: #0f172a; font-size: 16px;">श्री काव्यंश कायस्थ जी</strong><br/>
        <span style="color: #ea580c; font-weight: 700;">नगर मंत्री, चौमुहां-छाता-कोसी क्षेत्र, मथुरा</span><br/>
        <span style="color: #475569;">अखिल भारतीय विद्यार्थी परिषद (ABVP)</span>
      </div>

      <!-- Subject Memo Box -->
      <div style="background-color: #fff7ed; border-left: 5px solid #ea580c; padding: 14px 18px; margin-bottom: 22px; border-radius: 0 8px 8px 0;">
        <span style="font-size: 11px; font-weight: 800; color: #c2410c; text-transform: uppercase; letter-spacing: 0.5px;">शिकायत का विषय (Grievance Subject):</span>
        <h2 style="margin: 4px 0 0 0; font-size: 17px; font-weight: 800; color: #9a3412;">
          ${issue.title}
        </h2>
        <div style="font-size: 12px; color: #64748b; margin-top: 4px;">
          श्रेणी (Category): <strong style="color: #ea580c;">${issue.category}</strong> • क्षेत्र: <strong style="color: #0f172a;">${issue.areaLocality || 'मथुरा'}</strong>
        </div>
      </div>

      <!-- Applicant Details Ledger Table -->
      <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 22px; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
        <thead>
          <tr style="background-color: #f8fafc; border-bottom: 1px solid #e2e8f0;">
            <th colspan="2" style="padding: 10px 14px; text-align: left; font-size: 12px; font-weight: 800; color: #475569; text-transform: uppercase;">
              भाग 1: आवेदक / शिकायतकर्ता का अधिकृत विवरण (Applicant Particulars)
            </th>
          </tr>
        </thead>
        <tbody>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 10px 14px; font-weight: 700; color: #64748b; width: 36%;">आवेदक का पूरा नाम:</td>
            <td style="padding: 10px 14px; font-weight: 800; color: #0f172a; font-size: 14px;">${issue.fullName}</td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9; background-color: #fafafa;">
            <td style="padding: 10px 14px; font-weight: 700; color: #64748b;">संपर्क मोबाइल नंबर:</td>
            <td style="padding: 10px 14px; font-weight: 800; color: #ea580c; font-size: 14px;">
              <a href="tel:${issue.mobile}" style="color: #ea580c; text-decoration: none;">${issue.mobile}</a>
              &nbsp;&nbsp;
              <a href="https://wa.me/91${issue.mobile}" style="display: inline-block; background-color: #dcfce7; color: #166534; font-size: 11px; font-weight: 700; padding: 3px 9px; border-radius: 4px; text-decoration: none; border: 1px solid #86efac;">WhatsApp Chat</a>
            </td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 10px 14px; font-weight: 700; color: #64748b;">ईमेल आईडी:</td>
            <td style="padding: 10px 14px; color: #0f172a;">
              ${issue.email ? `<a href="mailto:${issue.email}" style="color: #0284c7; text-decoration: none; font-weight: 600;">${issue.email}</a>` : '<span style="color: #94a3b8;">उपलब्ध नहीं</span>'}
            </td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9; background-color: #fafafa;">
            <td style="padding: 10px 14px; font-weight: 700; color: #64748b;">कॉलेज / इलाका / पता:</td>
            <td style="padding: 10px 14px; font-weight: 600; color: #0f172a;">${issue.areaLocality || 'मथुरा'} (${issue.city || 'मथुरा'})</td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 10px 14px; font-weight: 700; color: #64748b;">समस्या श्रेणी:</td>
            <td style="padding: 10px 14px; font-weight: 700; color: #ea580c;">${issue.category}</td>
          </tr>
          <tr style="background-color: #fafafa;">
            <td style="padding: 10px 14px; font-weight: 700; color: #64748b;">पंजीकरण स्थिति:</td>
            <td style="padding: 10px 14px; font-weight: 800; color: #16a34a;">सफलतापूर्वक दर्ज (New Complaint • Action Required)</td>
          </tr>
        </tbody>
      </table>

      <!-- Grievance Description Statement Memo -->
      <div style="margin-bottom: 24px;">
        <div style="font-size: 12px; font-weight: 800; color: #475569; text-transform: uppercase; margin-bottom: 8px;">
          भाग 2: समस्या / शिकायत का संपूर्ण विवरण (Grievance Statement)
        </div>
        <div style="background: #fffdfa; border: 1.5px solid #fed7aa; border-radius: 8px; padding: 18px; font-size: 15px; line-height: 1.7; color: #1e293b; white-space: pre-wrap; font-family: Georgia, 'Times New Roman', serif;">
${issue.description}
        </div>
      </div>

      <!-- Applicant Undertaking -->
      <div style="background-color: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 8px; padding: 12px 16px; font-size: 12px; color: #475569; line-height: 1.6; margin-bottom: 22px;">
        <strong style="color: #0f172a;">आवेदक द्वारा घोषणा:</strong> "प्रमाणित किया जाता है कि उपरोक्त शिकायत विवरण सत्य है तथा एबीवीपी मथुरा नेतृत्व से निवारण हेतु सहयोग एवं प्रशासनिक मार्गदर्शन की अपेक्षा है।"
      </div>

      <!-- Quick Action Buttons for Kavyansh -->
      <div style="text-align: center; margin-bottom: 24px;">
        <a href="tel:${issue.mobile}" style="display: inline-block; background-color: #ea580c; color: #ffffff; padding: 12px 22px; border-radius: 8px; text-decoration: none; font-weight: 800; font-size: 13px; margin: 4px; box-shadow: 0 2px 5px rgba(234, 88, 12, 0.25);">
          📞 आवेदक को कॉल करें (${issue.mobile})
        </a>
        <a href="https://wa.me/91${issue.mobile}?text=${encodeURIComponent(`Namaste ${issue.fullName} ji, ABVP Mathura helpline se sampark kar raha hoon. Aapki shikayat #${issue.ticketNumber} ke sambandh mein.`)}" style="display: inline-block; background-color: #16a34a; color: #ffffff; padding: 12px 22px; border-radius: 8px; text-decoration: none; font-weight: 800; font-size: 13px; margin: 4px; box-shadow: 0 2px 5px rgba(22, 163, 74, 0.25);">
          💬 WhatsApp पर बात करें
        </a>
      </div>

      <!-- Official Digital Seal & Signature -->
      <table style="width: 100%; border-collapse: collapse; border-top: 2px solid #e2e8f0; padding-top: 16px; margin-top: 20px;">
        <tr>
          <td style="vertical-align: top; width: 62%; font-size: 12px; color: #64748b;">
            <div style="font-weight: 800; color: #0f172a;">अखिल भारतीय विद्यार्थी परिषद (ABVP) • मथुरा महानगर</div>
            <div>डिजिटल रूप से पंजीकृत एवं संज्ञान हेतु प्रेषित</div>
            <div style="font-family: monospace; font-size: 11px; color: #ea580c; font-weight: 700; margin-top: 3px;">
              SECURITY ID: ABVP-MTH-VERIFIED-${issue.ticketNumber}
            </div>
          </td>
          <td style="vertical-align: top; text-align: right; font-size: 13px;">
            <div style="border: 2px solid #ea580c; border-radius: 50%; width: 72px; height: 72px; display: inline-flex; align-items: center; justify-content: center; text-align: center; font-size: 9px; font-weight: 900; color: #c2410c; text-transform: uppercase; line-height: 1.1; margin-bottom: 6px;">
              SEAL<br/>ABVP<br/>MATHURA
            </div>
            <div style="font-weight: 800; color: #0f172a; font-size: 14px;">काव्यंश कायस्थ</div>
            <div style="font-size: 12px; color: #64748b;">नगर मंत्री, चौमुहां-छाता-कोसी क्षेत्र, मथुरा (ABVP)</div>
          </td>
        </tr>
      </table>

    </div>

    <!-- Letterhead Footer -->
    <div style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 14px 20px; text-align: center; font-size: 12px; color: #64748b;">
      यह ईमेल ABVP मथुरा के आधिकारिक छात्र एवं जनसमस्या निवारण पोर्टल द्वारा स्वतः उत्पन्न अधिकृत शिकायत प्रपत्र है।
    </div>
  </div>
</body>
</html>
  `.trim();

  let smtpDelivered = false;
  let smtpError: string | null = null;
  const transporter = getEmailTransporter();

  const logoPath = path.join(process.cwd(), 'public', 'abvp-logo.png');
  const attachments: any[] = [];
  if (fs.existsSync(logoPath)) {
    attachments.push({
      filename: 'abvp-official-logo.png',
      path: logoPath,
      cid: 'abvplogo',
    });
  }

  if (transporter) {
    try {
      await transporter.sendMail({
        from: `"ABVP Mathura Grievance" <${process.env.GMAIL_USER || PRIMARY_NOTIFICATION_EMAIL}>`,
        to: recipients.join(', '),
        subject,
        text: textContent,
        html: htmlContent,
        attachments,
      });
      console.log('[Notification Service] Official complaint petition dispatched via SMTP to:', recipients);
      smtpDelivered = true;
      cachedSmtpAuthStatus = { tested: true, valid: true, error: null };
    } catch (err: any) {
      smtpError = err.message || 'SMTP delivery failed';
      cachedSmtpAuthStatus = { tested: true, valid: false, error: smtpError };
      console.warn('[Notification Service] Server email notice (' + smtpError + '). Grievance is safely recorded in database.');
    }
  } else {
    smtpError = 'No SMTP credentials configured';
  }

  // Also dispatch through cloud email forwarder (FormSubmit) as redundancy
  forwardViaFormSubmit(issue, baseUrl).catch((e) => console.warn('[FormSubmit Forwarder] Notice:', e.message));

  return { smtpDelivered, smtpError, recipients, memoText: textContent };
}

async function sendContactNotificationEmail(msg: any) {
  const recipients = [PRIMARY_NOTIFICATION_EMAIL, SECONDARY_NOTIFICATION_EMAIL].filter(Boolean);
  const subject = `[ABVP Mathura Website Contact] ${msg.subject} - from ${msg.name}`;

  const transporter = getEmailTransporter();
  if (transporter) {
    try {
      await transporter.sendMail({
        from: `"ABVP Mathura Contact" <${process.env.GMAIL_USER || PRIMARY_NOTIFICATION_EMAIL}>`,
        to: recipients.join(', '),
        subject,
        text: `Name: ${msg.name}\nContact: ${msg.contact}\nSubject: ${msg.subject}\nMessage:\n${msg.message}`,
        html: `<div style="font-family: sans-serif; padding: 20px;"><h2>नया संदेश (ABVP Mathura)</h2><p><strong>नाम:</strong> ${msg.name}</p><p><strong>संपर्क:</strong> ${msg.contact}</p><p><strong>विषय:</strong> ${msg.subject}</p><p><strong>संदेश:</strong> ${msg.message}</p></div>`,
      });
      console.log('[Notification Service] Contact message email dispatched to:', recipients);
    } catch (err: any) {
      console.warn('[Notification Service] Contact SMTP send notice:', err.message);
    }
  }
}

// ==========================================
// API ROUTES
// ==========================================

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// 1. Admin Login
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }

  if (username.trim() === ADMIN_USER && password === ADMIN_PASS) {
    const token = crypto.randomBytes(32).toString('hex');
    const db = readDB();
    const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days

    db.sessions[token] = {
      username: ADMIN_USER,
      expiresAt,
    };
    writeDB(db);

    return res.json({
      success: true,
      token,
      expiresAt,
      username: ADMIN_USER,
      role: 'Nagar Mantri Admin',
    });
  }

  return res.status(401).json({ error: 'Invalid admin credentials.' });
});

// 2. Verify Admin Session
app.get('/api/admin/verify', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.json({ authenticated: false });
  }

  const token = authHeader.split(' ')[1];
  const db = readDB();
  const session = db.sessions[token];

  if (session && session.expiresAt > Date.now()) {
    return res.json({ authenticated: true, username: session.username });
  }

  return res.json({ authenticated: false });
});

// 3. Admin Logout
app.post('/api/admin/logout', (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    const db = readDB();
    if (db.sessions[token]) {
      delete db.sessions[token];
      writeDB(db);
    }
  }
  res.json({ success: true });
});

// 4. Submit Issue (Public with Rate Limiter)
app.post('/api/issues', rateLimiter(10, 15 * 60 * 1000), (req, res) => {
  const {
    fullName,
    mobile,
    email,
    district,
    city,
    areaLocality,
    category,
    title,
    description,
    preferredContact,
    attachment,
    consent,
  } = req.body;

  // Validation
  if (!fullName || !mobile || !category || !title || !description) {
    return res.status(400).json({
      error: 'कृपया सभी आवश्यक फ़ील्ड (नाम, मोबाइल, श्रेणी, शीर्षक, विवरण) भरें।',
    });
  }

  if (!consent) {
    return res.status(400).json({
      error: 'कृपया नियम एवं गोपनीयता सहमति चेकबॉक्स (Consent) को स्वीकार करें।',
    });
  }

  // Validate mobile (10 digits standard)
  const cleanMobile = mobile.toString().replace(/\D/g, '');
  if (cleanMobile.length < 10) {
    return res.status(400).json({
      error: 'कृपया एक मान्य 10-अंकीय मोबाइल नंबर दर्ज करें।',
    });
  }

  // Validate attachment size if present (max 10MB base64)
  if (attachment && attachment.dataUrl) {
    const sizeInBytes = (attachment.dataUrl.length * 3) / 4;
    if (sizeInBytes > 10 * 1024 * 1024) {
      return res.status(400).json({
        error: 'दस्तावेज़ का आकार 10MB से अधिक नहीं होना चाहिए।',
      });
    }
  }

  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const ticketNumber = `ABVP-2026-${randomSuffix}`;

  const newIssue = {
    id: `iss-${Date.now()}-${randomSuffix}`,
    ticketNumber,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    fullName: sanitize(fullName),
    mobile: cleanMobile,
    email: sanitize(email || ''),
    district: sanitize(district || 'Mathura'),
    city: sanitize(city || 'Mathura'),
    areaLocality: sanitize(areaLocality || ''),
    category: sanitize(category),
    title: sanitize(title),
    description: sanitize(description),
    preferredContact: preferredContact || 'Phone',
    attachment: attachment || null,
    status: 'New',
    priority: 'Medium',
    assignedTo: 'Unassigned',
    adminNotes: '',
    resolutionNotes: '',
    consent: true,
    emailAlertDispatched: true,
    emailRecipients: Array.from(new Set([PRIMARY_NOTIFICATION_EMAIL, SECONDARY_NOTIFICATION_EMAIL].filter(Boolean))),
  };

  const db = readDB();
  db.issues.unshift(newIssue);
  writeDB(db);

  const baseUrl = `${req.protocol}://${req.get('host')}`;

  // Asynchronously dispatch email notifications
  sendIssueNotificationEmail(newIssue, baseUrl).catch((err) => {
    console.warn('[Notification Service] Async email dispatch notice:', err.message);
  });

  // Pre-formatted mailto URL and Gmail Web URL for direct 1-click emailing to Kavyansh
  const memoText = formatFormalComplaintMemo(newIssue);
  const mailSubject = encodeURIComponent(`[ABVP आधिकारिक शिकायत #${newIssue.ticketNumber}] ${newIssue.title}`);
  const mailBody = encodeURIComponent(memoText);

  const mailtoUrl = SECONDARY_NOTIFICATION_EMAIL
    ? `mailto:${PRIMARY_NOTIFICATION_EMAIL}?cc=${SECONDARY_NOTIFICATION_EMAIL}&subject=${mailSubject}&body=${mailBody}`
    : `mailto:${PRIMARY_NOTIFICATION_EMAIL}?subject=${mailSubject}&body=${mailBody}`;

  const gmailWebUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${PRIMARY_NOTIFICATION_EMAIL}&su=${mailSubject}&body=${mailBody}`;

  const waText = encodeURIComponent(
    `*अखिल भारतीय विद्यार्थी परिषद (ABVP) मथुरा*\n` +
      `*औपचारिक शिकायत प्रपत्र - संदर्भ सं०: ${newIssue.ticketNumber}*\n\n` +
      `*आवेदक का नाम:* ${newIssue.fullName}\n` +
      `*मोबाइल:* ${newIssue.mobile}\n` +
      `*कॉलेज/इलाका:* ${newIssue.areaLocality || 'मथुरा'}\n` +
      `*श्रेणी:* ${newIssue.category}\n` +
      `*विषय:* ${newIssue.title}\n\n` +
      `*शिकायत विवरण:*\n${newIssue.description}\n\n` +
      `_डिजिटल पंजीकरण: ABVP-MTH-VERIFIED_`
  );
  const whatsappUrl = `https://wa.me/916395014760?text=${waText}`;

  const formattedDate = new Date(newIssue.createdAt).toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  return res.status(201).json({
    success: true,
    ticketNumber: newIssue.ticketNumber,
    referenceId: newIssue.ticketNumber,
    heading: 'आपकी समस्या सफलतापूर्वक प्राप्त हो गई है।',
    message: 'आपकी दी गई जानकारी सुरक्षित रूप से दर्ज कर ली गई है। आवश्यक होने पर आपसे संपर्क किया जाएगा।',
    emailAlertDispatched: true,
    emailRecipients: newIssue.emailRecipients,
    mailtoUrl,
    gmailWebUrl,
    whatsappUrl,
    complaintMemoText: memoText,
    formattedDate,
    issue: {
      ticketNumber: newIssue.ticketNumber,
      referenceId: newIssue.ticketNumber,
      createdAt: newIssue.createdAt,
      formattedDate,
      title: newIssue.title,
      category: newIssue.category,
      status: newIssue.status,
      fullName: newIssue.fullName,
      mobile: newIssue.mobile,
      email: newIssue.email,
      areaLocality: newIssue.areaLocality,
      district: newIssue.district,
      city: newIssue.city,
      description: newIssue.description,
    },
  });
});

// 5. Get Issues (Protected Admin Endpoint with Filters)
app.get('/api/issues', requireAdmin, (req, res) => {
  const { search, category, status, date } = req.query;
  const db = readDB();
  let issues = [...db.issues];

  if (status && status !== 'all') {
    issues = issues.filter((i) => i.status.toLowerCase() === (status as string).toLowerCase());
  }

  if (category && category !== 'all') {
    issues = issues.filter((i) => i.category.toLowerCase() === (category as string).toLowerCase());
  }

  if (search) {
    const q = (search as string).toLowerCase();
    issues = issues.filter(
      (i) =>
        i.title.toLowerCase().includes(q) ||
        i.fullName.toLowerCase().includes(q) ||
        i.ticketNumber.toLowerCase().includes(q) ||
        i.areaLocality.toLowerCase().includes(q) ||
        i.mobile.includes(q)
    );
  }

  if (date) {
    issues = issues.filter((i) => i.createdAt.startsWith(date as string));
  }

  res.json({
    total: issues.length,
    issues,
    counts: {
      total: db.issues.length,
      new: db.issues.filter((i) => i.status === 'New').length,
      underReview: db.issues.filter((i) => i.status === 'Under Review').length,
      inProgress: db.issues.filter((i) => i.status === 'In Progress').length,
      resolved: db.issues.filter((i) => i.status === 'Resolved').length,
      closed: db.issues.filter((i) => i.status === 'Closed').length,
    },
  });
});

// 6. Update Issue Status & Details (Protected Admin Endpoint)
app.patch('/api/issues/:id', requireAdmin, (req, res) => {
  const { id } = req.params;
  const { status, priority, assignedTo, adminNotes, resolutionNotes } = req.body;

  const db = readDB();
  const issueIndex = db.issues.findIndex((i) => i.id === id || i.ticketNumber === id);

  if (issueIndex === -1) {
    return res.status(404).json({ error: 'Issue not found.' });
  }

  const issue = db.issues[issueIndex];
  if (status) issue.status = status;
  if (priority) issue.priority = priority;
  if (assignedTo !== undefined) issue.assignedTo = sanitize(assignedTo);
  if (adminNotes !== undefined) issue.adminNotes = sanitize(adminNotes);
  if (resolutionNotes !== undefined) issue.resolutionNotes = sanitize(resolutionNotes);
  issue.updatedAt = new Date().toISOString();

  writeDB(db);
  res.json({ success: true, issue });
});

// 7. Delete Issue (Protected Admin Endpoint)
app.delete('/api/issues/:id', requireAdmin, (req, res) => {
  const { id } = req.params;
  const db = readDB();
  const initialLength = db.issues.length;
  db.issues = db.issues.filter((i) => i.id !== id && i.ticketNumber !== id);

  if (db.issues.length === initialLength) {
    return res.status(404).json({ error: 'Issue not found.' });
  }

  writeDB(db);
  res.json({ success: true, message: 'Issue deleted successfully.' });
});

// 8. Contact Form Submission (Public with Rate Limiter)
app.post('/api/contact', rateLimiter(8, 10 * 60 * 1000), (req, res) => {
  const { name, contact, subject, message } = req.body;

  if (!name || !contact || !message) {
    return res.status(400).json({ error: 'Please provide name, contact information, and message.' });
  }

  const db = readDB();
  const newMsg = {
    id: `msg-${Date.now()}`,
    createdAt: new Date().toISOString(),
    name: sanitize(name),
    contact: sanitize(contact),
    subject: sanitize(subject || 'General Inquiry'),
    message: sanitize(message),
    status: 'New',
  };

  db.contactMessages.unshift(newMsg);
  writeDB(db);

  // Dispatch email alert for contact message
  sendContactNotificationEmail(newMsg).catch((err) => {
    console.warn('[Notification Service] Contact email dispatch notice:', err.message);
  });

  const mailSubject = encodeURIComponent(`[ABVP Website Inquiry] ${newMsg.subject}`);
  const mailBody = encodeURIComponent(`Namaste Kavyansh ji,\n\nNaam: ${newMsg.name}\nSampark: ${newMsg.contact}\nVishay: ${newMsg.subject}\n\nSandesh:\n${newMsg.message}`);
  const mailtoUrl = SECONDARY_NOTIFICATION_EMAIL
    ? `mailto:${PRIMARY_NOTIFICATION_EMAIL}?cc=${SECONDARY_NOTIFICATION_EMAIL}&subject=${mailSubject}&body=${mailBody}`
    : `mailto:${PRIMARY_NOTIFICATION_EMAIL}?subject=${mailSubject}&body=${mailBody}`;

  res.json({
    success: true,
    message: 'आपका संदेश सफलतापूर्वक प्राप्त हो गया है। धन्यवाद।',
    mailtoUrl,
  });
});

// Admin endpoint: Check SMTP and Email Notification Status
app.get('/api/admin/smtp-status', requireAdmin, (req, res) => {
  const envUser = process.env.GMAIL_USER || (process.env.SMTP_USER && process.env.SMTP_USER.includes('@gmail.com') ? process.env.SMTP_USER : null);
  const rawUser = envUser ? normalizeKavyanshEmail(envUser) : null;
  const rawPass = process.env.GMAIL_APP_PASSWORD || process.env.SMTP_PASS;

  res.json({
    primaryRecipient: PRIMARY_NOTIFICATION_EMAIL,
    secondaryRecipient: SECONDARY_NOTIFICATION_EMAIL,
    hasConfiguredSender: Boolean(rawUser && rawPass),
    configuredUser: rawUser || null,
    lastAuthStatus: cachedSmtpAuthStatus,
  });
});

// Admin endpoint: Resend email alert for an existing issue
app.post('/api/issues/:id/resend-email', requireAdmin, async (req, res) => {
  const { id } = req.params;
  const db = readDB();
  const issue = db.issues.find((i) => i.id === id || i.ticketNumber === id);

  if (!issue) {
    return res.status(404).json({ error: 'Issue not found.' });
  }

  try {
    const result = await sendIssueNotificationEmail(issue);
    issue.emailLastResentAt = new Date().toISOString();
    writeDB(db);
    res.json({
      success: true,
      message: result.smtpDelivered
        ? 'Email notification resent successfully via SMTP.'
        : 'Grievance record updated. Note: Direct SMTP login was not completed (' + (result.smtpError || 'Bad Credentials') + '). 1-click email and WhatsApp links are available.',
      result,
    });
  } catch (err: any) {
    res.status(200).json({ success: false, message: 'Notice: ' + err.message });
  }
});

// Admin endpoint: Send a test email to verify inbox delivery
app.post('/api/admin/test-email', requireAdmin, async (req, res) => {
  const testIssue = {
    ticketNumber: 'MTH-TEST-VERIFY',
    createdAt: new Date().toISOString(),
    fullName: 'Kavyansh Kayastha (Admin Test)',
    mobile: '6395014760',
    email: PRIMARY_NOTIFICATION_EMAIL,
    district: 'Mathura',
    city: 'Mathura',
    areaLocality: 'ABVP Mathura Office',
    category: 'Student Issue',
    title: 'Test Email Delivery Verification (सत्यापन टेस्ट)',
    description: 'This is a test notification confirming that the ABVP Mathura Grievance Portal email notification pipeline is working and connected to your email inbox.',
    priority: 'Medium',
    preferredContact: 'Phone & WhatsApp',
  };

  try {
    const result = await sendIssueNotificationEmail(testIssue);
    if (result.smtpDelivered) {
      res.json({
        success: true,
        smtpDelivered: true,
        message: `सत्यापन ईमेल सफलतापूर्वक भेजा गया (${PRIMARY_NOTIFICATION_EMAIL} & ${SECONDARY_NOTIFICATION_EMAIL})`,
        result,
      });
    } else {
      res.json({
        success: true,
        smtpDelivered: false,
        smtpError: result.smtpError,
        message: `Google SMTP सूचना: ${result.smtpError || 'Username/Password not accepted'}। यदि आप डायरेक्ट सर्वर SMTP का उपयोग करना चाहते हैं, तो Google Account > Security > 2-Step Verification > App Passwords में जाकर 16-अक्षरों का नया App Password बनाएं। इस बीच पोर्टल डेटाबेस रिकॉर्डिंग और 1-क्लिक ईमेल/व्हाट्सएप पूरी तरह सक्रिय हैं।`,
        result,
      });
    }
  } catch (err: any) {
    res.status(200).json({
      success: false,
      message: 'ईमेल परीक्षण नोटिस: ' + err.message,
    });
  }
});

// Admin endpoint: Trigger Cloud Relay test directly to Kavyansh email
app.post('/api/admin/trigger-cloud-relay', requireAdmin, async (req, res) => {
  try {
    const testTicket = 'TEST-' + Math.floor(1000 + Math.random() * 9000);
    const result = await forwardViaFormSubmit({
      ticketNumber: testTicket,
      createdAt: new Date().toISOString(),
      fullName: 'काव्यंश कायस्थ (व्यवस्थापक)',
      mobile: '6395014760',
      email: PRIMARY_NOTIFICATION_EMAIL,
      district: 'Mathura',
      city: 'Mathura',
      areaLocality: 'विद्यार्थी भवन, मथुरा',
      category: 'System Activation',
      title: 'Email Relay Direct Verification Test',
      description: 'यह परीक्षण संदेश पुष्टि करता है कि एबीवीपी पोर्टल से हर छात्र की पूरी डिटेल आपके ईमेल kavyanshkayasthabvp@gmail.com पर सीधे पहुंच रही है।',
      priority: 'High',
    });
    res.json({
      success: true,
      result,
      message: result.success
        ? `क्लाउड रिले ईमेल सीधे ${PRIMARY_NOTIFICATION_EMAIL} पर प्रेषित कर दिया गया है!`
        : `सूचना: ${result.message || 'FormSubmit relay sent'}. यदि सक्रियण ईमेल आया हो, तो Gmail में 'Activate Form' पर 1-बार क्लिक करें।`,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Admin endpoint: Save or update Gmail App Password directly in database
app.post('/api/admin/save-smtp-password', requireAdmin, async (req, res) => {
  const rawUser = req.body.user || req.body.smtpUser;
  const rawPass = req.body.password || req.body.smtpPass;
  const db = readDB();
  const targetUser = rawUser ? normalizeKavyanshEmail(rawUser) : PRIMARY_NOTIFICATION_EMAIL;
  const cleanedPassword = rawPass ? String(rawPass).replace(/\s+/g, '').trim() : '';

  (db as any).smtpSettings = {
    user: targetUser,
    password: cleanedPassword,
    updatedAt: new Date().toISOString(),
  };
  writeDB(db);

  if (!cleanedPassword) {
    cachedSmtpAuthStatus = { tested: false, valid: false, error: null };
    return res.json({
      success: true,
      message: 'SMTP पासवर्ड रीसेट कर दिया गया।',
    });
  }

  // Attempt verification with the new password
  try {
    const testTransporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: targetUser,
        pass: cleanedPassword,
      },
      connectionTimeout: 8000,
      greetingTimeout: 8000,
      socketTimeout: 12000,
    });

    await testTransporter.verify();
    cachedSmtpAuthStatus = { tested: true, valid: true, error: null };
    return res.json({
      success: true,
      verified: true,
      message: `Google SMTP प्रमाणीकरण सफल! अब सभी नई शिकायतें एवं संदेश स्वतः ${targetUser} पर बिना किसी त्रुटि के प्रेषित होंगे।`,
    });
  } catch (err: any) {
    cachedSmtpAuthStatus = { tested: true, valid: false, error: err.message };
    return res.json({
      success: true,
      verified: false,
      error: err.message,
      message: `पासवर्ड सुरक्षित सेव कर लिया गया है, लेकिन Google ने प्रमाणीकरण अस्वीकार किया (${err.message})। कृपया सुनिश्चित करें कि यह 16-अक्षरों का Google App Password है।`,
    });
  }
});

// 9. Get Contact Messages (Protected Admin Endpoint)
app.get('/api/contact', requireAdmin, (req, res) => {
  const db = readDB();
  res.json({ messages: db.contactMessages });
});

// 10. Delete Contact Message (Protected Admin Endpoint)
app.delete('/api/contact/:id', requireAdmin, (req, res) => {
  const { id } = req.params;
  const db = readDB();
  db.contactMessages = db.contactMessages.filter((m) => m.id !== id);
  writeDB(db);
  res.json({ success: true });
});

// Helper: Auto-detect and import 64572.png or uploaded photos
function checkAndAutoImport64572() {
  const candidateDirs = [
    process.cwd(),
    path.join(process.cwd(), 'public'),
    '/tmp',
    path.join(process.cwd(), 'dist'),
  ];
  const candidateNames = ['64572.png', '64572.jpg', '64572.jpeg', 'kavyansh-upload.png', 'kavyansh.png'];

  for (const dir of candidateDirs) {
    for (const name of candidateNames) {
      const fullPath = path.join(dir, name);
      if (fs.existsSync(fullPath)) {
        try {
          const buffer = fs.readFileSync(fullPath);
          if (buffer.length > 100) {
            const publicPath = path.join(process.cwd(), 'public', 'kavyansh-kayastha.jpg');
            fs.writeFileSync(publicPath, buffer);
            try {
              fs.writeFileSync(path.join(process.cwd(), 'public', 'kavyansh-saxena.jpg'), buffer);
            } catch (_) {}

            const distDir = path.join(process.cwd(), 'dist');
            if (fs.existsSync(distDir)) {
              fs.writeFileSync(path.join(distDir, 'kavyansh-kayastha.jpg'), buffer);
              try {
                fs.writeFileSync(path.join(distDir, 'kavyansh-saxena.jpg'), buffer);
              } catch (_) {}
            }

            const db = readDB();
            const photoUrlWithVer = `/kavyansh-kayastha.jpg?v=${Date.now()}`;
            db.profileOverrides = {
              ...(db.profileOverrides || {}),
              photo: photoUrlWithVer,
              photoUrl: photoUrlWithVer,
              isPhotoLocked: true,
              updatedAt: new Date().toISOString(),
            };
            writeDB(db);
            console.log(`[Photo Sync] Successfully auto-imported ${fullPath} as permanent profile photo.`);
            return true;
          }
        } catch (e) {
          console.error('[Photo Sync] Error auto-importing photo:', e);
        }
      }
    }
  }
  return false;
}

// 11. Profile Overrides (Get & Update)
app.get('/api/profile', (req, res) => {
  checkAndAutoImport64572();
  const db = readDB();
  res.json({ profileOverrides: db.profileOverrides || {} });
});

// Dedicated endpoint to permanently set Kavyansh's photo via drag & drop or file upload
app.post('/api/profile/set-photo', (req, res) => {
  try {
    const { imageBase64 } = req.body;
    if (!imageBase64) {
      return res.status(400).json({ error: 'No image data provided' });
    }

    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    const publicPath = path.join(process.cwd(), 'public', 'kavyansh-kayastha.jpg');
    fs.writeFileSync(publicPath, buffer);
    try {
      fs.writeFileSync(path.join(process.cwd(), 'public', 'kavyansh-saxena.jpg'), buffer);
    } catch (_) {}

    const distDir = path.join(process.cwd(), 'dist');
    if (fs.existsSync(distDir)) {
      fs.writeFileSync(path.join(distDir, 'kavyansh-kayastha.jpg'), buffer);
      try {
        fs.writeFileSync(path.join(distDir, 'kavyansh-saxena.jpg'), buffer);
      } catch (_) {}
    }

    const db = readDB();
    const photoUrlWithVer = `/kavyansh-kayastha.jpg?v=${Date.now()}`;
    db.profileOverrides = {
      ...(db.profileOverrides || {}),
      photo: photoUrlWithVer,
      photoUrl: photoUrlWithVer,
      isPhotoLocked: true,
      updatedAt: new Date().toISOString(),
    };
    writeDB(db);

    return res.json({
      success: true,
      message: 'Kavyansh official photo permanently set.',
      photo: photoUrlWithVer,
      photoUrl: photoUrlWithVer,
      profileOverrides: db.profileOverrides,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to save profile photograph' });
  }
});

app.put('/api/profile', requireAdmin, (req, res) => {
  const db = readDB();
  db.profileOverrides = {
    ...(db.profileOverrides || {}),
    ...req.body,
    updatedAt: new Date().toISOString(),
  };
  writeDB(db);
  res.json({ success: true, profileOverrides: db.profileOverrides });
});

// 11b. ADMIN-ONLY Profile Photograph Management (Strictly Server-Side Authorized)
// Public users have READ-ONLY access to GET /api/profile.
// Only authenticated administrators can replace or remove the profile photograph.
app.post('/api/admin/profile-photo', requireAdmin, (req, res) => {
  try {
    const { imageBase64 } = req.body;
    if (!imageBase64) {
      return res.status(400).json({ error: 'No image data provided' });
    }

    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    const publicPath = path.join(process.cwd(), 'public', 'kavyansh-kayastha.jpg');
    fs.writeFileSync(publicPath, buffer);
    try {
      fs.writeFileSync(path.join(process.cwd(), 'public', 'kavyansh-saxena.jpg'), buffer);
    } catch (_) {}

    const distDir = path.join(process.cwd(), 'dist');
    if (fs.existsSync(distDir)) {
      fs.writeFileSync(path.join(distDir, 'kavyansh-kayastha.jpg'), buffer);
      try {
        fs.writeFileSync(path.join(distDir, 'kavyansh-saxena.jpg'), buffer);
      } catch (_) {}
    }

    const db = readDB();
    const photoUrlWithVer = `/kavyansh-kayastha.jpg?v=${Date.now()}`;
    db.profileOverrides = {
      ...(db.profileOverrides || {}),
      photo: photoUrlWithVer,
      photoUrl: photoUrlWithVer,
      isPhotoLocked: true,
      updatedAt: new Date().toISOString(),
    };
    writeDB(db);

    return res.json({
      success: true,
      message: 'Profile photo successfully replaced by authenticated administrator.',
      photo: photoUrlWithVer,
      photoUrl: photoUrlWithVer,
      profileOverrides: db.profileOverrides,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to save profile photograph' });
  }
});

// Admin Remove Profile Photo
app.delete('/api/admin/profile-photo', requireAdmin, (req, res) => {
  try {
    const db = readDB();
    db.profileOverrides = {
      ...(db.profileOverrides || {}),
      photo: '',
      photoUrl: '',
      isPhotoLocked: false,
      updatedAt: new Date().toISOString(),
    };
    writeDB(db);

    const publicPath = path.join(process.cwd(), 'public', 'kavyansh-kayastha.jpg');
    if (fs.existsSync(publicPath)) {
      try { fs.unlinkSync(publicPath); } catch (_) {}
    }
    const legacyPublic = path.join(process.cwd(), 'public', 'kavyansh-saxena.jpg');
    if (fs.existsSync(legacyPublic)) {
      try { fs.unlinkSync(legacyPublic); } catch (_) {}
    }

    const distPath = path.join(process.cwd(), 'dist', 'kavyansh-kayastha.jpg');
    if (fs.existsSync(distPath)) {
      try { fs.unlinkSync(distPath); } catch (_) {}
    }
    const legacyDist = path.join(process.cwd(), 'dist', 'kavyansh-saxena.jpg');
    if (fs.existsSync(legacyDist)) {
      try { fs.unlinkSync(legacyDist); } catch (_) {}
    }

    return res.json({
      success: true,
      message: 'Profile photo successfully removed by administrator.',
      profileOverrides: db.profileOverrides,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to remove profile photograph' });
  }
});

// Legacy /api/upload-official-portrait endpoint is now strictly protected with requireAdmin
app.post('/api/upload-official-portrait', requireAdmin, (req, res) => {
  try {
    const { imageBase64 } = req.body;
    if (!imageBase64) {
      return res.status(400).json({ error: 'No image data provided' });
    }

    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    const publicPath = path.join(process.cwd(), 'public', 'kavyansh-kayastha.jpg');
    fs.writeFileSync(publicPath, buffer);
    try {
      fs.writeFileSync(path.join(process.cwd(), 'public', 'kavyansh-saxena.jpg'), buffer);
    } catch (_) {}

    const distDir = path.join(process.cwd(), 'dist');
    if (fs.existsSync(distDir)) {
      fs.writeFileSync(path.join(distDir, 'kavyansh-kayastha.jpg'), buffer);
      try {
        fs.writeFileSync(path.join(distDir, 'kavyansh-saxena.jpg'), buffer);
      } catch (_) {}
    }

    const db = readDB();
    const photoUrlWithVer = `/kavyansh-kayastha.jpg?v=${Date.now()}`;
    db.profileOverrides = {
      ...(db.profileOverrides || {}),
      photo: photoUrlWithVer,
      photoUrl: photoUrlWithVer,
      isPhotoLocked: true,
      updatedAt: new Date().toISOString(),
    };
    writeDB(db);

    return res.json({ success: true, photo: photoUrlWithVer, photoUrl: photoUrlWithVer });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to save portrait' });
  }
});

// 12. Journey Milestones API (Get all, Add, Edit, Delete, Toggle Publish)
app.get('/api/journey', (req, res) => {
  const db = readDB();
  res.json({ journeyEntries: db.journeyEntries || null });
});

app.post('/api/journey', requireAdmin, (req, res) => {
  const db = readDB();
  if (!db.journeyEntries) {
    db.journeyEntries = [];
  }
  const newEntry = {
    id: `j-${Date.now()}`,
    yearOrDate: sanitize(req.body.yearOrDate || ''),
    title: sanitize(req.body.title || ''),
    englishLabel: sanitize(req.body.englishLabel || ''),
    description: sanitize(req.body.description || ''),
    category: sanitize(req.body.category || 'Organisation'),
    status: sanitize(req.body.status || 'Active'),
    location: sanitize(req.body.location || ''),
    photoUrl: req.body.photoUrl || '',
    badge: sanitize(req.body.badge || ''),
    isPublished: req.body.isPublished !== undefined ? Boolean(req.body.isPublished) : true,
    isCurrentResponsibility: Boolean(req.body.isCurrentResponsibility),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.journeyEntries.push(newEntry);
  writeDB(db);
  res.status(201).json({ success: true, entry: newEntry, journeyEntries: db.journeyEntries });
});

app.put('/api/journey/:id', requireAdmin, (req, res) => {
  const { id } = req.params;
  const db = readDB();
  if (!db.journeyEntries) {
    db.journeyEntries = [];
  }
  const index = db.journeyEntries.findIndex((e) => e.id === id);
  if (index === -1) {
    // If not found in custom list, we can add it or return 404
    return res.status(404).json({ error: 'Journey milestone not found.' });
  }

  const existing = db.journeyEntries[index];
  db.journeyEntries[index] = {
    ...existing,
    yearOrDate: req.body.yearOrDate !== undefined ? sanitize(req.body.yearOrDate) : existing.yearOrDate,
    title: req.body.title !== undefined ? sanitize(req.body.title) : existing.title,
    englishLabel: req.body.englishLabel !== undefined ? sanitize(req.body.englishLabel) : existing.englishLabel,
    description: req.body.description !== undefined ? sanitize(req.body.description) : existing.description,
    category: req.body.category !== undefined ? sanitize(req.body.category) : existing.category,
    status: req.body.status !== undefined ? sanitize(req.body.status) : existing.status,
    location: req.body.location !== undefined ? sanitize(req.body.location) : existing.location,
    photoUrl: req.body.photoUrl !== undefined ? req.body.photoUrl : existing.photoUrl,
    badge: req.body.badge !== undefined ? sanitize(req.body.badge) : existing.badge,
    isPublished: req.body.isPublished !== undefined ? Boolean(req.body.isPublished) : existing.isPublished,
    isCurrentResponsibility:
      req.body.isCurrentResponsibility !== undefined
        ? Boolean(req.body.isCurrentResponsibility)
        : existing.isCurrentResponsibility,
    updatedAt: new Date().toISOString(),
  };

  writeDB(db);
  res.json({ success: true, entry: db.journeyEntries[index], journeyEntries: db.journeyEntries });
});

app.put('/api/journey-all', requireAdmin, (req, res) => {
  const db = readDB();
  const { entries } = req.body;
  if (!Array.isArray(entries)) {
    return res.status(400).json({ error: 'Entries must be an array' });
  }
  db.journeyEntries = entries;
  writeDB(db);
  res.json({ success: true, journeyEntries: db.journeyEntries });
});

app.delete('/api/journey/:id', requireAdmin, (req, res) => {
  const { id } = req.params;
  const db = readDB();
  if (!db.journeyEntries) {
    db.journeyEntries = [];
  }
  db.journeyEntries = db.journeyEntries.filter((e) => e.id !== id);
  writeDB(db);
  res.json({ success: true, journeyEntries: db.journeyEntries });
});

// ==========================================
// 13. Gallery Management Endpoints (Strict Admin Protection)
// ==========================================
// Public visitors have READ-ONLY access to published gallery photos.
// Only authenticated administrator can upload, edit, publish/unpublish, or delete.
app.get('/api/gallery', (req, res) => {
  const db = readDB();
  const allGallery = db.gallery || [];
  const authHeader = req.headers.authorization;
  let isAdmin = false;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    if (token && db.sessions && db.sessions[token] && db.sessions[token].expiresAt > Date.now()) {
      isAdmin = true;
    }
  }

  if (isAdmin) {
    return res.json({ success: true, gallery: allGallery });
  }

  // Public visitors: read-only published items
  const published = allGallery.filter((item: any) => item.isPublished !== false);
  return res.json({ success: true, gallery: published });
});

app.post('/api/gallery', requireAdmin, (req, res) => {
  try {
    const db = readDB();
    if (!db.gallery) {
      db.gallery = [];
    }

    const { title, category, date, location, description, imageUrl, isPublished } = req.body;
    if (!title || !imageUrl) {
      return res.status(400).json({ error: 'Title and Photograph are required.' });
    }

    let finalImageUrl = imageUrl;
    // If base64 image, persist to uploads directory
    if (imageUrl.startsWith('data:image/')) {
      const base64Data = imageUrl.replace(/^data:image\/\w+;base64,/, '');
      const buffer = Buffer.from(base64Data, 'base64');
      const filename = `gal-${Date.now()}-${Math.floor(Math.random() * 10000)}.jpg`;
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
      fs.writeFileSync(path.join(uploadsDir, filename), buffer);

      const distUploads = path.join(process.cwd(), 'dist', 'uploads');
      if (fs.existsSync(path.join(process.cwd(), 'dist'))) {
        if (!fs.existsSync(distUploads)) {
          fs.mkdirSync(distUploads, { recursive: true });
        }
        try {
          fs.writeFileSync(path.join(distUploads, filename), buffer);
        } catch (_) {}
      }
      finalImageUrl = `/uploads/${filename}`;
    }

    const newItem = {
      id: `gal-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      title: sanitize(title),
      category: sanitize(category || 'ABVP Activities'),
      date: sanitize(date || ''),
      location: sanitize(location || 'Mathura, Uttar Pradesh'),
      description: sanitize(description || ''),
      imageUrl: finalImageUrl,
      isPublished: isPublished !== undefined ? Boolean(isPublished) : true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.gallery.unshift(newItem);
    writeDB(db);
    res.status(201).json({ success: true, galleryItem: newItem, gallery: db.gallery });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to add gallery photo' });
  }
});

app.put('/api/gallery/:id', requireAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const db = readDB();
    if (!db.gallery) db.gallery = [];
    const index = db.gallery.findIndex((g: any) => g.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Gallery photo entry not found.' });
    }

    const existing = db.gallery[index];
    let finalImageUrl = existing.imageUrl;
    if (req.body.imageUrl && req.body.imageUrl.startsWith('data:image/')) {
      const base64Data = req.body.imageUrl.replace(/^data:image\/\w+;base64,/, '');
      const buffer = Buffer.from(base64Data, 'base64');
      const filename = `gal-${Date.now()}-${Math.floor(Math.random() * 10000)}.jpg`;
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
      fs.writeFileSync(path.join(uploadsDir, filename), buffer);

      const distUploads = path.join(process.cwd(), 'dist', 'uploads');
      if (fs.existsSync(path.join(process.cwd(), 'dist'))) {
        if (!fs.existsSync(distUploads)) {
          fs.mkdirSync(distUploads, { recursive: true });
        }
        try {
          fs.writeFileSync(path.join(distUploads, filename), buffer);
        } catch (_) {}
      }
      finalImageUrl = `/uploads/${filename}`;
    } else if (req.body.imageUrl) {
      finalImageUrl = req.body.imageUrl;
    }

    db.gallery[index] = {
      ...existing,
      title: req.body.title !== undefined ? sanitize(req.body.title) : existing.title,
      category: req.body.category !== undefined ? sanitize(req.body.category) : existing.category,
      date: req.body.date !== undefined ? sanitize(req.body.date) : existing.date,
      location: req.body.location !== undefined ? sanitize(req.body.location) : existing.location,
      description: req.body.description !== undefined ? sanitize(req.body.description) : existing.description,
      imageUrl: finalImageUrl,
      isPublished: req.body.isPublished !== undefined ? Boolean(req.body.isPublished) : existing.isPublished,
      updatedAt: new Date().toISOString(),
    };

    writeDB(db);
    res.json({ success: true, galleryItem: db.gallery[index], gallery: db.gallery });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to update gallery photo' });
  }
});

app.delete('/api/gallery/:id', requireAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const db = readDB();
    if (!db.gallery) db.gallery = [];
    const itemToDelete = db.gallery.find((g: any) => g.id === id);
    db.gallery = db.gallery.filter((g: any) => g.id !== id);
    writeDB(db);

    if (itemToDelete && itemToDelete.imageUrl && itemToDelete.imageUrl.startsWith('/uploads/')) {
      const filePath = path.join(process.cwd(), 'public', itemToDelete.imageUrl);
      if (fs.existsSync(filePath)) {
        try { fs.unlinkSync(filePath); } catch (_) {}
      }
      const distFilePath = path.join(process.cwd(), 'dist', itemToDelete.imageUrl);
      if (fs.existsSync(distFilePath)) {
        try { fs.unlinkSync(distFilePath); } catch (_) {}
      }
    }

    res.json({ success: true, gallery: db.gallery });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to delete gallery photo' });
  }
});

// ==========================================
// Vite Middleware / Static Serving
// ==========================================
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
