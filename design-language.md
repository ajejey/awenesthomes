# AweNest Homes Design Language

## Introduction

This document outlines the design language for the AweNest Homes application, a premium online travel agency (OTA) platform. Our design philosophy emphasizes elegance, professionalism, and user-friendliness while maintaining a consistent visual identity across all devices and interfaces.

## Color Palette

### Primary Colors

- **Sky Blue** `#3B82F6` - Our primary brand color, representing trust, tranquility, and reliability
- **Deep Blue** `#1E40AF` - Used for hover states and emphasis
- **Light Blue** `#93C5FD` - Used for backgrounds, highlights, and secondary elements

### Neutral Colors

- **White** `#FFFFFF` - Primary background color
- **Off-White** `#F9FAFB` - Secondary background color for cards and sections
- **Light Gray** `#F3F4F6` - Tertiary background color, used for hover states
- **Medium Gray** `#E5E7EB` - Borders and dividers
- **Dark Gray** `#6B7280` - Secondary text and icons
- **Charcoal** `#1F2937` - Primary text color

### Accent Colors

- **Success Green** `#10B981` - Confirmations, availability, and success states
- **Warning Amber** `#F59E0B` - Warnings and important notifications
- **Error Red** `#EF4444` - Errors and critical alerts
- **Highlight Gold** `#F59E0B` - Special offers, featured properties, and premium listings

## Typography

### Font Family

- **Primary Font**: Inter, sans-serif
- **Fallback Fonts**: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial

### Font Sizes

- **Display**: 36px (2.25rem)
- **Heading 1**: 30px (1.875rem)
- **Heading 2**: 24px (1.5rem)
- **Heading 3**: 20px (1.25rem)
- **Heading 4**: 18px (1.125rem)
- **Body Large**: 16px (1rem)
- **Body**: 14px (0.875rem)
- **Small**: 12px (0.75rem)
- **Tiny**: 10px (0.625rem)

### Font Weights

- **Regular**: 400
- **Medium**: 500
- **Semibold**: 600
- **Bold**: 700

### Line Heights

- **Tight**: 1.25
- **Normal**: 1.5
- **Relaxed**: 1.75

## Spacing System

We use a consistent 4px (0.25rem) base unit for our spacing system:

- **2xs**: 4px (0.25rem)
- **xs**: 8px (0.5rem)
- **sm**: 12px (0.75rem)
- **md**: 16px (1rem)
- **lg**: 24px (1.5rem)
- **xl**: 32px (2rem)
- **2xl**: 48px (3rem)
- **3xl**: 64px (4rem)

## Border Radius

- **None**: 0px
- **Small**: 4px (0.25rem)
- **Medium**: 8px (0.5rem)
- **Large**: 12px (0.75rem)
- **XL**: 16px (1rem)
- **Full**: 9999px (for pills and circles)

## Shadows

- **Small**: `0 1px 2px 0 rgba(0, 0, 0, 0.05)`
- **Medium**: `0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)`
- **Large**: `0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)`
- **XL**: `0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)`

## Component Styles

### Buttons

#### Primary Button
- Background: Sky Blue (`#3B82F6`)
- Text: White
- Hover: Deep Blue (`#1E40AF`)
- Border Radius: Medium (8px)
- Padding: 12px 24px (sm horizontally, md vertically)
- Font Weight: Semibold

#### Secondary Button
- Background: White
- Border: 1px solid Medium Gray (`#E5E7EB`)
- Text: Charcoal (`#1F2937`)
- Hover Background: Light Gray (`#F3F4F6`)
- Border Radius: Medium (8px)
- Padding: 12px 24px (sm horizontally, md vertically)
- Font Weight: Medium

#### Tertiary Button (Text Button)
- Background: Transparent
- Text: Sky Blue (`#3B82F6`)
- Hover: Light Blue (`#93C5FD`) at 10% opacity as background
- Padding: 8px 16px (xs horizontally, sm vertically)
- Font Weight: Medium

