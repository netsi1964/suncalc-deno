// Date Picker Custom Element
class DatePicker extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    
    // State
    this.selectedDate = new Date();
    this.viewDate = new Date(); // Month/year being viewed
  }

  static get observedAttributes() {
    return ['selected-date'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'selected-date' && newValue) {
      this.selectedDate = new Date(newValue);
      this.viewDate = new Date(this.selectedDate);
      this.render();
    }
  }

  connectedCallback() {
    this.render();
  }

  isSameDay(date1, date2) {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
  }

  isToday(date) {
    return this.isSameDay(date, new Date());
  }

  getDaysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
  }

  getFirstDayOfMonth(year, month) {
    return new Date(year, month, 1).getDay();
  }

  selectDate(date) {
    this.selectedDate = new Date(date);
    
    // Emit custom event
    this.dispatchEvent(new CustomEvent('datechange', {
      detail: { date: this.selectedDate },
      bubbles: true,
      composed: true
    }));
    
    this.render();
  }

  previousMonth() {
    this.viewDate.setMonth(this.viewDate.getMonth() - 1);
    this.render();
  }

  nextMonth() {
    this.viewDate.setMonth(this.viewDate.getMonth() + 1);
    this.render();
  }

  goToToday() {
    const today = new Date();
    this.viewDate = new Date(today);
    this.selectDate(today);
  }

  generateCalendar() {
    const year = this.viewDate.getFullYear();
    const month = this.viewDate.getMonth();
    const daysInMonth = this.getDaysInMonth(year, month);
    const firstDay = this.getFirstDayOfMonth(year, month);
    
    // Adjust for Monday start (0 = Sunday -> 6, 1 = Monday -> 0)
    const startDay = firstDay === 0 ? 6 : firstDay - 1;
    
    const days = [];
    
    // Previous month days
    const prevMonthDays = this.getDaysInMonth(year, month - 1);
    for (let i = startDay - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, prevMonthDays - i);
      days.push({ date, isCurrentMonth: false });
    }
    
    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      days.push({ date, isCurrentMonth: true });
    }
    
    // Next month days to fill the grid
    const remainingDays = 42 - days.length; // 6 weeks * 7 days
    for (let i = 1; i <= remainingDays; i++) {
      const date = new Date(year, month + 1, i);
      days.push({ date, isCurrentMonth: false });
    }
    
    return days;
  }

  render() {
    const months = ['Januar', 'Februar', 'Marts', 'April', 'Maj', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'December'];
    const weekdays = ['Man', 'Tir', 'Ons', 'Tor', 'Fre', 'Lør', 'Søn'];
    
    const currentMonth = months[this.viewDate.getMonth()];
    const currentYear = this.viewDate.getFullYear();
    const days = this.generateCalendar();

    const daysHtml = days.map(({ date, isCurrentMonth }) => {
      const isSelected = this.isSameDay(date, this.selectedDate);
      const isToday = this.isToday(date);
      
      return `
        <div class="day ${isCurrentMonth ? '' : 'other-month'} ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''}"
             data-date="${date.toISOString()}">
          ${date.getDate()}
        </div>
      `;
    }).join('');

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
          font-family: Segoe UI, Tahoma, Verdana, sans-serif;
        }

        .picker-container {
          background: white;
          border-radius: 8px;
          padding: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }

        .month-year {
          font-size: 14px;
          font-weight: bold;
          color: #2c3e50;
        }

        .nav-buttons {
          display: flex;
          gap: 6px;
        }

        .nav-btn, .today-btn {
          width: 28px;
          height: 28px;
          border: none;
          border-radius: 6px;
          background: #f0f0f0;
          color: #2c3e50;
          font-size: 14px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        .nav-btn:hover, .today-btn:hover {
          background: #667eea;
          color: white;
          transform: scale(1.05);
        }

        .today-btn {
          width: auto;
          padding: 0 10px;
          font-size: 12px;
          font-weight: bold;
          background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
          color: white;
        }

        .today-btn:hover {
          background: linear-gradient(135deg, #218838 0%, #1aa179 100%);
        }

        .weekdays {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 2px;
          margin-bottom: 4px;
        }

        .weekday {
          text-align: center;
          font-size: 10px;
          font-weight: bold;
          color: #666;
          padding: 4px 0;
        }

        .days-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 2px;
        }

        .day {
          aspect-ratio: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 6px;
          cursor: pointer;
          font-size: 12px;
          transition: all 0.2s;
          background: white;
          color: #2c3e50;
        }

        .day:hover {
          background: #f0f0f0;
          transform: scale(1.05);
        }

        .day.other-month {
          color: #2c3e50;
        }

        .day.selected {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          font-weight: bold;
        }

        .day.today {
          border: 2px solid #28a745;
          font-weight: bold;
        }

        .day.selected.today {
          border-color: white;
        }
      </style>

      <div class="picker-container">
        <div class="header">
          <div class="month-year">${currentMonth} ${currentYear}</div>
          <div class="nav-buttons">
            <button class="today-btn" id="today-btn">I dag</button>
            <button class="nav-btn" id="prev-btn">◀</button>
            <button class="nav-btn" id="next-btn">▶</button>
          </div>
        </div>
        
        <div class="weekdays">
          ${weekdays.map(day => `<div class="weekday">${day}</div>`).join('')}
        </div>
        
        <div class="days-grid">
          ${daysHtml}
        </div>
      </div>
    `;

    // Attach event listeners
    this.shadowRoot.getElementById('prev-btn').addEventListener('click', () => this.previousMonth());
    this.shadowRoot.getElementById('next-btn').addEventListener('click', () => this.nextMonth());
    this.shadowRoot.getElementById('today-btn').addEventListener('click', () => this.goToToday());
    
    this.shadowRoot.querySelectorAll('.day').forEach(dayEl => {
      dayEl.addEventListener('click', () => {
        const dateStr = dayEl.getAttribute('data-date');
        this.selectDate(new Date(dateStr));
      });
    });
  }
}

// Register custom element
customElements.define('date-picker', DatePicker);
