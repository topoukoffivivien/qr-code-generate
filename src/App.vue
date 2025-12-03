<template>
  <div class="app-container">
    <div class="wrapper" :class="{ active: isActive }">

      <!-- Theme toggle -->
      <button
        type="button"
        class="theme-toggle-btn"
        @click="toggleTheme"
        :aria-label="getLabel()"
        :title="getLabel()"
      >
        <span class="material-icons theme-icon">
          {{ getIcon() }}
        </span>
      </button>

      <!-- Header -->
      <header>
        <h1>QR Code Générateur</h1>
        <p>Entre un url ou du texte pour créer un code QR</p>
      </header>

      <!-- Form -->
      <div class="form">
        <input
          type="text"
          v-model="qrValue"
          @keyup="handleKeyup"
          spellcheck="false"
          placeholder="Entrer texte ou url"
        />

        <button @click="generateQR">
          {{ buttonText }}
        </button>
      </div>

      <!-- QR Code area -->
      <div class="qr-code">
        <img
          v-if="qrImage"
          :src="qrImage"
          alt="qr-code"
          @load="handleImageLoad"
        />

        <button
          v-if="qrImage"
          class="download-btn"
          @click="downloadQR"
        >
          <span class="material-symbols-outlined">
            download
          </span>
        </button>
      </div>

    </div>
  </div>
</template>


<script setup>
/* --------------------------------------------------
   IMPORTS
-------------------------------------------------- */
import { ref, computed } from 'vue';
import { useTheme } from "./composables/useTheme.js";


/* --------------------------------------------------
   THEME HANDLING
-------------------------------------------------- */
const { theme, toggleTheme } = useTheme();

const getIcon = () => {
  if (theme.value === "light") return "light_mode";
  if (theme.value === "dark") return "dark_mode";
  return "contrast";
};

const getLabel = () => {
  if (theme.value === "light") return "Switch to dark mode";
  if (theme.value === "dark") return "Switch to system mode";
  return "Switch to light mode";
};


/* --------------------------------------------------
   QR STATES
-------------------------------------------------- */
const qrValue = ref('');
const qrImage = ref('');
const isActive = ref(false);
const isGenerating = ref(false);
const preValue = ref('');

const buttonText = computed(() =>
  isGenerating.value ? "Generating QR Code..." : "Generate QR Code"
);


/* --------------------------------------------------
   QR GENERATION LOGIC
-------------------------------------------------- */
const generateQR = () => {
  const trimmedValue = qrValue.value.trim();

  if (!trimmedValue || preValue.value === trimmedValue) return;

  preValue.value = trimmedValue;
  isGenerating.value = true;

  qrImage.value =
    `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(trimmedValue)}`;
};

const handleImageLoad = () => {
  isActive.value = true;
  isGenerating.value = false;
};

const handleKeyup = () => {
  if (!qrValue.value.trim()) {
    isActive.value = false;
    preValue.value = '';
  }
};


/* --------------------------------------------------
   DOWNLOAD
-------------------------------------------------- */
const downloadQR = () => {
  if (!qrImage.value) return;

  const link = document.createElement("a");
  link.href = qrImage.value;
  link.download = "qr-code.png";
  link.click();
};
</script>
