// Register GSAP plugins
      gsap.registerPlugin(ScrollTrigger, TextPlugin);
      
      /* ── CURSOR ── */
      const cur = document.getElementById("cur"),
        cr = document.getElementById("cr");
      let mx = 0,
        my = 0,
        rx = 0,
        ry = 0;
      document.addEventListener("mousemove", (e) => {
        mx = e.clientX;
        my = e.clientY;
        gsap.to(cur, {
          x: mx - 5,
          y: my - 5,
          duration: 0.1,
          ease: "power2.out"
        });
      });
      (function loop() {
        rx += (mx - rx) * 0.1;
        ry += (my - ry) * 0.1;
        gsap.to(cr, {
          x: rx - 19,
          y: ry - 19,
          duration: 0.3,
          ease: "power2.out"
        });
        requestAnimationFrame(loop);
      })();
      document.querySelectorAll("a,button,.pc,.wc,.pbtn").forEach((el) => {
        el.addEventListener("mouseenter", () => {
          document.body.classList.add("ch");
          gsap.to(cur, { backgroundColor: "var(--cyan)", duration: 0.15 });
        });
        el.addEventListener("mouseleave", () => {
          document.body.classList.remove("ch");
          gsap.to(cur, { backgroundColor: "var(--bll)", duration: 0.15 });
        });
      });

      /* ── CANVAS PARTICLES ── */
      (function () {
        const canvas = document.getElementById("cv"),
          ctx = canvas.getContext("2d");
        let W,
          H,
          pts = [];
        function resize() {
          W = canvas.width = canvas.offsetWidth;
          H = canvas.height = canvas.offsetHeight;
        }
        resize();
        window.addEventListener("resize", () => {
          resize();
          init();
        });
        function Pt() {
          this.x = Math.random() * W;
          this.y = Math.random() * H;
          this.vx = (Math.random() - 0.5) * 0.36;
          this.vy = (Math.random() - 0.5) * 0.36;
          this.r = Math.random() * 1.5 + 0.4;
          this.a = Math.random() * 0.35 + 0.08;
        }
        function init() {
          pts = [];
          const n = Math.floor((W * H) / 11000);
          for (let i = 0; i < n; i++) pts.push(new Pt());
        }
        init();
        let mX = W / 2,
          mY = H / 2;
        document.addEventListener("mousemove", (e) => {
          const r = canvas.getBoundingClientRect();
          mX = e.clientX - r.left;
          mY = e.clientY - r.top;
        });
        function draw() {
          ctx.clearRect(0, 0, W, H);
          pts.forEach((p, i) => {
            p.x += p.vx;
            p.y += p.vy;
            if (p.x < 0) p.x = W;
            if (p.x > W) p.x = 0;
            if (p.y < 0) p.y = H;
            if (p.y > H) p.y = 0;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(77,148,255,${p.a})`;
            ctx.fill();
            for (let j = i + 1; j < pts.length; j++) {
              const q = pts[j],
                dx = p.x - q.x,
                dy = p.y - q.y,
                d = Math.sqrt(dx * dx + dy * dy);
              if (d < 110) {
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(q.x, q.y);
                ctx.strokeStyle = `rgba(77,148,255,${0.08 * (1 - d / 110)})`;
                ctx.lineWidth = 0.5;
                ctx.stroke();
              }
            }
            const md = Math.sqrt((p.x - mX) ** 2 + (p.y - mY) ** 2);
            if (md < 150) {
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(mX, mY);
              ctx.strokeStyle = `rgba(0,200,240,${0.15 * (1 - md / 150)})`;
              ctx.lineWidth = 0.9;
              ctx.stroke();
            }
          });
          requestAnimationFrame(draw);
        }
        draw();
      })();

      /* ── DRY: COMMON ANIMATION CONFIGURATIONS ── */
      const animationConfigs = {
        // Scroll reveal animations
        scrollReveal: {
          from: { y: 60, opacity: 0 },
          to: {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out"
          }
        },
        // Experience items animation
        experienceItem: {
          from: { x: -60, opacity: 0 },
          to: {
            x: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power3.out"
          }
        },
        // Hero entrance animations
        heroEntrance: [
          { selector: ".hbadge", delay: 0 },
          { selector: ".hh .hl", delay: -0.4 },
          { selector: ".hdesc", delay: -0.3 },
          { selector: ".hacts", delay: -0.2 },
          { selector: ".shint", delay: -0.1 }
        ]
      };
      
      /* ── DRY: ANIMATION HELPERS ── */
      function createScrollAnimation(element, config = {}) {
        const animationConfig = { ...animationConfigs.scrollReveal.to, ...config };
        return gsap.fromTo(element, animationConfigs.scrollReveal.from, animationConfig);
      }
      
      function createExperienceAnimation(element, delay = 0) {
        const config = { ...animationConfigs.experienceItem.to, delay };
        return gsap.fromTo(element, animationConfigs.experienceItem.from, config);
      }
      
      /* ── DRY: HERO ENTRANCE ANIMATIONS ── */
      function animateHeroEntrance() {
        const timeline = gsap.timeline();
        
        animationConfigs.heroEntrance.forEach(({ selector, delay }) => {
          timeline.from(selector, {
            y: selector === ".hh .hl" ? 50 : 30,
            opacity: 0,
            duration: selector === ".shint" ? 0.6 : 0.8,
            ease: "power3.out"
          }, delay);
        });
        
        // Widget entrance animations with stagger
        gsap.from(".fw", {
          y: 40,
          opacity: 0,
          scale: 0.95,
          duration: 0.8,
          ease: "back.out(1.7)",
          stagger: 0.1
        });
        
        return timeline;
      }
      
      // Initialize hero animations
      animateHeroEntrance();
      /* ── CYCLE WORDS WITH GSAP ── */
      const words = document.querySelectorAll(".cw");
      let currentIndex = 0;
      
      function cycleWords() {
        const currentWord = words[currentIndex];
        const nextIndex = (currentIndex + 1) % words.length;
        const nextWord = words[nextIndex];
        
        gsap.timeline()
          .to(currentWord, {
            y: -40,
            opacity: 0,
            duration: 0.4,
            ease: "power2.in"
          })
          .set(currentWord, { className: "cw off" })
          .set(nextWord, { className: "cw on" })
          .fromTo(nextWord,
            { y: 40, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" }
          );
          
        currentIndex = nextIndex;
      }
      
      setInterval(cycleWords, 2700);

      /* ── PROJECT CARD FILTER & 3D TILT ── */
      (function () {
        // Filter tabs
        document.querySelectorAll('.pf-tab').forEach(function(tab) {
          tab.addEventListener('click', function() {
            document.querySelectorAll('.pf-tab').forEach(function(t) { t.classList.remove('active'); });
            tab.classList.add('active');
            var filter = tab.dataset.filter;
            document.querySelectorAll('.pcard').forEach(function(card) {
              var match = filter === 'all' || card.dataset.category === filter;
              card.classList.toggle('hidden', !match);
            });
            document.querySelectorAll('.ptier').forEach(function(tier) {
              var grid = tier.nextElementSibling;
              if (!grid) return;
              var visible = grid.querySelectorAll('.pcard:not(.hidden)').length;
              tier.style.display = visible ? '' : 'none';
              grid.style.display = visible ? '' : 'none';
            });
          });
        });

      /* ── PROJECT CARD 3D TILT WITH GSAP ── */
      document.querySelectorAll('.pcard').forEach(function(card) {
        card.addEventListener('mousemove', function(e) {
          const rect = card.getBoundingClientRect();
          const x = (e.clientX - rect.left) / rect.width - 0.5;
          const y = (e.clientY - rect.top) / rect.height - 0.5;
          
          gsap.to(card, {
            rotationY: x * 8,
            rotationX: -y * 6,
            scale: 1.02,
            duration: 0.3,
            ease: "power2.out",
            transformPerspective: 800
          });
          
          // Dynamic shadow
          const shadowX = -x * 20;
          const shadowY = y * 20;
          gsap.to(card, {
            boxShadow: `${shadowX}px ${shadowY}px 36px rgba(0,0,0,0.5), 0 0 0 1px rgba(77,148,255,0.18)`,
            duration: 0.3,
            ease: "power2.out"
          });
        });
        
        card.addEventListener('mouseleave', function() {
          gsap.to(card, {
            rotationY: 0,
            rotationX: 0,
            scale: 1,
            boxShadow: '',
            duration: 0.4,
            ease: "power2.out"
          });
        });
      });
      })();

      /* ── WIDGET PARALLAX WITH GSAP ── */
      const hero = document.querySelector(".hero");
      const widgets = document.querySelectorAll(".fw");
      const depths = [0.9, 1.1, 0.7, 1.3, 0.85, 1.0];
      
      hero.addEventListener("mousemove", (e) => {
        const rect = hero.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const moveX = (e.clientX - rect.left - centerX) / centerX;
        const moveY = (e.clientY - rect.top - centerY) / centerY;
        
        widgets.forEach((widget, index) => {
          const depth = depths[index] || 1;
          const x = moveX * depth * 8;
          const y = moveY * depth * 6;
          
          gsap.to(widget, {
            x: x,
            y: y,
            duration: 0.6,
            ease: "power2.out"
          });
        });
      });
      
      hero.addEventListener("mouseleave", () => {
        gsap.to(widgets, {
          x: 0,
          y: 0,
          duration: 0.8,
          ease: "power2.out"
        });
      });

      /* ── TOOL CYCLE ── */
      (function () {
        const t = document.querySelectorAll(".wttag");
        const sets = [
          [0, 1, 4],
          [2, 3, 5],
          [0, 4],
          [1, 2, 3],
        ];
        let i = 0;
        setInterval(() => {
          t.forEach((x) => x.classList.remove("on"));
          sets[i % sets.length].forEach((n) => {
            if (t[n]) t[n].classList.add("on");
          });
          i++;
        }, 2000);
      })();

      /* ── COUNTERS ── */
      function countUp(el, target, dur) {
        let s = 0;
        const isF = !Number.isInteger(target);
        const step = target / (dur / 16);
        const t = setInterval(() => {
          s += step;
          if (s >= target) {
            s = target;
            clearInterval(t);
          }
          el.textContent = isF ? s.toFixed(1) : Math.floor(s);
        }, 16);
      }
      new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              countUp(document.getElementById("c1"), 25, 1100);
              countUp(document.getElementById("c2"), 30, 1400);
              countUp(document.getElementById("c3"), 15.5, 1700);
            }
          });
        },
        { threshold: 0.3 },
      ).observe(document.querySelector(".fw-stat"));

      /* ── DRY: SCROLL REVEAL ANIMATIONS ── */
      function initializeScrollAnimations() {
        // General scroll reveal animations
        gsap.utils.toArray(".rv").forEach(element => {
          createScrollAnimation(element, {
            scrollTrigger: {
              trigger: element,
              start: "top 85%",
              end: "bottom 15%",
              toggleActions: "play none none reverse"
            }
          });
        });
        
        // Experience items with stagger
        gsap.utils.toArray(".eitem").forEach((item, index) => {
          createExperienceAnimation(item, index * 0.1).scrollTrigger = {
            trigger: item,
            start: "top 80%",
            toggleActions: "play none none reverse"
          };
        });
      }
      
      // Initialize scroll animations
      initializeScrollAnimations();

      /* ── NAVIGATION SCROLL WITH GSAP ── */
      const nav = document.getElementById("nav");
      
      ScrollTrigger.create({
        start: "top -80",
        end: 99999,
        toggleClass: {className: "scrolled", targets: nav},
        onUpdate: self => {
          const progress = self.progress;
          gsap.to(nav, {
            backgroundColor: `rgba(6, 9, 15, ${0.97 + progress * 0.01})`,
            duration: 0.3,
            ease: "power2.out"
          });
        }
      });
      
      // Smooth scroll for navigation links
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
          e.preventDefault();
          const target = document.querySelector(this.getAttribute('href'));
          if (target) {
            gsap.to(window, {
              duration: 1.5,
              scrollTo: {
                y: target,
                offsetY: 80,
                autoKill: false
              },
              ease: "power2.inOut"
            });
          }
        });
      });

      /* ── ENHANCED FIGMA MODAL WITH GSAP ── */
      let currentFigmaUrl = "";
      
      // DRY: Common animation settings
      const modalAnimationConfig = {
        scale: 0.9,
        opacity: 0,
        y: 30,
        duration: 0.4,
        ease: "back.out(1.7)"
      };
      
      function openFigma(embedUrl, title, subtitle) {
        currentFigmaUrl = embedUrl;
        const modal = document.getElementById("figma-modal");
        const modalInner = modal.querySelector(".fm-inner");
        const titleEl = document.getElementById("fm-title");
        const subtitleEl = document.getElementById("fm-subtitle");
        const loading = document.getElementById("fm-loading");
        const iframe = document.getElementById("fm-iframe");
        
        // DRY: Set content using helper function
        setModalContent(titleEl, subtitleEl, title, subtitle);
        
        // Reset and show loading
        loading.style.display = "flex";
        iframe.src = "";
        
        // Add open class and animate modal in
        modal.classList.add("open");
        animateModalIn(modal, modalInner);
        
        // Load iframe after animation starts
        setTimeout(() => {
          iframe.src = embedUrl;
        }, 200);
        
        document.body.style.overflow = "hidden";
        
        // Announce to screen readers
        titleEl.setAttribute("role", "alert");
        setTimeout(() => titleEl.removeAttribute("role"), 1000);
      }
      
      // DRY: Helper functions
      function setModalContent(titleEl, subtitleEl, title, subtitle) {
        titleEl.textContent = title || "Figma Preview";
        subtitleEl.textContent = subtitle || "Interactive Design";
      }
      
      function animateModalIn(modal, modalInner) {
        gsap.set(modal, { display: "flex" });
        gsap.fromTo(modalInner, modalAnimationConfig, {
          scale: 1,
          opacity: 1,
          y: 0
        });
      }
      
      function closeFigmaModal() {
        const modal = document.getElementById("figma-modal");
        const modalInner = modal.querySelector(".fm-inner");
        const iframe = document.getElementById("fm-iframe");
        
        // DRY: Use reverse animation config
        gsap.to(modalInner, {
          ...modalAnimationConfig,
          duration: 0.3,
          ease: "power2.in",
          onComplete: () => {
            resetModalState(modal, iframe);
          }
        });
      }
      
      // DRY: Helper function to reset modal state
      function resetModalState(modal, iframe) {
        modal.classList.remove("open");
        iframe.src = "";
        document.body.style.overflow = "";
        gsap.set(modal, { display: "none" });
      }
      
      // Close modal on escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && document.getElementById("figma-modal").classList.contains("open")) {
          closeFigmaModal();
        }
      });
      
      // Close modal on background click
      document.getElementById("figma-modal").addEventListener('click', (e) => {
        if (e.target.id === "figma-modal") {
          closeFigmaModal();
        }
      });
      
      function openFigmaTab() {
        const url = currentFigmaUrl
          .replace("https://www.figma.com/embed?embed_host=share&url=", "")
          .replace(/^https?:\/\//, "https://");
        window.open(decodeURIComponent(url), "_blank");
      }
      /* ── KEYBOARD NAVIGATION ENHANCEMENTS ── */
      document.addEventListener('keydown', (e) => {
        // Tab trap for modal
        if (e.key === 'Tab' && document.getElementById("figma-modal").classList.contains("open")) {
          const focusableElements = document.getElementById("figma-modal").querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          const firstElement = focusableElements[0];
          const lastElement = focusableElements[focusableElements.length - 1];
          
          if (e.shiftKey) {
            if (document.activeElement === firstElement) {
              lastElement.focus();
              e.preventDefault();
            }
          } else {
            if (document.activeElement === lastElement) {
              firstElement.focus();
              e.preventDefault();
            }
          }
        }
        
        // Arrow key navigation for project cards
        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
          const currentCard = document.activeElement.closest('.pcard');
          if (currentCard) {
            const cards = Array.from(document.querySelectorAll('.pcard:not(.hidden)'));
            const currentIndex = cards.indexOf(currentCard);
            let nextIndex;
            
            if (e.key === 'ArrowRight') {
              nextIndex = (currentIndex + 1) % cards.length;
            } else {
              nextIndex = (currentIndex - 1 + cards.length) % cards.length;
            }
            
            cards[nextIndex].querySelector('.pcard-title').focus();
            e.preventDefault();
          }
        }
      });
      
      /* ── RESPONSIVE ENHANCEMENTS ── */
      // Touch device detection
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      
      if (isTouchDevice) {
        // Disable custom cursor on touch devices
        document.getElementById('cur').style.display = 'none';
        document.getElementById('cr').style.display = 'none';
        document.body.style.cursor = 'auto';
        
        // Enhanced touch interactions for project cards
        document.querySelectorAll('.pcard').forEach(card => {
          card.addEventListener('touchstart', function() {
            gsap.to(this, {
              scale: 0.98,
              duration: 0.1,
              ease: "power2.out"
            });
          });
          
          card.addEventListener('touchend', function() {
            gsap.to(this, {
              scale: 1,
              duration: 0.2,
              ease: "power2.out"
            });
          });
        });
      }
      
      /* ── PERFORMANCE OPTIMIZATIONS ── */
      // Reduce motion for users who prefer it
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
      
      if (prefersReducedMotion.matches) {
        gsap.globalTimeline.timeScale(0.5);
        document.querySelectorAll('.glw, #cv').forEach(el => {
          el.style.display = 'none';
        });
      }
      
      /* ── ERROR HANDLING FOR EXTERNAL RESOURCES ── */
      document.querySelectorAll('img').forEach(img => {
        img.addEventListener('error', function() {
          this.style.opacity = '0.3';
          this.setAttribute('alt', 'Image failed to load');
        });
      });
      
      /* ── ANNOUNCEMENTS FOR SCREEN READERS ── */
      function announceToScreenReader(message) {
        const announcement = document.createElement('div');
        announcement.setAttribute('role', 'status');
        announcement.setAttribute('aria-live', 'polite');
        announcement.className = 'sr-only';
        announcement.textContent = message;
        document.body.appendChild(announcement);
        setTimeout(() => document.body.removeChild(announcement), 1000);
      }
