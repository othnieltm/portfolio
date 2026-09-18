const EMAIL = "makumbeothnielt@gmail.com";
const form = document.getElementById("contact-form");
const statusEl = document.getElementById("form-status");

function setStatus(text, isError) {
  statusEl.textContent = text;
  statusEl.classList.toggle("error", Boolean(isError));
}

function openMailClient(name, from, message) {
  const subject = encodeURIComponent(`Portfolio message from ${name}`);
  const body = encodeURIComponent(`${message}\n\n— ${name}\n${from}`);
  window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const name = form.name.value.trim();
  const from = form.email.value.trim();
  const message = form.message.value.trim();
  const honeypot = form._gotcha.value.trim();

  if (honeypot) {
    setStatus("Message sent.");
    form.reset();
    return;
  }

  if (!name || !from || !message) {
    setStatus("Please fill in name, email, and message.", true);
    return;
  }

  const button = form.querySelector("button");
  button.disabled = true;
  setStatus("Sending…");

  try {
    const payload = new FormData();
    payload.append("name", name);
    payload.append("email", from);
    payload.append("message", message);
    payload.append("_subject", `Portfolio message from ${name}`);
    payload.append("_template", "table");
    payload.append("_captcha", "false");

    const response = await fetch(`https://formsubmit.co/ajax/${EMAIL}`, {
      method: "POST",
      headers: { Accept: "application/json" },
      body: payload,
    });

    if (!response.ok) {
      throw new Error("Form service unavailable");
    }

    setStatus("Message sent. I will get back to you at this address.");
    form.reset();
  } catch (error) {
    openMailClient(name, from, message);
    setStatus("Opening your email app so the message can go out.");
  } finally {
    button.disabled = false;
  }
});
