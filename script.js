const username = localStorage.getItem("ai_user");

if (!username) {
  window.location.href = "auth.html";
} else {
  const users = JSON.parse(localStorage.getItem("ai_users") || "[]");
  const userData = users.find(u => u.username === username);

  const welcome = document.getElementById("welcome-user");
  if (welcome && userData) {
    welcome.innerText = `Welcome, ${userData.username}!`;
  }
}

// menue
document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menu-toggle");
  const menu = document.getElementById("main-menu");

  if (menuToggle && menu) {
    menuToggle.addEventListener("click", () => {
      menu.classList.toggle("active");
    });
  }

  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("ai_user");
      window.location.href = "auth.html";
    });
  }
});


// logout button
document.getElementById("logout-btn").addEventListener("click", () => {
  localStorage.removeItem("ai_user");
  window.location.href = "auth.html";
});

// DASHBOARD PAGE: Load featured courses
if (window.location.pathname.includes("index.html")) {
  fetch("courses.json")
    .then((res) => res.json())
    .then((courses) => {
      const courseList = document.getElementById("course-list");
      const featuredCourses = courses.filter(course => course.featured);

      featuredCourses.forEach((course) => {
        const score = localStorage.getItem(`course_${course.id}_score`);
        const progress = score ? (parseInt(score) / course.quiz.length) * 100 : 0;

        // Get current user email
        const username = localStorage.getItem("ai_user");
        const users = JSON.parse(localStorage.getItem("ai_users") || "[]");
        const userData = users.find(u => u.username === username);
        const userEmail = userData?.email;

        // Check enrollment status
        const enrolled = localStorage.getItem(`enrolled_${userEmail}_course_${course.id}`);
        const status = enrolled ? "✅ Enrolled" : "❌ Not Enrolled";

        // Create course card
        const card = document.createElement("div");
        card.className = "course-card";
        card.innerHTML = `
          <h3>${course.title}</h3>
          <p>${course.description}</p>
          <progress value="${progress}" max="100"></progress>
          <p class="progress-label">${Math.round(progress)}% Complete</p>
          <p class="enroll-status">${status}</p>
          <a href="course.html?courseId=${course.id}">Go to Course</a>
        `;
        courseList.appendChild(card);
      });
    })
    .catch((error) => console.error("Error loading courses:", error));
}

// COURSE PAGE: Load course content, quiz, and AI Tutor
if (window.location.pathname.includes("course.html")) {
  const courseId = parseInt(new URLSearchParams(window.location.search).get("courseId"));

  fetch("courses.json")
    .then((res) => res.json())
    .then((courses) => {
      const course = courses.find(c => c.id === courseId);
      console.log("Course ID:", courseId);
      console.log("Courses loaded:", courses);
      console.log("Selected course:", course);

      if (!course) {
        document.getElementById("course-title").innerText = "Course not found.";
        return;
      }

      document.getElementById("course-title").innerText = course.title;

      const username = localStorage.getItem("ai_user");
      const users = JSON.parse(localStorage.getItem("ai_users") || "[]");
      const userData = users.find(u => u.username === username);
      const userEmail = userData?.email;

      const enrolledKey = `enrolled_${userEmail}_course_${courseId}`;
      const isEnrolled = localStorage.getItem(enrolledKey);

      // Show enrollment status
      const enrollStatus = document.getElementById("enroll-status");
      if (enrollStatus) {
        enrollStatus.innerText = isEnrolled ? "✅ You are enrolled in this course." : "❌ You are not enrolled yet.";
      }

      // Handle enrollment button
      const enrollBtn = document.getElementById("enroll-btn");
      if (enrollBtn) {
        enrollBtn.addEventListener("click", () => {
          if (!userEmail) {
            alert("Please log in first.");
            return;
          }
          localStorage.setItem(enrolledKey, true);
          alert("Enrollment successful!");
          location.reload();
        });
      }

      if (!isEnrolled) {
  document.getElementById("course-title").innerText = "Please enroll to access this course.";
  return;
}

      // Lessons
      const lessonsDiv = document.getElementById("lessons");
      course.lessons.forEach((lesson, i) => {
        const p = document.createElement("p");
        p.innerHTML = `<strong>Lesson ${i + 1}:</strong> ${lesson}`;
        lessonsDiv.appendChild(p);
      });

      // Quiz
      const quizForm = document.getElementById("quiz-form");
      course.quiz.forEach((q, i) => {
        const div = document.createElement("div");
        div.className = "question";
        div.innerHTML = `<label>${i + 1}. ${q.question}</label><br />` +
          q.options.map(opt => `<input type="radio" name="q${i}" value="${opt}" /> ${opt}<br />`).join("");
        quizForm.appendChild(div);
      });

      quizForm.addEventListener("submit", function (e) {
        e.preventDefault();
        localStorage.removeItem(`course_${courseId}_score`); // Clear old score

        let score = 0;
        course.quiz.forEach((q, i) => {
          const selected = document.querySelector(`input[name="q${i}"]:checked`);
          if (selected && selected.value === q.answer) score++;
        });

        document.getElementById("quiz-result").innerText =
          `You scored ${score}/${course.quiz.length}. ${score < course.quiz.length ? "Keep practicing!" : "Excellent!"}`;

        localStorage.setItem(`course_${courseId}_score`, score); // Save new score
      });

      // Review Tips Button Logic
      document.getElementById("review-tips-btn").addEventListener("click", function () {
        const score = localStorage.getItem(`course_${courseId}_score`);
        let reply = "";

        if (score === null) {
          reply = "You haven't taken the quiz yet. Try it first, then I'll help you review!";
        } else if (parseInt(score) < course.quiz.length) {
          reply = `You scored ${score}/${course.quiz.length}. I suggest reviewing Lesson 1 and Lesson 2. Focus on 'const', 'string', and how variables work.`;
        } else {
          reply = `Excellent score! You scored ${score}/${course.quiz.length}. You're ready to move on or build a mini project to apply your skills.`;
        }

        const chatBox = document.getElementById("chat-box");
        chatBox.innerHTML += `<p><strong>Gemini:</strong> ${reply}</p>`;
      });
    })
    .catch((error) => console.error("Error loading course:", error));

  document.getElementById("retake-quiz-btn").addEventListener("click", () => {
  document.querySelectorAll("#quiz-form input[type='radio']").forEach(input => input.checked = false);
  document.getElementById("quiz-result").innerText = "";
  localStorage.removeItem(`course_${courseId}_score`);
});
}

