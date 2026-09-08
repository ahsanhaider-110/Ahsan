document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.querySelector('.navbar-toggler');
  const navMenu = document.querySelector('.navbar-collapse');
  const navLinks = document.querySelectorAll('.nav-link');
  const yearNode = document.querySelector('#year');
  const revealItems = document.querySelectorAll('.reveal');

  if (yearNode) {
    yearNode.textContent = new Date().getFullYear();
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
