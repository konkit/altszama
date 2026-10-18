const dateWithoutYear = new Intl.DateTimeFormat('en-GB', {weekday: 'short', day: 'numeric', month: 'short'})
const dateWithYear = new Intl.DateTimeFormat('en-GB', {weekday: 'short', day: 'numeric', month: 'short', year: 'numeric'})

// Formats a "yyyy-MM-dd" order date as "Today", "Yesterday", "Mon, 13 Oct" or, for other years, "Mon, 13 Oct 2024"
export function formatOrderDate(isoDate: string, now: Date = new Date()): string {
  const [year, month, day] = isoDate.split("-").map(Number)
  if (!year || !month || !day) {
    return isoDate
  }

  const date = new Date(year, month - 1, day)
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const daysAgo = Math.round((today.getTime() - date.getTime()) / (24 * 60 * 60 * 1000))

  if (daysAgo === 0) {
    return "Today"
  } else if (daysAgo === 1) {
    return "Yesterday"
  } else if (year === now.getFullYear()) {
    return dateWithoutYear.format(date)
  } else {
    return dateWithYear.format(date)
  }
}
