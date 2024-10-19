<template>
  <div class="course-container">
    <h1>Курс 1: Введение в программирование</h1>
    <p>
      Этот курс предназначен для начинающих и охватывает основы программирования
      на языке Python.
    </p>

    <h2>Темы курса:</h2>
    <ul>
      <li v-for="(topic, index) in topics" :key="index" class="course-item">
        <a :href="topic.videoUrl" target="_blank" class="course-link">{{
          topic.title
        }}</a>
        <input
          type="checkbox"
          :checked="topic.completed"
          @change="toggleCompletion(topic)"
          class="checkbox"
        />
      </li>
    </ul>

    <div v-if="allCompleted" class="completed-message">Курс пройден!</div>

    <!-- <div class="status-container"> -->
      <!-- <h3>Текущие состояния тем:</h3> -->
      <!-- <pre>{{ topics }}</pre> -->
      <!-- <p>Все темы завершены: {{ allCompleted }}</p> -->
    <!-- </div> -->

    <div v-if="successMessage" class="success-message">
      {{ successMessage }}
    </div>
    <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>

    <div class="buttons">
      <nuxt-link to="/quizzes/quiz1" class="btn">Начать тест</nuxt-link>
      <nuxt-link to="/courses" class="btn">Вернуться к курсам</nuxt-link>
      <nuxt-link to="/" class="btn">На главное</nuxt-link>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, onMounted } from "vue";
const { useWebApp } = await import("vue-tg");
const { initDataUnsafe } = useWebApp(); // Инициализация WebApp данных

interface Topic {
  title: string;
  videoUrl: string;
  completed: boolean;
}

export default {
  setup() {
    const topics = ref<Topic[]>([
      {
        title: "Основы Python",
        videoUrl: "https://youtu.be/LFCq-mNF96c?si=LnKdsw4mkRX3TwRt",
        completed: false,
      },
      {
        title: "Условные операторы",
        videoUrl: "https://youtu.be/P8XvMo_NNvo?si=rDO9-lTZE6_cr5zM",
        completed: false,
      },
      {
        title: "Циклы в Python",
        videoUrl: "https://youtu.be/sZ0EIwgLblY?si=NlKXzNoMkV4dEqD3",
        completed: false,
      },
    ]);

    const allCompleted = ref(false);
    const successMessage = ref("");
    const errorMessage = ref("");

    const toggleCompletion = async (topic: Topic) => {
      topic.completed = !topic.completed;
      allCompleted.value = topics.value.every((t) => t.completed);

      if (allCompleted.value) {
        await sendCompletionData();
      }
    };

    const sendCompletionData = async () => {
      const userId = initDataUnsafe.user?.id;
      const courseId = 1;

      try {
        const { data, error } = await useNuxtApp()
          .$supabase.from("completed_courses")
          .insert([{ user_id: userId, course_id: courseId }]);

        if (error) {
          throw new Error(
            `Ошибка при отправке данных в Supabase: ${error.message}`
          );
        } else {
          successMessage.value = "Данные успешно отправлены!";
        }
      } catch (err) {
        errorMessage.value = "Ошибка: " + (err as Error).message;
      }
    };

    const checkCourseCompletion = async () => {
      const userId = initDataUnsafe.user?.id;
      const courseId = 1;

      try {
        const { data, error } = await useNuxtApp()
          .$supabase.from("completed_courses")
          .select("*")
          .eq("user_id", userId)
          .eq("course_id", courseId);

        if (error) {
          throw new Error(
            `Ошибка при запросе данных из Supabase: ${error.message}`
          );
        }

        if (data && data.length > 0) {
          topics.value.forEach((topic) => {
            topic.completed = true;
          });
          allCompleted.value = true;
        }
      } catch (err) {
        errorMessage.value = "Ошибка: " + (err as Error).message;
      }
    };

    onMounted(() => {
      checkCourseCompletion();
    });

    return {
      topics,
      allCompleted,
      toggleCompletion,
      successMessage,
      errorMessage,
    };
  },
};
</script>

<style scoped>
.course-container {
  background-color: #ffffff; /* Белый фон */
  padding: 20px;
  max-width: 100%;
  margin: 0 auto;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  font-family: Arial, sans-serif;
}

h1,
h2,
p {
  color: #333; /* Темный цвет для заголовков и текста */
  text-align: center;
  margin-bottom: 15px;
}

ul {
  list-style: none;
  padding: 0;
}

.course-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f9f9f9;
  padding: 10px 15px;
  border-radius: 8px;
  margin-bottom: 10px;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.1);
}

.course-link {
  color: #007bff; /* Синий цвет для ссылок */
  font-weight: bold;
  text-decoration: none;
}

.course-link:hover {
  text-decoration: underline;
}

.checkbox {
  transform: scale(1.3);
}

.completed-message {
  background-color: #4caf50;
  color: white;
  text-align: center;
  padding: 10px;
  margin-top: 20px;
  border-radius: 8px;
}

.status-container {
  margin-top: 20px;
}

.success-message,
.error-message {
  text-align: center;
  margin-top: 15px;
  font-weight: bold;
}

.success-message {
  color: #28a745; /* Зеленый цвет для успешных сообщений */
}

.error-message {
  color: #dc3545; /* Красный цвет для ошибок */
}

.buttons {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
}

.buttons .btn {
  display: block;
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border-radius: 8px;
  text-align: center;
  text-decoration: none;
  margin-bottom: 10px;
  width: 100%;
  max-width: 250px;
}

.buttons .btn:hover {
  background-color: #0056b3;
}

/* Мобильная адаптация */
@media (max-width: 600px) {
  .course-item {
    flex-direction: column;
    align-items: flex-start;
  }

  .course-link {
    margin-bottom: 10px;
  }

  .checkbox {
    margin-left: auto;
  }

  .buttons .btn {
    width: 100%;
  }
}
</style>
