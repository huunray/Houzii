Improve Shortlet Calendar Interaction

Refine the calendar component used in the Houzii Shortlet (Stay) date picker to improve clarity between today’s date, selected dates, and the selected date range.

Maintain the Houzii design system, including rounded UI, soft shadows, and the Houzii primary brand color.

The calendar should display two months side-by-side inside a floating card.

1. Today Indicator

Differentiate today's date from selected dates.

Do NOT fill today with the primary color.

Instead:

• Make the date number bold
• Add a small subtle dot indicator below the number

Example:

Today → bold number + small dot

The dot should use the Houzii primary color but remain subtle.

This ensures today's date is visible but not confused with a selected date.

2. Selected Dates (Check-in and Check-out)

When a user selects dates:

The check-in date and check-out date should appear as fully filled circular or rounded shapes using the Houzii primary color.

Text color inside should be white.

These two dates should visually appear as the start and end points of the selection.

3. Date Range Connector

Dates between check-in and check-out should display a soft connector background.

Style:

• Use a very light tint of the primary color
• Rectangle background spanning between the dates
• No border
• Subtle fill

Example:

If the range is:

11 → 13

Display:

11 = filled (check-in)
12 = light connector background
13 = filled (check-out)

4. Range Highlight Style

The connector color should be:

Primary color at 10–15% opacity.

This ensures the range is visible but does not compete with the start/end dates.

5. Hover Interaction

When hovering over dates:

• Light hover state
• Slight background highlight
• Rounded hover container

If hovering between dates before selection:

Show a preview range highlight.

6. Disabled Dates

Past dates should appear:

• faded
• non-clickable
• reduced opacity

7. Calendar Navigation

Include:

• left arrow
• right arrow

to navigate months.

Display two months side-by-side.

Example:

March 2026 | April 2026

8. UX Microcopy

When the user selects the first date:

Show helper text above calendar:

"Select checkout date"

When both dates are selected:

Update the When field to show:

Mar 12 — Mar 21

9. Visual Priority Rules

Priority of date states should be:

Check-in / Check-out (fully filled primary color)

Selected range connector (light tint)

Today indicator (bold + small dot)

Hover state

Disabled dates

10. Design Goal

The calendar should clearly communicate:

• today's date
• the start of the stay
• the end of the stay
• the selected stay range

while keeping the interface clean, minimal, and easy to understand.