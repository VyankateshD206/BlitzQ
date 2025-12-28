function headers(apiKey: string) {
  return {
    'Accept': 'application/vnd.api+json',
    'Content-Type': 'application/vnd.api+json',
    'Authorization': 'Bearer ' + apiKey
  }
}

export {
  headers
}