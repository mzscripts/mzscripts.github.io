document.addEventListener("DOMContentLoaded", function () {
  // Smooth scrolling for navigation links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href");
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 50,
          behavior: "smooth",
        });
      }
    });
  });

  // Add active class to nav links based on scroll position
  const sections = document.querySelectorAll("section");
  const navLinks = document.querySelectorAll(".nav-links a");

  window.addEventListener("scroll", () => {
    let current = "";

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;

      if (pageYOffset >= sectionTop - 100) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href").substring(1) === current) {
        link.classList.add("active");
      }
    });
  });

  // Terminal typing effect for section headings
  const terminalHeadings = document.querySelectorAll(".terminal-heading");

  function typeWriter(element, text, i, cb) {
    if (i < text.length) {
      element.innerHTML += text.charAt(i);
      i++;
      setTimeout(() => typeWriter(element, text, i, cb), 50);
    } else if (typeof cb === "function") {
      cb();
    }
  }

  // Optional: Typing animation when sections come into view
  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.1,
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll("section").forEach((section) => {
    observer.observe(section);
  });

  // Optional: Cursor blink effect for terminal prompts
  const terminalPrompts = document.querySelectorAll(".terminal-prompt");

  setInterval(() => {
    terminalPrompts.forEach((prompt) => {
      prompt.classList.toggle("blink");
    });
  }, 800);

  // ✅ Scramble effect for .name and .tagline
  const elements = [
    {
      el: document.querySelector(".dname"),
      text: "[m]Zaid",
    },
  ];

  const scrambleChars = "!@#$%^&*()_+=-{}[]<>?/\\|~";
  const revealDelay = 25;

  elements.forEach(async ({ el, text }, index) => {
    if (!el) return;
    let iterations = 0;
    const maxIterations = text.length * 5;

    function scramble() {
      let output = "";

      for (let i = 0; i < text.length; i++) {
        if (iterations / 5 > i) {
          output += text[i];
        } else {
          output +=
            scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
        }
      }

      el.textContent = output;

      if (iterations++ < maxIterations) {
        setTimeout(scramble, revealDelay);
      }
    }

    setTimeout(scramble, index * 500); // stagger

    const container = document.getElementById("blog-container");

    try {
      const response = await fetch("https://blognews-ju56.onrender.com/scrape");
      const blogs = await response.json();

      blogs.forEach((blog) => {
        const blogHTML = `
                <div class="blog-item">
                <div class="blog-content">
                    <img src="${
                      blog.image
                    }" alt="Blog thumbnail" style="width:100%; border-radius: 8px; margin-bottom: 1rem;">
                    <h3>${blog.title}</h3>
                    <span class="blog-date">${new Date().toLocaleDateString()}</span>
                </div>
                <a href="${
                  blog.link
                }" target="_blank" class="blog-read">READ <span class="arrow">↗</span></a>
                </div>
            `;
        container.insertAdjacentHTML("beforeend", blogHTML);
      });
    } catch (error) {
      console.error("Failed to load blogs:", error);
      container.innerHTML =
        '<p style="color:red;">Failed to load blogs. Please try again later.</p>';
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const terminal = document.getElementById("terminal");
  const startTime = new Date();

  const VISITOR_KEY = "unique_visitor_id";
  let visitorCount = localStorage.getItem("visitorCount") || 33;
  if (!localStorage.getItem(VISITOR_KEY)) {
    localStorage.setItem(VISITOR_KEY, Date.now());
    visitorCount = parseInt(visitorCount) + 1;
    localStorage.setItem("visitorCount", visitorCount);
  }

  let ipAddress = "unknown";
  let locationInfo = "unknown";
  let orgInfo = "unknown";
  let postalCode = "unknown";
  let regionCode = "unknown";
  let timeZone = "unknown";
  

  function getFormattedUptime() {
    const now = new Date();
    const diff = Math.floor((now - startTime) / 1000);
    const minutes = Math.floor(diff / 60);
    const seconds = diff % 60;
    return `${minutes}m ${seconds}s`;
  }

  function getCurrentDate() {
    return new Date().toDateString();
  }

  function getDeviceType() {
    return /Mobi|Android/i.test(navigator.userAgent) ? "mobile" : "desktop";
  }

  function getOS() {
    const platform = navigator.platform.toLowerCase();
    if (platform.includes("win")) return "Windows";
    if (platform.includes("mac")) return "macOS";
    if (platform.includes("linux")) return "Linux";
    return "Unknown";
  }

  function getBrowser() {
    const ua = navigator.userAgent;
    if (ua.includes("Firefox")) return "Firefox";
    if (ua.includes("Edg")) return "Edge";
    if (ua.includes("Chrome") && !ua.includes("Chromium")) return "Chrome";
    if (ua.includes("Safari") && !ua.includes("Chrome")) return "Safari";
    return "Unknown";
  }

  function getScreenSize() {
    return `${window.screen.width}x${window.screen.height}`;
  }

  function renderTerminalLine() {
    const line = `[system@web ~]$ uptime: ${getFormattedUptime()} | ip: ${ipAddress} | loc: ${locationInfo} | org: ${orgInfo} | postal: ${postalCode} | region: ${regionCode} | timezone: ${timeZone} | mem: 128KB | device: ${getDeviceType()} | OS: ${getOS()} | browser: ${getBrowser()} | screen: ${getScreenSize()} | date: ${getCurrentDate()}`;
    terminal.textContent = line;
  }

  function loadScrambleThenRender() {
    const totalFrames = 15;
    let scrambleIndex = 0;
    const interval = setInterval(() => {
      scrambleIndex++;
      scrambleText(90);
      if (scrambleIndex >= totalFrames) {
        clearInterval(interval);
        renderTerminalLine();
        setInterval(renderTerminalLine, 1000); // live uptime
      }
    }, 50);
  }

  function fetchGeoInfo() {
    fetch("https://ipapi.co/json/")
      .then(res => res.json())
      .then(data => {
        ipAddress = data.ip || "unknown";
        locationInfo = `${data.city || ""}, ${data.region || ""}, ${data.country || ""}`.trim();
        orgInfo = data.org || "unknown";
        postalCode = data.postal || "unknown";
        regionCode = data.region_code || "unknown";
        timeZone = data.timezone || "unknown";
  
        sendToBackend({
          timestamp: new Date().toISOString(),
          ip: ipAddress,
          location: locationInfo,
          org: orgInfo,
          postal: postalCode,
          region: regionCode,
          timezone: timeZone,
          device: getDeviceType(),
          os: getOS(),
          browser: getBrowser(),
          screen: getScreenSize(),
          date: getCurrentDate(),
          uptime: getFormattedUptime(),
        });
  
        renderTerminalLine();
      })
      .catch(() => {
        locationInfo = "unavailable";
        renderTerminalLine();
      });
  }
  

  function sendToBackend(data) {
    fetch("https://visitordata.onrender.com/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (!response.ok) throw new Error("Logging failed");
        console.log("Logged to backend successfully");
      })
      .catch((error) => console.error("Logging failed:", error));
  }

  // Hide terminal on scroll down
  let lastScrollTop = 0;
  window.addEventListener("scroll", () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    terminal.style.opacity = scrollTop > lastScrollTop ? "0" : "0.75";
    lastScrollTop = Math.max(scrollTop, 0);
  });

  // Run initial loaders
  fetchGeoInfo();
  loadScrambleThenRender();
});