function sendToGemini() {
  const input = document.getElementById("user-input").value.toLowerCase();
  const courseId = parseInt(new URLSearchParams(window.location.search).get("courseId"));
  const score = localStorage.getItem(`course_${courseId}_score`);
  let reply = "";

  // Personalized feedback based on score
  if (input.includes("how did i do") || input.includes("my score")) {
    if (score === null) {
      reply = "You haven't taken the quiz yet. Try it out and I'll help you review!";
    } else if (parseInt(score) < 2) {
      reply = `You scored ${score}/2. I recommend reviewing Lesson 1 and Lesson 2 for this course.`;
    } else {
      reply = `Great job! You scored ${score}/2. You're ready to move on to the next topic.`;
    }
  }

  // Lesson suggestions based on course
  else if (input.includes("what should i review") || input.includes("lesson")) {
    if (score === null || parseInt(score) < 2) {
      if (courseId === 1) {
        reply = "Review Lesson 1: Variables and Lesson 2: Functions. These are key to understanding JavaScript basics.";
      } else if (courseId === 2) {
        reply = "Review Lesson 1: HTML tags and Lesson 2: CSS styling. These are essential for web design.";
      } else if (courseId === 3) {
        reply = "Review Lesson 1: Indentation and Lesson 2: Variables. These are foundational in Python.";
      } else {
        reply = "Review the first two lessons to strengthen your foundation.";
      }
    } else {
      reply = "You seem confident! Try building a mini project to apply what you've learned.";
    }
  }

  // Keyword-based tutoring by course
  else if (courseId === 1) {
    if (input.includes("variable") && input.includes("constant")) {
      reply = "`const` is used to declare a variable that cannot be reassigned in JavaScript.";
    } else if (input.includes("hello world") || input.includes("type") && input.includes("string")) {
      reply = `"Hello World" is a string because it's enclosed in quotes and represents text in JavaScript.`;
    }
  } else if (courseId === 2) {
    if (input.includes("heading") || input.includes("tag")) {
      reply = "`<h1>` is the tag used for the largest heading in HTML.";
    } else if (input.includes("text color") || input.includes("css")) {
      reply = "`color` is the CSS property that changes text color.";
    }
  } else if (courseId === 3) {
    if (input.includes("output") || input.includes("print")) {
      reply = "`print()` is the function used to display output in Python.";
    } else if (input.includes("define function") || input.includes("python function")) {
      reply = "Use `def myFunc():` to define a function in Python.";
    }
  }

  // Fallback encouragement
  if (!reply) {
    const tips = [
      "Try reviewing the lesson again.",
      "Focus on key terms and examples.",
      "You're doing great—keep going!",
      "Practice with flashcards or mini projects."
    ];
    reply = tips[Math.floor(Math.random() * tips.length)];
  }

  const chatBox = document.getElementById("chat-box");
  chatBox.innerHTML += `<p><strong>You:</strong> ${input}</p>`;
  chatBox.innerHTML += `<p><strong>Gemini:</strong> ${reply}</p>`;
  document.getElementById("user-input").value = "";
}
