export default class StringFormatter {
    public static formatDate(date: Date): string {
        let dateString: string = String(date.getDate());
        dateString = dateString.concat(". " + String(date.getMonth()))
        dateString = dateString.concat(". " + String(date.getFullYear()))
        return dateString;
    }
}