### Form Elements

#### Input Fields
- Background: White
- Border: 1px solid Medium Gray (`#E5E7EB`)
- Border Radius: Medium (8px)
- Focus: 2px Sky Blue (`#3B82F6`) outline
- Padding: 12px 16px (sm vertically, md horizontally)
- Text: Charcoal (`#1F2937`)
- Placeholder: Dark Gray (`#6B7280`)

#### Select Dropdowns
- Same styling as input fields
- Custom dropdown icon in Sky Blue

#### Checkboxes and Radio Buttons
- Unchecked Border: 1px solid Medium Gray (`#E5E7EB`)
- Checked Background: Sky Blue (`#3B82F6`)
- Size: 18px (1.125rem)

### Cards

#### Property Cards
- Background: White
- Border: None
- Border Radius: Large (12px)
- Shadow: Medium
- Padding: 16px (md)
- Image Border Radius: Large (12px) at top

#### Information Cards
- Background: Off-White (`#F9FAFB`)
- Border: 1px solid Medium Gray (`#E5E7EB`)
- Border Radius: Medium (8px)
- Padding: 16px (md)

### Navigation

#### Main Navigation
- Background: White
- Shadow: Small
- Active Item: Sky Blue (`#3B82F6`) indicator
- Text: Charcoal (`#1F2937`)
- Hover: Light Gray (`#F3F4F6`)

#### Category Navigation
- Selected: Dark background with white icon
- Unselected: Light gray background with dark icon
- Fixed width for consistent spacing
- Indicator dot for selected state

## Responsive Design

### Breakpoints
- **Mobile**: < 640px
- **Tablet**: 640px - 768px
- **Laptop**: 768px - 1024px
- **Desktop**: 1024px - 1280px
- **Large Desktop**: > 1280px

### Mobile-First Approach
- All components designed for mobile first
- Enhanced layouts for larger screens
- Touch-friendly targets (minimum 44px × 44px)
- Simplified navigation on mobile

## Animations and Transitions

### Durations
- **Fast**: 150ms
- **Normal**: 200ms
- **Slow**: 300ms

### Easing
- **Default**: ease-in-out
- **Entrance**: ease-out
- **Exit**: ease-in
- **Emphasis**: cubic-bezier(0.175, 0.885, 0.32, 1.275)

### Common Animations
- Button hover/press: Scale and color change
- Page transitions: Fade
- Modal entrance/exit: Fade with slight movement
- Loading states: Pulse or spinner in Sky Blue

## Accessibility

- Minimum contrast ratio of 4.5:1 for all text
- Focus states clearly visible for keyboard navigation
- Alternative text for all images
- Semantic HTML structure
- ARIA attributes where appropriate
- Support for screen readers

## Implementation with Tailwind CSS

This design language is implemented using Tailwind CSS with a custom configuration. The primary color (Sky Blue) and other colors are mapped to Tailwind's color system for consistent usage throughout the application.

Example Tailwind classes for primary elements:
- Primary button: `bg-blue-500 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-md`
- Secondary button: `bg-white border border-gray-200 text-gray-800 font-medium py-3 px-6 rounded-md hover:bg-gray-50`
- Input field: `w-full border border-gray-200 rounded-md py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500`

## Usage Guidelines

1. Maintain consistent spacing using the defined spacing system
2. Use the color palette intentionally - primary blue for main actions, accent colors sparingly
3. Follow the typography hierarchy for clear information architecture
4. Ensure all interactive elements have appropriate hover and active states
5. Optimize all components for both mobile and desktop experiences
6. Maintain accessibility standards across all components

## Component Library

The design language is implemented through a set of reusable components that maintain consistency across the application. These components include:

- Navigation bars
- Search interfaces
- Property cards
- Filters and sorting controls
- Forms and input elements
- Modals and overlays
- Loading states
- Error messages
- Success confirmations

Each component adheres to the design principles outlined in this document, ensuring a cohesive user experience throughout the AweNest Homes platform.
