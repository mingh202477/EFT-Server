// DOM 元素
const navbar = document.getElementById("navbar");
const menuToggle = document.getElementById("menu-toggle");
const mobileMenu = document.getElementById("mobile-menu");
const backToTop = document.getElementById("back-to-top");
const contactForm = document.getElementById("contact-form");
const navLinks = document.querySelectorAll(".nav-link, #mobile-menu a");
const serverStatusLight = document.getElementById("server-status-light");
const serverStatusContainer = document.getElementById(
  "server-status-container",
);

// 性能优化变量
let lastScrollTop = 0;
let ticking = false;
let particlesCreated = false;

// 表单提交处理函数
function handleFormSubmit(e) {
  e.preventDefault();
  // 基本表单验证和提交逻辑
  const formData = new FormData(contactForm);
  const data = Object.fromEntries(formData.entries());

  console.log("表单数据:", data);

  // 这里可以添加AJAX请求发送表单数据
  // 显示成功消息或错误处理
  alert("表单已提交，谢谢！");
  contactForm.reset();
}

// 显示键盘快捷键帮助
function showKeyboardShortcuts() {
  const shortcuts = [
    { key: "ESC", action: "关闭菜单" },
    { key: "Ctrl+/ 或 Cmd+/", action: "显示快捷键帮助" },
    { key: "Home", action: "回到顶部" },
  ];

  // 这里可以添加一个漂亮的模态框显示快捷键
  console.log("键盘快捷键:", shortcuts);
}

// 添加键盘快捷键
function addKeyboardShortcuts() {
  document.addEventListener("keydown", (e) => {
    // ESC键关闭移动菜单
    if (e.key === "Escape" && !mobileMenu.classList.contains("hidden")) {
      toggleMobileMenu();
    }

    // Ctrl + / 或 Cmd + / 显示帮助
    if ((e.ctrlKey || e.metaKey) && e.key === "/") {
      e.preventDefault();
      showKeyboardShortcuts();
    }
  });
}

// 初始化函数
function init() {
  // 检查DOM元素是否存在，避免空引用错误
  if (!navbar || !menuToggle || !mobileMenu || !backToTop) {
    console.warn("部分DOM元素未找到，某些功能可能无法正常工作");
  }

  // 事件监听器 - 使用防抖优化性能
  window.addEventListener("scroll", throttle(handleScroll, 16));

  if (menuToggle) {
    menuToggle.addEventListener("click", toggleMobileMenu);
  }

  if (backToTop) {
    backToTop.addEventListener("click", scrollToTop);
  }

  if (contactForm) {
    contactForm.addEventListener("submit", handleFormSubmit);
  }

  navLinks.forEach((link) => {
    link.addEventListener("click", smoothScroll);
  });

  // 添加鼠标交互效果
  addMagneticEffects();
  addHoverEffects();

  // 添加滚动显示动画
  addScrollReveal();

  // 添加键盘快捷键
  addKeyboardShortcuts();

  // 性能优化
  optimizePerformance();
  optimizeForTouch();

  // 监听窗口大小变化
  window.addEventListener("resize", debounce(checkMobileMenu, 250));

  // 更新服务器状态
  updateServerStatus();

  // 创建粒子效果（只在桌面端）
  if (window.innerWidth > 768) {
    // 延迟执行以确保 DOM 完全准备好
    setTimeout(() => {
      createAdvancedParticles();
    }, 100);
  }

  // 定时检测服务器状态
  setInterval(updateServerStatus, 60000);
}

// 服务器版本选择模态窗口相关函数
function initVersionModal() {
  // 版本选择功能已简化：直接跳转到3.11指南页面
}

// 更新服务器状态 - 通过检测公网地址判断
const SERVER_CHECK_URL = "https://202.189.23.245:26969";
function updateServerStatus() {
  if (!serverStatusLight) return;
  serverStatusLight.className =
    "w-3 h-3 rounded-full bg-yellow-500 animate-pulse";
  if (serverStatusContainer.querySelector(".status-text")) {
    serverStatusContainer.querySelector(".status-text").innerText = "检测中";
  }
  fetch(SERVER_CHECK_URL, {
    method: "HEAD",
    mode: "no-cors",
    signal: AbortSignal.timeout(5000),
  })
    .then(() => {
      serverStatusLight.className =
        "w-3 h-3 rounded-full bg-green-500 animate-pulse";
      if (serverStatusContainer.querySelector(".status-text")) {
        serverStatusContainer.querySelector(".status-text").innerText = "在线";
      }
    })
    .catch(() => {
      serverStatusLight.className = "w-3 h-3 rounded-full bg-red-500";
      if (serverStatusContainer.querySelector(".status-text")) {
        serverStatusContainer.querySelector(".status-text").innerText = "离线";
      }
    });
}

