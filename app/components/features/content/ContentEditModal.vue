<template>
  <BaseModal
    :modelValue="modelValue"
    @update:modelValue="emit('update:modelValue', $event)"
    title="Edit Konten"
    icon="lucide:pencil"
    type="info"
    confirmText="Simpan Perubahan"
    maxWidth="max-w-3xl"
    @confirm="submitEdit"
  >
    <div class="space-y-4">
      <div>
            <label class="block text-sm font-medium text-gray-700">Judul Konten</label>
            <input v-model="form.judul" type="text" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm" />
          </div>

          <!-- File Upload Section - Gambar -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Gambar Utama</label>
              
              <div v-if="imagePreview" class="relative group rounded-xl overflow-hidden border border-gray-200 shadow-sm mb-3 bg-gray-50 flex items-center justify-center">
                <img :src="imagePreview" alt="Preview Gambar" class="w-full h-48 object-cover" />
                <button @click.prevent="clearImage" class="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600">
                  <Icon icon="lucide:x" class="w-4 h-4" />
                </button>
              </div>

              <div v-else class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:bg-gray-50 transition-colors">
                <div class="space-y-1 text-center">
                  <Icon icon="lucide:image" class="mx-auto h-12 w-12 text-gray-400" />
                  <div class="flex text-sm text-gray-600 justify-center">
                    <label for="edit-gambar-upload" class="relative cursor-pointer bg-white rounded-md font-medium text-emerald-600 hover:text-emerald-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-emerald-500">
                      <span>Unggah gambar</span>
                      <input id="edit-gambar-upload" ref="imageInputRef" type="file" @change="onImageChange" accept="image/*" class="sr-only" />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <!-- File Upload Section - Video -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Video Utama</label>
              
              <div v-if="videoPreview" class="relative group rounded-xl overflow-hidden border border-gray-200 shadow-sm mb-3 bg-black flex items-center justify-center">
                <video :src="videoPreview" controls class="w-full h-48 object-contain"></video>
                <button @click.prevent="clearVideo" class="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-red-600">
                  <Icon icon="lucide:x" class="w-4 h-4" />
                </button>
              </div>

              <div v-else class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:bg-gray-50 transition-colors">
                <div class="space-y-1 text-center">
                  <Icon icon="lucide:film" class="mx-auto h-12 w-12 text-gray-400" />
                  <div class="flex text-sm text-gray-600 justify-center">
                    <label for="edit-video-upload" class="relative cursor-pointer bg-white rounded-md font-medium text-emerald-600 hover:text-emerald-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-emerald-500">
                      <span>Unggah video</span>
                      <input id="edit-video-upload" ref="videoInputRef" type="file" @change="onVideoChange" accept="video/mp4, video/webm" class="sr-only" />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Isi Konten</label>
        <textarea v-model="form.isi" rows="4" class="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"></textarea>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">Kondisi Tampilan</label>
        <select v-model="form.status" class="mt-1 block w-full border border-gray-300 bg-white rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm">
          <option value="draft">Draft (Simpan sementara)</option>
          <option value="published">Published (Terbit)</option>
        </select>
      </div>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, watch, onBeforeUnmount } from 'vue';
import { useContent } from '~/composables/useContents';
import { resolveAssetUrl } from '~/infrastructure/adapters/assets';
import { Icon } from '@iconify/vue';

const props = defineProps({
  modelValue: Boolean,
  editData: {
    type: Object,
    default: () => ({})
  }
});

const emit = defineEmits(['update:modelValue', 'saved']);
const { updateContent } = useContent();

const form = ref({
    judul: '',
    isi: '',
    status: 'draft',
    gambarUrl: null as File | null,
    videoUrl: null as File | null
});

// UI states for Preview Mapping
const imagePreview = ref('');
const videoPreview = ref('');
const imageInputRef = ref<HTMLInputElement | null>(null);
const videoInputRef = ref<HTMLInputElement | null>(null);

watch(() => props.editData, (newVal) => {
    if (newVal) {
        form.value.judul = newVal.judul || '';
        form.value.isi = newVal.isi || '';
        form.value.status = newVal.status || 'draft';
        form.value.gambarUrl = null;
        form.value.videoUrl = null;
        
        // Resolve backend URL
        imagePreview.value = newVal.gambarUrl ? resolveAssetUrl(newVal.gambarUrl) : '';
        videoPreview.value = newVal.videoUrl ? resolveAssetUrl(newVal.videoUrl) : '';
    }
}, { immediate: true });

// Input handlers
const onImageChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
        const file = target.files[0];
        form.value.gambarUrl = file;
        // Revoke old object URL if exists (not standard http links)
        if (imagePreview.value.startsWith('blob:')) URL.revokeObjectURL(imagePreview.value);
        imagePreview.value = URL.createObjectURL(file);
    }
};

const onVideoChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
        const file = target.files[0];
        form.value.videoUrl = file;
        if (videoPreview.value.startsWith('blob:')) URL.revokeObjectURL(videoPreview.value);
        videoPreview.value = URL.createObjectURL(file);
    }
};

const clearImage = () => {
    if (imagePreview.value.startsWith('blob:')) URL.revokeObjectURL(imagePreview.value);
    imagePreview.value = '';
    form.value.gambarUrl = null;
    if (imageInputRef.value) imageInputRef.value.value = '';
};

const clearVideo = () => {
    if (videoPreview.value.startsWith('blob:')) URL.revokeObjectURL(videoPreview.value);
    videoPreview.value = '';
    form.value.videoUrl = null;
    if (videoInputRef.value) videoInputRef.value.value = '';
};

onBeforeUnmount(() => {
    if (imagePreview.value.startsWith('blob:')) URL.revokeObjectURL(imagePreview.value);
    if (videoPreview.value.startsWith('blob:')) URL.revokeObjectURL(videoPreview.value);
});

const submitEdit = async () => {
    try {
        await updateContent(props.editData.id, {
            judul: form.value.judul,
            isi: form.value.isi,
            status: form.value.status,
            gambarUrl: form.value.gambarUrl,
            videoUrl: form.value.videoUrl
        } as any);
        emit('update:modelValue', false);
        emit('saved', 'Berhasil', 'Konten berhasil diperbarui');
    } catch(e) {
        console.error('Error updating:', e);
        alert('Gagal mengupdate konten.');
    }
};
</script>
