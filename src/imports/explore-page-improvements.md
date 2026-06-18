Final UX & Product Improvements for the Explore Page
1. Sticky Search & Filter System

The search and filters should stay accessible while users scroll.

Behavior

Initial state:

Buy | Rent | Shortlet
[Location] [Bedrooms] [Search]
Price | Property Type | Bedrooms | Land Size | More Filters

When the user scrolls:

Sticky Bar
[Location] [Filters] [Sort] [Map]

Filters remain visible and users can refine results without scrolling back up.

Micro-interaction

Smooth transition (200–300 ms)

Search inputs shrink slightly when sticky

2. Dynamic Filters Based on Intent

Filters must adapt based on the tab.

Buy

Focus on property characteristics.

Price
Property Type
Bedrooms
Land Size
Title Type
Bathrooms
Parking

Title Type options:

C of O
Governor’s Consent
Excision
Gazette
Registered Survey
Rent

Focus on living conditions.

Price (per year)
Bedrooms
Property Type
Furnished
Serviced Apartment
Parking
Security
Generator
Water Supply
Estate
Shortlet

Focus on availability and rules.

Check-in
Check-out
Guests
Price per night
Entire apartment
Instant booking

House rules filters:

Events allowed
Parties allowed
Smoking allowed
Pets allowed

Amenities:

WiFi
Pool
Parking
24hr power
Self check-in
3. Smart Filter Chips

Filters should behave like interactive chips.

Example:

Before selection:

Price
Bedrooms
Property Type

After selection:

Price: ₦80M–₦150M
Bedrooms: 3+

Users can remove filters easily.

4. Clear Filters & Filter Count

Add:

Clear All

And show active filter count.

Example:

More Filters (2)
5. Map Discovery Mode

Add a split layout map experience.

Default:

Listings full width

When clicking Show Map:

Listings | Map

Map features:

price pins

property clusters

hover preview

Example pins:

₦120M
₦80M
₦250M

Interaction:

Hover card → highlight map pin
Hover pin → highlight card
6. Compare Mode

Improve compare interaction.

Workflow:

Click Compare
Select cards
Compare Selected

Cards show checkboxes.

Example:

[✓] Property A
[✓] Property B

Comparison opens side panel.

7. Quick View Feature

Users should preview properties without leaving the page.

Interaction:

Click card → side modal opens

Shows:

images

price

beds/baths

location

contact agent

8. Improve Property Cards

Add more helpful information.

Current card:

Image
Title
Beds
Baths
Price

Improve with:

Land size
Property type
Agent badge
Verified tag

Example:

4 Beds • 5 Baths • 420 sqm

Add:

Listed 2 days ago
9. Sorting Options

Improve sorting options.

Add:

Newest
Price Low → High
Price High → Low
Most Popular
Verified Listings
10. Results Context

Improve result feedback.

Instead of:

12 results found

Use:

12 homes for sale in Lekki
11. Empty State UX

If no properties match:

No properties found in Lekki under ₦50M

Suggestions:

Expand search area
Increase budget
Remove filters
12. Mobile UX

On mobile the layout should change.

Top bar:

Search
Filters
Map
Sort

Filters open a bottom sheet.

Map opens full screen.

Cards become vertical stack.

13. Performance Improvements

Add lazy loading for property cards.

Interaction:

Scroll → load more listings

Show loading skeleton.

14. Micro Interactions

Add subtle UI polish.

Examples:

Card hover:

lift + shadow increase

Map pin hover:

pin expands

Filter selection:

chip highlight animation
Complete Prompt to Build the Explore Page

Use this prompt for design/dev tools.

Prompt

Design and implement the Explore Properties page for the Houzii real estate platform. This page allows users to search, filter, compare, and discover properties across Nigeria.

The design must follow the Houzii design system and prioritize fast property discovery.

The page must support three primary user intents:

Buy
Rent
Shortlet

The layout should include a sticky search and filter system, a property listing grid, and an optional map discovery mode.

Page Layout

Use a two-column layout when map mode is active.

Default layout:

Full-width property listings.

When the user clicks “Show Map”:

Left side: property listings
Right side: interactive map

Sticky Search

At the top include a search bar with tabs:

Buy
Rent
Shortlet

Fields:

Location
Bedrooms (Buy/Rent)
Search button

When the Shortlet tab is selected, replace Bedrooms with:

Check-in
Check-out
Guests

The search bar should become sticky when users scroll.

Filter System

Below the search bar include filter chips.

Filters include:

Price
Property Type
Bedrooms
Land Size
More Filters

Filters should display selected values.

Example:

Price: ₦80M – ₦120M
Bedrooms: 3+

Add a Clear All filters button.

Filters must dynamically change depending on the selected tab.

Buy Filters

Price
Property Type
Bedrooms
Land Size
Title Type
Bathrooms
Parking

Title types include:

C of O
Governor’s Consent
Excision
Gazette
Registered Survey

Rent Filters

Price per year
Bedrooms
Property Type
Furnished
Serviced Apartment
Parking
Security
Generator
Water Supply

Shortlet Filters

Check-in date
Check-out date
Guests
Price per night
Entire apartment
Instant booking

House rules filters:

Events allowed
Smoking allowed
Pets allowed

Amenities:

WiFi
Pool
24hr power
Self check-in
Parking

Property Listings

Display the total number of results.

Example:

12 homes for sale in Lekki

Include sorting options:

Newest
Price Low to High
Price High to Low
Most Popular
Verified Listings

Property Cards

Each property card should include:

Image
Price
Property title
Location
Bedrooms and bathrooms
Property type
Land size
Verified badge
Save icon

Add:

Listed date
Agent badge

Cards should include actions:

View Details
Contact Agent
Save

Map Discovery

When map mode is enabled, display a map with property pins.

Pins should show property prices.

Example:

₦120M
₦80M
₦300M

Hovering a property card highlights the map pin.

Hovering a map pin highlights the listing card.

Compare Feature

Enable property comparison.

When Compare is clicked, cards display selection checkboxes.

Users can select multiple listings and click Compare Selected.

Open a comparison panel displaying key details side by side.

Quick Preview

Clicking a property card should open a side modal preview.

Preview includes:

Images
Price
Location
Key features
Contact agent

Mobile Behavior

On mobile:

Search bar remains at the top.
Filters open in a bottom sheet.
Map opens in full screen.
Listings appear in a vertical card layout.