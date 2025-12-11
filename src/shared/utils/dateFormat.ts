/**
 * YYYY-MM-DD 형식을 "Oct 28"로 변환
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = months[date.getMonth()];
  const day = date.getDate();

  return `${month} ${day}`;
}

/**
 * 24시간제 시간을 12시간제 AM/PM으로 변환
 * 예: "14:30" → "2:30 PM", "09:00" → "9:00 AM"
 */
export function formatTime(timeString: string): string {
  const [hours, minutes] = timeString.split(':').map(Number);

  const period = hours >= 12 ? 'PM' : 'AM';
  const hour12 = hours % 12 || 12; // 0시는 12시로 표시

  return `${hour12}:${minutes.toString().padStart(2, '0')} ${period}`;
}

/**
 * 날짜와 시간을 합쳐서 "Oct 28 · 2:30 PM" 형식으로 반환
 */
export function formatDateTime(dateString: string, timeString: string): string {
  return `${formatDate(dateString)} · ${formatTime(timeString)}`;
}
