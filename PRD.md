# Planning Guide

A macro-friendly recipe collection site that showcases high-protein, calorie-controlled recipes organized by protein type with flexible filtering capabilities.

**Experience Qualities**: 
1. **Approachable** - The site should feel welcoming and easy to navigate, encouraging users to explore recipes without intimidation
2. **Clean** - A minimal, uncluttered interface that puts recipes front and center with clear typography and organized content
3. **Efficient** - Quick access to recipes through intuitive filtering and search, making meal planning fast and straightforward

**Complexity Level**: Light Application (multiple features with basic state)
This is a content-focused application with filtering and search functionality. It manages recipe data from markdown files, handles multiple filter states, and presents organized recipe collections. The complexity is moderate - more than a simple showcase but less than a full application requiring complex state management.

## Essential Features

### Recipe Display System
- **Functionality**: Parse and display markdown recipe files with frontmatter metadata (category, rating, difficulty, portions)
- **Purpose**: Enable users to add recipes simply by dropping markdown files into a folder
- **Trigger**: Application load / folder scan
- **Progression**: App loads → Scans recipe folder → Parses markdown files → Extracts metadata → Displays recipe cards
- **Success criteria**: All markdown files in the recipes folder appear as cards with correct metadata

### Category Navigation
- **Functionality**: Filter recipes by protein type (Chicken, Ground Beef, Steak, Other)
- **Purpose**: Help users find recipes based on their available ingredients
- **Trigger**: Click on category button/tab
- **Progression**: User clicks category → Filter applies → Recipe grid updates → Shows only matching recipes
- **Success criteria**: Only recipes matching selected category are visible, clear visual indicator of active category

### Multi-Criteria Search
- **Functionality**: Independent filters for rating (1-5 stars), difficulty (Easy/Medium/Hard), and portions (numeric)
- **Purpose**: Allow users to find recipes matching specific criteria for their needs
- **Trigger**: Select filter value from dropdown/selector
- **Progression**: User selects filter → Results update immediately → List shows matching recipes → User can change or clear filter
- **Success criteria**: Each filter works independently, showing all recipes that match the selected criterion

### Recipe Detail View
- **Functionality**: Display full recipe content when selected
- **Purpose**: Provide complete cooking instructions and ingredient lists
- **Trigger**: Click on recipe card
- **Progression**: User clicks card → Detail view opens → Shows full markdown content → User can return to list
- **Success criteria**: Markdown renders properly with formatting, easy navigation back to list

### Homepage Introduction
- **Functionality**: Landing section explaining the macro philosophy (500-600 cal, 40g+ protein per serving)
- **Purpose**: Set expectations and communicate the value proposition of the recipe collection
- **Trigger**: Initial page load
- **Progression**: User arrives → Sees hero section → Reads macro commitment → Browses to recipes
- **Success criteria**: Clear, prominent message about macro targets that's visible immediately

## Edge Case Handling

- **Missing Metadata** - If a recipe file lacks required frontmatter, display it in "Other" category with default values (3 stars, Medium difficulty, 1 portion)
- **Empty Categories** - Show empty state message "No recipes in this category yet" rather than blank space
- **No Search Results** - Display "No recipes match your criteria" with option to clear filters
- **Malformed Markdown** - Gracefully handle parsing errors by showing recipe title with error message instead of breaking the app
- **No Recipes** - Show welcome message with instructions on adding markdown files to the recipes folder

## Design Direction

The design should evoke confidence, clarity, and appetite appeal. It should feel like a professional meal-prep resource - trustworthy for hitting macro targets while still being visually appetizing. The interface should be clean and organized like a well-kept recipe box, with bold typography that feels modern and energetic.

## Color Selection

A vibrant, energetic palette inspired by fresh ingredients and nutritional focus, with high contrast for excellent readability.

- **Primary Color**: Deep Forest Green (oklch(0.45 0.12 155)) - Represents freshness, health, and natural ingredients. Used for primary actions and headers.
- **Secondary Colors**: 
  - Warm Terracotta (oklch(0.65 0.15 35)) - Adds warmth and appetite appeal for category badges and accents
  - Sage Green (oklch(0.75 0.08 150)) - Lighter complement for secondary buttons and hover states
