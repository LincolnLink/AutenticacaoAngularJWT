import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../entities/interface/IUser';
import * as moment from "moment";
import { tap, map, shareReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) {
  }


  // Método que faz o login, recebendo email e a senha.
  // Se usa o retorno para criar um token na session.
  login(email:string, password:string ) {
    return this.http.post<User>('/api/login', {email, password})
    .pipe(
      tap((res: any) => this.setSession),
      shareReplay()
    )
  }

  /* Estamos armazenando o JWT diretamente no armazenamento local
  *  na id_tokenentrada da chave.
  */
  /* Pegando o instante atual e a expiresInpropriedade
  *  e usando-os para calcular o carimbo  de data e hora de expiração
  */
  /* Então, estamos salvando também o carimbo de data / hora de expiração
  *  como um valor numérico na expires_atentrada Armazenamento local
  */
  private setSession(authResult: any) {
      const expiresAt = moment().add(authResult.expiresIn,'second');

      localStorage.setItem('id_token', authResult.idToken);
      localStorage.setItem("expires_at", JSON.stringify(expiresAt.valueOf()) );
  }

  logout() {
      localStorage.removeItem("id_token");
      localStorage.removeItem("expires_at");
  }

  public isLoggedIn() {
      return moment().isBefore(this.getExpiration());
  }

  isLoggedOut() {
      return !this.isLoggedIn();
  }

  getExpiration() {

      const expiration: string = localStorage.getItem("expires_at")?? '';
      const expiresAt = JSON.parse(expiration);
      return moment(expiresAt);

  }
}
