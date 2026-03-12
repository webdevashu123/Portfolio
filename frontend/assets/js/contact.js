const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");

if (contactForm && formStatus) {
  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(contactForm);
    const payload = {
      name: String(formData.get("name") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      projectType: String(formData.get("projectType") || ""),
      budget: String(formData.get("budget") || ""),
      message: String(formData.get("message") || "").trim()
    };

    if (!payload.name || !payload.email || !payload.message) {
      formStatus.textContent = "Please fill in all required fields.";
      formStatus.style.color = "var(--error)";
      if (window.toast) {
        window.toast.error("Please fill in all required fields.");
      }
      return;
    }

    formStatus.textContent = "Sending message...";
    formStatus.style.color = "var(--muted)";

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.message || "Unable to submit your message.");
      }

      formStatus.textContent = "Message sent successfully!";
      formStatus.style.color = "var(--success)";
      contactForm.reset();
      
      if (window.toast) {
        window.toast.success("Message sent successfully! Check your email for confirmation.");
      }
    } catch (error) {
      formStatus.textContent = error.message || "Unable to submit your message right now.";
      formStatus.style.color = "var(--error)";
      if (window.toast) {
        window.toast.error(error.message || "Unable to submit your message.");
      }
    }
  });
}
