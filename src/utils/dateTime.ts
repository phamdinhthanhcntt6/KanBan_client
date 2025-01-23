import { addZeroToNumber } from "./addZeroToNumber";

export class DateTime {
  static CalendarDate = (val: any) => {
    const date = new Date(val);

    //YYYY/MM/DD
    return `${date.getFullYear()}/${addZeroToNumber(
      date.getMonth() + 1
    )}/${date.getDate()}`;
  };
}
