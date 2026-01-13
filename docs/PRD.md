# **Product Requirements Document (PRD)**

## **Title: Sun & Moon Info Web App**

### **Version: 1.0**

### **Last Updated: 2026-01-13**

---

## **Objective**

Create a responsive and lightweight Deno-based web application that displays real-time sun and moon information using a **vanilla JavaScript Custom Element UI**. The app should use the [SunCalc](https://github.com/mourner/suncalc)![Attachment.tiff](file:///Attachment.tiff) library to visualize solar events and optionally show moon visibility. The UI should replicate the visual layout and behavior demonstrated in the current app, maintaining a clean, readable, and informative interface.

---

## **Target Audience**

* General public
* Amateur astronomers
* Outdoor enthusiasts
* Designers and developers looking to understand daylight patterns

---

## **Core Features**

### **1.** ****

### **Location Detection**

* Automatically detect user location using IP geolocation (via [ipinfo.io](https://ipinfo.io/json)![Attachment.tiff](file:///Attachment.tiff)).
* Fallback to a default location (e.g., Skodstrup, Denmark) if detection fails.
* Display the name of the location at the top (e.g., “📍 Herning”).

### **2.** ****

### **Sun Data Display**

* Show the following:
  * Duration of daylight in **xh ym** format.
  * Sunrise and sunset time.
  * Solar noon time.

### **3.** ****

### **Moon Data Display**

* Show moon visibility range in local time.
* Indicate if moonrise and moonset span to the next day.

### **4.** ****

### **Graphical Visualization**

* A **vertical bar graph** representing the 24-hour day segmented into:
  * Night (dark gray)
  * Twilight (red)
  * Daylight (blue)
* Accompanied by **hour labels** from 0 to 24.
* Segments should scale proportionally according to actual times.

### **5.** ****

### **Responsive UI**

* On desktop: 3-column layout (text, map, graph).
* On mobile: Stacked layout with the graph underneath text and map.

---

## **Technical Requirements**

### **Platform**

* **Runtime:** [Deno](https://deno.com/)![Attachment.tiff](file:///Attachment.tiff)
* **Frontend:**
  * Vanilla JS Custom Elements (Web Components)
  * Shadow DOM encapsulation
  * CSS Grid / Flexbox for layout
* **Data Sources:**
  * [SunCalc.js](https://cdnjs.cloudflare.com/ajax/libs/suncalc/1.8.0/suncalc.min.js)![Attachment.tiff](file:///Attachment.tiff)
  * **IP Info: **https://ipinfo.io/json
  * Map static image: [Mapbox Static API](https://docs.mapbox.com/api/maps/static-images/)![Attachment.tiff](file:///Attachment.tiff)

### **Security**

* No backend or user tracking.
* Only client-side requests for public IP/location.

### **External APIs**

* **SunCalc.getTimes()** and **SunCalc.getMoonTimes()** for calculating solar/lunar positions.
* **https://ipinfo.io/json** for IP-based geolocation.
* Mapbox Static Map API (with a hardcoded access token) to render a map image.

---

## **Component Layout**

### **<sun-moon-info lat="56.2635" lng="10.3041"></sun-moon-info>**

**Internals:**

* **.header** – Title and location name.
* **.text-info** – Sun and moon text-based information.
* **.map-container** – Static map from Mapbox.
* **.graph-container** – Vertical bar graph (with hour labels).

---

## **UX & Design**

### **Typography**

* Clean sans-serif font (**Segoe UI**, **Tahoma**, **Verdana**)
* Headings bold and prominent
* Time values shown in **bold** for visibility

### **Colors**


| **Phase** | **Color** |
| ----------- | ----------- |
| Night     | #2c3e50   |
| Twilight  | #e74c3c   |
| Daylight  | #3498db   |

### **Behavior**

* Graph smoothly transitions between segments
* Labels remain fixed and readable on resize

---

## **Responsiveness**


| **Screen** | **Layout**                |
| ------------ | --------------------------- |
| >768px     | Grid: Info                |
| <768px     | Stacked: Info, Map, Graph |

---

## **Out of Scope (for v1)**

* Manual location search
* Real-time tracking of sun/moon
* Lunar phase graphics
* Voice assistant integration

---

## **Milestones**


| **Task**                         | **Deadline** |
| ---------------------------------- | -------------- |
| Setup Deno app structure         | Day 1        |
| **Create**<sun-moon-info>**tag** | Day 2        |
| Implement layout & styles        | Day 3        |
| Integrate SunCalc & IP Info      | Day 4        |
| Render dynamic graph             | Day 5        |
| Final responsive polish          | Day 6        |
| QA & testing                     | Day 7        |

---

## **Acceptance Criteria**

* App renders without errors in Deno
* Component loads and shows correct location
* Sun and moon info are correct for the day
* Vertical bar graph is readable and aligned
* Fully responsive layout behaves correctly on small and large screens
* Only external dependencies are SunCalc, Mapbox, and IPInfo

---

## **Notes**

* The custom element must work standalone via HTML without requiring frameworks
* Avoid use of global styles — rely on Shadow DOM
* Prefer semantic HTML and accessibility-friendly layout where applicable
