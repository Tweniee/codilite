import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class SessionCodeService {
  private baseUrl = environment.baseUrl;
  constructor(private http: HttpClient) {}

  getSessionDataService(roomId: string) {
    const url = this.baseUrl + '/session/getInitialSession/' + roomId;
    return this.get(url);
  }

  private get(url) {
    return this.http.get(url);
  }
}
