import axios, { AxiosPromise } from "axios";
import { Report } from "../model/Report";

const baseUrl = 'http://localhost:3001/api/reports';


export class Reports {
    public static getReport = (id: string) => {
        const request: AxiosPromise = axios.get(`${baseUrl}/${id}`);
        return request.then(response => {
            return new Report(response.data);
        });
    }
    public static getReports = () => {
        const request: AxiosPromise = axios.get(baseUrl);
        return request.then(response => {
            console.log("response from axios");
            return response.data;
        });
    }
    public static createReport = (template: object) => {
        const request: AxiosPromise = axios.post(baseUrl, template);
        return request.then(response => {
            return new Report(response.data);
        });
    }
}
