<template>
  <div class="courses-container">
    <nav class="lms-nav">
      <nuxt-link to="/" class="nav-item" exact-active-class="active"
        >Главная</nuxt-link
      >
      <nuxt-link to="/quizzes" class="nav-item" active-class="active"
        >Квизы</nuxt-link
      >
    </nav>
    <h1>Курсы</h1>
    <p>Выберите курс для изучения:</p>
    <div class="courses-list">
      <div v-for="course in courses" :key="course.id" class="course-card">
        <div v-if="course.completed" class="completed-badge">Курс пройден!</div>
        <!-- Плашка над курсом -->
        <h2>
          <nuxt-link :to="`/course${course.id}`"
            >Курс {{ course.id }}: {{ course.title }}</nuxt-link
          >
        </h2>
        <p>{{ course.description }}</p>
        <nuxt-link :to="`/course${course.id}`" class="btn"
          >Узнать больше</nuxt-link
        >
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, onMounted } from "vue";
const { useWebApp } = await import("vue-tg");
const { initDataUnsafe } = useWebApp();

interface Course {
  id: number;
  title: string;
  description: string;
  completed?: boolean;
}

export default {
  head() {
    return {
      title: "Курсы",
      meta: [
        {
          hid: "description",
          name: "description",
          content: "Список доступных курсов для онлайн-обучения",
        },
      ],
    };
  },

  setup() {
    const courses = ref<Course[]>([]);

    const { $supabase } = useNuxtApp();
    const userId = initDataUnsafe.user?.id;

    const fetchCourses = async () => {
      const { data: courseData, error: courseError } = await $supabase
        .from("courses")
        .select("*");

      if (courseError) {
        console.error(courseError);
        return;
      }

      const { data: completedData, error: completedError } = await $supabase
        .from("completed_courses")
        .select("*")
        .eq("user_id", userId);

      if (completedError) {
        console.error(completedError);
        return;
      }

      if (courseData && completedData) {
        courses.value = courseData.map((course: Course) => ({
          ...course,
          completed: completedData.some(
            (completed) => completed.course_id === course.id
          ),
        }));
      }
    };

    onMounted(fetchCourses);

    return { courses };
  },
};
</script>

<style scoped>
/* Основной контейнер */
.courses-container {
  max-width: 100%;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
  background-color: white;
}

/* Сетка курсов */
.courses-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

/* Карточка курса */
.course-card {
  background-color: #ffffff;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 15px;
  position: relative;
  transition: box-shadow 0.3s ease, transform 0.3s ease;
}

/* Заголовок курса */
.course-card h2 {
  font-size: 1.2em;
  margin: 0 0 10px;
}

/* Описание курса */
.course-card p {
  font-size: 1em;
  color: #555;
}

/* Анимация при наведении */
.course-card:hover {
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  transform: translateY(-5px);
}

/* Кнопка "Узнать больше" */
.btn {
  display: inline-block;
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  margin-top: 10px;
  font-weight: bold;
  text-align: center;
}

.btn:hover {
  background-color: #0056b3;
}

/* Плашка для завершенного курса */
.completed-badge {
  position: absolute;
  top: -10px;
  right: -10px;
  background-color: #28a745;
  color: white;
  padding: 5px 10px;
  font-size: 0.9em;
  border-radius: 50px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
}


.lms-nav {
  display: flex;
  gap: 20px;
}

.nav-item {
  text-decoration: none;
  color: #495057;
  font-weight: 500;
  padding: 10px 15px;
  border-radius: 5px;
  transition: all 0.3s ease;
}

.nav-item:hover {
  background-color: #e9ecef;
  color: #007bff;
}

.nav-item.active {
  background-color: #007bff;
  color: white;
}

@media (max-width: 768px) {
  .course-card {
    padding: 10px;
  }

  .btn {
    padding: 8px 15px;
    font-size: 0.9em;
  }
}
</style>
