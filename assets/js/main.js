document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.querySelector('.navbar-toggler');
  const navMenu = document.querySelector('.navbar-collapse');
  const navLinks = document.querySelectorAll('.nav-link');
  const yearNode = document.querySelector('#year');
  const revealItems = document.querySelectorAll('.reveal');
  const whatCanDoButton = document.querySelector('#whatCanDoButton');
  const servicesModal = document.querySelector('#servicesModal');
  const modalCloseButtons = servicesModal?.querySelectorAll('[data-modal-close]');
  const capabilityTabs = servicesModal?.querySelectorAll('[role="tab"][data-capability]');
  const capabilityDetail = servicesModal?.querySelector('#capabilityDetail');
  const capabilityDetailNumber = servicesModal?.querySelector('#capabilityDetailNumber');
  const capabilityDetailTitle = servicesModal?.querySelector('#capabilityDetailTitle');
  const capabilityDetailCopy = servicesModal?.querySelector('#capabilityDetailCopy');
  const capabilityDetailPoints = servicesModal?.querySelector('#capabilityDetailPoints');
  const capabilityContact = servicesModal?.querySelector('[data-capability-contact]');
  const projectModal = document.querySelector('#projectModal');
  const projectModalTitle = document.querySelector('#projectModalTitle');
  const projectModalDescription = document.querySelector('#projectModalDescription');
  const projectModalKicker = document.querySelector('#projectModalKicker');
  const projectModalTabs = document.querySelector('#projectModalTabs');
  const projectModalPanel = document.querySelector('#projectModalPanel');
  const projectModalImage = document.querySelector('#projectModalImage');
  const projectModalLinks = document.querySelector('#projectModalLinks');
  const projectSection = document.querySelector('#projects');
  const contactForm = document.querySelector('#contactForm');
  const formStatus = document.querySelector('#formStatus');
  const submitButton = contactForm?.querySelector('button[type="submit"]');
  const cooldownStorageKey = 'contactFormCooldownEnd';
  const cooldownDuration = 30 * 60 * 1000;

  if (whatCanDoButton && servicesModal) {
    let closeTimeout;
    let previouslyFocused;

    const capabilities = {
      website: {
        number: 'Capability / 01',
        title: 'Website Development',
        copy: 'Build clear, responsive frontend experiences using the tools already in my practice, with structure and presentation tailored to your content.',
        points: ['HTML & CSS / Sass', 'Bootstrap', 'JavaScript', 'Angular where applicable'],
      },
      responsive: {
        number: 'Capability / 02',
        title: 'Responsive Design',
        copy: 'Adapt page structure and styling so your content remains readable and your interface stays comfortable across desktop, tablet, and mobile.',
        points: ['Desktop layouts', 'Tablet adjustments', 'Mobile-first refinements'],
      },
      interactive: {
        number: 'Capability / 03',
        title: 'Interactive UI',
        copy: 'Bring the frontend to life with purposeful interactions and clear feedback that make common journeys easier to understand and use.',
        points: ['Navigation and buttons', 'Forms and feedback', 'Lightweight animations'],
      },
      improvements: {
        number: 'Capability / 04',
        title: 'Website Improvements',
        copy: 'Refine an existing frontend through considered visual updates, layout fixes, styling improvements, and usability-focused details.',
        points: ['Visual refinements', 'Layout and styling fixes', 'Usability improvements'],
      },
      maintenance: {
        number: 'Capability / 05',
        title: 'Frontend Maintenance',
        copy: 'Keep existing interfaces working as intended by addressing frontend bugs and maintaining consistent layouts and responsive behavior.',
        points: ['Frontend bug fixes', 'Interface updates', 'Layout consistency'],
      },
    };

    const selectCapability = (selectedTab) => {
      const capability = capabilities[selectedTab.dataset.capability];
      if (!capability || !capabilityDetail || !capabilityDetailNumber ||
        !capabilityDetailTitle || !capabilityDetailCopy || !capabilityDetailPoints) {
        console.error('Capability details could not be displayed because the selected item is invalid.');
        return;
      }

      capabilityTabs?.forEach((tab) => {
        const isSelected = tab === selectedTab;
        tab.classList.toggle('is-active', isSelected);
        tab.setAttribute('aria-selected', String(isSelected));
        tab.tabIndex = isSelected ? 0 : -1;
      });

      capabilityDetail.setAttribute('aria-labelledby', selectedTab.id);
      capabilityDetailNumber.textContent = capability.number;
      capabilityDetailTitle.textContent = capability.title;
      capabilityDetailCopy.textContent = capability.copy;
      capabilityDetailPoints.replaceChildren();
      capability.points.forEach((point) => {
        const item = document.createElement('li');
        item.textContent = point;
        capabilityDetailPoints.append(item);
      });
      capabilityDetail.classList.remove('is-updating');
      requestAnimationFrame(() => {
        capabilityDetail.classList.add('is-updating');
      });
    };

    const closeServicesModal = (restoreFocus = true) => {
      servicesModal.classList.remove('is-open');
      servicesModal.setAttribute('aria-hidden', 'true');
      whatCanDoButton.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      clearTimeout(closeTimeout);
      closeTimeout = setTimeout(() => {
        servicesModal.hidden = true;
      }, 300);
      if (restoreFocus) {
        previouslyFocused?.focus();
      }
    };

    whatCanDoButton.addEventListener('click', () => {
      clearTimeout(closeTimeout);
      previouslyFocused = document.activeElement;
      const activeTab = servicesModal.querySelector('[role="tab"][aria-selected="true"]');
      if (activeTab) {
        selectCapability(activeTab);
      }
      servicesModal.hidden = false;
      servicesModal.setAttribute('aria-hidden', 'false');
      whatCanDoButton.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
      servicesModal.classList.add('is-open');
      servicesModal.querySelector('[role="tab"][aria-selected="true"]')?.focus();
    });

    modalCloseButtons?.forEach((button) => {
      button.addEventListener('click', closeServicesModal);
    });

    capabilityTabs?.forEach((tab, index) => {
      tab.addEventListener('click', () => selectCapability(tab));
      tab.addEventListener('keydown', (event) => {
        let nextIndex = index;
        if (event.key === 'ArrowRight') nextIndex = (index + 1) % capabilityTabs.length;
        if (event.key === 'ArrowLeft') nextIndex = (index - 1 + capabilityTabs.length) % capabilityTabs.length;
        if (event.key === 'Home') nextIndex = 0;
        if (event.key === 'End') nextIndex = capabilityTabs.length - 1;
        if (nextIndex !== index) {
          event.preventDefault();
          selectCapability(capabilityTabs[nextIndex]);
          capabilityTabs[nextIndex].focus();
        }
      });
    });

    capabilityContact?.addEventListener('click', () => closeServicesModal(false));

    servicesModal.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && !servicesModal.hidden) {
        closeServicesModal();
      }

      if (event.key === 'Tab') {
        const focusable = [...servicesModal.querySelectorAll(
          'button:not([disabled]):not([tabindex="-1"]), a[href], [tabindex]:not([tabindex="-1"])'
        )].filter((element) => element.offsetParent !== null);
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    });
  }

  if (
    projectModal &&
    projectModalTitle &&
    projectModalDescription &&
    projectModalKicker &&
    projectModalTabs &&
    projectModalPanel &&
    projectModalImage &&
    projectModalLinks &&
    projectSection
  ) {
    const closeButtons = projectModal.querySelectorAll('[data-project-modal-close]');
    let activeProject = null;
    let activeMode = 'case-study';
    let previouslyFocused = null;
    let closeTimeout;

    const projectDetails = {
      business: {
        features: ['Conversion-focused sections'],
      },
      portfolio: {
        features: ['Personal brand experience'],
      },
      commerce: {
        features: ['Responsive storefront concept', 'Product-focused layouts'],
      },
    };

    const contentForTab = (tab) => {
      const { title, description, id, category } = activeProject;
      const featureList = projectDetails[id]?.features || [];
      const unavailable = 'This detail was not included in the existing project description, so it is not guessed here.';

      if (activeMode === 'explore') {
        switch (tab) {
          case 'Overview':
            return { heading: 'Project overview', paragraphs: [description] };
          case 'Highlights':
            return {
              heading: 'Documented highlights',
              paragraphs: ['Only details present in the existing portfolio copy are listed.'],
              list: featureList,
            };
          case 'Visual':
            return {
              heading: 'Available visual',
              paragraphs: ['One existing portfolio image is available. Verified project screenshots and additional gallery images were not supplied.'],
            };
          default:
            return {
              heading: 'Project details',
              paragraphs: [`Category: ${category}.`, 'Project-specific technology, live demo, and repository details were not provided.'],
            };
        }
      }

      switch (tab) {
        case 'Overview':
          return { heading: 'Project overview', paragraphs: [description] };
        case 'Problem':
          return { heading: 'Problem', paragraphs: [unavailable] };
        case 'Solution':
          return { heading: 'Solution', paragraphs: [unavailable] };
        case 'Features':
          return {
            heading: 'Documented features',
            paragraphs: ['Based on the existing project description:'],
            list: featureList,
          };
        case 'Technologies':
          return { heading: 'Technologies', paragraphs: ['The project-specific technology stack was not provided.'] };
        case 'Design':
          return { heading: 'Design decisions', paragraphs: [unavailable] };
        case 'Development':
          return { heading: 'Development details', paragraphs: [unavailable] };
        default:
          return { heading: title, paragraphs: [description] };
      }
    };

    const renderPanel = (tab) => {
      const content = contentForTab(tab);
      projectModalPanel.replaceChildren();

      const eyebrow = document.createElement('p');
      eyebrow.className = 'project-modal-panel__eyebrow';
      eyebrow.textContent = activeMode === 'explore' ? 'Explore' : 'Case study';

      const heading = document.createElement('h3');
      heading.textContent = content.heading;
      projectModalPanel.append(eyebrow, heading);

      content.paragraphs.forEach((text) => {
        const paragraph = document.createElement('p');
        paragraph.textContent = text;
        projectModalPanel.append(paragraph);
      });

      if (content.list?.length) {
        const list = document.createElement('ul');
        content.list.forEach((text) => {
          const item = document.createElement('li');
          item.textContent = text;
          list.append(item);
        });
        projectModalPanel.append(list);
      }
    };

    const selectTab = (tabButtons, selectedIndex) => {
      const selectedButton = tabButtons[selectedIndex];
      tabButtons.forEach((button, index) => {
        const selected = index === selectedIndex;
        button.classList.toggle('is-active', selected);
        button.setAttribute('aria-selected', String(selected));
        button.tabIndex = selected ? 0 : -1;
      });
      renderPanel(selectedButton.textContent);
    };

    const openProjectModal = (projectCard, mode) => {
      const title = projectCard.querySelector('h3')?.textContent?.trim();
      const description = projectCard.querySelector('.project-content > p:not(.project-feedback)')?.textContent?.trim();
      const image = projectCard.querySelector('.project-visual img');
      const category = projectCard.querySelector('.project-category')?.textContent?.trim();
      const id = projectCard.dataset.project;

      if (!title || !description || !image || !id) {
        console.error('Project showcase could not open because project content is incomplete.');
        return;
      }

      activeProject = { title, description, image, id, category: category || 'Project' };
      activeMode = mode;
      previouslyFocused = document.activeElement;
      clearTimeout(closeTimeout);
      projectModalTitle.textContent = title;
      projectModalDescription.textContent = description;
      projectModalKicker.textContent = mode === 'explore' ? 'Interactive showcase' : 'Case study';
      projectModalImage.src = image.currentSrc || image.src;
      projectModalImage.alt = image.alt;
      projectModalLinks.textContent = 'No project-specific live demo or GitHub URL was provided.';

      const tabs = mode === 'explore'
        ? ['Overview', 'Highlights', 'Visual', 'Project details']
        : ['Overview', 'Problem', 'Solution', 'Features', 'Technologies', 'Design', 'Development'];
      projectModalTabs.replaceChildren();
      const tabButtons = tabs.map((tab, index) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'project-modal-tab';
        button.id = `projectTab${index}`;
        button.setAttribute('role', 'tab');
        button.setAttribute('aria-controls', 'projectModalPanel');
        button.setAttribute('aria-selected', String(index === 0));
        button.tabIndex = index === 0 ? 0 : -1;
        button.textContent = tab;
        button.addEventListener('click', () => selectTab(tabButtons, index));
        button.addEventListener('keydown', (event) => {
          let nextIndex = index;
          if (event.key === 'ArrowRight') nextIndex = (index + 1) % tabButtons.length;
          if (event.key === 'ArrowLeft') nextIndex = (index - 1 + tabButtons.length) % tabButtons.length;
          if (event.key === 'Home') nextIndex = 0;
          if (event.key === 'End') nextIndex = tabButtons.length - 1;
          if (nextIndex !== index) {
            event.preventDefault();
            selectTab(tabButtons, nextIndex);
            tabButtons[nextIndex].focus();
          }
        });
        projectModalTabs.append(button);
        return button;
      });

      renderPanel(tabs[0]);
      projectModal.hidden = false;
      projectModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      requestAnimationFrame(() => {
        projectModal.classList.add('is-open');
        projectModal.querySelector('.project-modal-close')?.focus();
      });
    };

    const closeProjectModal = () => {
      projectModal.classList.remove('is-open');
      projectModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      clearTimeout(closeTimeout);
      closeTimeout = setTimeout(() => {
        projectModal.hidden = true;
      }, 300);
      previouslyFocused?.focus();
    };

    projectSection.addEventListener('click', (event) => {
      const actionButton = event.target.closest('[data-project-action]');
      if (!actionButton) return;

      const projectCard = actionButton.closest('[data-project]');
      const action = actionButton.dataset.projectAction;
      if (!projectCard) return;

      if (action === 'demo') {
        const feedback = projectCard.querySelector('.project-feedback');
        const demoUrl = projectCard.dataset.demoUrl;
        if (demoUrl) {
          window.open(demoUrl, '_blank', 'noopener,noreferrer');
          if (feedback) feedback.textContent = '';
        } else if (feedback) {
          feedback.textContent = 'Live demo unavailable: no deployed project URL was provided.';
        }
        return;
      }

      openProjectModal(projectCard, action === 'explore' ? 'explore' : 'case-study');
    });

    closeButtons.forEach((button) => button.addEventListener('click', closeProjectModal));

    projectModal.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        closeProjectModal();
      }

      if (event.key === 'Tab') {
        const focusable = [...projectModal.querySelectorAll(
          'button:not([disabled]):not([tabindex="-1"]), a[href], [tabindex]:not([tabindex="-1"])'
        )].filter((element) => element.offsetParent !== null);
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    });
  }

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
      const isOpen = navMenu.classList.toggle('show');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });
  }

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.forEach((item) => item.classList.remove('active'));
      link.classList.add('active');

      if (navMenu) {
        navMenu.classList.remove('show');
        navToggle?.setAttribute('aria-expanded', 'false');
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
