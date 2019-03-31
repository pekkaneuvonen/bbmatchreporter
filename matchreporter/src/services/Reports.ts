import axios, { AxiosPromise } from "axios";
import { Report } from "../model/Report";

const baseUrl = '/api/reports';


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
            return response.data;
        });
    }
    public static createReport = (template: object) => {
        const request: AxiosPromise = axios.post(baseUrl, template);
        return request.then(response => {
            return new Report(response.data);
        });
    }
    public static deleteReport = (deletedId: string) => {
        const request: AxiosPromise = axios.delete(`${baseUrl}/${deletedId}`);
        return request.then(response => response.data);
    }
    public static update = (id: string, newObject: object) => {
        const request = axios.put(`${baseUrl}/${id}`, newObject);
        return request.then(response => response.data);
      }
}
