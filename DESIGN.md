# Design Documentation

## Visual Layout

### Stream Deck Button Display (144x144px)

```
┌─────────────────────────────────┐
│         Event Name              │ ← Colored Banner (customizable)
│        (white text)             │
├─────────────────────────────────┤
│                                 │
│                                 │
│            42                   │ ← Large number (days remaining)
│      (white, bold)              │
│                                 │
│           days                  │ ← Label
│                                 │
└─────────────────────────────────┘
```

### Property Inspector (Configuration UI)

Organized in three sections:

**Event Settings**
- Event Name (text input)
- Target Date (YYYY-MM-DD format)

**Banner Customization**
- Banner Background Color (color picker)
- Banner Text Color (color picker)
- Banner Font (dropdown selector)
- Banner Font Size (10-24px)

**Main Display Customization**
- Background Color (color picker)
- Text Color (color picker)
- Number Font (dropdown selector)
- Number Font Size (24-72px)
- Label Font Size (12-32px)

## Color Scheme

### Default Colors (All Customizable)
- **Main Background**: `#000000` (black)
- **Main Text**: `#FFFFFF` (white)
- **Banner Background**: `#4CAF50` (Material Green 500)
- **Banner Text**: `#FFFFFF` (white)

### Suggested Banner Colors
- **Green**: `#4CAF50` - Success/Go
- **Blue**: `#2196F3` - Professional
- **Purple**: `#9C27B0` - Creative
- **Orange**: `#FF9800` - Warning/Important
- **Red**: `#F44336` - Urgent
- **Teal**: `#009688` - Calm
- **Pink**: `#E91E63` - Fun

## Typography

### Button Display (All Customizable)
- **Event Name**: Bold, customizable font family and size (default: 24px Arial)
- **Days Number**: Bold, customizable font family and size (default: 48px Arial)
- **Days Label**: Bold, same font as number, customizable size (default: 20px)

### Available Fonts
- Arial
- Helvetica
- Georgia
- Times New Roman
- Courier New
- Verdana
- Trebuchet MS
- Impact

### Property Inspector
- **Labels**: 500 weight, 13px, System Font
- **Inputs**: 13px, System Font
- **Info Text**: 12px, Gray (#888)

## Behavior

### Display States

1. **Not Configured**
   - Shows "?" instead of number
   - Shows "Set Date" as event name
   - Uses default green banner

2. **Future Date**
   - Shows positive number (e.g., "42")
   - Label: "days" or "day"
   - Full color display

3. **Today**
   - Shows "0"
   - Label: "days"
   - Celebrates the day!

4. **Past Date**
   - Shows positive number (e.g., "5")
   - Label: "days ago"
   - Still shows full color

### Update Frequency
- **Midnight**: Precise daily update
- **Hourly**: Backup update every hour
- **On Settings Change**: Immediate update

## Accessibility

- High contrast text (white on dark/colored backgrounds)
- Large, readable numbers
- Clear visual hierarchy
- Truncation with ellipsis for long event names

## Technical Constraints

- **Canvas Size**: 144x144px (1x) or 288x288px (2x for retina)
- **Max Event Name**: 20 characters (will truncate with "...")
- **Date Format**: ISO 8601 (YYYY-MM-DD) from date picker
- **Color Format**: Hex color codes (#RRGGBB)
- **Image Format**: PNG, base64 encoded

## Example Configurations

### Vacation Countdown
- Event Name: "Hawaii Trip"
- Target Date: "2026-08-15"
- Banner Color: "#00BCD4" (Cyan)

### Birthday Countdown
- Event Name: "Mom's Birthday"
- Target Date: "2026-05-22"
- Banner Color: "#E91E63" (Pink)

### Project Deadline
- Event Name: "App Launch"
- Target Date: "2026-03-01"
- Banner Color: "#FF5722" (Deep Orange)

### Conference
- Event Name: "WWDC 2026"
- Target Date: "2026-06-08"
- Banner Color: "#3F51B5" (Indigo)
