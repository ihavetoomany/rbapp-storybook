import Foundation

// "today" reference + money/date formatting — ported from src/data/format.ts.
// Grouping uses regular spaces (sv-SE style) so output matches the RN prototype.

enum RyFormat {
    /// Today at local midnight.
    static let today: Date = Calendar.current.startOfDay(for: Date())

    /// Date-offset helper: today + offsetDays as `YYYY-MM-DD` (design's d()).
    static func d(_ offsetDays: Int) -> String {
        let date = Calendar.current.date(byAdding: .day, value: offsetDays, to: today)!
        let f = DateFormatter()
        f.dateFormat = "yyyy-MM-dd"
        f.locale = Locale(identifier: "en_US_POSIX")
        f.timeZone = TimeZone.current
        return f.string(from: date)
    }

    private static let monthsSv = [
        "jan", "feb", "mar", "apr", "maj", "jun",
        "jul", "aug", "sep", "okt", "nov", "dec",
    ]

    private static let isoParser: DateFormatter = {
        let f = DateFormatter()
        f.dateFormat = "yyyy-MM-dd"
        f.locale = Locale(identifier: "en_US_POSIX")
        f.timeZone = TimeZone.current
        return f
    }()

    static func parse(_ iso: String) -> Date? {
        isoParser.date(from: String(iso.prefix(10)))
    }

    /// Format money: sv-SE grouped integer with regular spaces, minus for
    /// negatives, no currency suffix. `%` renders as e.g. `4,05 %`.
    static func money(_ money: Money?) -> String {
        guard let money else { return "" }
        if money.currency == .percent {
            return String(money.amount).replacingOccurrences(of: ".", with: ",") + " %"
        }
        return grouped(money.amount)
    }

    /// sv-SE grouping of an Int with regular spaces (design's imFmt).
    static func grouped(_ value: Int) -> String {
        let neg = value < 0
        var digits = Array(String(abs(value)))
        var out: [Character] = []
        var count = 0
        for ch in digits.reversed() {
            if count > 0 && count % 3 == 0 { out.append(" ") }
            out.append(ch)
            count += 1
        }
        digits = out.reversed()
        return (neg ? "-" : "") + String(digits)
    }

    /// ISO date → e.g. `14 nov`.
    static func date(_ iso: String?) -> String {
        guard let iso, let date = parse(iso) else { return "" }
        let comps = Calendar.current.dateComponents([.day, .month], from: date)
        guard let day = comps.day, let month = comps.month else { return "" }
        return "\(day) \(monthsSv[month - 1])"
    }

    /// Relative label: Today / Tomorrow / Yesterday / In N days / N days ago / `14 nov`.
    static func relative(_ iso: String?) -> String {
        guard let iso, let date = parse(iso) else { return "" }
        let days = Calendar.current.dateComponents([.day], from: today, to: date).day ?? 0
        switch days {
        case 0: return "Today"
        case 1: return "Tomorrow"
        case -1: return "Yesterday"
        case 2...7: return "In \(days) days"
        case -7 ... -2: return "\(-days) days ago"
        default: return self.date(iso)
        }
    }

    /// Whole days from today to the given ISO due date (negative = overdue).
    static func daysUntil(_ iso: String) -> Int {
        guard let date = parse(iso) else { return 0 }
        return Calendar.current.dateComponents([.day], from: today, to: date).day ?? 0
    }
}
