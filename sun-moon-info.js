// Sun & Moon Info Custom Element
class SunMoonInfo extends HTMLElement {
  constructor() {
    super();

    // Create Shadow DOM for style encapsulation
    this.attachShadow({ mode: "open" });

    // Initialize properties
    this.lat = null;
    this.lng = null;
    this.locationName = "";
    this.timezone = null;
    this.timezoneName = null; // IANA timezone name (e.g., 'America/New_York')
    this.map = null;
    this.marker = null;
    this.zoom = 13;
    this.currentDate = new Date(); // Active date for calculations

    // Feature toggles - ALL cards are features now
    this.features = {
      datePicker: true,
      sunInfo: true,
      moonInfo: true,
      moonPhase: true,
      sunElevation: true,
      goldenHour: true,
      compass: true,
      uvIndex: true,
    };

    // Feature tab states (data or info)
    this.featureTabs = {
      datePicker: "feature",
      sunInfo: "feature",
      moonInfo: "feature",
      moonPhase: "feature",
      sunElevation: "feature",
      goldenHour: "feature",
      compass: "feature",
      uvIndex: "feature",
    };

    // Load state from URL or localStorage
    this.loadState();

    // Listen for language changes
    window.addEventListener("languagechange", () => {
      this.render();
      // Re-initialize map and event listeners after render
      this.initializeMap();
      this.attachChartTooltip();
      this.attachLanguageSelector();
      this.attachLocationControls();
      this.attachFeatureEventListeners();
    });
  }

  // Observed attributes for reactivity
  static get observedAttributes() {
    return ["lat", "lng"];
  }

  // Load state from URL query string or localStorage
  loadState() {
    const params = new URLSearchParams(window.location.search);

    // Priority: URL params > localStorage > defaults
    if (params.has("lat") && params.has("lng")) {
      this.lat = parseFloat(params.get("lat"));
      this.lng = parseFloat(params.get("lng"));
    }

    if (params.has("zoom")) {
      this.zoom = parseInt(params.get("zoom"));
    }

    if (params.has("lang")) {
      window.setLanguage(params.get("lang"));
    }

    if (params.has("date")) {
      this.currentDate = new Date(params.get("date"));
    }

    if (params.has("features")) {
      const featuresStr = params.get("features");
      Object.keys(this.features).forEach((key) => {
        this.features[key] = featuresStr.includes(key);
      });
    }

    if (params.has("tabs")) {
      const tabsStr = params.get("tabs");
      const tabPairs = tabsStr.split(",");
      tabPairs.forEach((pair) => {
        const [feature, tab] = pair.split(":");
        if (this.featureTabs[feature]) {
          this.featureTabs[feature] = tab;
        }
      });
    }

    // Load from localStorage if not in URL
    if (!params.has("lat") || !params.has("lng")) {
      const saved = localStorage.getItem("sunMoonState");
      if (saved) {
        try {
          const state = JSON.parse(saved);
          if (state.lat) this.lat = state.lat;
          if (state.lng) this.lng = state.lng;
          if (state.zoom) this.zoom = state.zoom;
          if (state.currentDate) this.currentDate = new Date(state.currentDate);
          if (state.features)
            this.features = { ...this.features, ...state.features };
          if (state.featureTabs)
            this.featureTabs = { ...this.featureTabs, ...state.featureTabs };
        } catch (e) {
          console.error("Failed to load state from localStorage", e);
        }
      }
    }
  }

  // Save current state to localStorage and update URL
  saveState(updateURL = true) {
    const state = {
      lat: this.lat,
      lng: this.lng,
      zoom: this.zoom,
      currentDate: this.currentDate.toISOString(),
      features: this.features,
      featureTabs: this.featureTabs,
    };

    localStorage.setItem("sunMoonState", JSON.stringify(state));

    // Update URL without reload (only for location/zoom changes, not feature toggles)
    if (updateURL) {
      this.updateURL();
    }
  }