- **Accent Color**: Bright Citrus Orange (oklch(0.70 0.18 50)) - High-energy color for CTAs, ratings, and important highlights
- **Foreground/Background Pairings**:
  - Background (Warm Cream oklch(0.97 0.01 85)): Dark text oklch(0.25 0.02 155) - Ratio 12.1:1 ✓
  - Primary (Deep Forest oklch(0.45 0.12 155)): White text oklch(1 0 0) - Ratio 6.8:1 ✓
  - Accent (Citrus Orange oklch(0.70 0.18 50)): Dark text oklch(0.25 0.02 155) - Ratio 4.9:1 ✓
  - Cards (White oklch(1 0 0)): Dark text oklch(0.25 0.02 155) - Ratio 14.5:1 ✓

## Font Selection

Typography should convey modern simplicity with a touch of editorial quality - trustworthy for following recipes while feeling contemporary and energetic.

- **Primary Font**: Space Grotesk for headings - A geometric sans with distinctive character that feels modern and confident
- **Secondary Font**: Inter for body text - Highly readable at all sizes with excellent screen optimization

- **Typographic Hierarchy**:
  - Hero Title: Space Grotesk Bold/48px/tight letter spacing/-0.02em
  - Section Headers: Space Grotesk SemiBold/32px/normal letter spacing
  - Recipe Card Title: Space Grotesk Medium/20px/tight leading
  - Category Labels: Space Grotesk Medium/14px/uppercase/wide letter spacing/0.05em
  - Body Text: Inter Regular/16px/1.6 line height
  - Recipe Metadata: Inter Medium/14px/muted color
  - Filter Labels: Inter SemiBold/13px/uppercase

## Animations

Animations should provide helpful feedback and create smooth transitions without delaying interactions or feeling overdone.

- **Micro-interactions**: Button hovers have subtle scale (1.02) and color shifts (150ms)
- **Card Interactions**: Recipe cards lift slightly on hover with smooth shadow transition (200ms)
- **Filter Updates**: Recipe grid uses stagger fade-in when filters change (300ms total, 50ms stagger per item)
- **Page Transitions**: Smooth slide-in for recipe detail view (350ms ease-out)
- **Loading States**: Skeleton cards pulse gently while parsing markdown files

## Component Selection

- **Components**:
  - **Card**: Recipe cards with image placeholder, title, metadata badges - Add hover shadow elevation and rounded-xl corners
  - **Badge**: Category labels, difficulty indicators, rating display - Custom colors matching the palette
  - **Button**: Category filters, clear filters action - Solid primary style for active state, outline for inactive
  - **Dialog/Sheet**: Full recipe detail view on mobile (Sheet), dialog on desktop - Slide-in animation
  - **Tabs**: Category navigation (Chicken/Ground Beef/Steak/Other) - Underline style with accent color
  - **Select**: Dropdowns for rating, difficulty, portions filters - Clean styling with icons
  - **Separator**: Dividing sections and filter groups
  - **Input**: Search functionality if needed later - Rounded with icon prefix
  - **ScrollArea**: Recipe content in detail view

- **Customizations**:
  - **RecipeCard**: Custom component combining Card + Badge + metadata display with consistent layout
  - **CategoryTabs**: Custom styled tabs with icons for each protein type
  - **FilterBar**: Custom component grouping Select components with clear visual hierarchy
  - **EmptyState**: Custom component for no results with helpful messaging

- **States**:
  - Buttons: Default has border, hover adds background fill, active state is fully filled with primary color
  - Recipe Cards: Default elevated shadow, hover increases elevation and adds accent border-top
  - Filters: Active filters show accent color, inactive show muted state
  - Tabs: Active tab has accent underline and bold text, inactive tabs are muted

- **Icon Selection**:
  - Category Icons: Chicken (Bird), Ground Beef (Hamburger), Steak (Steak), Other (ForkKnife)
  - Metadata Icons: Star (rating), ChartBar (difficulty), Users (portions)
  - Actions: X (clear filters), MagnifyingGlass (search), ArrowLeft (back navigation)
  - Info: Info (macro information on homepage)

- **Spacing**:
  - Page margins: px-6 md:px-12 lg:px-24
  - Section gaps: gap-12 md:gap-16
  - Card padding: p-6
  - Card grid gap: gap-6
  - Filter group spacing: space-y-4
  - Metadata badge gaps: gap-2

- **Mobile**:
  - Recipe grid: 1 column on mobile, 2 on tablet (md:grid-cols-2), 3 on desktop (lg:grid-cols-3)
  - Filter bar: Vertical stack on mobile, horizontal row on desktop
  - Category tabs: Scrollable horizontal on mobile, full width on desktop
  - Recipe detail: Full-screen sheet on mobile, centered dialog on desktop (max-w-2xl)
  - Hero text: Smaller font sizes on mobile (text-3xl → text-4xl → text-5xl)
  - Navigation: Sticky header on mobile for easy access to filters
