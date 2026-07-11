// Pulls the most useful message out of an Axios error from our API.
// Our validate() middleware sends { message, errors: { field: [msgs] } }
// on a 400 — this surfaces the actual field problem instead of the generic
// "Validation failed" wrapper message.
export function getApiErrorMessage(err, fallback = 'Something went wrong') {
  const data = err?.response?.data;
  if (!data) return fallback;

  if (data.errors) {
    const firstField = Object.keys(data.errors)[0];
    const firstMessage = data.errors[firstField]?.[0];
    if (firstField && firstMessage) {
      return `${firstField}: ${firstMessage}`;
    }
  }

  return data.message || fallback;
}