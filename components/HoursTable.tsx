"use client";

import { useEffect, useState } from "react";
import type { Hour } from "@/lib/listings";

const ORDER = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export default function HoursTable({ hours }: { hours: Hour[] }) {
  // Determine "today" on the client so the highlight reflects the visitor's
  // local day rather than the build server's day.
  const [today, setToday] = useState<string | null>(null);
  useEffect(() => {
    setToday(ORDER[(new Date().getDay() + 6) % 7]);
  }, []);

  if (!hours || hours.length === 0) {
    return <p className="muted">Hours are not currently listed for this venue.</p>;
  }

  return (
    <table className="hours">
      <tbody>
        {hours.map((h) => {
          const isToday = h.day === today;
          return (
            <tr key={h.day} className={isToday ? "hours-today" : ""}>
              <th scope="row">
                {h.day}
                {isToday && <span className="hours-badge">Today</span>}
              </th>
              <td className={h.closed ? "muted" : ""}>{h.label}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
