import easingUtils from "https://esm.sh/easing-utils";

class TechBlog extends HTMLElement {
  /**
   * Init
   */
  connectedCallback() {
    // Elements
    this.canvas = this.querySelector(".js-canvas");
    this.ctx = this.canvas.getContext("2d");
    this.badge = this.querySelector(".js-badge");

    this.discs = [];
    this.lines = [];

    // Init
    this.setSize();
    this.setDiscs();
    this.setLines();
    this.setParticles();

    this.bindEvents();

    // RAF
    requestAnimationFrame(this.tick.bind(this));
  }

  /**
   * Bind events
   */
  bindEvents() {
    window.addEventListener("resize", this.onResize.bind(this));
    
    // Note: Badge now directly links to hero-reveal.html
    // No need for custom click handling
  }

  /**
   * Resize handler
   */
  onResize() {
    this.setSize();
    this.setDiscs();
    this.setLines();
    this.setParticles();
  }

  /**
   * Set size
   */
  setSize() {
    this.rect = this.getBoundingClientRect();
    this.badgeRect = this.badge.getBoundingClientRect();

    this.render = {
      width: this.rect.width,
      height: this.rect.height,
      dpi: window.devicePixelRatio
    };

    this.canvas.width = this.render.width * this.render.dpi;
    this.canvas.height = this.render.height * this.render.dpi;
  }

  /**
   * Set discs
   */
  setDiscs() {
    const { badgeRect } = this;
    const { width, height } = this.rect;

    this.discs = [];

    const diag = Math.hypot(width, height);

    this.startDisc = {
      x: width * 0.5,
      y: height * 0.5,
      w: diag * 0.5,
      h: diag * 0.5
    };

    this.endDisc = {
      x: width * 0.5,
      y: height * 0.5,
      w: badgeRect.width * 0.5,
      h: badgeRect.height * 0.5
    };

    const totalDiscs = 20;

    for (let i = 0; i < totalDiscs; i++) {
      const p = i / totalDiscs;

      const disc = this.tweenDisc({
        p
      });

      this.discs.push(disc);
    }
  }

  /**
   * Set lines
   */
  setLines() {
    const { width, height } = this.rect;

    this.lines = [];

    const totalLines = 100;
    const linesAngle = (Math.PI * 2) / totalLines;

    for (let i = 0; i < totalLines; i++) {
      const angle =
        (i * linesAngle + performance.now() * 0.0001) % (Math.PI * 2);

      const p0 = {
        x: width * 0.5 + Math.cos(angle) * this.startDisc.w,
        y: height * 0.5 + Math.sin(angle) * this.startDisc.h
      };

      const p1 = {
        x: width * 0.5 + Math.cos(angle) * this.endDisc.w,
        y: height * 0.5 + Math.sin(angle) * this.endDisc.h
      };

      const l = {
        x: p1.x - p0.x,
        y: p1.y - p0.y
      };

      this.lines.push({ p0, p1, l });
    }
  }

  /**
   * Set particles
   */
  setParticles() {
    const { width, height } = this.rect;

    this.particles = [];

    const totalParticles = 500;

    for (let i = 0; i < totalParticles; i++) {
      const particle = this.initParticle(true);

      this.particles.push(particle);
    }
  }

  /**
   * Init particle
   */
  initParticle() {
    const lineIndex = Math.round((this.lines.length - 1) * Math.random());
    const v = 0.005 + Math.random() * 0.005;
    const l = 0.01 + Math.random() * 0.1;
    const a = 0.05 + Math.random() * 0.15;

    return {
      lineIndex,
      p: Math.random(),
      v,
      l,
      a
    };
  }

  /**
   * Reset particle
   */
  resetParticle(particle) {
    particle.p = 0;
  }

  /**
   * Tween value
   */
  tweenValue(start, end, p, ease = false) {
    const delta = end - start;

    const easeFn =
      easingUtils[
        ease ? "ease" + ease.charAt(0).toUpperCase() + ease.slice(1) : "linear"
      ];

    return start + delta * easeFn(p);
  }

  /**
   * Draw discs
   */
  drawDiscs() {
    const { ctx } = this;

    ctx.strokeStyle = "#444";
    ctx.lineWidth = 2;

    // Outer disc
    const outerDisc = this.startDisc;

    ctx.beginPath();

    ctx.ellipse(
      outerDisc.x,
      outerDisc.y,
      outerDisc.w,
      outerDisc.h,
      0,
      0,
      Math.PI * 2
    );
    ctx.stroke();

    ctx.closePath();

    // Discs
    this.discs.forEach((disc, i) => {
      ctx.beginPath();

      ctx.ellipse(disc.x, disc.y, disc.w, disc.h, 0, 0, Math.PI * 2);
      ctx.stroke();

      ctx.closePath();
    });
  }

