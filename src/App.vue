<template>
  <div class="app-container">
    <div class="wrapper" :class="{ active: isActive }">
      
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

      <header>
        <h1>QR Code Générateur</h1>
        <p>Entre un url ou du texte pour créer un code QR</p>
      </header>
      
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
      
      <div class="qr-code">
        <img 
          v-if="qrImage" 
          :src="qrImage" 
          alt="qr-code"
          @load="handleImageLoad"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useTheme } from "./composables/useTheme.js";

const { theme, toggleTheme, isDark } = useTheme();

const getIcon = () => {
  if (theme.value === "light") return "light_mode";
  if (theme.value === "dark") return "dark_mode";
  return "contrast"; // pour le mode system
};

const getLabel = () => {
  if (theme.value === "light") return "Switch to dark mode";
  if (theme.value === "dark") return "Switch to system mode";
  return "Switch to light mode";
};

const qrValue = ref('');
const qrImage = ref('');
const isActive = ref(false);
const isGenerating = ref(false);
const preValue = ref('');

const buttonText = computed(() => {
  return isGenerating.value ? 'Generating QR Code...' : 'Generate QR Code';
});

const generateQR = () => {
  const trimmedValue = qrValue.value.trim();
  
  if (!trimmedValue || preValue.value === trimmedValue) {
    return;
  }
  
  preValue.value = trimmedValue;
  isGenerating.value = true;
  
  qrImage.value = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(trimmedValue)}`;
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
</script>

