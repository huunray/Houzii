Implement Search Result Transfer from Homepage to Explore Page

Implement the interaction where the homepage search bar passes user search parameters to the Explore Properties page and displays results accordingly.

The homepage and explore page UI already exist, so this task is only about connecting the search behavior and displaying the search results state correctly.

Do not redesign the UI.

1. Search Trigger from Homepage

When a user performs a search on the homepage using the search module (location, dates, guests, property type):

Example inputs:

Location
Check-in date
Check-out date
Number of guests
Tab selected (Buy / Rent / Shortlet)

When the user clicks Search, redirect the user to the Explore page and pass these parameters.

Example:

Location: Lekki
Check-in: June 12
Check-out: June 15
Guests: 2
Tab: Shortlet

2. Preserve Search State on Explore Page

When the Explore page loads:

The search fields should automatically populate with the user's inputs.

Example display on Explore page search bar:

Location: Lekki
Dates: Jun 12 – Jun 15
Guests: 2 guests

The correct tab must also be automatically selected.

Example:

If the user searched from the Shortlet tab, the Explore page should default to the Shortlet tab.

3. Display Search Result Context

At the top of the property results section, display a contextual message that confirms the results are based on the user's search.

Example text:

"7 homes found based on your search"

or

"7+ stays available in Lekki for your selected dates"

This message should appear above the property grid.

4. Display Matching Properties

The Explore page should show only the properties that match the search parameters.

Filtering logic should consider:

• location
• availability for selected dates (for shortlets)
• number of guests (capacity filtering if applicable)

Results should populate the existing property card grid already built on the Explore page.

5. Allow Users to Refine Search

After the results appear, users should be able to:

• modify the search location
• adjust dates
• change guest count
• switch tabs between Buy, Rent, and Shortlet
• use the existing filters on the Explore page

When any filter or field changes, the results should update dynamically without leaving the page.

6. Maintain UI Consistency

Do not change the layout of the Explore page.

Use the existing components, including:

• search bar
• tab selector (Buy / Rent / Shortlet)
• property cards
• filters
• sorting controls

This feature only connects the homepage search flow to the explore results state.

7. Expected User Flow

User visits homepage.

User enters:

Location → Lekki
Dates → Jun 12 – Jun 15
Guests → 2
Tab → Shortlet

User clicks Search.

User is redirected to the Explore page, which now shows:

Shortlet tab active
Search fields filled with previous inputs
Results header showing number of properties found
Property cards matching the search

Users can then refine filters or modify their search.

Goal

Ensure a smooth transition from homepage search → explore results page, allowing users to immediately see relevant listings and continue refining their search without re-entering their information.