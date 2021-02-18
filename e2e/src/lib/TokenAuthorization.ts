import {RequestHook} from "testcafe";
import axios from "axios";

export interface TokenData {
  token: string,
  userId: string,
  username: string
}

async function getToken(): Promise<TokenData> {
  const payload = {
    username: "John Testcafe",
    email: "john@altszama.club"
  }
  const response = await axios.post("http://localhost:8088/api/auth/testLogin", payload)

  return response.data as TokenData
}

export class TokenAuthorization extends RequestHook {
  private token: string = ""

  constructor () {
    // No URL filtering applied to this hook
    // so it will be used for all requests.
    super();
  }

  async init() {
    const tokenData = await getToken()
    this.token = tokenData.token
  }

  async onRequest(e: any): Promise<void> {
    e.requestOptions.headers['Authorization'] = "Bearer " + this.token;
  }

  async onResponse (_: any) {
    // This method must also be overridden,
    // but you can leave it blank.
  }
}
