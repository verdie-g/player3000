const BASE_URL = 'http://localhost:8000';

class ApiService {
  public get(url: string): Promise<any> {
    return this.req('GET', url);
  }

  public post(url: string, body?: any): Promise<any> {
    return this.req('POST', url, body);
  }

  public put(url: string, body?: any): Promise<any> {
    return this.req('PUT', url, body);
  }

  public delete(url: string): Promise<any> {
    return this.req('DELETE', url);
  }

  private async req(method: string, url: string, body?: any): Promise<any> {
    const res = await fetch(BASE_URL + url, {
      method,
      body,
    });
    return res!.json();
  }
}

export default new ApiService();
