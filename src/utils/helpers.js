/**
 * SELAH RHYTHM - Helper Utilities
 * v0.9.45
 */

export const genId = () => Math.random().toString(36).slice(2, 9);

export const fmtTime = (s) => {
  const min = Math.floor(s / 60).toString().padStart(2, "0");
  const sec = (s % 60).toString().padStart(2, "0");
  return min + ":" + sec;
};

export const fmtHour = (h) => 
  h === 0 ? "12 AM" : h === 12 ? "12 PM" : h < 12 ? h + " AM" : (h - 12) + " PM";

export const fmtTimeSlot = (h, m) => {
  const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  const ampm = h < 12 ? 'AM' : 'PM';
  return hour12 + ":" + String(m).padStart(2, '0') + " " + ampm;
};

export const addMinutes = (h, m, dur) => {
  const total = h * 60 + m + dur;
  return { hour: Math.floor(total / 60) % 24, minute: total % 60 };
};

export const fmtDate = (d) => {
  if (!d) return "";
  const x = new Date(d);
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return months[x.getMonth()] + " " + x.getDate();
};

export const fmtDateFull = (d) => {
  if (!d) return "";
  const x = new Date(d);
  const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  return days[x.getDay()] + ", " + fmtDate(d);
};

export const getToday = () => {
  const d = new Date();
  const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return { day: days[d.getDay()], shortDay: days[d.getDay()], date: d.getDate(), shortMonth: months[d.getMonth()] };
};

export const load = (k, d) => {
  try {
    const v = localStorage.getItem("selah_" + k);
    return v ? JSON.parse(v) : d;
  } catch (e) {
    console.error('[SelahDaily Error] localStorage.getItem failed:', k, e);
    return d;
  }
};

export const save = (k, v) => {
  try {
    localStorage.setItem("selah_" + k, JSON.stringify(v));
  } catch (e) {
    console.error('[SelahDaily Error] localStorage.setItem failed:', k, e);
  }
};

export const groupByDate = (tasks) => {
  const groups = {};
  tasks.forEach(t => {
    const d = t.completedAt ? fmtDateFull(t.completedAt) : "Unknown";
    if (!groups[d]) groups[d] = [];
    groups[d].push(t);
  });
  return groups;
};

export const formatEncouragement = (message, firstName) => {
  if (!firstName || !firstName.trim()) {
    return message.replace(/\{name\},?\s*/g, '').replace(/\s+/g, ' ').trim();
  }
  return message.replace(/\{name\}/g, firstName.trim());
};

/**
 * Get time-appropriate greeting with optional personalization
 * @param {Object} profile - User profile with firstName
 * @returns {string} Personalized greeting
 */
export const getGreeting = (profile) => {
  const hour = new Date().getHours();
  const timeGreeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const name = profile?.firstName?.trim();
  return name ? `${timeGreeting}, ${name}` : timeGreeting;
};
