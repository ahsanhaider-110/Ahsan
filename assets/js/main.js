document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.querySelector('.navbar-toggler');
  const navMenu = document.querySelector('.navbar-collapse');
  const navLinks = document.querySelectorAll('.nav-link');
  const yearNode = document.querySelector('#year');
  const revealItems = document.querySelectorAll('.reveal');
  const contactForm = document.querySelector('#contactForm');
  const formStatus = document.querySelector('#formStatus');
  const submitButton = contactForm?.querySelector('button[type="submit"]');

  const emailJsConfig = {
    publicKey: 'YOUR_EMAILJS_PUBLIC_KEY',
    serviceId: 'YOUR_EMAILJS_SERVICE_ID',
    templateId: 'YOUR_EMAILJS_TEMPLATE_ID',
  };

  if (yearNode) {
    yearNode.textContent = new Date().getFullYear();
  }

  if (contactForm && window.emailjs) {
    window.emailjs.init({ publicKey: emailJsConfig.publicKey });

    contactForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      if (!contactForm.reportValidity()) {
        return;
      }

      if (Object.values(emailJsConfig).some((value) => value.startsWith('YOUR_'))) {
        formStatus.textContent = 'EmailJS is not configured yet.';
        formStatus.classList.add('error');
        return;
      }

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
      } catch (error) {
        formStatus.textContent = 'Message could not be sent. Please try again.';
        formStatus.classList.add('error');
        console.error('EmailJS error:', error);
      } finally {
        submitButton.disabled = false;
        submitButton.textContent = 'Send Message';
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
