import { Component, Injectable } from "@angular/core";
import {
  NgbDate,
  NgbCalendar,
  NgbDateStruct,
  NgbDatepickerI18n
} from "@ng-bootstrap/ng-bootstrap";

const I18N_DATEPICKER_WEEKDAYS = ["L", "M", "M", "J", "V", "S", "D"];
const I18N_DATEPICKER_MONTHS = [
  "Janvier",
  "Février",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Août",
  "Septembre",
  "Octobre",
  "Novembre",
  "Décembre"
];

// Define custom service providing the months and weekdays translations
@Injectable()
export class CustomDatepickerI18n extends NgbDatepickerI18n {
  getWeekdayShortName(weekday: number): string {
    return I18N_DATEPICKER_WEEKDAYS[weekday - 1];
  }
  getMonthShortName(month: number): string {
    return I18N_DATEPICKER_MONTHS[month - 1];
  }
  getMonthFullName(month: number): string {
    return this.getMonthShortName(month);
  }

  getDayAriaLabel(date: NgbDateStruct): string {
    return `${date.day}-${date.month}-${date.year}`;
  }
}

@Component({
  selector: "app-component",
  styleUrls: ["./app.component.scss"],
  templateUrl: "./app.component.html",
  providers: [{ provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n }]
})
export class AppComponent {
  hoveredDate: NgbDate;
  fromDate: NgbDate;
  toDate: NgbDate;

  constructor(private calendar: NgbCalendar) {
    this.fromDate = calendar.getToday();
    this.toDate = calendar.getNext(calendar.getToday(), "d", 3);
  }

  events = [
    {
      fromDate: this.calendar.getNext(this.calendar.getToday(), "d", 14),
      toDate: this.calendar.getNext(this.calendar.getToday(), "m", 1)
    },
    {
      fromDate: this.calendar.getNext(this.calendar.getToday(), "d", 5),
      toDate: this.calendar.getNext(this.calendar.getToday(), "d", 8)
    }
  ];

  isStartOfEvent(date: NgbDate) {
    return date.equals(this.fromDate) || this.events.find((e) => date.equals(e.fromDate));
  }

  isEndOfEvent(date: NgbDate) {
    return date.equals(this.toDate) || this.events.find((e) => date.equals(e.toDate));
  }

  isFirstDayOfMonth(date: NgbDate) {
    return date.day === 1;
  }

  isLastDayOfMonth(date: NgbDate) {
    return (
      date.day ===
      this.calendar.getPrev(new NgbDate(date.year, date.month + 1, 1), "d", 1)
        .day
    );
  }

  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date.after(this.fromDate)) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
  }

  isHovered(date: NgbDate) {
    return (
      (this.fromDate &&
        !this.toDate &&
        this.hoveredDate &&
        date.after(this.fromDate) &&
        date.before(this.hoveredDate)) 
    );
  }

  isInside(date: NgbDate) {
    return (
      (date.after(this.fromDate) && date.before(this.toDate)) ||
      this.isInsideEvent(date)
    );
  }

  isInsideEvent(date: NgbDate) {
    return this.events.reduce((acc, event) => {
      const isInside = date.after(event.fromDate) && date.before(event.toDate);
      return acc || isInside;
    }, false);
  }

  isRange(date: NgbDate) {
    return (
      this.isStartOfEvent(date) ||
      this.isEndOfEvent(date) ||
      this.isInside(date) ||
      this.isHovered(date)
    );
  }
}
