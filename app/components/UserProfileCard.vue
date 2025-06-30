<script setup lang="ts">
interface UserProfile {
  name: string;
  email: string;
  avatar?: string;
  title?: string;
  company?: string;
  location?: string;
  bio?: string;
  verified?: boolean;
}

interface Props {
  user: UserProfile;
  showContactButton?: boolean;
  showFollowButton?: boolean;
  compact?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  showContactButton: true,
  showFollowButton: true,
  compact: false,
});

const emit = defineEmits<{
  contact: [user: UserProfile];
  follow: [user: UserProfile];
}>();

const getInitials = (name: string): string => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

const handleContact = () => {
  emit("contact", props.user);
};

const handleFollow = () => {
  emit("follow", props.user);
};
</script>

<template>
  <div
    class="user-profile-card"
    :class="{ 'user-profile-card--compact': compact }"
  >
    <!-- Header with avatar and basic info -->
    <div class="user-profile-card__header">
      <div class="user-profile-card__avatar-container">
        <img
          v-if="user.avatar"
          :src="user.avatar"
          :alt="`${user.name} avatar`"
          class="user-profile-card__avatar"
        />
        <div
          v-else
          class="user-profile-card__avatar user-profile-card__avatar--initials"
        >
          {{ getInitials(user.name) }}
        </div>
        <div
          v-if="user.verified"
          class="user-profile-card__verified-badge"
          title="Verified user"
        >
          ✓
        </div>
      </div>

      <div class="user-profile-card__info">
        <h3 class="user-profile-card__name">{{ user.name }}</h3>
        <p v-if="user.title" class="user-profile-card__title">
          {{ user.title }}
        </p>
        <p v-if="user.company" class="user-profile-card__company">
          {{ user.company }}
        </p>
        <p v-if="user.location" class="user-profile-card__location">
          📍 {{ user.location }}
        </p>
      </div>
    </div>

    <!-- Bio section -->
    <div v-if="user.bio && !compact" class="user-profile-card__bio">
      <p>{{ user.bio }}</p>
    </div>

    <!-- Contact information -->
    <div class="user-profile-card__contact">
      <a :href="`mailto:${user.email}`" class="user-profile-card__email">
        {{ user.email }}
      </a>
    </div>

    <!-- Action buttons -->
    <div
      v-if="showContactButton || showFollowButton"
      class="user-profile-card__actions"
    >
      <button
        v-if="showContactButton"
        @click="handleContact"
        class="user-profile-card__button user-profile-card__button--primary"
      >
        Contact
      </button>
      <button
        v-if="showFollowButton"
        @click="handleFollow"
        class="user-profile-card__button user-profile-card__button--secondary"
      >
        Follow
      </button>
    </div>
  </div>
</template>

<style scoped>
.user-profile-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  border: 1px solid #e5e7eb;
  transition: all 0.3s ease;
  max-width: 400px;
  margin: 0 auto;
}

.user-profile-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.user-profile-card--compact {
  padding: 16px;
  max-width: 320px;
}

.user-profile-card__header {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 16px;
}

.user-profile-card__avatar-container {
  position: relative;
  flex-shrink: 0;
}

.user-profile-card__avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #f3f4f6;
}

.user-profile-card__avatar--initials {
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-weight: 600;
  font-size: 18px;
}

.user-profile-card--compact .user-profile-card__avatar {
  width: 48px;
  height: 48px;
}

.user-profile-card--compact .user-profile-card__avatar--initials {
  font-size: 14px;
}

.user-profile-card__verified-badge {
  position: absolute;
  bottom: -2px;
  right: -2px;
  background: #10b981;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
  border: 2px solid white;
}

.user-profile-card__info {
  flex: 1;
  min-width: 0;
}

.user-profile-card__name {
  font-size: 20px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 4px 0;
  line-height: 1.2;
}

.user-profile-card--compact .user-profile-card__name {
  font-size: 18px;
}

.user-profile-card__title {
  font-size: 14px;
  font-weight: 500;
  color: #6b7280;
  margin: 0 0 2px 0;
}

.user-profile-card__company {
  font-size: 14px;
  color: #374151;
  margin: 0 0 4px 0;
}

.user-profile-card__location {
  font-size: 12px;
  color: #6b7280;
  margin: 0;
}

.user-profile-card__bio {
  margin-bottom: 16px;
  padding: 12px 0;
  border-top: 1px solid #f3f4f6;
}

.user-profile-card__bio p {
  color: #4b5563;
  font-size: 14px;
  line-height: 1.5;
  margin: 0;
}

.user-profile-card__contact {
  margin-bottom: 16px;
}

.user-profile-card__email {
  color: #3b82f6;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: color 0.2s ease;
}

.user-profile-card__email:hover {
  color: #1d4ed8;
  text-decoration: underline;
}

.user-profile-card__actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

.user-profile-card__button {
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  outline: none;
}

.user-profile-card__button:focus {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.user-profile-card__button--primary {
  background: #3b82f6;
  color: white;
}

.user-profile-card__button--primary:hover {
  background: #2563eb;
  transform: translateY(-1px);
}

.user-profile-card__button--secondary {
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
}

.user-profile-card__button--secondary:hover {
  background: #e5e7eb;
  transform: translateY(-1px);
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .user-profile-card {
    background: #1f2937;
    border-color: #374151;
    color: #f9fafb;
  }

  .user-profile-card__name {
    color: #f9fafb;
  }

  .user-profile-card__title,
  .user-profile-card__location {
    color: #9ca3af;
  }

  .user-profile-card__company {
    color: #d1d5db;
  }

  .user-profile-card__bio {
    border-color: #374151;
  }

  .user-profile-card__bio p {
    color: #d1d5db;
  }

  .user-profile-card__button--secondary {
    background: #374151;
    color: #d1d5db;
    border-color: #4b5563;
  }

  .user-profile-card__button--secondary:hover {
    background: #4b5563;
  }
}

/* Responsive design */
@media (max-width: 640px) {
  .user-profile-card {
    margin: 0 16px;
    max-width: none;
  }

  .user-profile-card__actions {
    flex-direction: column;
  }

  .user-profile-card__button {
    width: 100%;
    justify-content: center;
  }
}
</style>
