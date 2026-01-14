// Timeline Graph Custom Element
class TimelineGraph extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return ['dawn', 'sunrise', 'sunset', 'dusk', 'polar-condition', 'lng'];
  }

  attributeChangedCallback() {
    this.render();
  }

  connectedCallback() {
    this.render();
  }

  // Convert time string (HH:MM) or Date to decimal hours
  getLocalHour(value) {
    if (!value) return 0;

    // If it's already a decimal number
    if (typeof value === 'number') {
      return value;
    }

    // If it's an ISO string, convert to Date first
    let dateObj = value;
    if (typeof value === 'string' && (value.includes('T') || value.includes('Z'))) {
      dateObj = new Date(value);
    }

    // If it's a Date object
    if (dateObj instanceof Date && !isNaN(dateObj)) {
      const lng = parseFloat(this.getAttribute('lng') || '0');
      const timezoneOffsetHours = Math.round(lng / 15);
      const localDate = new Date(dateObj.getTime() + (timezoneOffsetHours * 60 * 60 * 1000) - (dateObj.getTimezoneOffset() * 60 * 1000));
      
      const hours = localDate.getUTCHours();
      const minutes = localDate.getUTCMinutes();
      
      return hours + (minutes / 60);
    }

    // If it's a string in HH:MM format
    if (typeof value === 'string' && value.includes(':')) {
      const [hours, minutes] = value.split(':').map(Number);
      return hours + (minutes / 60);
    }

    return 0;
  }

  calculateSegments() {
    const segments = [];
    const polarCondition = this.getAttribute('polar-condition');

    // Handle polar conditions
    if (polarCondition === 'polarNight') {
      segments.push({
        type: 'night',
        percent: 100,
        color: '#2c3e50'
      });
      return segments;
    } else if (polarCondition === 'midnightSun') {
      segments.push({
        type: 'daylight',
        percent: 100,
        color: '#3498db'
      });
      return segments;
    }

    // Normal day: parse times
    const dawnHour = this.getLocalHour(this.getAttribute('dawn'));
    const sunriseHour = this.getLocalHour(this.getAttribute('sunrise'));
    const sunsetHour = this.getLocalHour(this.getAttribute('sunset'));
    const duskHour = this.getLocalHour(this.getAttribute('dusk'));

    // Convert to percentages
    const dawnPercent = (dawnHour / 24) * 100;
    const sunrisePercent = (sunriseHour / 24) * 100;
    const sunsetPercent = (sunsetHour / 24) * 100;
    const duskPercent = (duskHour / 24) * 100;

    // Build segments
    segments.push({
      type: 'night',
      percent: dawnPercent,
      color: '#2c3e50'
    });

    segments.push({
      type: 'twilight',
      percent: sunrisePercent - dawnPercent,
      color: '#e74c3c'
    });

    segments.push({
      type: 'daylight',
      percent: sunsetPercent - sunrisePercent,
      color: '#3498db'
    });

    segments.push({
      type: 'twilight',
      percent: duskPercent - sunsetPercent,
      color: '#e74c3c'
    });

    segments.push({
      type: 'night',
      percent: 100 - duskPercent,
      color: '#2c3e50'
    });

    return segments;
  }

  render() {
    const segments = this.calculateSegments();

    // Create segment labels for tooltips
    const segmentLabels = {
      'night': window.t('night') || 'Night',
      'twilight': window.t('twilight') || 'Twilight',
      'daylight': window.t('daylight') || 'Daylight'
    };

    // Get time attributes for detailed tooltips
    const dawn = this.getAttribute('dawn');
    const sunrise = this.getAttribute('sunrise');
    const sunset = this.getAttribute('sunset');
    const dusk = this.getAttribute('dusk');

    // Helper to format time from ISO string
    const formatTime = (isoString) => {
      if (!isoString) return '--:--';
      const date = new Date(isoString);
      const lng = parseFloat(this.getAttribute('lng') || '0');
      const timezoneOffsetHours = Math.round(lng / 15);
      const localDate = new Date(date.getTime() + (timezoneOffsetHours * 60 * 60 * 1000) - (date.getTimezoneOffset() * 60 * 1000));
      
      const hours = String(localDate.getUTCHours()).padStart(2, '0');
      const minutes = String(localDate.getUTCMinutes()).padStart(2, '0');
      return `${hours}:${minutes}`;
    };

    // Helper to calculate duration in hours and minutes
    const calculateDuration = (startISO, endISO) => {
      if (!startISO || !endISO) return '';
      const start = new Date(startISO);
      const end = new Date(endISO);
      const durationMs = end - start;
      const hours = Math.floor(durationMs / (1000 * 60 * 60));
      const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
      const hourAbbr = window.t('hourAbbr') || 'h';
      const minuteAbbr = window.t('minuteAbbr') || 'm';
      return `${hours}${hourAbbr} ${minutes}${minuteAbbr}`;
    };

    // Create detailed tooltip content for each segment type
    const getDetailedTooltip = (type, segmentIndex) => {
      const startLabel = window.t('start') || 'Start';
      const durationLabel = window.t('duration') || 'Duration';
      
      if (type === 'night') {
        if (segmentIndex === 0) {
          // First night segment (midnight to dawn)
          const start = '00:00';
          const end = formatTime(dawn);
          const duration = calculateDuration(
            new Date(new Date(dawn).setHours(0, 0, 0, 0)).toISOString(),
            dawn
          );
          return `${segmentLabels[type]}\\n${startLabel}: ${start}\\n${durationLabel}: ${duration}`;
        } else {
          // Last night segment (dusk to midnight)
          const start = formatTime(dusk);
          const duration = calculateDuration(
            dusk,
            new Date(new Date(dusk).setHours(23, 59, 59, 999)).toISOString()
          );
          return `${segmentLabels[type]}\\n${startLabel}: ${start}\\n${durationLabel}: ${duration}`;
        }
      } else if (type === 'twilight') {
        if (segmentIndex === 1) {
          // Morning twilight (dawn to sunrise)
          const start = formatTime(dawn);
          const duration = calculateDuration(dawn, sunrise);
          return `${segmentLabels[type]} (${window.t('morning') || 'Morning'})\\n${startLabel}: ${start}\\n${durationLabel}: ${duration}`;
        } else {
          // Evening twilight (sunset to dusk)
          const start = formatTime(sunset);
          const duration = calculateDuration(sunset, dusk);
          return `${segmentLabels[type]} (${window.t('evening') || 'Evening'})\\n${startLabel}: ${start}\\n${durationLabel}: ${duration}`;
        }
      } else if (type === 'daylight') {
        const start = formatTime(sunrise);
        const duration = calculateDuration(sunrise, sunset);
        return `${segmentLabels[type]}\\n${startLabel}: ${start}\\n${durationLabel}: ${duration}`;
      }
      
      return segmentLabels[type];
    };

    const hours = Array.from({length: 25}, (_, i) => i);
    const labelsHtml = hours.map(h => 
      `<div style="flex: 1; text-align: center; font-size: 10px; color: #666;">${h}</div>`
    ).join('');

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
        }

        .timeline-bar {
          display: flex;
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          position: relative;
        }

        .segment {
          transition: filter 0.2s ease;
          cursor: pointer;
          position: relative;
        }

        .segment:hover {
          filter: brightness(1.1);
        }

        .timeline-labels {
          display: flex;
          width: 100%;
        }

        .tooltip {
          position: fixed;
          display: none;
          background: rgba(0, 0, 0, 0.9);
          color: white;
          padding: 8px 12px;
          border-radius: 6px;
          font-size: 13px;
          font-family: Segoe UI, Tahoma, Verdana, sans-serif;
          white-space: nowrap;
          z-index: 10000;
          pointer-events: none;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
        }

        .tooltip.visible {
          display: block;
          animation: fadeIn 0.2s ease;
        }

        .tooltip.night {
          background: rgba(44, 62, 80, 0.95);
        }

        .tooltip.twilight {
          background: rgba(231, 76, 60, 0.95);
        }

        .tooltip.daylight {
          background: rgba(52, 152, 219, 0.95);
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      </style>

      <div class="timeline-bar"></div>
      <div class="timeline-labels">
        ${labelsHtml}
      </div>
      <div class="tooltip"></div>
    `;

    // Create segments and add tooltip functionality
    const barContainer = this.shadowRoot.querySelector('.timeline-bar');
    const tooltip = this.shadowRoot.querySelector('.tooltip');
    
    segments.forEach((seg, index) => {
      const segmentDiv = document.createElement('div');
      segmentDiv.className = 'segment';
      segmentDiv.setAttribute('data-type', seg.type);
      segmentDiv.style.flex = seg.percent;
      segmentDiv.style.background = seg.color;
      segmentDiv.style.minHeight = '30px';
      
      const detailedLabel = getDetailedTooltip(seg.type, index);
      
      // Add tooltip event listeners
      segmentDiv.addEventListener('mouseenter', (e) => {
        tooltip.innerHTML = detailedLabel.replace(/\\n/g, '<br>');
        tooltip.className = `tooltip visible ${seg.type}`;
      });

      segmentDiv.addEventListener('mousemove', (e) => {
        const tooltipRect = tooltip.getBoundingClientRect();
        let top = e.clientY - tooltipRect.height - 15;
        let left = e.clientX - tooltipRect.width / 2;

        // Adjust if tooltip goes off screen
        if (top < 10) {
          top = e.clientY + 15;
        }
        if (left < 10) {
          left = 10;
        }
        if (left + tooltipRect.width > window.innerWidth - 10) {
          left = window.innerWidth - tooltipRect.width - 10;
        }

        tooltip.style.top = `${top}px`;
        tooltip.style.left = `${left}px`;
      });

      segmentDiv.addEventListener('mouseleave', () => {
        tooltip.className = 'tooltip';
      });
      
      barContainer.appendChild(segmentDiv);
    });
  }
}

// Register custom element
customElements.define('timeline-graph', TimelineGraph);
