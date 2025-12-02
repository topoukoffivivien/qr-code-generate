<template>
  <div class="app-container">
    <div class="wrapper" :class="{ active: isActive }">
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

