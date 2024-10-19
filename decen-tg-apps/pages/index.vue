<template>
  <section class="lms-section">
    <div class="lms-container">
      <header class="lms-header">
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
      </header>

      <main>
        <section class="intro">
          <h2>
            Добро пожаловать, {{ initDataUnsafe.user?.first_name }}!
          </h2>
          <p class="user-id">Telegram ID: {{ initDataUnsafe.user?.id }}</p>
          <p>
            Чтобы начать обучение, нажмите на кнопку снизу.
          </p>
          <nuxt-link to="/courses" class="btn">Начать обучение</nuxt-link>
        </section>

        <section class="completed-courses" v-if="userCourses.length">
          <h2>Ваши пройденные курсы:</h2>
          <ul>
            <li
              v-for="course in userCourses"
              :key="course.id"
              class="course-item"
            >
              <div class="course-badge">Пройден</div>
              <span class="course-title">{{ course.title }}</span>
              <nuxt-link :to="`/course${course.id}`" class="btn-small"
                >Подробнее</nuxt-link
              >
            </li>
          </ul>
        </section>

        <div class="auth-messages">
          <h2>Статус авторизации</h2>
          <div v-if="successMessage" class="success-message">
            {{ successMessage }}
          </div>
          <div v-if="errorMessage" class="error-message">
            {{ errorMessage }}
          </div>
        </div>
      </main>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
const { useWebApp } = await import("vue-tg");
const { initDataUnsafe } = useWebApp();
const { $supabase } = useNuxtApp();

const successMessage = ref("");
const errorMessage = ref("");

interface Course {
  id: number;
  title: string;
  description: string;
}

const userCourses = ref<Course[]>([]);

const checkUserExists = async (telegram_id: string) => {
  const { data, error } = await $supabase
    .from("users")
    .select("*")
    .eq("telegram_id", telegram_id)
    .limit(1)
    .single();

  if (error && error.code !== "PGRST116") {
    throw error;
  }

  return data;
};

const submitUserData = async () => {
  const first_name = initDataUnsafe.user?.first_name || "";
  const telegram_id = initDataUnsafe.user?.id || "";

  try {
    const existingUser = await checkUserExists(telegram_id);

    if (existingUser) {
      successMessage.value = "Вы уже зарегистрированы!";
    } else {
      const { error } = await $supabase.from("users").insert([
        {
          first_name,
          telegram_id,
        },
      ]);

      if (error) {
        throw error;
      }

      successMessage.value = "Данные успешно отправлены!";
    }
  } catch (error: any) {
    errorMessage.value = "Ошибка при обработке данных: " + error.message;
  }
};

const fetchUserCourses = async () => {
  const telegram_id = initDataUnsafe.user?.id;

  if (!telegram_id) {
    console.error("Telegram ID не найден");
    return;
  }

  // Получаем пройденные курсы пользователя
  const { data: completedCoursesData, error: completedCoursesError } =
    await $supabase
      .from("completed_courses")
      .select("course_id")
      .eq("user_id", telegram_id);

  if (completedCoursesError) {
    console.error(
      "Ошибка при получении пройденных курсов:",
      completedCoursesError
    );
    return;
  }

  const completedCourseIds = completedCoursesData.map((item) => item.course_id);

  // Получаем информацию о пройденных курсах
  if (completedCourseIds.length > 0) {
    const { data: userCoursesData, error: userCoursesError } = await $supabase
      .from("courses")
      .select("*")
      .in("id", completedCourseIds);

    if (userCoursesError) {
      console.error(
        "Ошибка при получении информации о пройденных курсах:",
        userCoursesError
      );
    } else {
      userCourses.value = userCoursesData;
    }
  }
};

onMounted(async () => {
  if (initDataUnsafe.user) {
    await submitUserData();
    await fetchUserCourses();
  } else {
    errorMessage.value = "Не удалось получить данные пользователя из Telegram.";
  }
});
</script>

<style scoped>
.lms-section {
  font-family: Arial, sans-serif;
  background-color: white;
  color: #333;
  line-height: 1.6;
}

.lms-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.lms-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding: 20px 0;
  border-bottom: 1px solid #e9ecef;
}

.lms-header h1 {
  font-size: 24px;
  color: #007bff;
  margin: 0;
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

.intro,
.completed-courses,
.features,
.auth-messages {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 30px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.intro h2,
.completed-courses h2,
.features h2,
.auth-messages h2 {
  color: #007bff;
  margin-bottom: 15px;
}

.user-id {
  font-size: 0.9em;
  color: #6c757d;
  margin-bottom: 15px;
}

.btn,
.btn-small {
  display: inline-block;
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  text-decoration: none;
  border-radius: 5px;
  transition: background-color 0.3s;
}

.btn:hover,
.btn-small:hover {
  background-color: #0056b3;
}

.btn-small {
  padding: 5px 10px;
  font-size: 0.9em;
}

.completed-courses ul {
  list-style-type: none;
  padding: 0;
}

.course-item {
  background-color: white;
  border: 1px solid #e9ecef;
  border-radius: 5px;
  padding: 15px;
  margin-bottom: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  overflow: hidden;
}

.course-badge {
  position: absolute;
  top: 0;
  right: 0;
  background-color: #28a745;
  color: white;
  padding: 5px 10px;
  font-size: 0.8em;
  border-bottom-left-radius: 5px;
}

.course-title {
  flex-grow: 1;
  margin-right: 15px;
}

.features ul {
  padding-left: 20px;
}

.features li {
  margin-bottom: 10px;
}

.success-message {
  color: #28a745;
}

.error-message {
  color: #dc3545;
}

@media (max-width: 768px) {
  .lms-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .lms-nav {
    margin-top: 20px;
    width: 100%;
    justify-content: space-between;
  }

  .nav-item {
    flex-grow: 1;
    text-align: center;
  }

  .course-item {
    flex-direction: column;
    align-items: flex-start;
  }

  .course-title {
    margin-right: 0;
    margin-bottom: 10px;
  }

  .btn-small {
    align-self: flex-start;
  }
}
</style>
