<script setup lang="ts">
// import { Motion, Presence } from "@vueuse/motion"; // Removed this line

// const heroVisible = ref(false); // No longer needed for v-motion with visibleOnce
// const servicesVisible = ref(false); // Will be removed
// const portfolioVisible = ref(false); // Will be removed
// const testimonialsVisible = ref(false); // Will be removed
// const ctaVisible = ref(false); // Will be removed

onMounted(() => {
  // Trigger animations after component is mounted
  // heroVisible.value = true; // No longer needed
  // servicesVisible.value = true; // Will be removed
  // portfolioVisible.value = true; // Will be removed
  // testimonialsVisible.value = true; // Will be removed
  // ctaVisible.value = true; // Will be removed
});
</script>

<template>
  <div class="landing-page">
    <header class="header">
      <div
        class="container mx-auto flex justify-between items-center py-6 px-4"
      >
        <div class="logo text-2xl font-bold text-gray-800">WebDev Agency</div>
        <nav>
          <ul class="flex space-x-6">
            <li>
              <a href="#" class="text-gray-600 hover:text-gray-800">Home</a>
            </li>
            <li>
              <a href="#services" class="text-gray-600 hover:text-gray-800"
                >Services</a
              >
            </li>
            <li>
              <a href="#portfolio" class="text-gray-600 hover:text-gray-800"
                >Portfolio</a
              >
            </li>
            <li>
              <a href="#contact" class="text-gray-600 hover:text-gray-800"
                >Contact</a
              >
            </li>
          </ul>
        </nav>
      </div>
    </header>

    <main>
      <section
        id="hero"
        class="hero bg-gradient-to-r from-purple-500 to-indigo-600 text-white py-20"
      >
        <div class="container mx-auto text-center px-4">
          <h1
            v-motion
            :initial="{ opacity: 0, y: 50 }"
            :visibleOnce="{ opacity: 1, y: 0, transition: { duration: 500 } }"
            class="text-5xl font-bold mb-4"
          >
            Beautiful Websites, Powerful Results
          </h1>
          <p
            v-motion
            :initial="{ opacity: 0, y: 50 }"
            :visibleOnce="{
              opacity: 1,
              y: 0,
              transition: { duration: 500, delay: 200 },
            }"
            class="text-xl mb-8"
          >
            We build stunning, high-performing websites that help your business
            grow.
          </p>
          <a
            v-motion
            :initial="{ opacity: 0, scale: 0.5 }"
            :visibleOnce="{
              opacity: 1,
              scale: 1,
              transition: { duration: 500, delay: 400 },
            }"
            href="#services"
            class="bg-white text-indigo-600 font-semibold py-3 px-8 rounded-lg hover:bg-gray-100 transition duration-300"
          >
            Our Services
          </a>
        </div>
      </section>

      <section id="services" class="services py-20 bg-gray-50">
        <div class="container mx-auto px-4">
          <div
            v-motion
            :initial="{ opacity: 0, y: 50 }"
            :visibleOnce="{ opacity: 1, y: 0, transition: { duration: 500 } }"
            class="text-center mb-12"
          >
            <h2 class="text-4xl font-bold text-gray-800">What We Offer</h2>
            <p class="text-gray-600 mt-2">
              Tailored solutions to meet your digital needs.
            </p>
          </div>

          <div class="grid md:grid-cols-3 gap-8">
            <div
              v-motion
              :initial="{ opacity: 0, y: 50 }"
              :visibleOnce="{
                opacity: 1,
                y: 0,
                transition: { duration: 500, delay: 200 },
              }"
              class="service-card bg-white p-8 rounded-lg shadow-lg"
            >
              <h3 class="text-2xl font-semibold text-gray-800 mb-3">
                Web Design
              </h3>
              <p class="text-gray-600">
                Creating visually appealing and user-friendly interfaces that
                engage your audience.
              </p>
            </div>
            <div
              v-motion
              :initial="{ opacity: 0, y: 50 }"
              :visibleOnce="{
                opacity: 1,
                y: 0,
                transition: { duration: 500, delay: 400 },
              }"
              class="service-card bg-white p-8 rounded-lg shadow-lg"
            >
              <h3 class="text-2xl font-semibold text-gray-800 mb-3">
                Web Development
              </h3>
              <p class="text-gray-600">
                Building robust and scalable web applications using the latest
                technologies.
              </p>
            </div>
            <div
              v-motion
              :initial="{ opacity: 0, y: 50 }"
              :visibleOnce="{
                opacity: 1,
                y: 0,
                transition: { duration: 500, delay: 600 },
              }"
              class="service-card bg-white p-8 rounded-lg shadow-lg"
            >
              <h3 class="text-2xl font-semibold text-gray-800 mb-3">
                SEO Optimization
              </h3>
              <p class="text-gray-600">
                Improving your website's visibility on search engines to attract
                more organic traffic.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="portfolio" class="portfolio py-20 bg-white">
        <div class="container mx-auto px-4">
          <div
            v-motion
            :initial="{ opacity: 0, y: 50 }"
            :visibleOnce="{ opacity: 1, y: 0, transition: { duration: 500 } }"
            class="text-center mb-12"
          >
            <h2 class="text-4xl font-bold text-gray-800">Our Recent Work</h2>
            <p class="text-gray-600 mt-2">
              Check out some of the amazing projects we've delivered.
            </p>
          </div>
          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div
              v-motion
              :initial="{ opacity: 0, scale: 0.8 }"
              :visibleOnce="{
                opacity: 1,
                scale: 1,
                transition: { duration: 500, delay: 200 },
              }"
              class="portfolio-item bg-gray-100 p-6 rounded-lg shadow-lg"
            >
              <img
                src="https://picsum.photos/seed/project1/400/300"
                alt="Project 1"
                class="rounded-md mb-4 w-full h-48 object-cover"
              />
              <h3 class="text-xl font-semibold text-gray-800 mb-2">
                E-commerce Platform
              </h3>
              <p class="text-gray-600 text-sm">
                A cutting-edge online store for a fashion brand.
              </p>
            </div>
            <div
              v-motion
              :initial="{ opacity: 0, scale: 0.8 }"
              :visibleOnce="{
                opacity: 1,
                scale: 1,
                transition: { duration: 500, delay: 400 },
              }"
              class="portfolio-item bg-gray-100 p-6 rounded-lg shadow-lg"
            >
              <img
                src="https://picsum.photos/seed/project2/400/300"
                alt="Project 2"
                class="rounded-md mb-4 w-full h-48 object-cover"
              />
              <h3 class="text-xl font-semibold text-gray-800 mb-2">
                Corporate Website
              </h3>
              <p class="text-gray-600 text-sm">
                A professional and sleek website for a financial firm.
              </p>
            </div>
            <div
              v-motion
              :initial="{ opacity: 0, scale: 0.8 }"
              :visibleOnce="{
                opacity: 1,
                scale: 1,
                transition: { duration: 500, delay: 600 },
              }"
              class="portfolio-item bg-gray-100 p-6 rounded-lg shadow-lg"
            >
              <img
                src="https://picsum.photos/seed/project3/400/300"
                alt="Project 3"
                class="rounded-md mb-4 w-full h-48 object-cover"
              />
              <h3 class="text-xl font-semibold text-gray-800 mb-2">
                Mobile App Design
              </h3>
              <p class="text-gray-600 text-sm">
                Intuitive and engaging UI/UX for a new mobile application.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="testimonials" class="testimonials py-20 bg-gray-50">
        <div class="container mx-auto px-4">
          <div
            v-motion
            :initial="{ opacity: 0, y: 50 }"
            :visibleOnce="{ opacity: 1, y: 0, transition: { duration: 500 } }"
            class="text-center mb-12"
          >
            <h2 class="text-4xl font-bold text-gray-800">
              What Our Clients Say
            </h2>
            <p class="text-gray-600 mt-2">
              We are proud of the positive feedback from our valued clients.
            </p>
          </div>
          <div class="grid md:grid-cols-2 gap-8">
            <div
              v-motion
              :initial="{ opacity: 0, x: -50 }"
              :visibleOnce="{
                opacity: 1,
                x: 0,
                transition: { duration: 500, delay: 200 },
              }"
              class="testimonial-card bg-white p-8 rounded-lg shadow-lg"
            >
              <p class="text-gray-600 italic mb-4">
                "The team at WebDev Agency transformed our online presence.
                Their creativity and technical expertise are unmatched!"
              </p>
              <p class="text-gray-800 font-semibold">Jane Doe</p>
              <p class="text-gray-500 text-sm">CEO, Tech Solutions Inc.</p>
            </div>
            <div
              v-motion
              :initial="{ opacity: 0, x: 50 }"
              :visibleOnce="{
                opacity: 1,
                x: 0,
                transition: { duration: 500, delay: 400 },
              }"
              class="testimonial-card bg-white p-8 rounded-lg shadow-lg"
            >
              <p class="text-gray-600 italic mb-4">
                "Working with WebDev Agency was a fantastic experience. They
                delivered a beautiful, functional website on time and on
                budget."
              </p>
              <p class="text-gray-800 font-semibold">John Smith</p>
              <p class="text-gray-500 text-sm">
                Marketing Director, Creative Co.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        id="cta"
        class="cta bg-gradient-to-r from-purple-500 to-indigo-600 text-white py-20"
      >
        <div class="container mx-auto text-center px-4">
          <h2
            v-motion
            :initial="{ opacity: 0, y: 50 }"
            :visibleOnce="{ opacity: 1, y: 0, transition: { duration: 500 } }"
            class="text-4xl font-bold mb-4"
          >
            Ready to Start Your Project?
          </h2>
          <p
            v-motion
            :initial="{ opacity: 0, y: 50 }"
            :visibleOnce="{
              opacity: 1,
              y: 0,
              transition: { duration: 500, delay: 200 },
            }"
            class="text-xl mb-8"
          >
            Let's build something amazing together. Get in touch with us today!
          </p>
          <a
            v-motion
            :initial="{ opacity: 0, scale: 0.5 }"
            :visibleOnce="{
              opacity: 1,
              scale: 1,
              transition: { duration: 500, delay: 400 },
            }"
            href="#contact"
            class="bg-white text-indigo-600 font-semibold py-3 px-8 rounded-lg hover:bg-gray-100 transition duration-300"
          >
            Contact Us
          </a>
        </div>
      </section>
    </main>

    <footer class="footer bg-gray-800 text-white py-10">
      <div class="container mx-auto text-center">
        <p>&copy; 2024 WebDev Agency. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
/* Basic styling - you can expand this or use a CSS framework like Tailwind CSS more extensively */
.container {
  max-width: 1200px;
}

/* Add any additional global styles or component-specific styles here */
</style>
