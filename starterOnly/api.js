// Send POST request
async function post(request) {
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
function createFormPostRequest(url, form) {
  const formData = new FormData(form);
  return new Request(url, {
    method: "POST",
    body: formData,
    // Content-Type will be automatically set with the appropriate boundary when using FormData
  });
}
