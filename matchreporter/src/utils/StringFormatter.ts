import { Kvalue } from "../types/Kvalue";
import { number } from "prop-types";

export default class StringFormatter {
    public static formatDate(date: Date): string {
        let dateString: string = String(date.getDate());
        dateString = dateString.concat(". " + String(date.getMonth()))
        dateString = dateString.concat(". " + String(date.getFullYear()))
        return dateString;
    }
    public static formatAsKvalue(unformattedkvalue: string | number): string {
        console.log("formatting : " + unformattedkvalue);
        let numeric;
        if (typeof unformattedkvalue === "string") {
            numeric = StringFormatter.convertKvalueStringToNumeric(unformattedkvalue);
        } else if (typeof unformattedkvalue === "number") {
            numeric = unformattedkvalue;
        }
        return new Kvalue(numeric).asString;
    }
    public static convertKvalueStringToNumeric(kvaluestring: string): number {
        if (kvaluestring) {
            let split: string[] = kvaluestring.split("k");
            let numericValue: number = parseInt(split.join(""), 10);
            numericValue *= 1000;
            return numericValue;
        } else {
            return 0;
        }
    }
}