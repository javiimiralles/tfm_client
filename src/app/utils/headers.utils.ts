import { environment } from "../../environments/environment"

export const headers = () => {
  return {
    headers: {
      'x-token': localStorage.getItem('token') || '',
      'Authorization': 'Basic ' + btoa(`${environment.apiUser}:${environment.apiPassword}`)
    }
  }
}
