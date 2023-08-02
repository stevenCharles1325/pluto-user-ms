import { phoneNumberConfig } from 'Config/phoneNumber'
import axios from 'axios'

export default class PhoneNumberProvider {
  private accessKey: string
  private baseURL: string

  constructor(public config: typeof phoneNumberConfig) {
    this.accessKey = config.accessKey
    this.baseURL = config.baseURL
  }

  private getUrl(endpointName: string): URL {
    return new URL(`${this.baseURL}/${endpointName}?accessKey=${this.accessKey}`)
  }

//   public async getAllAvaliableCountries(): Promise<any> {

//   }
}
