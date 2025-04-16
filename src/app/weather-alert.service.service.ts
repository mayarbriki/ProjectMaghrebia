import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WeatherAlertService {
  private apiUrl = 'https://api.weatherapi.com/v1/current.json?key=TON_API_KEY&q=';  // 🚀 API Météo

  constructor(private http: HttpClient) {}

  getWeather(city: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}${city}`);
  }
}
