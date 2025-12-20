# Network Visualization Feature

## Overview

A complete interactive network visualization feature has been added to Pathway, allowing users to visually explore how people move between companies using a force-directed graph similar to TalentHunt's layout.

## Features Implemented

### 🎯 Core Features

1. **Force-Directed Network Graph**
   - Interactive circular network layout with D3.js
   - Nodes represent companies with size based on employee movement
   - Links show connections between companies with weight representing transition frequency
   - Smooth animations and transitions

2. **Interactive Elements**
   - **Hover**: Highlights connected nodes and shows tooltip with company info
   - **Click**: Opens detailed side panel with comprehensive metrics
   - **Drag**: Nodes can be repositioned
   - **Zoom/Pan**: Scroll to zoom, drag canvas to pan

3. **Color-Coded Company Types**
   - 🟩 Consulting (Green)
   - 🟦 Banking / Finance (Blue)
   - 🟪 Tech (Purple)
   - 🟧 Private Equity / VC (Orange)
   - 🟨 Other (Yellow)

### 📊 Company Detail Panel

When clicking a company node, a slide-out panel displays:
- Company name and type
- Employee Movement (Incoming/Outgoing)
- Average years before exit
- Most common exit type
- MBA percentage
- Top 3 exit companies with counts and average tenure
- Action buttons for future features (View Details, Compare)

### 🎛️ Filters & Controls

1. **Search Bar**
   - Real-time search to filter companies by name
   - Located at top-left

2. **Legend**
   - Toggle company types on/off
   - Select/Deselect all option
   - Located at bottom-left

3. **Time Window Filter**
   - Past Year / Past 2 Years / All Time
   - (Framework ready - requires date data in exit records)

### 🎨 Design

- Full-screen dark mode canvas
- Subtle grid background for depth
- Smooth animations with Framer Motion
- Backdrop blur effects for modern look
- Responsive design (mobile-friendly)
- Floating instruction panel for first-time users

## File Structure

### New Components

```
components/
├── NetworkGraph.tsx          # Main D3.js force-directed graph
├── CompanyDetailPanel.tsx    # Sidebar with company details
├── NetworkLegend.tsx         # Company type legend with toggles
└── NetworkFilters.tsx        # Search and time window filters
```

### New Pages

```
app/
└── visualize/
    └── page.tsx              # Main visualization page
```

### Utilities

```
lib/
└── networkData.ts            # Generates network data from exit data
```

### Updated Types

```
types/
└── index.ts                  # Added NetworkNode, NetworkLink, NetworkData, CompanyType
```

## Navigation

### From Landing Page
- New "NETWORK VISUALIZATION" button alongside "EXPLORE ALL COMPANIES"
- Gradient purple-blue styling to stand out

### From Explore Page
- "Network View" button in header (desktop and mobile)
- Integrated with existing navigation

### Within Visualization
- Back arrow returns to home
- "View List" button goes to explore page

## Data Processing

The `networkData.ts` utility:
1. Combines all exit data from 11 consulting firms
2. Calculates statistics for each company:
   - Incoming/outgoing transitions
   - Average years before exit
   - Top exit destinations
   - MBA percentage
3. Creates weighted links between companies
4. Categorizes companies by type

## Technical Stack

- **D3.js**: Force simulation and graph rendering
- **Framer Motion**: Smooth animations and transitions
- **TypeScript**: Full type safety
- **Tailwind CSS**: Styling
- **Next.js 14**: App router and client components

## Performance

- Efficient force simulation with configurable parameters
- Smooth 60fps animations
- Lazy loading of detail panel
- Optimized re-renders with React hooks

## Mobile Support

- Touch-friendly interactions
- Tap to show details
- Swipe to close panel
- Responsive layout
- Mobile navigation button

## Future Enhancements

Ready for implementation:
1. **Time Window Filtering**: Requires date fields in exit data
2. **Company Comparison**: Framework in place for side-by-side comparison
3. **Full Detail Views**: Links ready for detailed company pages
4. **Search Highlighting**: Can enhance search with visual highlighting
5. **Export/Share**: Graph can be exported as image or shared via URL

## Usage

1. Navigate to `/visualize` from any page
2. Explore the network by hovering over nodes
3. Click nodes to see detailed information
4. Use the legend to filter by company type
5. Search for specific companies
6. Drag nodes to rearrange the layout
7. Zoom in/out for better views

## Data Source

Uses existing exit data from:
- McKinsey & Company
- BCG (Boston Consulting Group)
- Bain & Company
- Deloitte
- EY (Ernst & Young)
- PwC (PricewaterhouseCoopers)
- KPMG
- Accenture
- Oliver Wyman
- A.T. Kearney
- L.E.K. Consulting

## Browser Support

- Chrome/Edge (recommended)
- Firefox
- Safari
- Mobile browsers (iOS Safari, Chrome Mobile)

## Known Limitations

1. Time window filter is UI-only (needs date data)
2. Company logos are placeholder initials
3. "View Details" and "Compare" buttons are placeholders
4. MBA data estimated from "Graduate Education" industry tags

## Development

To modify the visualization:
- Adjust force parameters in `NetworkGraph.tsx`
- Add more company type mappings in `networkData.ts`
- Customize colors in the `typeColors` object
- Modify layout and positioning in `page.tsx`

---

**Status**: ✅ Fully functional and integrated
**Version**: 1.0
**Last Updated**: November 4, 2025

