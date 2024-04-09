// Hamburger nav-bar
const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-list");

hamburger.addEventListener("click", mobileMenu);

function mobileMenu() {
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
}

const navLink = document.querySelectorAll(".nav-link");

navLink.forEach(n => n.addEventListener("click", closeMenu));

function closeMenu() {
    hamburger.classList.remove("active");
    navMenu.classList.remove("active");
}

// Fade in card animation
function addRevealEffect(elements) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !entry.target.closest('#paginated-list') && !entry.target.closest('.feature-carrousel')) {
          entry.target.classList.add('reveal');
        }
      });
    },
    { threshold: 0.1 }
  );

  elements.forEach((element) => {
    observer.observe(element);
  });
}

const elementsToReveal = document.querySelectorAll('.card');
addRevealEffect(elementsToReveal);

  
// Pagination tools
const paginationNumbers = document.getElementById("pagination-numbers");
const paginatedList = document.getElementById("paginated-list");
const paginationLimit = 6;
if (paginatedList) {
  const listItems = paginatedList.querySelectorAll(".card");
  const pageCount = Math.ceil(listItems.length / paginationLimit);
  let currentPage = 1;

  const appendPageNumber = (index) => {
    const pageNumber = document.createElement("button");
    pageNumber.className = "pagination-number";
    pageNumber.innerHTML = index;
    pageNumber.setAttribute("page-index", index);
    pageNumber.setAttribute("aria-label", "Page " + index);

    paginationNumbers.appendChild(pageNumber);
  };

  const getPaginationNumbers = () => {
    for (let i = 1; i <= pageCount; i++) {
      appendPageNumber(i);
    }
  };

  const handleActivePageNumber = () => {
    document.querySelectorAll(".pagination-number").forEach((button) => {
      button.classList.remove("active");
      const pageIndex = Number(button.getAttribute("page-index"));
      if (pageIndex === currentPage) {
        button.classList.add("active");
      }
    });
  };

  const setCurrentPage = (pageNum) => {
    currentPage = pageNum;
    handleActivePageNumber();

    const prevRange = (pageNum - 1) * paginationLimit;
    const currRange = pageNum * paginationLimit;

    listItems.forEach((item, index) => {
      item.style.display = index >= prevRange && index < currRange ? "block" : "none";
    });
  };

  window.addEventListener("load", () => {
      getPaginationNumbers();
      setCurrentPage(1);
    
      document.querySelectorAll(".pagination-number").forEach((button) => {
        const pageIndex = Number(button.getAttribute("page-index"));
        button.addEventListener("click", () => {
          setCurrentPage(pageIndex);
        });
      });
    
      document.getElementById("prev-button").addEventListener("click", () => {
        if (currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      });
    
      document.getElementById("next-button").addEventListener("click", () => {
        if (currentPage < pageCount) {
          setCurrentPage(currentPage + 1);
        }
      });
    });
}

// Card background pointer
let cards = document.querySelectorAll('.card-tool');

if (cards.length > 0) {
    cards.forEach(card => {
        card.onmousemove = function(e) {
            let x = e.pageX - card.offsetLeft;
            let y = e.pageY - card.offsetTop;

            card.style.setProperty('--x', x + 'px');
            card.style.setProperty('--y', y + 'px');
        }
    });
}

// Tilting images
const cards_image = document.querySelectorAll(".card-image-basic");
if (cards_image) {
  function applyTiltOnMouserOver(event) {
    event.stopPropagation();
    
    const target = event.currentTarget;
    
    const targetInfo = {
      centerX: target.offsetWidth/2,
      centerY: target.offsetHeight/2
    }
    
    const rect = target.getBoundingClientRect();
    const mouseX = (event.clientX - targetInfo.centerX) - rect.left;
    const mouseY = (event.clientY - targetInfo.centerY) - rect.top;
    
    const transform = {
      x: (mouseY * 0.05).toFixed(2),
      y: (mouseX * -0.05).toFixed(2)
    }

      target.style.cssText += `
        transform: perspective(1000px) rotateX(${transform.x}deg) rotateY(${transform.y}deg);
      `;
  }

  cards_image.forEach(e => e.addEventListener("mousemove", applyTiltOnMouserOver));

  cards_image.forEach(e => e.addEventListener("mouseout", (e) => {
      e.currentTarget.style.cssText += `
        transform: rotate3d(0,0, 0, 0deg);
      `;
  }));
}

// Carrousel
const tabs = document.querySelectorAll('[data-id]');
const contents = document.querySelectorAll('[data-content]');
let id = 0;

tabs.forEach(function (tab, index) {
    tab.addEventListener('click', function () {
        tabs[id].classList.remove('active');
        tab.classList.add('active');
        id = tab.getAttribute('data-id');
        contents.forEach(function (box, boxIndex) {
            box.classList.add('hide');
            if (boxIndex == index){
                box.classList.remove('hide');
                box.classList.add('show');
            }
        });
    });
});

// Header sketch
let phase = 0;
let noiseMax = 2;
let zOff = 0;
const TWO_PI = Math.PI * 2;

function setup() {
  let scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
  let cnv = createCanvas(windowWidth - scrollbarWidth, windowHeight);
  let container1 = select('.family-header');
  let container2 = select('.advanced-header');

  if (container1) {
    cnv.parent(container1);
  } else if (container2) {
    cnv.parent(container2);
  }
  
  cnv.position(0, 0);
  strokeWeight(40);
}

function windowResized() {
  let scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
  resizeCanvas(windowWidth - scrollbarWidth, windowHeight);
}

function draw() {
  clear();

  let centerY = height / 2;

  if (select('.family-header')) {
    phase += 0.003;
    zOff += 0.01;

    translate(width / 2, height / 2);
    stroke("#b4aaff9d");
    noFill();

    for (let i = 1; i < 4; i++) {
      beginShape();
      for (let a = 0; a < TWO_PI; a += 0.01) {
        let xOff = map(cos(a + phase), -1, 1, 0, noiseMax);
        let yOff = map(sin(a + phase), -1, 1, 0, noiseMax);
        let r = map(noise(xOff, yOff, zOff), 0, 1, 100, 250) * (i * 0.7);
        let x = r * cos(a);
        let y = r * sin(a);
        vertex(x, y);
      }
      endShape(CLOSE);
    }
  } else if (select('.advanced-header')) {
    phase += 0.02;

    drawSinusWave(100, 0.003, centerY - 100);
    drawSinusWave(80, 0.004, centerY + 100);
    drawSinusWave(200, 0.002, centerY);
    drawSinusWave(150, 0.001, centerY + 50);
  }
}

function drawSinusWave(amplitude, speed, yOffset) {
  beginShape();
  stroke("#edb84d9e");
  noFill();
  for (let x = 0; x <= width; x += 10) {
    let y = sin(x * speed + phase) * amplitude + yOffset;
    vertex(x, y);
  }
  endShape();
}

// Price switcher
const priceCards = document.querySelectorAll(".price-card");
const switchInputs = document.querySelectorAll(".switch-price input");
const toggleClass = "hide";

for (const switchInput of switchInputs) {
  switchInput.addEventListener("input", function () {
    for (const priceCard of priceCards) {
      const prices = priceCard.querySelectorAll(".price-tag");
      for (const price of prices) {
        price.classList.add(toggleClass);
      }
      const activePrices = priceCard.querySelectorAll(`.price-tag.${switchInput.id}`);
      for (const activePrice of activePrices) {
        activePrice.classList.remove(toggleClass);
      }
    }
  });
}

// Price questionaire
document.addEventListener("DOMContentLoaded", function() {
  const notSurePlanButton = document.getElementById('not-sure-plan');

  // Check if the element with id 'not-sure-plan' exists
  if (notSurePlanButton) {
    document.getElementById('not-sure-plan').addEventListener('click', function() {
      document.getElementById('questionnaire').style.display = 'block';
      window.scrollBy(0, 300);
    });

    document.getElementById('submit-answer1').addEventListener('click', function() {
      const answer1a = document.getElementById('answer1a').checked;
      const answer1b = document.getElementById('answer1b').checked;

      if (answer1a || answer1b) {
          document.getElementById('question-text1').style.display = 'none';
          document.getElementById('question-form1').style.display = 'none';
          document.getElementById('question-text2').style.display = 'block';
          document.getElementById('question-form2').style.display = 'block';
      }
    });

    document.getElementById('submit-answer2').addEventListener('click', function() {
      const answer2a = document.getElementById('answer2a').checked;
      const answer2b = document.getElementById('answer2b').checked;

      if (answer2a || answer2b) {
          document.getElementById('question-text2').style.display = 'none';
          document.getElementById('question-form2').style.display = 'none';
          document.getElementById('question-text3').style.display = 'block';
          document.getElementById('question-form3').style.display = 'block';
      }
    });

    document.getElementById('submit-answer3').addEventListener('click', function() {
      const answer3a = document.getElementById('answer3a').checked;
      const answer3b = document.getElementById('answer3b').checked;

      if (answer3a || answer3b) {
          let selectedAnswer = '';
          let selectedAnswer2 = '';
          let selectedAnswer3 = '';

          if (document.getElementById('answer1a').checked) {
              selectedAnswer = 'health';
          } else if (document.getElementById('answer1b').checked) {
              selectedAnswer = 'potential';
          }

          if (document.getElementById('answer2a').checked) {
              selectedAnswer2 = 'beginner';
          } else if (document.getElementById('answer2b').checked) {
              selectedAnswer2 = 'experienced';
          }

          if (document.getElementById('answer3a').checked) {
              selectedAnswer3 = 'yes';
          } else if (document.getElementById('answer3b').checked) {
              selectedAnswer3 = 'no';
          }

          let recommendedPlan = '';

          if (selectedAnswer === 'health' && selectedAnswer2 === 'experienced' && selectedAnswer3 === 'yes') {
              recommendedPlan = 'family-card';
          } else if (selectedAnswer === 'health' || selectedAnswer2 === 'beginner' || selectedAnswer3 === 'yes') {
              recommendedPlan = 'standard-card';
          } else if (selectedAnswer === 'potential' || selectedAnswer2 === 'experienced' || selectedAnswer3 === 'no') {
              recommendedPlan = 'advanced-card';
          }

          document.querySelectorAll('.question-card').forEach(card => {
              card.style.display = 'none';
          });

          let recommendedPlanElement = document.querySelector(`.${recommendedPlan}`);
          recommendedPlanElement.style.display = 'flex';

          if (recommendedPlanElement) {
              recommendedPlanElement.scrollIntoView({ behavior: "smooth", flex: "center" });
          }
      }
    });
  }
});

// Payment
document.addEventListener("DOMContentLoaded", function() {
  let selectedPlan = localStorage.getItem('selectedPlan') || 'Standard';

  function updateSelectedPlan(newPlan) {
      selectedPlan = newPlan;
      localStorage.setItem('selectedPlan', selectedPlan);
  }

  document.querySelectorAll('.select-plan').forEach(link => {
      link.addEventListener('click', function(event) {
          event.preventDefault();
          const selectedPlan = this.getAttribute('data-plan');
          localStorage.setItem('selectedPlan', selectedPlan);
          window.location.href = `subscription.html?plan=${selectedPlan}`;
      });
  });

  const paymentForm = document.getElementById('payment-form');

  if (paymentForm) {
      document.getElementById('plan').value = selectedPlan;
      updatePrice();

      document.getElementById('plan').addEventListener('change', function() {
          selectedPlan = this.value;
          localStorage.setItem('selectedPlan', selectedPlan);
          updatePrice();
      });

      document.getElementById('payment-frequency').addEventListener('change', updatePrice);

      function updatePrice() {
          const plan = selectedPlan;
          const paymentFrequency = document.getElementById('payment-frequency').value;
          const prices = {
              Standard: { monthly: '10€/month', yearly: '96€/year' },
              Advanced: { monthly: '20€/month', yearly: '216€/year' },
              Family: { monthly: '25€/month', yearly: '264€/year' }
          };
          const price = prices[plan][paymentFrequency];
          document.getElementById('price').textContent = price;
      }

      paymentForm.addEventListener('submit', function(event) {
          event.preventDefault();
          if (validatePaymentForm()) {
              localStorage.removeItem('selectedPlan');
              window.location.href = 'other.html';
          } else {
              alert('Please enter valid card information.');
          }
      });

      function validatePaymentForm() {
          const cardNumber = document.getElementById('card-number').value.trim();
          const cvv = document.getElementById('cvv').value.trim();
          const expirationDate = document.getElementById('expiration-date').value.trim();

          // Card number format: 1111-2222-3333-4444
          const cardNumberRegex = /^\d{4}-\d{4}-\d{4}-\d{4}$/;
          // CVV format: XXX
          const cvvRegex = /^\d{3}$/;
          // Expiration date format: MM/YY
          const expirationDateRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;

          return cardNumberRegex.test(cardNumber) && cvvRegex.test(cvv) && expirationDateRegex.test(expirationDate);
      }

      const cardNumberInput = document.getElementById('card-number');
      const expirationDateInput = document.getElementById('expiration-date');
      const cvvInput = document.getElementById('cvv');

      cardNumberInput.addEventListener('input', function() {
          validateAndSetColor(cardNumberInput, /^\d{4}-\d{4}-\d{4}-\d{4}$/);
      });

      expirationDateInput.addEventListener('input', function() {
          validateAndSetColor(expirationDateInput, /^(0[1-9]|1[0-2])\/\d{2}$/);
      });

      cvvInput.addEventListener('input', function() {
          validateAndSetColor(cvvInput, /^\d{3}$/);
      });

      function validateAndSetColor(inputField, regex) {
          const value = inputField.value.trim();

          if (!regex.test(value)) {
              inputField.style.borderColor = '';
          } else {
              inputField.style.borderColor = '';
          }
      }
  }
});

document.addEventListener('DOMContentLoaded', function() {
    const interBubble = document.querySelector('.interactive');
    let curX = 0;
    let curY = 0;
    let tgX = 0;
    let tgY = 0;

    function move() {
        curX += (tgX - curX) / 20;
        curY += (tgY - curY) / 20;
        interBubble.style.transform = `translate(${Math.round(curX)}px, ${Math.round(curY)}px)`;
        requestAnimationFrame(function() {
            move();
        });
    }

    window.addEventListener('mousemove', function(event) {
        tgX = event.clientX;
        tgY = event.clientY;
    });

    move();
});