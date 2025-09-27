# Mini E-Learning Platform with Gemini-Simulated AI Tutor

## 👨‍💻 Project Overview
This web application is a mini e-learning platform designed to help users explore interactive courses, take short quizzes, and receive personalized study tips from a simulated AI Tutor named Gemini. Built using HTML, CSS, and JavaScript, the platform demonstrates core web development skills and introduces simulated AI integration for a modern learning experience.

## 🚀 Features

- **Dashboard Page**  
  Displays a list of featured courses with:
  - Titles and short descriptions
  - Progress indicators (ready for future tracking)
  - A hero section welcoming users and guiding them to start learning
  - Sidebar navigation with links to Home, My Courses, Profile, and Help
  - Learning Tips section offering study strategies and motivation

- **Course Detail Page**  
  Loads course content dynamically from `courses.json`, including:
  - Multiple lessons formatted for clarity
  - A quiz section with instant feedback
  - A Gemini AI Tutor chatbox for personalized support

- **Quiz System**  
  - Multiple-choice questions with scoring logic
  - Saves user scores using localStorage
  - “Review Tips” button triggers Gemini to give targeted advice

- **Gemini AI Tutor**  
  - Responds to user questions based on keywords
  - Offers encouragement and study tips
  - Adapts responses based on quiz performance

- **Responsive Design**  
  - Styled with CSS and Font Awesome icons
  - Mobile-friendly layout with sidebar toggle

## 🛠️ Technologies Used
- HTML5
- CSS3
- JavaScript (ES6)
- LocalStorage API

## 📦 Setup Instructions
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/e-learning-platform.git

 
2. Open the project folder in VS Code.
3. Launch index.html using Live Server or any     local server.
4. Click on a course to view lessons, take the quiz, and interact with Gemini.
📚 Course Data
Courses are stored in courses.json and loaded dynamically. Each course includes:
- Title and description
- Array of lessons
- Array of quiz questions with correct answers
🧠 AI Tutor Simulation
Gemini is a simulated AI tutor that:
- Answers keyword-based questions
- Responds based on quiz score
- Offers encouragement and review tips
- Can be expanded to integrate real AI APIs in future versions
📈 Future Improvements
- User registration and login
- Real-time Gemini API integration
- Progress dashboard with visual analytics
- Course completion certificates
- Admin panel for adding/editing courses
🎥 Demo Video
Watch the full walkthrough here: Microsoft Teams Link
👤 Author
Uduakobong Lawrence Okonah
CSE 310 – Applied Programming
Module #1: Web Apps
Date: 27/09/2025
