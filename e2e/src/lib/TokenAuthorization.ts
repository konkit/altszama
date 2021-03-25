import {RequestHook} from "testcafe";
import axios from "axios";

const TARGET_PORT = process.env.TARGET_PORT;

export interface TokenData {
  token: string,
  userId: string,
  username: string
}

export interface UserData {
  username: string;
  email: string;
}

async function getToken(userData: UserData): Promise<TokenData> {
  const response = await axios.post(`http://localhost:${TARGET_PORT}/api/auth/testUser/login`, userData)

  return response.data as TokenData
}

export class TokenAuthorization extends RequestHook {
  private token: string = ""

  constructor () {
    // No URL filtering applied to this hook
    // so it will be used for all requests.
    super();
  }

  async init(userData: UserData) {
    const tokenData = await getToken(userData)
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