// 性能优化函数
function throttle(func, limit) {
  let inThrottle;
  return function () {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

function debounce(func, wait) {
  let timeout;
  return function () {
    const context = this;
    const args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
}

// 处理滚动事件
function handleScroll() {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

  // 导航栏滚动效果
  if (navbar) {
    if (scrollTop > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  }

  lastScrollTop = scrollTop;

  // 返回顶部按钮显示/隐藏
  if (backToTop) {
    if (scrollTop > 300) {
      backToTop.classList.add("visible");
      backToTop.style.opacity = "1";
      backToTop.style.visibility = "visible";
    } else {
      backToTop.classList.remove("visible");
      backToTop.style.opacity = "0.3"; // 降低透明度但保持可见
      backToTop.style.visibility = "visible";
    }
  }

  // 视差效果
  updateParallax(scrollTop);

  // 检查元素是否在视口中并添加动画
  if (!ticking) {
    requestAnimationFrame(() => {
      checkElementsInView();
      ticking = false;
    });
    ticking = true;
  }
}

// 视差滚动效果
function updateParallax(scrollTop) {
  const parallaxElements = document.querySelectorAll(".parallax-bg");
  parallaxElements.forEach((element) => {
    const speed = element.dataset.speed || 0.5;
    const yPos = -(scrollTop * speed);
    element.style.transform = `translateY(${yPos}px)`;
  });
}

// 切换移动菜单
function toggleMobileMenu() {
  mobileMenu.classList.toggle("hidden");
  // 切换图标
  const icon = menuToggle.querySelector("i");
  if (icon.classList.contains("fa-bars")) {
    icon.classList.remove("fa-bars");
    icon.classList.add("fa-times");
  } else {
    icon.classList.remove("fa-times");
    icon.classList.add("fa-bars");
  }
}

// 检查移动菜单是否需要关闭
function checkMobileMenu() {
  if (window.innerWidth >= 768 && !mobileMenu.classList.contains("hidden")) {
    mobileMenu.classList.add("hidden");
    const icon = menuToggle.querySelector("i");
    icon.classList.remove("fa-times");
    icon.classList.add("fa-bars");
  }
}

// 平滑滚动
function smoothScroll(e) {
  // 获取链接地址
  const targetId = this.getAttribute("href");

  // 判断是否为内部锚点链接（以#开头）
  if (targetId.startsWith("#")) {
    e.preventDefault();

    // 关闭移动菜单
    if (!mobileMenu.classList.contains("hidden")) {
      toggleMobileMenu();
    }

    const targetElement = document.querySelector(targetId);

    if (targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop - 80, // 减去导航栏高度
        behavior: "smooth",
      });
    }
  }
  // 外部链接不阻止默认行为，让浏览器正常跳转
}

// 滚动到顶部
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

// 添加滚动显示动画
function addScrollReveal() {
  const revealElements = document.querySelectorAll(".scroll-reveal");

  revealElements.forEach((element, index) => {
    // 移除初始隐藏，改为默认可见
    // element.style.opacity = '0';
    // element.style.transform = 'translateY(50px)';
    element.style.transition = "all 0.8s cubic-bezier(0.215, 0.610, 0.355, 1)";
    element.dataset.delay = index * 100;
  });
}

// 添加磁性按钮效果
function addMagneticEffects() {
  const magneticBtns = document.querySelectorAll(".magnetic-btn");

  magneticBtns.forEach((btn) => {
    btn.addEventListener("mousemove", (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const deltaX = ((x - centerX) / centerX) * 10;
      const deltaY = ((y - centerY) / centerY) * 10;

      btn.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
    });

    btn.addEventListener("mouseleave", () => {
      btn.style.transform = "translate(0, 0)";
    });
  });
}

// 添加悬停效果
function addHoverEffects() {
  const hoverElements = document.querySelectorAll(".hover-zoom, .hover-scale");

  hoverElements.forEach((element) => {
    element.addEventListener("mouseenter", () => {
      element.style.transform = element.classList.contains("hover-zoom")
        ? "perspective(1000px) rotateX(5deg) rotateY(5deg) scale(1.05)"
        : "scale(1.06)";
    });

    element.addEventListener("mouseleave", () => {
      element.style.transform = "none";
    });
  });
}

// 检查元素是否在视口中
function checkElementsInView() {
  const revealElements = document.querySelectorAll(".scroll-reveal");

  revealElements.forEach((element) => {
    const elementTop = element.getBoundingClientRect().top;
    const elementVisible = 150;

    if (elementTop < window.innerHeight - elementVisible) {
      // 确保元素可见
      element.style.opacity = "1";
      element.style.transform = "translateY(0)";
      element.classList.add("revealed");
    }
  });
}

// 创建高级粒子效果
function createAdvancedParticles() {
  if (particlesCreated) return;

  // 检查 document.body 是否存在
  if (!document.body) {
    console.warn("document.body not ready, skipping particle creation");
    return;
  }

  const particlesContainer = document.createElement("div");
  particlesContainer.classList.add("particles-container");
  // 设置必要的CSS样式
  particlesContainer.style.position = "fixed";
  particlesContainer.style.top = "0";
  particlesContainer.style.left = "0";
  particlesContainer.style.width = "100%";
  particlesContainer.style.height = "100%";
  particlesContainer.style.pointerEvents = "none";
  particlesContainer.style.zIndex = "0";
  document.body.appendChild(particlesContainer);

  const particleCount =
    window.innerWidth > 1024 ? 100 : window.innerWidth > 768 ? 50 : 30; // 减少粒子数量以提高性能

  for (let i = 0; i < particleCount; i++) {
    createParticle(particlesContainer, i);
  }

  particlesCreated = true;
}

function createParticle(container, index) {
  const particle = document.createElement("div");
  particle.classList.add("particle");

  // 随机属性
  const size = Math.random() * 3 + 1;
  const x = Math.random() * 100;
  const y = Math.random() * 100;
  const opacity = Math.random() * 0.5 + 0.1;
  const delay = Math.random() * 8;
  const duration = Math.random() * 15 + 10;

  // 随机颜色
  const colors = [
    "#FF4D4D",
    "#3D5A80",
    "#F2CC8F",
    "#EEF5FF",
    "#FF6B6B",
    "#5A79A5",
  ];
  const color = colors[Math.floor(Math.random() * colors.length)];

  // 设置粒子样式
  particle.style.position = "absolute";
  particle.style.width = `${size}px`;
  particle.style.height = `${size}px`;
  particle.style.backgroundColor = color;
  particle.style.borderRadius = "50%";
  particle.style.left = `${x}%`;
  particle.style.top = `${y}%`;
  particle.style.opacity = opacity;
  particle.style.boxShadow = `0 0 ${size * 2}px ${color}`;
  particle.style.animation = `float ${duration}s ease-in-out ${delay}s infinite`;
  particle.style.animationFillMode = "both";
  particle.style.animationDirection =
    Math.random() > 0.5 ? "normal" : "reverse";

  container.appendChild(particle);
}

// 华丽加载动画
function createLoadingAnimation() {
  // 仅作为占位函数，如果需要可以实现具体的加载动画
  console.log("加载动画功能准备就绪");
}

// 数字增长动画
function animateNumber(element, start, end, duration) {
  let startTime = null;

  function animation(currentTime) {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const progress = Math.min(timeElapsed / duration, 1);
    const value = Math.floor(progress * (end - start) + start);

    element.innerText = value;

    if (timeElapsed < duration) {
      requestAnimationFrame(animation);
    }
  }

  requestAnimationFrame(animation);
}

// 注意：createParticles函数已被createAdvancedParticles替代，保留兼容性

// 为链接添加悬停效果
function addLinkHoverEffects() {
  const links = document.querySelectorAll(
    "a:not(.btn-primary):not(.btn-secondary)",
  );

  links.forEach((link) => {
    link.addEventListener("mouseenter", () => {
      link.style.transform = "translateY(-2px)";
      link.style.transition = "transform 0.3s ease";
    });

    link.addEventListener("mouseleave", () => {
      link.style.transform = "translateY(0)";
    });
  });
}

// 动态调整内容高度
function adjustContentHeight() {
  const sections = document.querySelectorAll("section");

  sections.forEach((section) => {
    const windowHeight = window.innerHeight;
    const sectionHeight = section.offsetHeight;

    if (sectionHeight < windowHeight * 0.8) {
      section.style.minHeight = `${windowHeight * 0.8}px`;
    }
  });
}

// 监听窗口大小变化，调整内容高度
const resizeHandler = debounce(adjustContentHeight, 250);
window.addEventListener("resize", resizeHandler);

// 初始化页面 - 适配 Cloudflare 环境
(function () {
  // 确保页面完全加载
  function initPage() {
    console.log("页面加载完成，开始初始化...");

    // 初始化所有功能
    init();
    adjustContentHeight();
    addLinkHoverEffects();

    // 确保所有元素初始可见
    const revealElements = document.querySelectorAll(".scroll-reveal");
    revealElements.forEach((el) => {
      if (el.style.opacity === "0" || el.style.opacity === "") {
        el.style.opacity = "1";
      }
    });

    // 添加页面卸载时的清理函数
    window.addEventListener("beforeunload", () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", resizeHandler);
    });

    console.log("页面初始化完成");
  }

  // 多种初始化方式，确保在不同环境下都能正常工作
  if (document.readyState === "complete") {
    initPage();
  } else if (document.readyState === "interactive") {
    setTimeout(initPage, 100);
  } else {
    window.addEventListener("load", initPage);
    document.addEventListener("DOMContentLoaded", () => {
      setTimeout(initPage, 200);
    });
  }

  // 立即加入按钮已改为直接链接到3.11指南页面
})();

// 页面性能优化
function optimizePerformance() {
  // 延迟加载非关键资源
  const lazyLoadImages = document.querySelectorAll("img[data-src]");
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.remove("lazy");
        observer.unobserve(img);
      }
    });
  });

  lazyLoadImages.forEach((img) => imageObserver.observe(img));
}

// 触摸设备优化
function optimizeForTouch() {
  if ("ontouchstart" in window) {
    // 为触摸设备优化交互
    document.body.classList.add("touch-device");

    // 移除部分悬停效果以避免触摸设备上的问题
    const hoverElements = document.querySelectorAll(
      ".hover-scale, .hover-zoom",
    );
    hoverElements.forEach((el) => {
      el.classList.add("touch-optimized");
    });
  }
}