  // Generate shareable URL with all current settings
  updateURL() {
    const params = new URLSearchParams();
    params.set("lat", this.lat.toFixed(4));
    params.set("lng", this.lng.toFixed(4));
    params.set("zoom", this.zoom);
    params.set("date", this.currentDate.toISOString().split("T")[0]);
    params.set("lang", window.currentLanguage || "en");

    // Active features
    const activeFeatures = Object.keys(this.features).filter(
      (k) => this.features[k]
    );
    if (activeFeatures.length < Object.keys(this.features).length) {
      params.set("features", activeFeatures.join(","));
    }

    // Tab states (only if not all are 'feature')
    const tabStates = Object.keys(this.featureTabs)
      .filter((k) => this.featureTabs[k] !== "feature")
      .map((k) => `${k}:${this.featureTabs[k]}`);
    if (tabStates.length > 0) {
      params.set("tabs", tabStates.join(","));
    }

    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, "", newUrl);
  }

  // Called when element is added to DOM
  connectedCallback() {
    this.render();
    this.initializeLocation();
    this.attachChartTooltip();
    this.attachLanguageSelector();
    this.attachLocationControls();
  }

  // Attach language selector event listener
  attachLanguageSelector() {
    setTimeout(() => {
      const langSelect = this.shadowRoot.querySelector("#lang-select");
      if (langSelect) {
        langSelect.addEventListener("change", (e) => {
          window.setLanguage(e.target.value);
        });
      }

      // Attach share button event listener
      const shareBtn = this.shadowRoot.querySelector("#share-btn");
      if (shareBtn) {
        shareBtn.addEventListener("click", async () => {
          const url = window.location.href;
          try {
            await navigator.clipboard.writeText(url);
            // Show feedback
            const originalText = shareBtn.textContent;
            shareBtn.textContent = "✓ " + window.t("linkCopied");
            shareBtn.style.background = "rgba(40, 180, 99, 0.8)";
            setTimeout(() => {
              shareBtn.textContent = originalText;
              shareBtn.style.background = "";
            }, 2000);
          } catch (err) {
            console.error("Failed to copy:", err);
            // Fallback: select and copy
            prompt(window.t("shareTitle") + ":", url);
          }
        });
      }
    }, 100);
  }

  // Attach location controls event listeners
  attachLocationControls() {
    setTimeout(() => {
      // Today button - reset to current date
      const todayBtn = this.shadowRoot.querySelector("#today-btn");
      if (todayBtn) {
        // Remove old listener if exists
        if (this.todayBtnHandler) {
          todayBtn.removeEventListener("click", this.todayBtnHandler);
        }

        // Create and store new handler
        this.todayBtnHandler = () => {
          this.currentDate = new Date();
          this.calculateSunMoonData();

          // Update date-picker component first (triggers its own render)
          const datePicker = this.shadowRoot.querySelector("date-picker");
          if (datePicker) {
            datePicker.setAttribute(
              "selected-date",
              this.currentDate.toISOString()
            );
          }

          // Update only data sections without full re-render
          this.updateDataSections();
          this.saveState();
        };

        todayBtn.addEventListener("click", this.todayBtnHandler);
      }

      // GPS button
      const gpsBtn = this.shadowRoot.querySelector("#gps-btn");
      if (gpsBtn) {
        // Remove old listener if exists
        if (this.gpsBtnHandler) {
          gpsBtn.removeEventListener("click", this.gpsBtnHandler);
        }

        this.gpsBtnHandler = async () => {
          if (!navigator.geolocation) {
            alert(window.t("gpsError"));
            return;
          }

          gpsBtn.textContent = "⏳ ...";
          gpsBtn.disabled = true;

          try {
            const position = await new Promise((resolve, reject) => {
              navigator.geolocation.getCurrentPosition(resolve, reject);
            });

            this.lat = position.coords.latitude;
            this.lng = position.coords.longitude;
            this.locationName = await this.reverseGeocode(this.lat, this.lng);

            this.calculateSunMoonData();
            this.render();
            this.initializeMap();
            this.attachChartTooltip();
            this.attachLanguageSelector();
            this.attachLocationControls();
            this.attachFeatureEventListeners();
            this.saveState();

            gpsBtn.textContent = "🌍 " + window.t("getMyLocation");
            gpsBtn.disabled = false;
          } catch (error) {
            console.error("GPS error:", error);
            alert(window.t("gpsError"));
            gpsBtn.textContent = "🌍 " + window.t("getMyLocation");
            gpsBtn.disabled = false;
          }
        };

        gpsBtn.addEventListener("click", this.gpsBtnHandler);
      }

      // Search button
      const searchBtn = this.shadowRoot.querySelector("#search-btn");
      const searchInput = this.shadowRoot.querySelector("#location-search");

      const performSearch = async () => {
        const query = searchInput.value.trim();
        if (!query) return;

        searchBtn.textContent = "⏳ ...";
        searchBtn.disabled = true;

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
              query
            )}&limit=1`
          );
          const results = await response.json();

          if (results.length === 0) {
            const message = `${window.t("locationNotFound")}:\n"${query}"\n\n${window.t("locationSearchHint")}`;
            alert(message);
            searchBtn.textContent = window.t("showButton");
            searchBtn.disabled = false;
            return;
          }

          this.lat = parseFloat(results[0].lat);
          this.lng = parseFloat(results[0].lon);
          this.locationName = results[0].display_name.split(",")[0];
          
          // Get timezone for this location
          this.timezoneName = await this.getTimezoneForLocation(this.lat, this.lng);

          this.calculateSunMoonData();
          this.render();
          this.initializeMap();
          this.attachChartTooltip();
          this.attachLanguageSelector();
          this.attachLocationControls();
          this.attachFeatureEventListeners();
          this.saveState();

          searchBtn.textContent = window.t("showButton");
          searchBtn.disabled = false;
          searchInput.value = "";
        } catch (error) {
          console.error("Search error:", error);
          const message = `${window.t("locationSearchError")}:\n"${query}"\n\n${window.t("locationSearchHint")}\n\n${window.t("technicalError")}: ${error.message}`;
          alert(message);
          searchBtn.textContent = window.t("showButton");
          searchBtn.disabled = false;
        }
      };

      if (searchBtn) {
        // Remove old listener if exists
        if (this.searchBtnHandler) {
          searchBtn.removeEventListener("click", this.searchBtnHandler);
        }
        this.searchBtnHandler = performSearch;
        searchBtn.addEventListener("click", this.searchBtnHandler);
      }

      if (searchInput) {
        // Remove old listener if exists
        if (this.searchInputHandler) {
          searchInput.removeEventListener("keypress", this.searchInputHandler);
        }
        this.searchInputHandler = (e) => {
          if (e.key === "Enter") {
            performSearch();
          }
        };
        searchInput.addEventListener("keypress", this.searchInputHandler);
      }
    }, 100);
  }

  // Attach tooltip to sun elevation chart
  attachChartTooltip() {
    setTimeout(() => {
      const shadow = this.shadowRoot;
      const overlay = shadow.querySelector(".chart-overlay");
      const tooltip = shadow.querySelector(".chart-tooltip");

      if (!overlay || !tooltip) return;

      const svg = shadow.querySelector(".sun-elevation-chart");
      const width = 220;
      const chartHeight = 100;
      const minAlt = -20;
      const maxAlt = 90;
      const range = maxAlt - minAlt;

      overlay.addEventListener("mousemove", (e) => {
        const rect = svg.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const xRatio = x / rect.width;
        const hour = Math.round(xRatio * 24);

        if (hour < 0 || hour > 23) return;

        // Calculate sun elevation for this hour
        const date = new Date(this.currentDate);
        date.setHours(hour, 0, 0, 0);
        const pos = SunCalc.getPosition(date, this.lat, this.lng);
        const altitude = ((pos.altitude * 180) / Math.PI).toFixed(1);

        // Format hour in location's timezone
        const hourDate = new Date(this.currentDate);
        hourDate.setHours(hour, 0, 0, 0);
        const timeStr = hourDate.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
          timeZone: this.timezoneName || undefined,
        });

        tooltip.textContent = `${timeStr} → ${altitude}°`;
        tooltip.style.display = "block";
        tooltip.style.left = `${e.clientX - rect.left}px`;
        tooltip.style.top = `${e.clientY - rect.top - 25}px`;
      });

      overlay.addEventListener("mouseleave", () => {
        tooltip.style.display = "none";
      });
    }, 100);
  }

  // Called when attributes change
  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this[name] = parseFloat(newValue);
      if (this.lat && this.lng) {
        this.updateData();
      }
    }
  }

  // Initialize location detection
  async initializeLocation() {
    // Skip if already loaded from state
    if (this.lat && this.lng) {
      // Ensure we have timezone if missing
      if (!this.timezoneName) {
        this.timezoneName = await this.getTimezoneForLocation(this.lat, this.lng);
      }
      this.updateData();
      return;
    }

    // Check if lat/lng attributes are provided
    const latAttr = this.getAttribute("lat");
    const lngAttr = this.getAttribute("lng");

    if (latAttr && lngAttr) {
      this.lat = parseFloat(latAttr);
      this.lng = parseFloat(lngAttr);
      this.locationName = "Custom Location";
      // Get timezone for custom location
      this.timezoneName = await this.getTimezoneForLocation(this.lat, this.lng);
      this.updateData();
    } else {
      // Auto-detect location via IP
      await this.detectLocation();
    }
  }

  // Detect location using IPInfo API
  async detectLocation() {
    try {
      const response = await fetch("https://ipinfo.io/json");
      const data = await response.json();

      const [lat, lng] = data.loc.split(",");
      this.lat = parseFloat(lat);
      this.lng = parseFloat(lng);
      this.locationName = data.city || "Unknown";
      
      // Get timezone for this location
      this.timezoneName = await this.getTimezoneForLocation(this.lat, this.lng);

      this.updateData();
    } catch (error) {
      console.error("Location detection failed, using fallback:", error);
      // Fallback to Skodstrup, Denmark
      this.lat = 56.2635;
      this.lng = 10.3041;
      this.locationName = "Skodstrup";
      this.timezoneName = "Europe/Copenhagen";
      this.updateData();
    }
  }

  // Reverse geocode coordinates to get location name
  async reverseGeocode(lat, lng) {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10`
      );
      const data = await response.json();

      // Extract city name from response
      const city =
        data.address?.city ||
        data.address?.town ||
        data.address?.village ||
        data.address?.state ||
        "Unknown";
      
      // Also get timezone for this location
      this.timezoneName = await this.getTimezoneForLocation(lat, lng);
      
      return city;
    } catch (error) {
      console.error("Reverse geocoding failed:", error);
      return "Unknown";
    }
  }

  // Update component data
  updateData() {
    this.calculateSunMoonData();
    this.render();
    this.initializeMap();
  }

  // Update only data sections without full re-render (preserves event listeners)
  updateDataSections() {
    const header = this.shadowRoot.querySelector(".header-center");
    const textInfo = this.shadowRoot.querySelector(".text-info");
    const timeline = this.shadowRoot.querySelector(".timeline-container");

    if (header) {
      header.textContent = `📍 ${
        this.locationName || this.lat.toFixed(4) + ", " + this.lng.toFixed(4)
      }`;
    }
    if (textInfo) {
      textInfo.innerHTML = this.renderTextInfo();
    }
    if (timeline) {
      // Clear existing content
      timeline.innerHTML = `<div class="section-title">${window.t("timeline")}</div>`;
      
      // Create and append timeline-graph as DOM element (not innerHTML)
      const timelineGraph = this.createTimelineGraph();
      if (timelineGraph) {
        timeline.appendChild(timelineGraph);
      }
    }

    // Update feature cards
    const cardsGrid = this.shadowRoot.querySelector(".cards-grid");
    if (cardsGrid) {
      cardsGrid.innerHTML = "";
      cardsGrid.appendChild(this.renderFeatures());
      setTimeout(() => {
        this.attachFeatureEventListeners();
      }, 0);
    }

    // Re-attach chart tooltip
    this.attachChartTooltip();
  }

  // Initialize Leaflet map
  initializeMap() {
    if (!this.lat || !this.lng || typeof L === "undefined") {
      return;
    }

    // Wait for map container to be in DOM
    setTimeout(() => {
      const mapContainer = this.shadowRoot.querySelector("#map");
      if (!mapContainer) return;

      // Destroy existing map if any
      if (this.map) {
        this.map.remove();
        this.map = null;
      }

      // Create new map
      this.map = L.map(mapContainer, {
        zoomControl: true,
        attributionControl: true,
      }).setView([this.lat, this.lng], this.zoom);

      // Add tile layer
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
        maxZoom: 19,
      }).addTo(this.map);

      // Save zoom level when changed
      this.map.on("zoomend", () => {
        this.zoom = this.map.getZoom();
        this.saveState();
      });

      // Add draggable marker
      this.marker = L.marker([this.lat, this.lng], {
        draggable: true,
        autoPan: true,
      }).addTo(this.map);

      // Invalidate size to fix rendering issues
      setTimeout(() => {
        if (this.map) {
          this.map.invalidateSize();
        }
      }, 200);

      // Update location dynamically while dragging
      this.marker.on("drag", async (e) => {
        const position = e.target.getLatLng();
        this.lat = position.lat;
        this.lng = position.lng;

        // Recalculate sun/moon data immediately
        this.calculateSunMoonData();

        // Update UI with coordinates first (instant)
        const header = this.shadowRoot.querySelector(".header-center");
        const textInfo = this.shadowRoot.querySelector(".text-info");
        const timeline = this.shadowRoot.querySelector(".timeline-container");
        const cardsGrid = this.shadowRoot.querySelector(".cards-grid");

        if (header) {
          header.textContent = `📍 ${position.lat.toFixed(
            4
          )}, ${position.lng.toFixed(4)}`;
        }
        if (textInfo) {
          textInfo.innerHTML = this.renderTextInfo();
        }
        if (timeline) {
          timeline.innerHTML = this.renderTimeline();
        }
        if (cardsGrid) {
          cardsGrid.innerHTML = "";
          cardsGrid.appendChild(this.renderFeatures());
          setTimeout(() => {
            this.attachFeatureEventListeners();
          }, 0);
        }
      });

      // Final update when dragging ends - get location name
      this.marker.on("dragend", async (e) => {
        const position = e.target.getLatLng();
        this.lat = position.lat;
        this.lng = position.lng;

        // Get location name via reverse geocoding
        this.locationName = await this.reverseGeocode(this.lat, this.lng);
        this.calculateSunMoonData();

        // Save state
        this.saveState();

        // Force full re-render to update gradient background
        this.render();
        this.initializeMap();
      });
    }, 100);
  }

  // Get timezone name for coordinates
  async getTimezoneForLocation(lat, lng) {
    // First, try to use a simple timezone database lookup
    // This is more reliable than external APIs and works offline
    const timezone = this.estimateTimezoneFromCoordinates(lat, lng);
    if (timezone) {
      return timezone;
    }

    // Fallback to GMT offset calculation
    console.warn('Using GMT offset fallback for timezone');
    const offset = Math.round(lng / 15);
    return `Etc/GMT${offset >= 0 ? '-' : '+'}${Math.abs(offset)}`;
  }

  // Estimate timezone from coordinates using a simple lookup table
  // This covers major timezones and is more reliable than external APIs
  estimateTimezoneFromCoordinates(lat, lng) {
    // Major timezone regions (simplified)
    // Format: [minLat, maxLat, minLng, maxLng, timezone]
    const timezoneRegions = [
      // North America
      [24, 50, -125, -66, 'America/New_York'],
      [24, 50, -125, -95, 'America/Chicago'],
      [24, 50, -125, -110, 'America/Denver'],
      [24, 50, -125, -114, 'America/Los_Angeles'],
      [49, 84, -141, -52, 'America/Toronto'],
      
      // Europe
      [36, 72, -10, 30, 'Europe/London'],
      [40, 72, 5, 16, 'Europe/Paris'],
      [47, 55, 5, 15, 'Europe/Berlin'],
      [54, 72, 10, 32, 'Europe/Stockholm'],
      [55, 70, 8, 14, 'Europe/Copenhagen'],
      
      // Asia
      [18, 54, 73, 135, 'Asia/Shanghai'],
      [20, 46, 122, 154, 'Asia/Tokyo'],
      [6, 38, 68, 97, 'Asia/Kolkata'],
      [10, 42, 95, 106, 'Asia/Bangkok'],
      
      // Australia / Oceania
      [-44, -10, 113, 154, 'Australia/Sydney'],
      [-48, -34, 166, 179, 'Pacific/Auckland'],
      
      // South America
      [-56, 13, -82, -34, 'America/Sao_Paulo'],
      [-56, 13, -82, -66, 'America/Argentina/Buenos_Aires'],
      
      // Africa
      [-35, 38, -18, 52, 'Africa/Johannesburg'],
      [4, 32, -18, 16, 'Africa/Lagos'],
    ];

    // Find matching region
    for (const [minLat, maxLat, minLng, maxLng, timezone] of timezoneRegions) {
      if (lat >= minLat && lat <= maxLat && lng >= minLng && lng <= maxLng) {
        return timezone;
      }
    }

    // If no match found, return null and use GMT offset fallback
    return null;
  }

  // Render date picker as a feature card
  renderDatePickerCard() {
    const content = `
      <date-picker selected-date="${this.currentDate.toISOString()}"></date-picker>
    `;

    return this.renderFeatureCard(
      "datePicker",
      "📅",
      window.t("selectDate") || "Select Date",
      content,
      window.t("datePickerInfo") || "Choose any date to view sun and moon times for that specific day."
    );
  }

  // Render sun information as a proper feature card
  renderSunInfoCard() {
    // Check for polar conditions
    const polarCondition = this.sunData?.polarCondition;
    const polarMessage = polarCondition
      ? `
      <div style="background: #e74c3c; color: white; padding: 10px; border-radius: 6px; margin-bottom: 10px; text-align: center; font-weight: bold;">
        ${window.t(polarCondition)} 🌌<br>
        <small style="font-weight: normal;">${window.t(
          polarCondition + "Desc"
        )}</small>
      </div>
    `
      : "";

    const content = `
      ${polarMessage}
      <table class="info-table">
        <tr>
          <td class="info-label">${window.t("sunrise")}</td>
          <td class="info-value">${
            this.sunData ? this.formatTime(this.sunData.sunrise) : "--:--"
          }</td>
        </tr>
        <tr>
          <td class="info-label">${window.t("sunset")}</td>
          <td class="info-value">${
            this.sunData ? this.formatTime(this.sunData.sunset) : "--:--"
          }</td>
        </tr>
        <tr>
          <td class="info-label">${window.t("solarNoon")}</td>
          <td class="info-value">${
            this.sunData ? this.formatTime(this.sunData.solarNoon) : "--:--"
          }</td>
        </tr>
        <tr>
          <td class="info-label">${window.t("daylight")}</td>
          <td class="info-value">${
            this.sunData ? this.sunData.daylightDuration : "--h --m"
          }</td>
        </tr>
        <tr>
          <td class="info-label" colspan="2" style="text-align: center; font-weight: bold; padding-top: 12px;">
            ${window.t("daylightDiff")}
          </td>
        </tr>
        <tr>
          <td class="info-label">${window.t("fromShortest")}</td>
          <td class="info-value">${this.sunData ? this.sunData.diffFromShortest : "--"}</td>
        </tr>
        <tr>
          <td class="info-label">${window.t("fromLongest")}</td>
          <td class="info-value">${this.sunData ? this.sunData.diffFromLongest : "--"}</td>
        </tr>
      </table>
    `;

    return this.renderFeatureCard(
      "sunInfo",
      "☀️",
      window.t("sunInfo"),
      content,
      window.t("sunInfoDesc") ||
        "Sun times and daylight duration for your location."
    );
  }

  // Render moon information as a proper feature card
  renderMoonInfoCard() {
    const content = `
      <table class="info-table">
        <tr>
          <td class="info-label">${window.t("moonrise")}</td>
          <td class="info-value">${
            this.moonData ? this.formatTime(this.moonData.rise) : "--:--"
          }</td>
        </tr>
        <tr>
          <td class="info-label">${window.t("moonset")}</td>
          <td class="info-value">${
            this.moonData ? this.formatTime(this.moonData.set) : "--:--"
          }</td>
        </tr>
      </table>
    `;

    return this.renderFeatureCard(
      "moonInfo",
      "🌕",
      window.t("moonInfo"),
      content,
      window.t("moonInfoDesc") || "Moon rise and set times for your location."
    );
  }

  // Render text info section
  renderTextInfo() {
    // Check for polar conditions
    const polarCondition = this.sunData?.polarCondition;
    const polarMessage = polarCondition
      ? `
      <div style="background: #e74c3c; color: white; padding: 10px; border-radius: 6px; margin-bottom: 10px; text-align: center; font-weight: bold;">
        ${window.t(polarCondition)} 🌌<br>
        <small style="font-weight: normal;">${window.t(
          polarCondition + "Desc"
        )}</small>
      </div>
    `
      : "";

    return `
      <div class="section-title">${window.t("sunInfo")}</div>
      ${polarMessage}
      <table class="info-table">
        <tr>
          <td class="info-label">${window.t("sunrise")}</td>
          <td class="info-value">${
            this.sunData ? this.formatTime(this.sunData.sunrise) : "--:--"
          }</td>
        </tr>
        <tr>
          <td class="info-label">${window.t("sunset")}</td>
          <td class="info-value">${
            this.sunData ? this.formatTime(this.sunData.sunset) : "--:--"
          }</td>
        </tr>
        <tr>
          <td class="info-label">${window.t("solarNoon")}</td>
          <td class="info-value">${
            this.sunData ? this.formatTime(this.sunData.solarNoon) : "--:--"
          }</td>
        </tr>
        <tr>
          <td class="info-label">${window.t("daylight")}</td>
          <td class="info-value">${
            this.sunData ? this.sunData.daylightDuration : "--h --m"
          }</td>
        </tr>
        <tr>
          <td class="info-label" colspan="2" style="text-align: center; font-weight: bold; padding-top: 12px;">
            ${window.t("daylightDiff")}
          </td>
        </tr>
        <tr>
          <td class="info-label">${window.t("fromShortest")}</td>
          <td class="info-value">${this.sunData ? this.sunData.diffFromShortest : "--"}</td>
        </tr>
        <tr>
          <td class="info-label">${window.t("fromLongest")}</td>
          <td class="info-value">${this.sunData ? this.sunData.diffFromLongest : "--"}</td>
        </tr>
      </table>
      
      <div class="section-title" style="margin-top: 20px;">${window.t(
        "moonInfo"
      )}</div>
      <table class="info-table">
        <tr>
          <td class="info-label">${window.t("moonrise")}</td>
          <td class="info-value">${
            this.moonData ? this.formatTime(this.moonData.rise) : "--:--"
          }</td>
        </tr>
        <tr>
          <td class="info-label">${window.t("moonset")}</td>
          <td class="info-value">${
            this.moonData ? this.formatTime(this.moonData.set) : "--:--"
          }</td>
        </tr>
      </table>
    `;
  }

  // Calculate sun and moon data using SunCalc
  calculateSunMoonData() {
    if (!this.lat || !this.lng || typeof SunCalc === "undefined") {
      return;
    }

    const now = this.currentDate;

    // Get sun times
    const times = SunCalc.getTimes(now, this.lat, this.lng);
    const sunPos = SunCalc.getPosition(now, this.lat, this.lng);

    this.sunData = {
      sunrise: times.sunrise,
      sunset: times.sunset,
      solarNoon: times.solarNoon,
      dawn: times.dawn,
      dusk: times.dusk,
      goldenHourEnd: times.goldenHourEnd,
      goldenHour: times.goldenHour,
      azimuth: sunPos.azimuth,
      altitude: sunPos.altitude,
    };

    // Check for polar night or midnight sun
    const sunriseValid = times.sunrise && !isNaN(times.sunrise.getTime());
    const sunsetValid = times.sunset && !isNaN(times.sunset.getTime());

    if (!sunriseValid || !sunsetValid) {
      // Determine if it's polar night or midnight sun based on sun altitude
      const altitudeDeg = (sunPos.altitude * 180) / Math.PI;
      this.sunData.polarCondition =
        altitudeDeg < -6 ? "polarNight" : "midnightSun";
    }

    // Calculate daylight duration
    let currentDaylightMs = 0;
    if (sunriseValid && sunsetValid) {
      currentDaylightMs = times.sunset - times.sunrise;
      const hours = Math.floor(currentDaylightMs / (1000 * 60 * 60));
      const minutes = Math.floor((currentDaylightMs % (1000 * 60 * 60)) / (1000 * 60));
      this.sunData.daylightDuration = `${hours}h ${minutes}m`;
    } else {
      // Polar night (0h) or midnight sun (24h)
      currentDaylightMs = this.sunData.polarCondition === "polarNight" ? 0 : 24 * 60 * 60 * 1000;
      this.sunData.daylightDuration =
        this.sunData.polarCondition === "polarNight" ? "0h 0m" : "24h 0m";
    }

    // Calculate difference from shortest and longest days
    const year = this.currentDate.getFullYear();
    const winterSolstice = new Date(year, 11, 21); // December 21
    const summerSolstice = new Date(year, 5, 21); // June 21

    // Get daylight duration for winter solstice (shortest day)
    const winterTimes = SunCalc.getTimes(winterSolstice, this.lat, this.lng);
    let shortestDayMs = 0;
    if (winterTimes.sunrise && winterTimes.sunset && !isNaN(winterTimes.sunrise) && !isNaN(winterTimes.sunset)) {
      shortestDayMs = winterTimes.sunset - winterTimes.sunrise;
    }

    // Get daylight duration for summer solstice (longest day)
    const summerTimes = SunCalc.getTimes(summerSolstice, this.lat, this.lng);
    let longestDayMs = 24 * 60 * 60 * 1000;
    if (summerTimes.sunrise && summerTimes.sunset && !isNaN(summerTimes.sunrise) && !isNaN(summerTimes.sunset)) {
      longestDayMs = summerTimes.sunset - summerTimes.sunrise;
    }

    // Calculate differences
    const diffFromShortest = currentDaylightMs - shortestDayMs;
    const diffFromLongest = longestDayMs - currentDaylightMs;

    // Format differences
    const formatDiff = (ms) => {
      const totalMinutes = Math.floor(Math.abs(ms) / (1000 * 60));
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      const sign = ms >= 0 ? '+' : '-';
      return `${sign}${hours}h ${minutes}m`;
    };

    this.sunData.diffFromShortest = formatDiff(diffFromShortest);
    this.sunData.diffFromLongest = formatDiff(-diffFromLongest);

    // Get moon times and phase
    const moonTimes = SunCalc.getMoonTimes(now, this.lat, this.lng);
    const moonIllumination = SunCalc.getMoonIllumination(now);
    const moonPos = SunCalc.getMoonPosition(now, this.lat, this.lng);

    this.moonData = {
      rise: moonTimes.rise,
      set: moonTimes.set,
      phase: moonIllumination.phase,
      illumination: moonIllumination.fraction,
      azimuth: moonPos.azimuth,
      altitude: moonPos.altitude,
    };
  }

  // Format time to HH:MM in the location's timezone
  formatTime(date) {
    if (!date || !(date instanceof Date) || isNaN(date)) {
      return "--:--";
    }

    // Use the location's timezone if available
    const options = {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    };

    // If we have a timezone name, use it; otherwise use the browser's local timezone
    if (this.timezoneName) {
      options.timeZone = this.timezoneName;
    }

    return date.toLocaleTimeString("en-US", options);
  }

  // Get moon phase emoji
  getMoonPhaseEmoji() {
    if (!this.moonData) return "🌑";

    const phase = this.moonData.phase;
    if (phase < 0.05) return "🌑"; // New Moon
    if (phase < 0.2) return "🌒"; // Waxing Crescent
    if (phase < 0.3) return "🌓"; // First Quarter
    if (phase < 0.45) return "🌔"; // Waxing Gibbous
    if (phase < 0.55) return "🌕"; // Full Moon
    if (phase < 0.7) return "🌖"; // Waning Gibbous
    if (phase < 0.8) return "🌗"; // Last Quarter
    if (phase < 0.95) return "🌘"; // Waning Crescent
    return "🌑"; // New Moon
  }

  // Get moon phase name
  getMoonPhaseName() {
    if (!this.moonData) return "N/A";

    const phase = this.moonData.phase;
    if (phase < 0.05) return window.t("newMoon");
    if (phase < 0.2) return window.t("waxingCrescent");
    if (phase < 0.3) return window.t("firstQuarter");
    if (phase < 0.45) return window.t("waxingGibbous");
    if (phase < 0.55) return window.t("fullMoon");
    if (phase < 0.7) return window.t("waningGibbous");
    if (phase < 0.8) return window.t("lastQuarter");
    if (phase < 0.95) return window.t("waningCrescent");
    return window.t("newMoon");
  }

  // Generate OpenStreetMap Static Map URL
  getMapboxUrl() {
    if (!this.lat || !this.lng) {
      return "";
    }

    const zoom = 13;
    const width = 400;
    const height = 300;

    // Using OpenStreetMap tiles via staticmap service (no API key required)
    return `https://www.openstreetmap.org/export/embed.html?bbox=${
      this.lng - 0.02
    },${this.lat - 0.02},${this.lng + 0.02},${
      this.lat + 0.02
    }&layer=mapnik&marker=${this.lat},${this.lng}`;
  }

  // Calculate graph segments for 24-hour timeline
  calculateGraphSegments() {
    if (!this.sunData) {
      return [];
    }

    const segments = [];

    // Handle polar night (no sun) or midnight sun (sun always up)
    if (this.sunData.polarCondition) {
      if (this.sunData.polarCondition === "polarNight") {
        // Full 24 hours of night
        segments.push({
          type: "night",
          percent: 100,
          color: "#2c3e50",
        });
      } else {
        // Full 24 hours of daylight (midnight sun)
        segments.push({
          type: "daylight",
          percent: 100,
          color: "#3498db",
        });
      }
      return segments;
    }

    // Helper to get local hour (0-24) using same logic as formatTime
    const getLocalHour = (date) => {
      if (!date || !(date instanceof Date) || isNaN(date)) {
        return 0;
      }

      // Estimate timezone offset based on longitude (same as formatTime)
      const timezoneOffsetHours = Math.round(this.lng / 15);
      const localDate = new Date(
        date.getTime() +
          timezoneOffsetHours * 60 * 60 * 1000 -
          date.getTimezoneOffset() * 60 * 1000
      );

      const hours = localDate.getUTCHours();
      const minutes = localDate.getUTCMinutes();

      // Return as decimal hours (e.g., 6.5 for 06:30)
      return hours + minutes / 60;
    };

    const dawnHour = getLocalHour(this.sunData.dawn);
    const sunriseHour = getLocalHour(this.sunData.sunrise);
    const sunsetHour = getLocalHour(this.sunData.sunset);
    const duskHour = getLocalHour(this.sunData.dusk);

    // Convert hours to percentages (0-100)
    const dawnPercent = (dawnHour / 24) * 100;
    const sunrisePercent = (sunriseHour / 24) * 100;
    const sunsetPercent = (sunsetHour / 24) * 100;
    const duskPercent = (duskHour / 24) * 100;

    // Night (start to dawn)
    segments.push({
      type: "night",
      percent: dawnPercent,
      color: "#2c3e50",
    });

    // Morning twilight (dawn to sunrise)
    segments.push({
      type: "twilight",
      percent: sunrisePercent - dawnPercent,
      color: "#e74c3c",
    });

    // Daylight (sunrise to sunset)
    segments.push({
      type: "daylight",
      percent: sunsetPercent - sunrisePercent,
      color: "#3498db",
    });

    // Evening twilight (sunset to dusk)
    segments.push({
      type: "twilight",
      percent: duskPercent - sunsetPercent,
      color: "#e74c3c",
    });

    // Night (dusk to end)
    segments.push({
      type: "night",
      percent: 100 - duskPercent,
      color: "#2c3e50",
    });

    return segments;
  }

  // Create timeline-graph custom element as DOM element
  createTimelineGraph() {
    if (!this.sunData) {
      return null;
    }

    const timelineGraph = document.createElement("timeline-graph");

    // Set attributes based on polar condition or normal sun data
    if (this.sunData.polarCondition) {
      timelineGraph.setAttribute(
        "polar-condition",
        this.sunData.polarCondition
      );
    } else if (
      this.sunData.dawn &&
      this.sunData.sunrise &&
      this.sunData.sunset &&
      this.sunData.dusk
    ) {
      timelineGraph.setAttribute("dawn", this.sunData.dawn.toISOString());
      timelineGraph.setAttribute("sunrise", this.sunData.sunrise.toISOString());
      timelineGraph.setAttribute("sunset", this.sunData.sunset.toISOString());
      timelineGraph.setAttribute("dusk", this.sunData.dusk.toISOString());
    }

    timelineGraph.setAttribute("lng", this.lng.toString());

    return timelineGraph;
  }

  // Render 24-hour bar graph using custom element
  renderGraph() {
    if (!this.sunData) {
      return '<div style="color: #999; padding: 40px 0;">Loading graph...</div>';
    }

    const timelineGraph = this.createTimelineGraph();
    return timelineGraph ? timelineGraph.outerHTML : '';
  }

  // Render timeline (24 hours)
  renderTimeline() {
    if (!this.sunData) {
      return '<div style="color: #999; padding: 20px;">Loading...</div>';
    }

    return `
      <div class="section-title">${window.t("timeline")}</div>
      ${this.renderGraph()}
    `;
  }

  // Render features - ALL cards in one flat grid
  renderFeatures() {
    const fragment = document.createDocumentFragment();

    // Date Picker Card (first card)
    fragment.appendChild(this.renderDatePickerCard());

    // Sun Info Card (first-class card)
    fragment.appendChild(this.renderSunInfoCard());

    // Moon Info Card (first-class card)
    fragment.appendChild(this.renderMoonInfoCard());

    // Moon Phase
    fragment.appendChild(
      this.renderFeatureCard(
        "moonPhase",
        "🌙",
        window.t("moonPhase"),
        `<div class="moon-phase-large">${this.getMoonPhaseEmoji()}</div>
       <div class="feature-value">${this.getMoonPhaseName()}</div>
       <div class="feature-detail">${
         this.moonData ? Math.round(this.moonData.illumination * 100) : 0
       }% ${window.t("illuminated")}</div>`,
        window.t("moonPhaseInfo")
      )
    );

    // Golden Hour
    fragment.appendChild(
      this.renderFeatureCard(
        "goldenHour",
        "✨",
        window.t("goldenHour"),
        `<div class="feature-value">${
          this.sunData ? this.formatTime(this.sunData.goldenHour) : "--:--"
        } - ${
          this.sunData ? this.formatTime(this.sunData.sunset) : "--:--"
        }</div>
       <div class="feature-detail">${window.t("evening")}</div>
       <div class="feature-value">${
         this.sunData ? this.formatTime(this.sunData.sunrise) : "--:--"
       } - ${
          this.sunData ? this.formatTime(this.sunData.goldenHourEnd) : "--:--"
        }</div>
       <div class="feature-detail">${window.t("morning")}</div>`,
        window.t("goldenHourInfo")
      )
    );

    // Sun Elevation
    const elevationDeg = this.sunData
      ? ((this.sunData.altitude * 180) / Math.PI).toFixed(1)
      : "0.0";
    const elevationText =
      parseFloat(elevationDeg) < 0
        ? `${window
            .t("sunBelowHorizon")
            .replace("{degrees}", Math.abs(elevationDeg))}`
        : "";
    fragment.appendChild(
      this.renderFeatureCard(
        "sunElevation",
        "📈",
        window.t("sunElevation"),
        `<div class="feature-value">${elevationDeg}°</div>
       <div class="sun-elevation-chart">${this.renderSunElevationChart()}</div>
       ${
         elevationText
           ? `<div class="feature-detail" style="margin-top: 8px;">${elevationText}</div>`
           : ""
       }`,
        window.t("sunElevationInfo")
      )
    );

    // Compass
    const sunriseAz = this.sunData
      ? ((this.sunData.azimuth * 180) / Math.PI + 180).toFixed(0)
      : "0";
    fragment.appendChild(
      this.renderFeatureCard(
        "compass",
        "🧭",
        window.t("compass"),
        `<div class="compass-container">
         <div class="compass-arrow" style="transform: rotate(${sunriseAz}deg)">↑</div>
       </div>
       <div class="feature-value">${sunriseAz}°</div>
       <div class="feature-detail">${window.t("azimuth")}</div>`,
        window.t("compassInfo")
      )
    );

    // UV Index
    const uvData = this.calculateUVIndex();
    const uvColor = this.getUVColor(uvData.index);
    fragment.appendChild(
      this.renderFeatureCard(
        "uvIndex",
        "☀️",
        window.t("uvIndex"),
        `<div class="feature-value" style="color: ${uvColor};">${
          uvData.index
        }</div>
       <div class="feature-detail">${uvData.level}</div>
       <div class="uv-bar-container">
         <div class="uv-bar" style="width: ${Math.min(
           uvData.index * 10,
           100
         )}%; background: ${uvColor};"></div>
       </div>
       <div class="feature-detail" style="margin-top: 8px;">${
         uvData.recommendation
       }</div>`,
        window.t("uvIndexInfo")
      )
    );

    return fragment;
  }

  // Render individual feature card with tabs using custom elements
  renderFeatureCard(featureKey, emoji, title, content, infoText) {
    const isActive = this.features[featureKey];
    const tabState = this.featureTabs?.[featureKey] || "feature";

    // Create feature-card custom element
    const card = document.createElement("feature-card");
    card.setAttribute("feature-id", featureKey);
    card.setAttribute("title", title);
    card.setAttribute("icon", emoji);
    card.setAttribute("expanded", isActive.toString());

    if (isActive) {
      // Create toggle in header
      const toggle = document.createElement("feature-toggle");
      toggle.setAttribute("slot", "header-actions");
      toggle.setAttribute("expanded", "true");
      toggle.setAttribute("title", "");
      toggle.setAttribute("data-feature", featureKey);
      card.appendChild(toggle);

      // Create tab group
      const tabGroup = document.createElement("tab-group");
      tabGroup.setAttribute("slot", "tabs");
      tabGroup.setAttribute("active-tab", tabState);
      tabGroup.setAttribute("data-feature", featureKey);

      // Data tab
      const dataTab = document.createElement("tab-button");
      dataTab.setAttribute("value", "feature");
      dataTab.setAttribute("label", window.t("dataTab"));
      dataTab.setAttribute("active", (tabState === "feature").toString());

      // Info tab
      const infoTab = document.createElement("tab-button");
      infoTab.setAttribute("value", "info");
      infoTab.setAttribute("label", window.t("infoTab"));
      infoTab.setAttribute("active", (tabState === "info").toString());

      tabGroup.appendChild(dataTab);
      tabGroup.appendChild(infoTab);

      card.appendChild(tabGroup);

      // Create content container
      const contentDiv = document.createElement("div");
      contentDiv.setAttribute("slot", "content");
      contentDiv.innerHTML = `
        <div class="tab-panel ${
          tabState === "feature" ? "active" : ""
        }" data-tab="feature">
          ${content}
        </div>
        <div class="tab-panel ${
          tabState === "info" ? "active" : ""
        }" data-tab="info">
          <div class="info-text">${infoText}</div>
        </div>
      `;
      card.appendChild(contentDiv);
    } else {
      // Create toggle in header for inactive state
      const toggle = document.createElement("feature-toggle");
      toggle.setAttribute("slot", "header-actions");
      toggle.setAttribute("expanded", "false");
      toggle.setAttribute("title", "");
      toggle.setAttribute("data-feature", featureKey);
      card.appendChild(toggle);
    }

    return card;
  }

  // Render sun elevation chart
  renderSunElevationChart() {
    if (!this.sunData) return "";

    const width = 220;
    const height = 120;
    const padding = { bottom: 20 }; // Space for x-axis labels
    const chartHeight = height - padding.bottom;
    const minAlt = -20;
    const maxAlt = 90;
    const range = maxAlt - minAlt;
    const points = [];
    const hourlyData = []; // Store hour and altitude for tooltip

    // Calculate horizon Y position
    const horizonY = chartHeight - ((0 - minAlt) / range) * chartHeight;

    // Generate 24 points (one per hour)
    for (let hour = 0; hour < 24; hour++) {
      const date = new Date(this.currentDate);
      date.setHours(hour, 0, 0, 0);
      const pos = SunCalc.getPosition(date, this.lat, this.lng);
      const altitude = (pos.altitude * 180) / Math.PI;

      const x = (hour / 24) * width;
      const y = chartHeight - ((altitude - minAlt) / range) * chartHeight;

      points.push(`${x},${y}`);
      hourlyData.push({ hour, altitude, x, y });
    }

    const pointsStr = points.join(" ");

    // X-axis labels (every 6 hours) - in location's timezone
    const xLabels = [0, 6, 12, 18, 24]
      .map((hour) => {
        const x = (hour / 24) * width;
        const hourDate = new Date(this.currentDate);
        hourDate.setHours(hour, 0, 0, 0);
        const displayHour = hourDate.toLocaleTimeString("en-US", {
          hour: "numeric",
          hour12: false,
          timeZone: this.timezoneName || undefined,
        }).split(':')[0];
        return `<text x="${x}" y="${
          height - 3
        }" font-size="9" fill="#666" text-anchor="middle">${displayHour}</text>`;
      })
      .join("");

    return `
      <div style="position: relative;">
        <svg width="100%" height="${height}" viewBox="0 0 ${width} ${height}" style="display: block; margin: 8px auto;" class="sun-elevation-chart">
          <!-- Grid lines -->
          <line x1="0" y1="${
            chartHeight - ((90 - minAlt) / range) * chartHeight
          }" x2="${width}" y2="${
      chartHeight - ((90 - minAlt) / range) * chartHeight
    }" stroke="#f0f0f0" stroke-width="1"/>
          <line x1="0" y1="${
            chartHeight - ((45 - minAlt) / range) * chartHeight
          }" x2="${width}" y2="${
      chartHeight - ((45 - minAlt) / range) * chartHeight
    }" stroke="#f0f0f0" stroke-width="1"/>
          <line x1="0" y1="${horizonY}" x2="${width}" y2="${horizonY}" stroke="#666" stroke-width="2" stroke-dasharray="4,2"/>
          <line x1="0" y1="${
            chartHeight - ((-10 - minAlt) / range) * chartHeight
          }" x2="${width}" y2="${
      chartHeight - ((-10 - minAlt) / range) * chartHeight
    }" stroke="#f0f0f0" stroke-width="1"/>
          
          <!-- Elevation curve with gradient coloring -->
          <defs>
            <linearGradient id="elevGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style="stop-color:#3498db;stop-opacity:1" />
              <stop offset="${
                ((0 - minAlt) / range) * 100
              }%" style="stop-color:#3498db;stop-opacity:1" />
              <stop offset="${
                ((0 - minAlt) / range) * 100
              }%" style="stop-color:#2c3e50;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#2c3e50;stop-opacity:1" />
            </linearGradient>
          </defs>
          <polyline points="${pointsStr}" fill="none" stroke="url(#elevGrad)" stroke-width="4"/>
          
          <!-- Y-axis labels -->
          <text x="5" y="${
            chartHeight - ((90 - minAlt) / range) * chartHeight - 3
          }" font-size="9" fill="#666">90°</text>
          <text x="5" y="${
            chartHeight - ((45 - minAlt) / range) * chartHeight - 3
          }" font-size="9" fill="#666">45°</text>
          <text x="5" y="${
            horizonY - 3
          }" font-size="10" fill="#666" font-weight="bold">0°</text>
          <text x="5" y="${
            chartHeight - ((-10 - minAlt) / range) * chartHeight + 12
          }" font-size="9" fill="#666">-10°</text>
          <text x="5" y="${
            chartHeight - ((-20 - minAlt) / range) * chartHeight + 12
          }" font-size="9" fill="#666">-20°</text>
          
          <!-- X-axis labels -->
          ${xLabels}
          
          <!-- Invisible overlay for hover detection -->
          <rect x="0" y="0" width="${width}" height="${chartHeight}" fill="transparent" class="chart-overlay" style="cursor: crosshair;"/>
        </svg>
        <div class="chart-tooltip" style="display: none; position: absolute; background: rgba(0,0,0,0.8); color: white; padding: 4px 8px; border-radius: 4px; font-size: 11px; pointer-events: none; white-space: nowrap; z-index: 1000;"></div>
      </div>
    `;
  }

  // Toggle feature
  toggleFeature(feature) {
    this.features[feature] = !this.features[feature];

    // Save state to localStorage only (don't update URL)
    this.saveState(false);

    // Update only the specific card instead of re-rendering everything
    const card = this.shadowRoot.querySelector(
      `feature-card[feature-id="${feature}"]`
    );
    if (card) {
      const newState = this.features[feature];
      card.setAttribute("expanded", newState.toString());

      // Also update the toggle element
      const toggle = card.querySelector("feature-toggle");
      if (toggle) {
        toggle.setAttribute("expanded", newState.toString());
      }
    }
  }

  // Switch feature tab
  switchTab(feature, tab) {
    this.featureTabs[feature] = tab;

    // Save state to localStorage only (don't update URL)
    this.saveState(false);

    // Update the specific card's tab panels
    const cardsGrid = this.shadowRoot.querySelector(".cards-grid");
    if (cardsGrid) {
      const card = cardsGrid.querySelector(
        `feature-card[feature-id="${feature}"]`
      );
      if (card) {
        const panels = card.querySelectorAll(".tab-panel");
        panels.forEach((panel) => {
          const panelTab = panel.getAttribute("data-tab");
          panel.classList.toggle("active", panelTab === tab);
        });
      }
    }
  }

  // Update features display (re-render all cards)
  updateFeaturesDisplay() {
    const cardsGrid = this.shadowRoot.querySelector(".cards-grid");
    if (cardsGrid) {
      cardsGrid.innerHTML = "";
      cardsGrid.appendChild(this.renderFeatures());

      // Re-attach event listeners after DOM update
      setTimeout(() => {
        this.attachFeatureEventListeners();
      }, 0);
    }
  }

  // Attach event listeners to feature toggles and tabs
  attachFeatureEventListeners() {
    // Attach listeners to all feature-toggle elements
    this.shadowRoot.querySelectorAll("feature-toggle").forEach((toggle) => {
      const featureKey = toggle.getAttribute("data-feature");
      if (featureKey) {
        toggle.addEventListener("toggle", (e) => {
          e.stopPropagation();
          this.toggleFeature(featureKey);
        });
      }
    });

    // Attach listeners to all tab-group elements
    this.shadowRoot.querySelectorAll("tab-group").forEach((tabGroup) => {
      const featureKey = tabGroup.getAttribute("data-feature");
      if (featureKey) {
        tabGroup.addEventListener("tab-change", (e) => {
          e.stopPropagation();
          this.switchTab(featureKey, e.detail.tab);
        });
      }
    });

    // Attach date-picker event listener (now inside feature-card)
    const datePicker = this.shadowRoot.querySelector("date-picker");
    if (datePicker) {
      // Remove old listener if exists
      if (this.datePickerHandler) {
        datePicker.removeEventListener("datechange", this.datePickerHandler);
      }

      // Create and store new handler
      this.datePickerHandler = (e) => {
        this.currentDate = e.detail.date;
        this.calculateSunMoonData();
        this.updateDataSections();
        this.saveState();
      };

      datePicker.addEventListener("datechange", this.datePickerHandler);
      
      // Set initial date
      datePicker.setAttribute("selected-date", this.currentDate.toISOString());
    }
  }

  // Calculate UV Index based on sun elevation
  calculateUVIndex() {
    if (!this.sunData) {
      return {
        index: 0,
        level: window.t("low"),
        recommendation: window.t("noProtectionNeeded"),
      };
    }

    const elevationDeg = (this.sunData.altitude * 180) / Math.PI;

    // UV index is roughly proportional to sin(elevation) when sun is above horizon
    // Maximum UV index ~11-12 when sun is at zenith (90°)
    let uvIndex = 0;

    if (elevationDeg > 0) {
      // Simplified UV calculation based on sun elevation
      // Real UV depends on ozone, clouds, altitude, etc.
      const maxUV = 11; // Maximum UV at zenith
      uvIndex = maxUV * Math.sin((elevationDeg * Math.PI) / 180);
      uvIndex = Math.max(0, Math.round(uvIndex * 10) / 10);
    }

    // Determine UV level and recommendation
    let level, recommendation;

    if (uvIndex < 3) {
      level = window.t("low");
      recommendation = window.t("noProtectionNeeded");
    } else if (uvIndex < 6) {
      level = window.t("moderate");
      recommendation = window.t("wearSunscreen");
    } else if (uvIndex < 8) {
      level = window.t("high");
      recommendation = window.t("wearSunscreenAndHat");
    } else if (uvIndex < 11) {
      level = window.t("veryHigh");
      recommendation = window.t("extraProtection");
    } else {
      level = window.t("extreme");
      recommendation = window.t("avoidSun");
    }

    return { index: uvIndex, level, recommendation };
  }

  // Get color for UV index level
  getUVColor(uvIndex) {
    if (uvIndex < 3) return "#289500"; // Low - Green
    if (uvIndex < 6) return "#f7e400"; // Moderate - Yellow
    if (uvIndex < 8) return "#f85900"; // High - Orange
    if (uvIndex < 11) return "#d8001d"; // Very High - Red
    return "#6b49c8"; // Extreme - Violet
  }

  // Render the component
  render() {
    // Static background gradient
    const bgGradient = "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";

    this.shadowRoot.innerHTML = `
      <style>
        /* Import Leaflet CSS into Shadow DOM */
        @import url('https://unpkg.com/leaflet@1.9.4/dist/leaflet.css');
        
        /* Global box-sizing to prevent layout bugs */
        * {
          box-sizing: border-box;
        }
        
        :host {
          display: block;
          max-width: 1400px;
          margin: 0 auto;
          font-family: Avenir, Montserrat, Corbel, 'URW Gothic', source-sans-pro, sans-serif;
          font-weight: normal;
          
          /* SPACING SYSTEM - Defined on :host so it inherits to child custom elements */
          --space-xs: 8px;
          --space-sm: 12px;
          --space-md: 16px;
          --space-lg: 24px;
        }
        
        .container {
          background: ${bgGradient};
          border-radius: 10px;
          padding: 12px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
          transition: background 1s ease;
          display: flex;
          flex-direction: column;
          gap: var(--space-xs);
        }
        
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: white;
          margin-bottom: 10px;
          text-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        
        .header-left,
        .header-center,
        .header-right {
          flex: 1;
          display: flex;
          align-items: center;
        }
        
        .header-left {
          justify-content: flex-start;
        }
        
        .header-center {
          justify-content: center;
        }
        
        .header-right {
          justify-content: flex-end;
        }
        
        .app-title {
          font-size: 18px;
          font-weight: bold;
        }
        
        .location-name {
          font-size: 14px;
          opacity: 0.95;
        }
        
        .language-selector {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .language-selector label {
          font-size: 12px;
          opacity: 0.9;
        }
        
        .language-selector select {
          padding: 6px 12px;
          border: 1px solid rgba(255,255,255,0.3);
          border-radius: 6px;
          background: rgba(255,255,255,0.2);
          color: white;
          font-family: Segoe UI, Tahoma, Verdana, sans-serif;
          font-size: 12px;
          cursor: pointer;
          outline: none;
        }
        
        .language-selector select:hover {
          background: rgba(255,255,255,0.3);
        }
        
        .language-selector select option {
          background: #667eea;
          color: white;
        }
        
        .share-button {
          padding: 8px 16px;
          margin-left: 12px;
          border: 1px solid rgba(255,255,255,0.4);
          border-radius: 6px;
          background: rgba(255,255,255,0.2);
          color: white;
          font-family: Segoe UI, Tahoma, Verdana, sans-serif;
          font-size: 12px;
          font-weight: bold;
          cursor: pointer;
          outline: none;
          transition: all 0.2s ease;
        }
        
        .share-button:hover {
          background: rgba(255,255,255,0.3);
          transform: translateY(-1px);
        }
        
        .share-button:active {
          transform: translateY(0);
        }
        
        .location-controls {
          background: white;
          border-radius: 10px;
          padding: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          display: flex;
          gap: 12px;
          align-items: center;
          flex-wrap: wrap;
        }
        
        .location-controls-title {
          font-size: 14px;
          font-weight: bold;
          color: #2c3e50;
          white-space: nowrap;
        }
        
        .location-buttons {
          display: flex;
          gap: 10px;
        }
        
        .gps-button {
          padding: 8px 16px;
          border: 2px solid #3498db;
          border-radius: 6px;
          background: white;
          color: #3498db;
          font-family: Segoe UI, Tahoma, Verdana, sans-serif;
          font-size: 13px;
          font-weight: bold;
          cursor: pointer;
          outline: none;
          transition: all 0.2s ease;
          white-space: nowrap;
        }
        
        .gps-button:hover {
          background: #3498db;
          color: white;
        }
        
        .today-button {
          padding: 8px 16px;
          border: 2px solid #28a745;
          border-radius: 6px;
          background: white;
          color: #28a745;
          font-family: Segoe UI, Tahoma, Verdana, sans-serif;
          font-size: 13px;
          font-weight: bold;
          cursor: pointer;
          outline: none;
          transition: all 0.2s ease;
          white-space: nowrap;
        }
        
        .today-button:hover {
          background: #28a745;
          color: white;
        }
        
        .search-container {
          display: flex;
          gap: 8px;
          flex: 1;
          min-width: 250px;
        }
        
        .search-input {
          flex: 1;
          padding: 10px 12px;
          border: 2px solid #ddd;
          border-radius: 6px;
          font-family: Segoe UI, Tahoma, Verdana, sans-serif;
          font-size: 13px;
          outline: none;
          transition: border-color 0.2s;
        }
        
        .search-input:focus {
          border-color: #667eea;
        }
        
        .search-button {
          padding: 10px 24px;
          border: none;
          border-radius: 6px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          font-family: Segoe UI, Tahoma, Verdana, sans-serif;
          font-size: 13px;
          font-weight: bold;
          cursor: pointer;
          outline: none;
          transition: all 0.2s ease;
        }
        
        .search-button:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(102, 126, 234, 0.3);
        }
        
        .search-button:active {
          transform: translateY(0);
        }
        
        .timeline-container {
          background: white;
          border-radius: 8px;
          padding: 10px;
          margin-bottom: var(--space-sm, 12px);
          min-width: 90%;
        }
        
        .content {
          display: flex;
          flex-direction: column;
          gap: var(--space-sm, 12px);
          margin-bottom: var(--space-sm, 12px);
        }
        
        .map-container {
          background: white;
          border-radius: 8px;
          padding: 10px;
        }
        
        #map {
          width: 100%;
          height: 400px;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          z-index: 0;
        }
        
        /* SINGLE GRID FOR ALL CARDS - Respects intrinsic card width */
        .cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, 300px);
          gap: var(--space-lg, 24px);
          justify-content: start;
          max-width: 100%;
        }
        
        /* Content styles for slotted content in custom elements */
        .tab-panel {
          display: none;
        }
        
        .tab-panel.active {
          display: block;
        }
        
        .info-text {
          text-align: left;
          line-height: 1.6;
          color: #555;
          font-size: 14px;
        }
        
        .feature-value {
          font-size: 20px;
          font-weight: bold;
          margin: 8px 0;
          color: #2c3e50;
        }
        
        .feature-detail {
          font-size: 12px;
          color: #666;
          margin-top: 4px;
        }
        
        .moon-phase-large {
          font-size: 48px;
          margin: 12px 0;
          text-align: center;
        }
        
        .compass-container {
          width: 80px;
          height: 80px;
          border: 3px solid #667eea;
          border-radius: 50%;
          margin: 12px auto;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }
        
        .compass-arrow {
          font-size: 32px;
          color: #667eea;
          transition: transform 0.3s;
        }
        
        .uv-bar-container {
          width: 100%;
          height: 12px;
          background: #e0e0e0;
          border-radius: 6px;
          overflow: hidden;
          margin: 12px 0;
        }
        
        .uv-bar {
          height: 100%;
          border-radius: 6px;
          transition: width 0.3s ease, background 0.3s ease;
        }
        
        .sun-elevation-chart {
          margin-top: 8px;
        }
        .compass-arrow {
          font-size: 32px;
          color: #667eea;
          transition: transform 0.3s;
        }
        
        .sun-elevation-chart {
          margin-top: 8px;
        }
        
        .info-table {
          width: 100%;
          border-collapse: collapse;
        }
        
        .info-table tr {
          border-bottom: 1px solid #f0f0f0;
        }
        
        .info-table tr:last-child {
          border-bottom: none;
        }
        
        .info-table td {
          padding: 8px 4px;
          line-height: 1.6;
        }
        
        .info-label {
          color: #666;
          width: 50%;
          text-align: left;
        }
        
        .info-value {
          font-weight: bold;
          color: #2c3e50;
          text-align: right;
          font-variant-numeric: tabular-nums;
        }
        
        /* Responsive layout */
        @media (max-width: 768px) {
          .cards-grid {
            grid-template-columns: 1fr;
          }
          
          .location-controls {
            flex-direction: column;
            align-items: stretch;
          }
          
          .search-container {
            min-width: 100%;
          }
          
          .header {
            font-size: 20px;
          }
          
          #map {
            height: 300px;
          }
        }
      </style>
      
      <div class="container">
        <div class="header">
          <div class="header-left">
            <div class="app-title">${window.t("title")}</div>
          </div>
          <div class="header-center">
            ${
              this.locationName
                ? `<div class="location-name">📍 ${this.locationName}</div>`
                : ""
            }
          </div>
          <div class="header-right">
            <div class="language-selector">
              <label>🌐</label>
              <select id="lang-select">
                <option value="da" ${
                  window.currentLanguage === "da" ? "selected" : ""
                }>🇩🇰 Dansk</option>
                <option value="en" ${
                  window.currentLanguage === "en" ? "selected" : ""
                }>🇬🇧 English</option>
                <option value="de" ${
                  window.currentLanguage === "de" ? "selected" : ""
                }>🇩🇪 Deutsch</option>
                <option value="zh" ${
                  window.currentLanguage === "zh" ? "selected" : ""
                }>🇨🇳 中文</option>
                <option value="es" ${
                  window.currentLanguage === "es" ? "selected" : ""
                }>🇪🇸 Español</option>
              </select>
            </div>
            <button id="share-btn" class="share-button">
              🔗 ${window.t("shareButton")}
            </button>
          </div>
        </div>
        
        <div class="map-container">
          <div id="map"></div>
        </div>
        
        <div class="location-controls">
          <div class="location-controls-title">📍 ${window.t(
            "searchLocation"
          )}</div>
          <div class="location-buttons">
            <button id="gps-btn" class="gps-button">
              🌍 ${window.t("getMyLocation")}
            </button>
            <button id="today-btn" class="today-button">
              📅 I dag
            </button>
          </div>
          <div class="search-container">
            <input 
              type="text" 
              id="location-search" 
              class="search-input" 
              placeholder="${window.t("searchPlaceholder")}"
            />
            <button id="search-btn" class="search-button">
              ${window.t("showButton")}
            </button>
          </div>
        </div>
        
        <div class="timeline-container"></div>
        
        <div class="cards-grid"></div>
      </div>
    `;

    // Append feature cards using DOM (not innerHTML) to preserve event listeners
    const cardsGrid = this.shadowRoot.querySelector(".cards-grid");
    if (cardsGrid) {
      cardsGrid.appendChild(this.renderFeatures());
    }

    // Append timeline-graph as DOM element (not innerHTML)
    const timelineContainer = this.shadowRoot.querySelector(".timeline-container");
    if (timelineContainer) {
      timelineContainer.innerHTML = `<div class="section-title">${window.t("timeline")}</div>`;
      const timelineGraph = this.createTimelineGraph();
      if (timelineGraph) {
        timelineContainer.appendChild(timelineGraph);
      }
    }

    // Wait for custom elements to be connected, then attach event listeners
    setTimeout(() => {
      this.attachFeatureEventListeners();
      this.attachTooltips();
    }, 0);
  }

  // Attach tooltips to buttons (after render)
  attachTooltips() {
    // Share button tooltip
    const shareBtn = this.shadowRoot.querySelector('#share-btn');
    if (shareBtn && !shareBtn.querySelector('custom-tooltip')) {
      const tooltip = document.createElement('custom-tooltip');
      tooltip.setAttribute('text', window.t('shareTitle'));
      tooltip.setAttribute('theme', 'light');
      shareBtn.appendChild(tooltip);
    }

    // GPS button tooltip
    const gpsBtn = this.shadowRoot.querySelector('#gps-btn');
    if (gpsBtn && !gpsBtn.querySelector('custom-tooltip')) {
      const tooltip = document.createElement('custom-tooltip');
      tooltip.setAttribute('text', window.t('gpsTooltip'));
      tooltip.setAttribute('theme', 'blue');
      gpsBtn.appendChild(tooltip);
    }

    // Today button tooltip
    const todayBtn = this.shadowRoot.querySelector('#today-btn');
    if (todayBtn && !todayBtn.querySelector('custom-tooltip')) {
      const tooltip = document.createElement('custom-tooltip');
      tooltip.setAttribute('text', window.t('todayTooltip'));
      tooltip.setAttribute('theme', 'blue');
      todayBtn.appendChild(tooltip);
    }

    // Search button tooltip
    const searchBtn = this.shadowRoot.querySelector('#search-btn');
    if (searchBtn && !searchBtn.querySelector('custom-tooltip')) {
      const tooltip = document.createElement('custom-tooltip');
      tooltip.setAttribute('text', window.t('searchTooltip'));
      tooltip.setAttribute('theme', 'blue');
      searchBtn.appendChild(tooltip);
    }
  }
}

// Register the custom element
customElements.define("sun-moon-info", SunMoonInfo);
