document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.querySelector('.navbar-toggler');
  const navMenu = document.querySelector('.navbar-collapse');
  const navLinks = document.querySelectorAll('.nav-link');
  const yearNode = document.querySelector('#year');
  const revealItems = document.querySelectorAll('.reveal');
  const contactForm = document.querySelector('#contactForm');
  const formStatus = document.querySelector('#formStatus');
  const submitButton = contactForm?.querySelector('button[type="submit"]');
  const cooldownStorageKey = 'contactFormCooldownEnd';
  const cooldownDuration = 30 * 60 * 1000;

  const emailJsConfig = {
    publicKey: 'tOYa1BVry_Kgk7jHt',
    serviceId: 'service_l8qysym',
    templateId: 'template_wgjqbtb',
  };

  if (yearNode) {
    yearNode.textContent = new Date().getFullYear();
  }

  if (contactForm) {
    let cooldownInterval = null;
    let isSubmitting = false;

    const updateCooldownButton = (cooldownEnd) => {
      const remaining = cooldownEnd - Date.now();

      if (remaining <= 0) {
        localStorage.removeItem(cooldownStorageKey);
        clearInterval(cooldownInterval);
        cooldownInterval = null;
        submitButton.disabled = false;
        submitButton.textContent = 'Send Message';
        return false;
      }

      const totalSeconds = Math.ceil(remaining / 1000);
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      submitButton.disabled = true;
      submitButton.textContent = `Send Message (${minutes}:${String(seconds).padStart(2, '0')})`;
      return true;
    };

    const startCooldown = (cooldownEnd) => {
      localStorage.setItem(cooldownStorageKey, String(cooldownEnd));
      clearInterval(cooldownInterval);
      updateCooldownButton(cooldownEnd);
      cooldownInterval = setInterval(() => updateCooldownButton(cooldownEnd), 1000);
    };

    const savedCooldownEnd = Number(localStorage.getItem(cooldownStorageKey));
    if (savedCooldownEnd && updateCooldownButton(savedCooldownEnd)) {
      cooldownInterval = setInterval(() => updateCooldownButton(savedCooldownEnd), 1000);
    }

    if (!window.emailjs) {
      formStatus.textContent = 'Email service is unavailable. Please try again later.';
      formStatus.classList.add('error');
      return;
    }

    window.emailjs.init({ publicKey: emailJsConfig.publicKey });

    contactForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      if (!contactForm.reportValidity()) {
        return;
      }

      if (isSubmitting || localStorage.getItem(cooldownStorageKey)) {
        return;
      }

      if (Object.values(emailJsConfig).some((value) => value.startsWith('YOUR_'))) {
        formStatus.textContent = 'EmailJS is not configured yet.';
        formStatus.classList.add('error');
        return;
      }

      isSubmitting = true;
      submitButton.disabled = true;
      submitButton.textContent = 'Sending...';
      formStatus.textContent = '';
      formStatus.classList.remove('error', 'success');

      try {
        await window.emailjs.sendForm(
          emailJsConfig.serviceId,
          emailJsConfig.templateId,
          contactForm
        );
        contactForm.reset();
        formStatus.textContent = 'Message sent successfully.';
        formStatus.classList.add('success');
        startCooldown(Date.now() + cooldownDuration);
      } catch (error) {
        const errorMessage = error?.text || error?.message || 'Please try again.';
        formStatus.textContent = `Message could not be sent: ${errorMessage}`;
        formStatus.classList.add('error');
        console.error('EmailJS error:', error);
      } finally {
        isSubmitting = false;
        if (!localStorage.getItem(cooldownStorageKey)) {
          submitButton.disabled = false;
          submitButton.textContent = 'Send Message';
        }
      }
    });
  }

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('show');
    });
  }

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.forEach((item) => item.classList.remove('active'));
      link.classList.add('active');

      if (navMenu) {
        navMenu.classList.remove('show');
      }
    });
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
    }
  );

  revealItems.forEach((item) => observer.observe(item));

  const typedText = document.querySelector('.typed-text');
  if (typedText) {
    const textList = ['Web Developer', 'UI Designer', 'Freelancer'];
    let index = 0;
    let charIndex = 0;

    const typeLoop = () => {
      const currentText = textList[index];
      typedText.textContent = currentText.slice(0, charIndex);
      charIndex++;

      if (charIndex > currentText.length) {
        index = (index + 1) % textList.length;
        charIndex = 0;
        setTimeout(() => {
          typeLoop();
        }, 1000);
        return;
      }

      setTimeout(typeLoop, 120);
    };

    typeLoop();
  }
});
