// Date Timeline Custom Element
class DateTimeline extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    
    // State
    this.selectedDate = new Date();
    this.scrollOffset = 0;
    this.isDragging = false;
    this.startX = 0;
    this.startScrollOffset = 0;
    this.wheelTimeout = null;
    
    // Bind event handlers once for cleanup
    this.handleDragStartBound = this.handleDragStart.bind(this);
    this.handleDragMoveBound = this.handleDragMove.bind(this);
    this.handleDragEndBound = this.handleDragEnd.bind(this);
    
    // Generate 180 days (90 before, 90 after) for infinite scroll
    this.days = this.generateDays(180);
  }

  static get observedAttributes() {
    return ['selected-date'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'selected-date' && newValue) {
      this.selectedDate = new Date(newValue);
      this.days = this.generateDays(180);
      this.render();
      // Re-center after attribute change (wait for render to complete)
      setTimeout(() => {
        this.centerOnSelectedDate();
      }, 100);
    }
  }

  connectedCallback() {
    this.render();
    // Center on selected date after rendering
    setTimeout(() => {
      this.centerOnSelectedDate();
    }, 100);
  }

  centerOnSelectedDate() {
    const selectedIndex = this.days.findIndex(date => 
      this.isSameDay(date, this.selectedDate)
    );
    if (selectedIndex >= 0) {
      const dayWidth = 92; // 80px width + 12px gap
      const container = this.shadowRoot.querySelector('.timeline-container');
      if (container) {
        const containerWidth = container.offsetWidth || window.innerWidth;
        // Center the selected day in the viewport
        // scrollOffset moves the track, so negative value moves items to the left
        // We want the selected item to be in the center of the container
        this.scrollOffset = -selectedIndex * dayWidth + (containerWidth / 2) - (dayWidth / 2);
        
        // Use animateScroll for smooth centering
        this.animateScroll(this.scrollOffset);
      }
    }
  }

  generateDays(count) {
    const days = [];
    const today = new Date(this.selectedDate);
    today.setHours(0, 0, 0, 0);
    
    // Generate many more days for infinite scroll (180 days total: 90 before, 90 after)
    const start = new Date(today);
    start.setDate(start.getDate() - 90);
    
    for (let i = 0; i < 180; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      days.push(date);
    }
    
    return days;
  }

  formatDay(date) {
    const days = ['Søn', 'Man', 'Tir', 'Ons', 'Tor', 'Fre', 'Lør'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Maj', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec'];
    
    return {
      weekday: days[date.getDay()],
      day: date.getDate(),
      month: months[date.getMonth()],
      isSelected: this.isSameDay(date, this.selectedDate),
      isToday: this.isSameDay(date, new Date())
    };
  }

  isSameDay(date1, date2) {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
  }
  
  cleanupEventListeners() {
    // Remove window-level listeners to prevent memory leaks
    window.removeEventListener('mousemove', this.handleDragMoveBound);
    window.removeEventListener('mouseup', this.handleDragEndBound);
    window.removeEventListener('touchmove', this.handleDragMoveBound);
    window.removeEventListener('touchend', this.handleDragEndBound);
  }

  attachEventListeners() {
    // Clean up any existing window listeners first
    this.cleanupEventListeners();
    
    const container = this.shadowRoot.querySelector('.timeline-container');
    if (!container) return;

    // Wheel event for trackpad horizontal scroll
    container.addEventListener('wheel', (e) => {
      // Check if horizontal scroll (trackpad two-finger swipe)
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        e.preventDefault();
        this.scrollOffset -= e.deltaX;
        this.updateScrollPosition();
        
        // Debounced snap after scroll stops
        clearTimeout(this.wheelTimeout);
        this.wheelTimeout = setTimeout(() => {
          this.snapToNearestDay();
        }, 150);
      }
    }, { passive: false });

    // Mouse events (use bound references for cleanup)
    container.addEventListener('mousedown', this.handleDragStartBound);
    window.addEventListener('mousemove', this.handleDragMoveBound);
    window.addEventListener('mouseup', this.handleDragEndBound);

    // Touch events (use bound references for cleanup)
    container.addEventListener('touchstart', this.handleDragStartBound, { passive: true });
    window.addEventListener('touchmove', this.handleDragMoveBound, { passive: false });
    window.addEventListener('touchend', this.handleDragEndBound);
    
    // Arrow buttons
    const leftArrow = this.shadowRoot.querySelector('.arrow-left');
    const rightArrow = this.shadowRoot.querySelector('.arrow-right');
    
    if (leftArrow) {
      leftArrow.addEventListener('click', (e) => {
        e.stopPropagation();
        this.scrollByDays(-7);
      });
    }
    if (rightArrow) {
      rightArrow.addEventListener('click', (e) => {
        e.stopPropagation();
        this.scrollByDays(7);
      });
    }

    // Click on day (use event delegation)
    container.addEventListener('click', (e) => {
      // Don't select if user was dragging
      if (this.isDragging || this.wasDragging) {
        this.wasDragging = false;
        return;
      }
      
      const dayElement = e.target.closest('.day-item');
      if (dayElement) {
        const index = parseInt(dayElement.dataset.index);
        if (this.days[index]) {
          this.selectDate(this.days[index]);
        }
      }
    });
  }
  
  scrollByDays(count) {
    const dayWidth = 92; // 80px + 12px gap
    this.scrollOffset += count * dayWidth;
    
    // Clamp scroll to available days
    const maxScroll = 0;
    const minScroll = -(this.days.length - 1) * dayWidth;
    this.scrollOffset = Math.max(minScroll, Math.min(maxScroll, this.scrollOffset));
    
    this.animateScroll(this.scrollOffset);
  }

  handleDragStart(e) {
    this.isDragging = false; // Start as false
    this.wasDragging = false;
    this.startX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
    this.startScrollOffset = this.scrollOffset;
  }

  handleDragMove(e) {
    if (!this.startX) return;
    
    if (e.type.includes('touch')) {
      e.preventDefault();
    }
    
    const currentX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
    const deltaX = currentX - this.startX;
    
    // Only set dragging if moved more than 5px
    if (Math.abs(deltaX) > 5) {
      this.isDragging = true;
      this.wasDragging = true;
    }
    
    if (this.isDragging) {
      this.scrollOffset = this.startScrollOffset + deltaX;
      this.updateScrollPosition();
    }
  }

  handleDragEnd(e) {
    if (this.isDragging) {
      // Snap to nearest day
      this.snapToNearestDay();
    }
    this.isDragging = false;
    this.startX = null;
  }

  updateScrollPosition() {
    const track = this.shadowRoot.querySelector('.days-track');
    if (track) {
      track.style.transform = `translateX(${this.scrollOffset}px)`;
    }
  }

  snapToNearestDay() {
    const dayWidth = 92; // Width of each day item + gap (80px + 12px)
    const container = this.shadowRoot.querySelector('.timeline-container');
    if (!container) return;
    
    const containerWidth = container.offsetWidth;
    const centerOffset = (containerWidth / 2) - (dayWidth / 2);
    
    // Find nearest day index based on scroll offset
    // Account for the centering offset when calculating which day is in center
    const targetIndex = Math.round((-this.scrollOffset + centerOffset) / dayWidth);
    const clampedIndex = Math.max(0, Math.min(this.days.length - 1, targetIndex));
    
    // Snap animation - center the selected day
    const targetScroll = -clampedIndex * dayWidth + centerOffset;
    this.animateScroll(targetScroll);
    
    // Select the snapped date (without triggering full render)
    setTimeout(() => {
      if (this.days[clampedIndex]) {
        this.selectedDate = new Date(this.days[clampedIndex]);
        
        // Emit event
        this.dispatchEvent(new CustomEvent('datechange', {
          detail: { date: this.selectedDate },
          bubbles: true,
          composed: true
        }));
        
        // Only update visual selection without full re-render
        this.updateSelectedVisual();
      }
    }, 300);
  }

  animateScroll(targetScroll) {
    const track = this.shadowRoot.querySelector('.days-track');
    if (track) {
      this.scrollOffset = targetScroll;
      track.style.transition = 'transform 0.3s ease-out';
      track.style.transform = `translateX(${targetScroll}px)`;
      
      setTimeout(() => {
        track.style.transition = '';
      }, 300);
    }
  }

  selectDate(date) {
    this.selectedDate = new Date(date);
    
    // Emit custom event FIRST so parent can update
    this.dispatchEvent(new CustomEvent('datechange', {
      detail: { date: this.selectedDate },
      bubbles: true,
      composed: true
    }));
    
    // Update visual selection without re-rendering
    this.updateSelectedVisual();
  }
  
  updateSelectedVisual() {
    // Update selected class on day items without full re-render
    const dayItems = this.shadowRoot.querySelectorAll('.day-item');
    dayItems.forEach((item, index) => {
      const date = this.days[index];
      if (date && this.isSameDay(date, this.selectedDate)) {
        item.classList.add('selected');
      } else {
        item.classList.remove('selected');
      }
    });
  }

  render() {
    const daysHtml = this.days.map((date, index) => {
      const { weekday, day, month, isSelected, isToday } = this.formatDay(date);
      
      return `
        <div class="day-item ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''}" 
             data-index="${index}">
          <div class="day-weekday">${weekday}</div>
          <div class="day-number">${day}</div>
          <div class="day-month">${month}</div>
        </div>
      `;
    }).join('');

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
          overflow: hidden;
          user-select: none;
          -webkit-user-select: none;
        }

        .timeline-container {
          position: relative;
          height: 100px;
          cursor: grab;
          padding: 10px 0;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .timeline-container:active {
          cursor: grabbing;
        }

        .days-track {
          display: flex;
          gap: 12px;
          will-change: transform;
        }

        .day-item {
          flex: 0 0 80px;
          height: 80px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: white;
          border: 2px solid #e0e0e0;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .day-item:hover {
          border-color: #667eea;
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(102, 126, 234, 0.2);
        }

        .day-item.selected {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-color: #667eea;
          color: white;
        }

        .day-item.today {
          border-color: #28a745;
          border-width: 3px;
        }

        .day-weekday {
          font-size: 11px;
          opacity: 0.7;
          text-transform: uppercase;
        }

        .day-number {
          font-size: 24px;
          font-weight: bold;
          margin: 4px 0;
        }

        .day-month {
          font-size: 11px;
          opacity: 0.7;
        }

        .day-item.selected .day-weekday,
        .day-item.selected .day-month {
          opacity: 0.9;
        }
        
        .arrow-left,
        .arrow-right {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 36px;
          height: 36px;
          background: white;
          border: 2px solid #667eea;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 18px;
          color: #667eea;
          font-weight: bold;
          z-index: 10;
          transition: all 0.2s;
          user-select: none;
        }
        
        .arrow-left:hover,
        .arrow-right:hover {
          background: #667eea;
          color: white;
          transform: translateY(-50%) scale(1.1);
        }
        
        .arrow-left {
          left: 10px;
        }
        
        .arrow-right {
          right: 10px;
        }
      </style>

      <div class="timeline-container">
        <button class="arrow-left">◀</button>
        <div class="days-track">
          ${daysHtml}
        </div>
        <button class="arrow-right">▶</button>
      </div>
    `;
    
    // Re-attach event listeners after render destroys them
    setTimeout(() => {
      this.attachEventListeners();
      // Don't call updateScrollPosition here - it will use old scrollOffset
      // Let centerOnSelectedDate() handle positioning after days are regenerated
    }, 0);
  }
}

// Register custom element
customElements.define('date-timeline', DateTimeline);
