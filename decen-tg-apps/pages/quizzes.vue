<template>
  <div class="quiz-container">
    <h1>Квизы</h1>

    <nav class="lms-nav">
      <nuxt-link to="/" class="nav-item" exact-active-class="active"
        >Главная</nuxt-link
      >
      <nuxt-link to="/courses" class="nav-item" active-class="active"
        >Курсы</nuxt-link
      >
      <nuxt-link to="/quizzes" class="nav-item" active-class="active"
        >Квизы</nuxt-link
      >
    </nav>

    <div v-if="!quizCompleted" class="quiz">
      <h2>{{ currentQuiz.title }}</h2>
      <p>{{ currentQuiz.description }}</p>

      <div
        v-for="(question, index) in currentQuiz.questions"
        :key="index"
        class="question"
      >
        <h3>{{ question.questionText }}</h3>
        <ul>
          <li v-for="(option, idx) in question.options" :key="idx">
            <input
              type="radio"
              :id="'question' + index + 'option' + idx"
              :name="'question' + index"
              :value="option.isCorrect"
              v-model="userAnswers[index]"
            />
            <label :for="'question' + index + 'option' + idx">{{
              option.text
            }}</label>
          </li>
        </ul>
      </div>

      <button @click="submitQuiz" class="submit-btn">Отправить</button>
    </div>

    <div v-if="quizCompleted" class="result">
      <h2>Ваш результат: {{ score }} из {{ currentQuiz.questions.length }}</h2>
      <div class="score-message" :class="scoreMessageClass">
        {{ scoreMessage }}
      </div>
      <button @click="restartQuiz" class="restart-btn">Пройти заново</button>
    </div>
  </div>
</template>

<script lang="ts">
import { ref } from "vue";

interface Option {
  text: string;
  isCorrect: boolean;
}

interface Question {
  questionText: string;
  options: Option[];
}

interface Quiz {
  title: string;
  description: string;
  questions: Question[];
}

export default {
  setup() {
    const currentQuiz: Quiz = {
      title: "Квиз по основам программирования на Python",
      description: "Проверьте свои знания основ программирования на Python.",
      questions: [
        {
          questionText: "Что такое переменная в программировании?",
          options: [
            { text: "Контейнер для хранения данных", isCorrect: true },
            { text: "Тип данных", isCorrect: false },
            { text: "Функция", isCorrect: false },
            { text: "Класс", isCorrect: false },
          ],
        },
        {
          questionText: "Какой оператор используется для сравнения значений?",
          options: [
            { text: "=", isCorrect: false },
            { text: "==", isCorrect: true },
            { text: "===", isCorrect: false },
            { text: "=", isCorrect: false },
          ],
        },
        {
          questionText:
            "Какой метод используется для добавления элемента в список?",
          options: [
            { text: "add()", isCorrect: false },
            { text: "append()", isCorrect: true },
            { text: "insert()", isCorrect: false },
            { text: "push()", isCorrect: false },
          ],
        },
      ],
    };

    const userAnswers = ref<boolean[]>(
      Array(currentQuiz.questions.length).fill(false)
    );
    const score = ref(0);
    const quizCompleted = ref(false);
    const scoreMessage = ref("");
    const scoreMessageClass = ref("");

    const submitQuiz = () => {
      score.value = 0;

      currentQuiz.questions.forEach((question, index) => {
        if (userAnswers.value[index]) {
          const selectedOption = question.options.find(
            (option) => option.isCorrect === userAnswers.value[index]
          );
          if (selectedOption && selectedOption.isCorrect) {
            score.value++;
          }
        }
      });

      quizCompleted.value = true;
      scoreMessage.value = `Вы правильно ответили на ${score.value} из ${currentQuiz.questions.length} вопросов.`;
      scoreMessageClass.value = score.value > 1 ? "success" : "failure"; // Классы для стилей
    };

    const restartQuiz = () => {
      userAnswers.value.fill(false);
      score.value = 0;
      quizCompleted.value = false;
      scoreMessage.value = "";
    };

    return {
      currentQuiz,
      userAnswers,
      score,
      quizCompleted,
      submitQuiz,
      restartQuiz,
      scoreMessage,
      scoreMessageClass,
    };
  },
};
</script>

<style scoped>
/* Основной контейнер для квизов */
.quiz-container {
  max-width: 800px;
  margin: 20px auto;
  padding: 30px;
  background-color: #f9f9f9;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  font-family: "Arial", sans-serif;
}

/* Заголовок квизов */
h1 {
  text-align: center;
  color: #333;
  margin-bottom: 20px;
}

/* Навигация */
.lms-nav {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 30px;
}

.nav-item {
  text-decoration: none;
  color: #495057;
  font-weight: 600;
  padding: 12px 18px;
  border-radius: 8px;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.nav-item:hover {
  background-color: #e9ecef;
  color: #007bff;
}

.nav-item.active {
  background-color: #007bff;
  color: white;
}

/* Квиз */
.quiz {
  margin-bottom: 30px;
}

/* Вопросы */
.question {
  margin-bottom: 20px;
}

.question h3 {
  font-size: 1.2em;
  color: #555;
  margin-bottom: 10px;
}

/* Список опций */
ul {
  list-style-type: none;
  padding: 0;
}

li {
  margin: 10px 0;
}

/* Кнопка отправки */
.submit-btn {
  display: block;
  width: 100%;
  padding: 12px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s ease;
}

.submit-btn:hover {
  background-color: #0056b3;
}

/* Результат */
.result {
  text-align: center;
  margin-top: 30px;
}

.score-message {
  margin-top: 10px;
  font-weight: bold;
}

.success {
  color: #28a745;
}

.failure {
  color: #dc3545;
}

/* Кнопка перезапуска */
.restart-btn {
  margin-top: 20px;
  padding: 12px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s ease;
}

.restart-btn:hover {
  background-color: #0056b3;
}

/* Адаптивность */
@media (max-width: 600px) {
  .quiz-container {
    padding: 20px;
  }

  .nav-item {
    padding: 10px 15px;
  }

  .submit-btn,
  .restart-btn {
    padding: 10px;
  }
}
</style>