// 🖥️ Render terminal line
function renderTerminalLine() {
  const line = `[system@web ~]$ uptime: ${getFormattedUptime()} | ip: ${ipAddress} | loc: ${locationInfo} | mem: 128KB | device: ${getDeviceType()} | OS: ${getOS()} | browser: ${getBrowser()} | screen: ${getScreenSize()} | date: ${getCurrentDate()}`;
  terminal.textContent = line;
}

// 🔠 Terminal-style loading scramble
function scrambleText(length) {
  const scrambleChars = "!@#$%^&*()_+=-{}[]|;:<>,.?/~`";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += scrambleChars.charAt(
      Math.floor(Math.random() * scrambleChars.length)
    );
  }
  terminal.textContent = result;
}

// 💻 Scramble then load actual content
function loadScrambleThenRender() {
  const totalFrames = 15;
  let scrambleIndex = 0;
  const interval = setInterval(() => {
    scrambleIndex++;
    scrambleText(90);
    if (scrambleIndex >= totalFrames) {
      clearInterval(interval);
      renderTerminalLine();
      setInterval(renderTerminalLine, 1000); // update uptime every second
    }
  }, 50);
}
let lastScrollTop = 0;

window.addEventListener("scroll", function () {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

  if (scrollTop > lastScrollTop) {
    // Scrolling down → hide
    terminal.style.opacity = "0";
  } else {
    // Scrolling up → show
    terminal.style.opacity = "0.75";
  }
  lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
});
fetchGeoInfo();
loadScrambleThenRender();