  /**
   * Draw lines
   */
  drawLines() {
    const { ctx, lines } = this;

    ctx.beginPath();

    lines.forEach(({ p0, p1 }, i) => {
      ctx.moveTo(p0.x, p0.y);
      ctx.lineTo(p1.x, p1.y);
    });

    ctx.strokeStyle = "#4449";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.closePath();
  }

  /**
   * Draw particles
   */
  drawParticles() {
    const { ctx, particles } = this;

    particles.forEach((particle) => {
      const line = this.lines[particle.lineIndex];

      const start = {
        x: line.p0.x + line.l.x * particle.p,
        y: line.p0.y + line.l.y * particle.p
      };

      const p0 = {
        x: start.x,
        y: start.y
      };

      const p1 = {
        x: start.x + line.l.x * particle.l,
        y: start.y + line.l.y * particle.l
      };

      ctx.beginPath();

      ctx.moveTo(p0.x, p0.y);
      ctx.lineTo(p1.x, p1.y);

      ctx.strokeStyle = `rgba(255, 255, 255, ${particle.a})`;
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.closePath();
    });
  }

  /**
   * Move discs
   */
  moveDiscs() {
    this.discs.forEach((disc) => {
      disc.p = (disc.p + 0.001) % 1;

      this.tweenDisc(disc);
    });
  }

  /**
   * Move Particles
   */
  moveParticles() {
    this.particles.forEach((particle) => {
      if (particle.p < 1) {
        particle.p += particle.v;
      } else {
        particle.p = 0;
      }
    });
  }

  /**
   * Tween disc
   */
  tweenDisc(disc) {
    disc.x = this.tweenValue(this.startDisc.x, this.endDisc.x, disc.p);
    disc.y = this.tweenValue(
      this.startDisc.y,
      this.endDisc.y,
      disc.p,
      "inExpo"
    );

    disc.w = this.tweenValue(
      this.startDisc.w,
      this.endDisc.w,
      disc.p,
      "outCubic"
    );
    disc.h = this.tweenValue(
      this.startDisc.h,
      this.endDisc.h,
      disc.p,
      "outCubic"
    );

    return disc;
  }

  /**
   * Tick
   */
  tick(time) {
    const { ctx } = this;

    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    ctx.save();
    ctx.scale(this.render.dpi, this.render.dpi);

    this.moveDiscs();
    this.moveParticles();

    this.setLines();

    this.drawDiscs();
    this.drawLines();
    this.drawParticles();

    ctx.restore();

    requestAnimationFrame(this.tick.bind(this));
  }
}

customElements.define("tech-blog", TechBlog);

// Additional interactive effects
document.addEventListener('DOMContentLoaded', () => {
  // Add glitch effect to title on hover
  const titleMain = document.querySelector('.title-main');
  if (titleMain) {
    let glitchTimeout;
    
    titleMain.addEventListener('mouseenter', () => {
      const originalText = titleMain.textContent;
      const glitchChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
      let iterations = 0;
      
      const glitchInterval = setInterval(() => {
        titleMain.textContent = originalText
          .split('')
          .map((char, index) => {
            if (index < iterations) {
              return originalText[index];
            }
            return glitchChars[Math.floor(Math.random() * glitchChars.length)];
          })
          .join('');
        
        if (iterations >= originalText.length) {
          clearInterval(glitchInterval);
        }
        
        iterations += 1 / 3;
      }, 30);
      
      glitchTimeout = setTimeout(() => {
        titleMain.textContent = originalText;
      }, 1000);
    });
  }

  // Enhanced badge hover effect with sound simulation
  const badge = document.querySelector('.js-badge');
  if (badge) {
    badge.addEventListener('mouseenter', () => {
      // Create a subtle screen flash effect
      const flash = document.createElement('div');
      flash.style.position = 'fixed';
      flash.style.top = '0';
      flash.style.left = '0';
      flash.style.width = '100%';
      flash.style.height = '100%';
      flash.style.background = 'rgba(0, 248, 241, 0.05)';
      flash.style.pointerEvents = 'none';
      flash.style.zIndex = '9998';
      
      document.body.appendChild(flash);
      
      setTimeout(() => {
        flash.remove();
      }, 200);
    });
  }
}); 