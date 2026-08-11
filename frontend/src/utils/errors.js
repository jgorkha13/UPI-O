export function getApiErrorMessage(err, fallback = 'Something went wrong. Please try again.') {
  if (!err?.response) {
    if (err?.code === 'ERR_NETWORK') {
      return 'Cannot connect to server. Make sure the backend is running on port 8080.';
    }
    return err?.message || fallback;
  }

  const { data, status } = err.response;

  if (data?.error) return data.error;
  if (data?.message) return data.message;

  if (status === 401) {
    return 'Unauthorized request. Try refreshing the page or use a different phone number.';
  }

  return fallback;
}
