export const ignoreNotFound = <T>(fallback: T) => (error: any): T => {
    if (error.response && error.response.status === 404) {
      return fallback
    }
    throw error
  }