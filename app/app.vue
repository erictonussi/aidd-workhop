<script setup lang="ts">
// Example user data
const users = [
  {
    name: "Sarah Johnson",
    email: "sarah.johnson@example.com",
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face",
    title: "Senior Frontend Developer",
    company: "Tech Innovators Inc.",
    location: "San Francisco, CA",
    bio: "Passionate about creating beautiful and functional user interfaces. Love working with Vue.js and modern web technologies.",
    verified: true,
  },
  {
    name: "Alex Chen",
    email: "alex.chen@example.com",
    title: "Product Designer",
    company: "Design Studio",
    location: "New York, NY",
    bio: "Creative problem solver with a focus on user experience design.",
    verified: false,
  },
  {
    name: "Michael Rodriguez",
    email: "michael.rodriguez@example.com",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
    title: "Full Stack Developer",
    company: "StartupXYZ",
    location: "Austin, TX",
    verified: true,
  },
];

// Event handlers
const handleContact = (user: any) => {
  console.log("Contact clicked for:", user.name);
  // You could implement actual contact logic here
};

const handleFollow = (user: any) => {
  console.log("Follow clicked for:", user.name);
  // You could implement actual follow logic here
};
</script>

<template>
  <div class="app">
    <div class="app__header">
      <h1>User Profile Cards Demo</h1>
      <p>
        A collection of beautiful user profile cards built with Vue 3 and Nuxt 4
      </p>
    </div>

    <div class="app__content">
      <!-- Standard profile cards -->
      <section class="app__section">
        <h2>Standard Profile Cards</h2>
        <div class="app__grid">
          <UserProfileCard
            v-for="user in users"
            :key="user.email"
            :user="user"
            @contact="handleContact"
            @follow="handleFollow"
          />
        </div>
      </section>

      <!-- Compact profile cards -->
      <section class="app__section">
        <h2>Compact Profile Cards</h2>
        <div class="app__grid">
          <UserProfileCard
            v-for="user in users"
            :key="`compact-${user.email}`"
            :user="user"
            :compact="true"
            :show-contact-button="false"
            @follow="handleFollow"
          />
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40px 20px;
}

.app__header {
  text-align: center;
  margin-bottom: 48px;
  color: white;
}

.app__header h1 {
  font-size: 36px;
  font-weight: 700;
  margin: 0 0 16px 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.app__header p {
  font-size: 18px;
  opacity: 0.9;
  margin: 0;
  max-width: 600px;
  margin: 0 auto;
}

.app__content {
  max-width: 1200px;
  margin: 0 auto;
}

.app__section {
  margin-bottom: 48px;
}

.app__section h2 {
  color: white;
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 24px 0;
  text-align: center;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.app__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 24px;
  justify-items: center;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .app {
    padding: 20px 16px;
  }

  .app__header h1 {
    font-size: 28px;
  }

  .app__header p {
    font-size: 16px;
  }

  .app__grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}
</style>
