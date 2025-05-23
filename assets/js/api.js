// Send POST request
export async function post(request) {
  try {
    const response = await fetch(request);
    if (!response.ok) {
      return { ok: false };
    }
    return { ok: true };
  } catch (error) {
    return { ok: false };
  }
}

// Create form data request
export function createFormPostRequest(url, form) {
  const formData = new FormData(form);
  // console.log(JSON.stringify(Object.fromEntries(formData.entries())));
  return new Request(url, {
    method: "POST",
    body: formData,
    // Content-Type will be automatically set with the appropriate boundary when using FormData
  });
}
